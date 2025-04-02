const fs = require("fs");
const configPath = "./config.json";
const config = JSON.parse(fs.readFileSync(configPath));

module.exports = {
    name: "owner",
    usePrefix: false,
    usage: "owner",
    version: "1.0",
    description: "Displays the owner's UID with a visit profile button.",

    execute: async ({ api, event }) => {
        const { threadID, messageID } = event;
        const ownerUID = config.ownerUID || "100030880666720"; // Replace with actual UID if available
        const ownerName = config.ownerName || "Mark Martinezw";
        const profileURL = `https://www.facebook.com/profile.php?id=${ownerUID}`;

        const message = `👑 Owner Information\n🆔 UID: ${ownerUID}\n📌 Name: ${ownerName}\n\nFollow me`;

        const button = {
            body: message,
            attachment: null,
            buttons: [
                {
                    type: "web_url",
                    url: profileURL,
                    title: "Visit Profile",
                },
            ],
        };

        api.sendMessage(button, threadID, messageID);
    },
};
