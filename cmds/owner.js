const fs = require("fs");
const configPath = "./config.json";

// Load config dynamically
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const ownerUID = config.ownerUID || "100030880666720";
const ownerName = config.ownerName || "Unknown";
const profileURL = "https://www.facebook.com/tutel.17"; // Your Facebook Share URL

module.exports = {
    name: "owner",
    usePrefix: false,
    usage: "owner",
    version: "1.5",
    description: "Displays the bot owner's information.",

    execute: async ({ api, event }) => {
        api.sendMessage(
            {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                            {
                                title: `👑 Bot Owner: ${ownerName}`,
                                subtitle: `🔹 UID: ${ownerUID}`,
                                image_url: "https://graph.facebook.com/" + ownerUID + "/picture?type=large",
                                buttons: [
                                    {
                                        type: "web_url",
                                        url: profileURL,
                                        title: "Visit Profile",
                                    },
                                    {
                                        type: "element_share",
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            event.threadID,
            event.messageID
        );
    },
};
