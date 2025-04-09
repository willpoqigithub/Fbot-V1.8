const fs = require("fs");
const path = require("path");

const autoAcceptFile = path.join(__dirname, "..", "autoaccept.json");

// Load or initialize autoaccept data
let autoAcceptData = {};
if (fs.existsSync(autoAcceptFile)) {
    autoAcceptData = JSON.parse(fs.readFileSync(autoAcceptFile, "utf-8"));
}

module.exports = {
    name: "autoaccept",
    usePrefix: false,
    usage: "autoaccept on/off",
    version: "1.3",
    description: "Toggle auto-accept group requests per group",
    admin: false,

    async execute({ api, event, args }) {
        const threadID = event.threadID;
        const senderID = event.senderID;

        const config = require("../config.json");
        const allowedUsers = config.ownerID || [];

        if (!allowedUsers.includes(senderID)) {
            return api.sendMessage("❌ Only the owner can use this command.", threadID);
        }

        const action = args[0]?.toLowerCase();
        if (!["on", "off"].includes(action)) {
            return api.sendMessage("⚠️ Use `autoaccept on` or `autoaccept off`.", threadID);
        }

        // Check if bot is admin in the group
        const threadInfo = await api.getThreadInfo(threadID);
        const botID = api.getCurrentUserID();
        const botIsAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);

        if (!botIsAdmin && action === "on") {
            return api.sendMessage("❌ Bot must be admin to enable auto accept in this group.", threadID);
        }

        if (action === "on") {
            autoAcceptData[threadID] = true;
            fs.writeFileSync(autoAcceptFile, JSON.stringify(autoAcceptData, null, 2));
            return api.sendMessage("✅ Auto accept enabled in this group.", threadID);
        }

        if (action === "off") {
            delete autoAcceptData[threadID];
            fs.writeFileSync(autoAcceptFile, JSON.stringify(autoAcceptData, null, 2));
            return api.sendMessage("⛔ Auto accept disabled in this group.", threadID);
        }
    }
};
