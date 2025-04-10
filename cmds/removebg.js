const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "removebg",
    usePrefix: false,
    usage: "removebg <reply a photo>",
    version: "1.0",
    cooldown: 5,
    admin: true,

    async execute({ api, event }) {
        const { messageReply, threadID, messageID } = event;

        // Check if user replied to a photo
        if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
            return api.sendMessage("❌ Please reply to an image.", threadID, messageID);
        }

        const attachment = messageReply.attachments[0];
        if (attachment.type !== "photo") {
            return api.sendMessage("❌ The replied message must be a photo.", threadID, messageID);
        }

        const imageUrl = attachment.url;
        const apiUrl = `https://kaiz-apis.gleeze.com/api/removebgv2?url=${encodeURIComponent(imageUrl)}`;

        try {
            api.sendMessage("⏳ Removing background from the image...", threadID);

            // Fetch processed image URL from the API
            const { data } = await axios.get(apiUrl);
            if (!data || !data.response) {
                return api.sendMessage("❌ Failed to get processed image from API.", threadID);
            }

            const processedImageUrl = data.response;

            // Download the processed image
            const imageRes = await axios.get(processedImageUrl, { responseType: "arraybuffer" });
            const tempPath = path.join(__dirname, "..", "temp", `${Date.now()}_no_bg.png`);

            fs.writeFileSync(tempPath, Buffer.from(imageRes.data, "binary"));

            api.sendMessage(
                {
                    body: "✅ Background removed!",
                    attachment: fs.createReadStream(tempPath)
                },
                threadID,
                () => fs.unlinkSync(tempPath) // cleanup
            );
        } catch (error) {
            console.error("❌ RemoveBG Error:", error.message);
            api.sendMessage("❌ Failed to remove background. Please try again later.", threadID, messageID);
        }
    }
};
