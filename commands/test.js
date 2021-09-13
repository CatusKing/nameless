const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: 'test',
  description: 'Just a simple test command',
  slash: true,
  options: [],
  executeI(client = new Client(), interaction = new CommandInteraction()) {
    if (interaction.member.roles.cache.has('830496065366130709')) {
      interaction.reply(client.guilds.cache.toJSON.toString())
    } else interaction.reply('No perms');
  }
}