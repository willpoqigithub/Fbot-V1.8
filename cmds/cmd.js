module.exports = {
    name: "cmd",
    description: "Lists all admin-only commands.",
    usage: "cmd",
    usePrefix: true,
    admin: true,

    execute: async ({ api, event }) => {
        const { threadID, messageID } = event;

        const adminCommands = Array.from(global.commands.values())
            .filter(cmd => cmd.admin)
            .sort((a, b) => a.name.localeCompare(b.name));

        if (adminCommands.length === 0) {
            return api.sendMessage("✅ No admin-only commands found.", threadID, messageID);
        }

        const list = adminCommands.map((cmd, index) =>
            `${index + 1}. ${cmd.name} (${cmd.usePrefix ? "uses prefix" : "no prefix"})\n   Usage: ${cmd.usage || "No usage info"}`
        ).join("\n\n");

        const message = `
╔═════════════════╗
   🔐 Admin Commands
╚═════════════════╝
${list}

Only bot owners can use these.`;

        api.sendMessage(message.trim(), threadID, messageID);
    }
};
