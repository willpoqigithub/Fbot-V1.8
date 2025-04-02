const fs = require("fs");
const configPath = "./config.json";

module.exports = {
    name: "owner",
    usePrefix: false,
    usage: "owner",
    version: "1.1",
    description: "Displays the bot owner's information.",

    execute: async ({ api, event }) => {
        const ownerUID = "100030880666720"; // Owner's UID
        const profileURL = `https://www.facebook.com/${ownerUID}`;

        const message = {
            body: "👑 Bot Owner Information 👑\n\n🔹 Name: Made in ChatGPT\n🔹 UID: " + ownerUID + "\n\nClick the button below to visit the owner's profile.",
            attachment: null,
            mentions: [{ id: ownerUID, tag: "Owner" }],
        };

        api.sendMessage(
            {
                ...message,
                buttons: [
                    {
                        type: "web_url",
                        url: profileURL,
                        title: "Visit Profile",
                    },
                ],
            },
            event.threadID,
            event.messageID
        );
    },
};
