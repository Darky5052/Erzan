const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Events, EmbedBuilder, Discord } = require('discord.js');
const { Eco, EconomyManager } = require("quick.eco");
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'Reason', reason);
});

const client = new Client({
  disableMentions: 'everyone',
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
});

client.config = require("./config.json");
client.commands = new Collection(); 


const levelSchema = require('./Models/Level');
const levelschema = require('./Models/LevelSetup');

client.on(Events.MessageCreate, async (message, err) => {

    const { guild, author } = message;
    if (message.guild === null) return;
    const leveldata = await levelschema.findOne({ Guild: message.guild.id });

    if (!leveldata || leveldata.Disabled === 'disabled') return;
    let multiplier = 1;
    
    multiplier = Math.floor(leveldata.Multi);
    

    if (!guild || author.bot) return;

    levelSchema.findOne({ Guild: guild.id, User: author.id}, async (err, data) => {

        if (err) throw err;

        if (!data) {
            levelSchema.create({
                Guild: guild.id,
                User: author.id,
                XP: 0,
                Level: 0
            })
        }
    })

    const channel = message.channel;

    const give = 1;

    const data = await levelSchema.findOne({ Guild: guild.id, User: author.id});

    if (!data) return;

    const requiredXP = data.Level * data.Level * 20 + 20;

    if (data.XP + give >= requiredXP) {

        data.XP += give;
        data.Level += 1;
        await data.save();
        
        if (!channel) return;

        const levelembed = new EmbedBuilder()
        .setColor(000000)
        .setTitle(`> ${author.username} has Leveled Up!`)
        .setTimestamp()
        .addFields({ name: `**New Rank:**`, value: `> ${author.username} is now level ${data.Level}!`})

        await message.channel.send({ embeds: [levelembed] }).catch(err => console.log('Error sending level up message!'));
    } else {

        if(message.member.roles.cache.find(r => r.id === leveldata.Role)) {
            data.XP += give * multiplier;
        } data.XP += give;
        data.save();
    }
})

module.exports = client;

// client.eco = new Eco.EconomyManager();({
//   adapter: 'sqlite'
// })
// client.db = Eco.db; // quick.db
// client.config = require("./config");
// client.commands = new Discord.Collection();
// client.aliases = new Discord.Collection();
// client.shop = {
//   "Grandma's Stick" : {
//     cost: 300
//   }
// };
// const fs = require("fs");

// fs.readdir("./Events/", (err, files) => {
//     if (err) return console.error(err);
//     files.forEach(f => {
//         if (!f.endsWith(".js")) return;
//         const event = require(`./Events/${f}`);
//         let eventName = f.split(".")[0];
//         client.on(eventName, event.bind(null, client));
//     });
// });

// fs.readdir("./Economy/", (err, files) => {
//     if (err) return console.error(err);
//     files.forEach(f => {
//         if (!f.endsWith(".js")) return;
//         let command = require(`./Economy/${f}`);
//         client.commands.set(command.help.name, command);
//         command.help.aliases.forEach(alias => {
//             client.aliases.set(alias, command.help.name);
//         });
//     });
// });

client.login(client.config.token).then(() => {
  loadEvents(client);
  loadCommands(client);
});