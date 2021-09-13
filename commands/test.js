const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: 'test',
  description: 'Just a simple test command',
  slash: true,
  options: [],
  executeI(client = new Client(), interaction = new CommandInteraction()) {
    if (interaction.member.roles.cache.has('')) {
      client.guilds.create('Test', { defaultMessageNotifications: 'ALL_MESSAGES', explicitContentFilter: 'ALL_MEMBERS', verificationLevel: 'NONE' }).then((guild) => {
        guild.invites.create(guild.channels.cache.first(), { reason: 'Test', maxUses: '50' })
      }, (err) => console.warn(err));
    } else interaction.reply('No perms');
  }
}