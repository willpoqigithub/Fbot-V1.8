const fs = require('fs');
const path = require('path');
const express = require('express');
const login = require('ws3-fca');
const scheduleTasks = require('./custom');

const app = express();
const PORT = 3000;

const loadConfig = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Missing ${filePath}!`);
            process.exit(1);
        }
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        console.error(`❌ Error loading ${filePath}:`, error);
        process.exit(1);
    }
};

const config = loadConfig("./config.json");
const botPrefix = config.prefix || "/";
const ownerID = config.ownerID || "100030880666720";

global.events = new Map();
global.commands = new Map();
const cooldowns = new Map(); // Track cooldowns

const loadEvents = () => {
    try {
        const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = require(`./events/${file}`);
            if (event.name && event.execute) {
                global.events.set(event.name, event);
                console.log(`✅ Loaded event: ${event.name}`);
            }
        }
        console.log(`✅ Loaded ${global.events.size} events.`);
    } catch (error) {
        console.error("❌ Error loading events:", error);
    }
};

const loadCommands = () => {
    try {
        const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./cmds/${file}`);
            if (command.name && command.execute) {
                global.commands.set(command.name, command);
                console.log(`✅ Loaded command: ${command.name}`);
            }
        }
        console.log(`✅ Loaded ${global.commands.size} commands.`);
    } catch (error) {
        console.error("❌ Error loading commands:", error);
    }
};

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`🌐 Web Server running at http://localhost:${PORT}`);
});

const appState = loadConfig("./appState.json");
const detectedURLs = new Set();

const startBot = async () => {
    login({ appState }, (err, api) => {
        if (err) {
            console.error("❌ Login failed:", err);
            return; // No auto-restart
        }

        console.clear();
        api.setOptions(config.option);
        console.log("🤖 Bot is now online!");
        api.sendMessage("🤖 Bot has started successfully!", ownerID);

        global.events.forEach((eventHandler, eventName) => {
            if (eventHandler.onStart) {
                eventHandler.onStart(api);
            }
        });

        api.listenMqtt(async (err, event) => {
            if (err) {
                console.error("❌ Error listening to events:", err);
                return;
            }

            try {
                if (global.events.has(event.type)) {
                    await global.events.get(event.type).execute({ api, event });
                }

                const urlRegex = /(https?:\/\/[^\s]+)/gi;
                if (event.body && urlRegex.test(event.body)) {
                    const urlCommand = global.commands.get("url");
                    if (urlCommand) {
                        const detectedURL = event.body.match(urlRegex)[0];
                        const threadID = event.threadID;
                        const uniqueKey = `${threadID}-${detectedURL}`;

                        if (!detectedURLs.has(uniqueKey)) {
                            detectedURLs.add(uniqueKey);
                            await urlCommand.execute({ api, event });
                            setTimeout(() => detectedURLs.delete(uniqueKey), 3600000);
                        }
                    }
                }

                if (event.body) {
                    let args = event.body.trim().split(/ +/);
                    let commandName = args.shift().toLowerCase();

                    let command;
                    if (global.commands.has(commandName)) {
                        command = global.commands.get(commandName);
                    } else if (event.body.startsWith(botPrefix)) {
                        commandName = event.body.slice(botPrefix.length).split(/ +/).shift().toLowerCase();
                        command = global.commands.get(commandName);
                    }

                    if (command) {
                        if (command.usePrefix && !event.body.startsWith(botPrefix)) return;

                        // Cooldown
                        const userID = event.senderID;
                        const cooldownKey = `${command.name}-${userID}`;
                        const now = Date.now();
                        const cooldownTime = (command.cooldown || 3) * 1000;

                        if (cooldowns.has(cooldownKey)) {
                            const lastUsed = cooldowns.get(cooldownKey);
                            const remaining = cooldownTime - (now - lastUsed);
                            if (remaining > 0) {
                                return api.sendMessage(`⏳ Wait ${Math.ceil(remaining / 1000)}s before using '${command.name}' again.`, event.threadID, event.messageID);
                            }
                        }

                        cooldowns.set(cooldownKey, now);
                        setTimeout(() => cooldowns.delete(cooldownKey), cooldownTime);

                        try {
                            await command.execute({ api, event, args });
                        } catch (commandError) {
                            console.error(`❌ Error executing '${command.name}':`, commandError);
                            api.sendMessage(`❌ Error in '${command.name}':\n${commandError.message || commandError}`, ownerID);
                        }
                    }
                }
            } catch (globalError) {
                console.error("❌ Unexpected error:", globalError);
                api.sendMessage(`❌ Unexpected bot error:\n${globalError.message || globalError}`, ownerID);
            }
        });

        scheduleTasks(ownerID, api, { autoRestart: true, autoGreet: true });
    });
};

loadEvents();
loadCommands();
startBot();
