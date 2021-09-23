const { MessageSelectMenu, MessageActionRow, CommandInteraction, Client, SelectMenuInteraction } = require("discord.js");
const { roleMessages, guildId } = require('../general/config.json');

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
        let selectMenu = new MessageSelectMenu().setCustomId(`roles^${roleMessages[i].name}`).setMaxValues(10);
        for (let j = 0; j < roleMessages[i].roles.length; ++j) {
          var role = client.guilds.cache.get(guildId).roles.cache.get(roleMessages[i].roles[j].id);
          selectMenu.addOptions({ label: role.name, value: `${roleMessages[i].roles[j].id}`, emoji: roleMessages[i].roles[j].emoji });
        }
        var components = [
          new MessageActionRow().addComponents(selectMenu)
        ];
        msg.edit({ components: components, embeds: [], content: `\u200B` })
        interaction.reply({ ephemeral: true, content: 'done!' });
      });
    }
  },
  selectMenu: true,
  executeSM(client = new Client(), interaction = new SelectMenuInteraction()) {
    for (let i = 0; roleMessages.length; ++i) {
      if (roleMessages[i].name == interaction.customId.replace('roles^', '')) {
        for (let j = 0; j < interaction.component.options.length; ++j) {
          if (!interaction.member.roles.includes(interaction.component.options[j].value)) {
            var role = client.guilds.cache.get(guildId).roles.cache.get(interaction.member.roles.cache.has(interaction.component.options[j].value));
            client.guilds.cache.get(guildId).members.cache.get(interaction.user.id).roles.add(role);
          }
        }
        interaction.reply({ ephemeral: true, content: 'added role' })
        break;
      }
    }
  },
};