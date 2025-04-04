module.exports = {
    name: "event",

    async execute({ api, event }) {
        if (event.logMessageType === "log:subscribe") {
            try {
                const threadInfo = await api.getThreadInfo(event.threadID);
                const totalMembers = threadInfo.participantIDs.length;
                const botID = api.getCurrentUserID();

                const newUsers = event.logMessageData.addedParticipants;
                for (const user of newUsers) {
                    const userID = user.userFbId;
                    const userName = user.fullName || "there";

                    // Tagging new user
                    const message = {
                        body: `👋 Welcome @${userName} to the group!\n
                        👥 Total members: ${totalMembers}\n\nThis is Beta test only`,
                        mentions: [{ tag: `@${userName}`, id: userID }]
                    };

                    api.sendMessage(message, event.threadID);

                    // If the bot joins, change its nickname
                    if (userID === botID) {
                        const nicknames = "🤖 Bot Assistant";
                        const newNickname = nicknames[Math.floor(Math.random() * nicknames.length)];
                        await api.changeNickname(newNickname, event.threadID, botID);
                        console.log(`✅ Changed bot nickname to: ${newNickname}`);
                    }
                }
            } catch (error) {
                console.error("❌ Error handling group event:", error);
            }
        }
    }
};
