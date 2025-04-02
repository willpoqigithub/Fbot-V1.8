const fs = require("fs");
const configPath = "./config.json";

// Load config dynamically
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const ownerUID = config.ownerUID || "100030880666720"; // Fallback UID
const ownerName = config.ownerName || "Unknown"; // Owner name

module.exports = {
    name: "owner",
    usePrefix: false,
    usage: "owner",
    version: "1.3",
    description: "Displays the bot owner's information.",

    execute: async ({ api, event }) => {
        const profileURL = `https://www.facebook.com/${ownerUID}`;

        const message = {
            body: `👑 Bot Owner Information 👑\n\n🔹 Name: ${ownerName}\n🔹 UID: ${ownerUID}`,
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Click the button below to visit the owner's profile:",
                    buttons: [
                        {
                            type: "web_url",
                            url: profileURL,
                            title: "Visit Profile",
                        },
                    ],
                },
            },
            mentions: [{ id: ownerUID, tag: ownerName }],
        };

        api.sendMessage(message, event.threadID, event.messageID);
    },
};
