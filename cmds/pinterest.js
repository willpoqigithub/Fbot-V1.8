const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
    name: "pinterest",
    usePrefix: false,
    usage: "pinterest <prompt>",
    version: "1.0",
    admin: false,
    cooldown: 10,

    execute: async ({ api, event, args }) => {
        const { threadID, messageID } = event;

        if (!args[0]) {
            return api.sendMessage("⚠️ Usage: pinterest <prompt>", threadID, messageID);
        }

        const prompt = args.join(" ");

        try {
            api.setMessageReaction("⏳", messageID, () => {}, true);

            const response = await axios.get(`https://ccprojectapis.ddns.net/api/pin?title=${encodeURIComponent(prompt)}&count=1`);
            console.log("📜 Pinterest API Response:", response.data);

            if (!response.data || !response.data.data || response.data.data.length === 0) {
                api.setMessageReaction("❌", messageID, () => {}, true);
                return api.sendMessage("⚠️ No Pinterest image found for that prompt.", threadID, messageID);
            }

            const imageUrl = response.data.data[0];
            const filePath = path.join(__dirname, "pinterest.jpg");

            const writer = fs.createWriteStream(filePath);
            const imageResponse = await axios({
                url: imageUrl,
                method: "GET",
                responseType: "stream"
            });

            imageResponse.data.pipe(writer);

            writer.on("finish", async () => {
                api.setMessageReaction("✅", messageID, () => {}, true);

                const msg = {
                    body: `🖼️ Pinterest image for: "${prompt}"`,
                    attachment: fs.createReadStream(filePath),
                };

                api.sendMessage(msg, threadID, (err) => {
                    if (err) {
                        console.error("❌ Error sending image:", err);
                        return api.sendMessage("⚠️ Failed to send image.", threadID);
                    }

                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) console.error("❌ Error deleting image file:", unlinkErr);
                    });
                });
            });

            writer.on("error", (err) => {
                console.error("❌ Error downloading image:", err);
                api.setMessageReaction("❌", messageID, () => {}, true);
                api.sendMessage("⚠️ Failed to download image.", threadID, messageID);
            });

        } catch (error) {
            console.error("❌ Error fetching Pinterest image:", error);
            api.setMessageReaction("❌", messageID, () => {}, true);
            api.sendMessage(`⚠️ Could not fetch Pinterest image. Error: ${error.message}`, threadID, messageID);
        }
    },
};
