const fs = require("fs");
const configPath = "./config.json";

// Load config dynamically
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const ownerUID = config.ownerUID || "100030880666720";
const ownerName = config.ownerName || "Unknown";

module.exports = {
    name: "owner",
    usePrefix: false,
    usage: "owner",
    version: "1.4",
    description: "Displays the bot owner's information.",

    execute: async ({ api, event }) => {
        const profileURL = `https://www.facebook.com/${ownerUID}`;

        api.sendMessage(
            {
                body: `👑 Bot Owner Information 👑\n\n🔹 Name: ${ownerName}\n🔹 UID: ${ownerUID}\n\nClick below to visit the profile.`,
                mentions: [{ id: ownerUID, tag: ownerName }],
            },
            event.threadID,
            (err, info) => {
                if (!err) {
                    api.sendMessage(
                        {
                            attachment: {
                                type: "template",
                                payload: {
                                    template_type: "button",
                                    text: "Click the button below:",
                                    buttons: [
                                        {
                                            type: "web_url",
                                            url: profileURL,
                                            title: "Visit Profile",
                                        },
                                    ],
                                },
                            },
                        },
                        event.threadID
                    );
                }
            }
        );
    },
};
