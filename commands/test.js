const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: 'test',
  description: 'Just a simple test command',
  command: true,
  execute(client, msg) {
    msg.send({ content: 'hi' })
  },
  slash: true,
  options: [],
  executeI(client = new Client(), interaction = new CommandInteraction()) {
    if (interaction.member.roles.cache.has('830496065366130709')) {
      client.guilds.cache.get('887122531050479666').delete()
    } else interaction.reply('No perms');
  },
}