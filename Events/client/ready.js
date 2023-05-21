const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
mongoose.set("strictQuery", true)
const config = require("../../config.json");
require("colors");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await mongoose.connect(config.mongodb || '', {
            keepAlive: true,
        });

        if (mongoose.connect) {
            console.log('[MongoDB connected]'.green)
        }

        const activities = [`${client.guilds.cache.size} servers & ${client.users.cache.size} users`];
        //This is the status of the bot if u didnt know. I was gonna put my name here but eh ¯\_(ツ)_/¯
        let i = 0;

        setInterval(() => client.user.setPresence({ activities: [{ name: activities[i++ % activities.length], type: ActivityType.Watching }] }), 15000);
        console.log(`[${client.user.tag} is watching ${client.guilds.cache.size} servers & ${client.users.cache.size} users]`.blue);
    },
};
