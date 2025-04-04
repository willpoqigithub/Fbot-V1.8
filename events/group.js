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
                        body: `👋 Welcome @${userName} to the group!\n\n👥 Total members: ${totalMembers}\n🎉 How to get more income info FunStep??\n\n\n☑️ Kung masipag ka mag...\n✅ Invite\n✅ Investment \n✅ And stay updated sa main group.\n\n\n📝 Take note it is optional only.\nYou can withdraw without that.\n\nCongratulations and Happy\nEarnings to us @everyone 😍🎉 \n\n`,
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
