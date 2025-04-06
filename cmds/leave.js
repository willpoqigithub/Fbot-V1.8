module.exports = {
    name: "leave",
    usePrefix: true,
    description: "Make the bot leave a group (current or chosen).",
    usage: "leave [group_number]",
    version: "1.0",

    async execute({ api, event, args }) {
        const senderID = event.senderID;
        const allowedUsers = ["100030880666720"]; // Replace with your owner ID

        if (!allowedUsers.includes(senderID)) {
            return api.sendMessage("❌ You are not authorized to use this command.", event.threadID);
        }

        const goodbyeMsg = "👋 Goodbye @everyone.";

        // Leave current group
        if (!args[0]) {
            await api.sendMessage(goodbyeMsg, event.threadID, () => {
                api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
            });
            return;
        }

        // Leave a group by picking from list
        const threads = await api.getThreadList(100, null, ["INBOX"]);
        const groupThreads = threads.filter(t => t.isGroup);

        const index = parseInt(args[0]) - 1;
        const group = groupThreads[index];

        if (!group) {
            return api.sendMessage("❌ Invalid group number.", event.threadID);
        }

        try {
            await api.sendMessage(goodbyeMsg, group.threadID, () => {
                api.removeUserFromGroup(api.getCurrentUserID(), group.threadID);
            });
            api.sendMessage(`✅ Left group: ${group.name || "Unnamed Group"}`, event.threadID);
        } catch (err) {
            console.error("❌ Error leaving group:", err);
            api.sendMessage("❌ Failed to leave the group.", event.threadID);
        }
    }
};
