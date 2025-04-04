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

                    const mentions = [
                        { tag: `@${userName}`, id: userID },
                        { tag: "@ADMIN", id: "61564220746177" },
                        { tag: "@BotCreator", id: "100030880666720" }
                    ];

                    const message = {
                        body: `👋 Welcome @${userName} to the group!
👥 Total members: ${totalMembers}

🎉 How To Earn FunStep 

✅ Daily Task
✅ Check in Everyday (Free 1 Coin)
✅ 3k steps (Receive 2 Coin)
✅ Invitation is optional (Receive 3 Coin)
✅ Top up or investment is optional in the shop.

Overall 120 Coin minimum to withdraw.
1 COIN = 1 PHP.

🎉 How to get more income info FunStep??

☑️ Kung masipag ka mag...
✅ Invite 
✅ Investment 
✅ And stay updated sa main group.

📝 Take note it is optional only. You can withdraw without that.

Congratulations and Happy Earnings to us @everyone 😍🎉

⚠️ Strictly no sending link in our VIP GROUPCHAT and avoid unrelated topic except for the admin. Otherwise you will be kicked out of the group. Please be guided po. Salamat po.

👨‍💻[ADMIN] @ADMIN: Pm me for more assistance para ma assist kita kaagad sa concern mo po. Salamat po. 🫶

Bot creator: @BotCreator`,
                        mentions
                    };

                    await api.sendMessage(message, event.threadID);

                    // Set bot nickname if it's the one added
                    if (userID === botID) {
                        const newNickname = "Bot Assistant";
                        await api.changeNickname(newNickname, event.threadID, botID);
                    }
                }
            } catch (err) {
                console.error("❌ Error in group event:", err);
            }
        }
    }
};
