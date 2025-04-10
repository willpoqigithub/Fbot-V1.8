module.exports = {
    name: "autogreet",
    usePrefix: false,
    usage: "autogreet on/off",
    version: "1.0",
    admin: false,
    cooldown: 5,
    async execute({ api, event, args }) {
        const configPath = "./config.json";
        const fs = require("fs");
        const config = JSON.parse(fs.readFileSync(configPath));

        if (!args[0] || !["on", "off"].includes(args[0].toLowerCase())) {
            return api.sendMessage("Usage: autogreet on/off", event.threadID);
        }

        const value = args[0].toLowerCase() === "on";
        config.autoGreet = value;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        api.sendMessage(`✅ Auto Greet has been turned ${value ? "ON" : "OFF"}.`, event.threadID);
    }
};
