const fetch = require("node-fetch");

module.exports = {
    name: "report",
    usePrefix: false,
    usage: "report <your message>",
    version: "1.0",

    execute: async ({ api, event, args }) => {
        const token = "EAAPzkYI1ZBYoBO4Kh2it5FjQ1PtoDWZCNNBcycDKcbS76yXaBnQWLTV8OvDt8LmKqlnOGLWViZBZBx51Iwv25X7LvmCGZC0H19ZCZBo9kNCMBZCGqN1b4wvjoA8Iyhf3UFuOq5ZCUa5SZAhRwnWKyKusxjcVVTRHQbIuHjKvr5vx4kSmJiYKZC7lJ7gpYLZBCHGZAGChaDAZDZD";
        const ownerID = "8783903955027960"; // Replace with actual owner UID

        const senderID = event.senderID;
        const name = (await api.getUserInfo(senderID))[senderID]?.name || "Unknown";
        const messageText = args.join(" ").trim();

        if (!messageText) {
            return api.sendMessage("⚠️ Please provide a message to report.", event.threadID);
        }

        const reportMessage = `📩 New Report Received:\n\n👤 Name: ${name}\n🆔 UID: ${senderID}\n📝 Message: ${messageText}`;

        try {
            const res = await fetch("https://graph.facebook.com/v21.0/me/messages", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    recipient: { id: ownerID },
                    message: { text: reportMessage }
                })
            });

            const json = await res.json();

            if (json.error) {
                console.error("❌ Report Error:", json.error);
                return api.sendMessage("❌ Failed to send report. Try again later.", event.threadID);
            }

            return api.sendMessage("✅ Report sent successfully to the owner!", event.threadID);
        } catch (err) {
            console.error("❌ Unexpected error:", err);
            return api.sendMessage("❌ An error occurred while sending the report.", event.threadID);
        }
    }
};
