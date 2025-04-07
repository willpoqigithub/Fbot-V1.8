module.exports = {
    name: "say",
    usage: "say <message>",
    description: "Repeats the message you send.",
    usePrefix: true,
    admin: false,

    execute: async ({ api, event, args }) => {
        const message = args.join(" ");
        if (!message) {
            return api.sendMessage("❌ Please provide a message to repeat.", event.threadID, event.messageID);
        }
        api.sendMessage(message, event.threadID, event.messageID);
    }
};
