const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
    name: "pinterest",
    usePrefix: false,
    usage: "pinterest [prompt] [count]",
    version: "1.0",
    admin: false,
    cooldown: 10,

    execute: async ({ api, event, args }) => {
        const { threadID, messageID } = event;

        if (!args[0]) {
            return api.sendMessage("⚠️ Please provide a search prompt.\nUsage: pinterest [prompt] [count]", threadID, messageID);
        }

        const count = Number(args[args.length - 1]);
        const isCount = !isNaN(count);
        const prompt = isCount ? args.slice(0, -1).join(" ") : args.join(" ");
        const imageCount = isCount ? count : 1;

        const apiUrl = `https://ccprojectapis.ddns.net/api/pin?title=${encodeURIComponent(prompt)}&count=${imageCount}`;

        try {
            api.setMessageReaction("⏳", messageID, () => {}, true);

            const response = await axios.get(apiUrl);
            const links = response.data?.data;

            if (!links || links.length === 0) {
                api.setMessageReaction("❌", messageID, () => {}, true);
                return api.sendMessage("⚠️ No images found.", threadID, messageID);
            }

            // Send each image one by one as attachments
            for (const [index, url] of links.entries()) {
                const filePath = path.join(__dirname, `pin-${index}.jpg`);
                const writer = fs.createWriteStream(filePath);

                const imageRes = await axios({ url, method: "GET", responseType: "stream" });
                imageRes.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on("finish", () => resolve());
                    writer.on("error", reject);
                });

                await api.sendMessage({
                    body: index === 0 ? `📌 Pinterest Results for: "${prompt}"` : "",
                    attachment: fs.createReadStream(filePath),
                }, threadID, () => {
                    fs.unlink(filePath, (err) => {
                        if (err) console.error("Error deleting file:", err);
                    });
                });
            }

            api.setMessageReaction("✅", messageID, () => {}, true);

        } catch (error) {
            console.error("❌ Pinterest Error:", error);
            api.setMessageReaction("❌", messageID, () => {}, true);
            api.sendMessage("⚠️ Failed to fetch Pinterest images.", threadID, messageID);
        }
    },
};
