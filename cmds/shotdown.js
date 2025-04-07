module.exports = {
    name: "shutdown",
    usage: "shutdown",
    description: "Stops the bot (admin only).",
    usePrefix: true,
    admin: true,

    execute: async ({ api, event }) => {
        api.sendMessage("⚠️ Bot is shutting down...", event.threadID, () => {
            process.exit(0);
        });
    }
};
