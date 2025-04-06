const fetch = require("node-fetch");

module.exports = {
    name: "report",
    usePrefix: false,
    description: "Report a message to the owner",
    usage: "report [your message]",
    version: "1.0",

    async execute({ api, event, args }) {
        const token = "EAAPzkYI1ZBYoBO4Kh2it5FjQ1PtoDWZCNNBcycDKcbS76yXaBnQWLTV8OvDt8LmKqlnOGLWViZBZBx51Iwv25X7LvmCGZC0H19ZCZBo9kNCMBZCGqN1b4wvjoA8Iyhf3UFuOq5ZCUa5SZAhRwnWKyKusxjcVVTRHQbIuHjKvr5vx4kSmJiYKZC7lJ7gpYLZBCHGZAGChaDAZDZD";
        const senderID = event.senderID;
        const name = (await api.getUserInfo(senderID))[senderID]?.name || "Unknown";
        const messageText = args.join(" ") || "(no message)";

        const reportMessage = `📩 New Report Received\n\nName: ${name}\nUID: ${senderID}\nMessage: ${messageText}`;

        try {
            const response = await fetch("https://graph.facebook.com/v21.0/me/messages", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    recipient: { id: "8783903955027960" }, // Replace with the real recipient ID
                    message: { text: reportMessage }
                })
            });

            const result = await response.json();

            if (result.error) {
                console.error("❌ Error sending report:", result.error);
                return api.sendMessage("❌ Failed to send report. Please try again later.", event.threadID);
            }

            return api.sendMessage("✅ Your report has been sent to the owner. Thank you!", event.threadID);
        } catch (err) {
            console.error("❌ Report error:", err);
            return api.sendMessage("❌ Something went wrong while sending the report.", event.threadID);
        }
    }
};
