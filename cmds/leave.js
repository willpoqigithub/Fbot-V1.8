module.exports = {
    name: "leave",
    usePrefix: true,
    description: "Make the bot leave a group or list groups.",
    usage: "leave [list | number]",
    version: "1.1",

    async execute({ api, event, args }) {
        const senderID = event.senderID;
        const allowedUsers = ["100030880666720"]; // Replace with your owner ID

        if (!allowedUsers.includes(senderID)) {
            return api.sendMessage("❌ You are not authorized to use this command.", event.threadID);
        }

        const threads = await api.getThreadList(100, null, ["INBOX"]);
        const groupThreads = threads.filter(t => t.isGroup);

        // leave list
        if (args[0] === "list") {
            if (groupThreads.length === 0) return api.sendMessage("❌ No groups found.", event.threadID);

            let msg = "📋 List of Groups:\n\n";
            groupThreads.forEach((group, index) => {
                msg += `${index + 1}. ${group.name || "Unnamed Group"} (${group.threadID})\n`;
            });

            return api.sendMessage(msg, event.threadID);
        }

        // leave current group
        if (!args[0]) {
            return api.sendMessage("👋 Goodbye @everyone.", event.threadID, () => {
                api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
            });
        }

        // leave specific group
        const index = parseInt(args[0]) - 1;
        const group = groupThreads[index];

        if (!group) {
            return api.sendMessage("❌ Invalid group number.", event.threadID);
        }

        try {
            await api.sendMessage("👋 Goodbye @everyone.", group.threadID, () => {
                api.removeUserFromGroup(api.getCurrentUserID(), group.threadID);
            });
            return api.sendMessage(`✅ Left group: ${group.name || "Unnamed Group"}`, event.threadID);
        } catch (err) {
            console.error("❌ Error leaving group:", err);
            return api.sendMessage("❌ Failed to leave the group.", event.threadID);
        }
    }
};
