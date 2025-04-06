const config = require("../config.json");

module.exports = {
    name: "add",
    usePrefix: false,
    description: "Add owner to a group.",
    usage: "add [list | number]",
    version: "1.1",

    async execute({ api, event, args }) {
        const threadID = event.threadID;
        const senderID = event.senderID;

        // Only owner can use this command
        if (senderID !== config.ownerID) {
            return api.sendMessage("❌ You are not authorized to use this command.", threadID);
        }

        // Get group chats
        const threads = await api.getThreadList(100, null, ["INBOX"]);
        const groupThreads = threads.filter(t => t.isGroup);

        if (args[0] === "list") {
            if (groupThreads.length === 0) return api.sendMessage("❌ No groups found.", threadID);

            let msg = "📋 List of Groups:\n\n";
            groupThreads.forEach((group, index) => {
                msg += `${index + 1}. ${group.name || "Unnamed Group"} (${group.threadID})\n`;
            });

            return api.sendMessage(msg, threadID);
        }

        const index = parseInt(args[0]) - 1;
        const group = groupThreads[index];

        if (!group) return api.sendMessage("❌ Invalid group number.", threadID);

        try {
            await api.addUserToGroup(config.ownerID, group.threadID);
            return api.sendMessage(`✅ Owner added to group: ${group.name || "Unnamed Group"}`, threadID);
        } catch (err) {
            console.error("❌ Failed to add owner:", err);
            return api.sendMessage("❌ Couldn't add owner. They might already be in the group or cannot be added.", threadID);
        }
    }
};
