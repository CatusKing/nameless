const { MessageSelectMenu, MessageActionRow, CommandInteraction } = require("discord.js");
const { roleMessages } = require('../general/config.json');

module.exports = {
	name: 'roles',
	description: 'Updates the bots status',
  command: false,
  slash: true,
  options: [],
	executeI(client, interaction = new CommandInteraction(), log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const channel = client.guilds.cache.get(guildId).channels.cache.get('830550223653830708');
    for (let i = 0; i < roleMessages.length; ++i) {
      channel.messages.fetch(roleMessages[i].id).then(msg => {
        let selectMenu = new MessageSelectMenu();
        for (let j = 0; j < roleMessages[i].roles.length; ++j) {
          var role = client.guilds.cache.get(guildId).roles.cache.get(roleMessages[i].roles[j]);
          selectMenu.addOptions({ label: role.name, value: `${roleMessages[i].name}^${roleMessages[i].roles[j]}` });
        }
        var components = [
          new MessageActionRow().addComponents(selectMenu)
        ];
        msg.edit({ components: components, embeds: [] })
        interaction.reply({ ephemeral: true, content: 'done!' });
      });
    }
  }
};