const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get bot ms"),
    run: (interaction) => {
        return interaction.reply(`Pong! in ${interaction.client.ws.ping}ms`)
    }
}
