module.exports = {
    name: "groups",
    usePrefix: false,
    description: "List all group chats the bot is in.",
    usage: "groups",
    version: "1.0",

    async execute({ api, event }) {
        const senderID = event.senderID;
        const allowedUsers = ["100030880666720"]; // Replace with your owner ID

        if (!allowedUsers.includes(senderID)) {
            return api.sendMessage("❌ You are not authorized to use this command.", event.threadID);
        }

        try {
            const threads = await api.getThreadList(100, null, ["INBOX"]);
            const groupThreads = threads.filter(t => t.isGroup);

            if (groupThreads.length === 0) {
                return api.sendMessage("🤖 I'm not currently in any groups.", event.threadID);
            }

            const groupList = groupThreads.map(
                (t, i) => `${i + 1}. ${t.name || "Unnamed Group"} (${t.threadID})`
            ).join("\n");

            const message = `🧾 List of Groups (${groupThreads.length} total):\n\n${groupList}`;
            api.sendMessage(message, event.threadID);
        } catch (err) {
            console.error("❌ Failed to get group list:", err);
            api.sendMessage("❌ Failed to retrieve group list.", event.threadID);
        }
    }
};
