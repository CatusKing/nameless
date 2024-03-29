const { MessageSelectMenu, MessageActionRow, CommandInteraction, Client, SelectMenuInteraction } = require("discord.js");
const { roleMessages, guildId } = require('../general/config.json');
const { icoe } = require("../icoe");

module.exports = {
	name: 'roles',
	description: 'Updates the bots status',
  command: false,
  slash: true,
  options: [],
	executeI(client, interaction = new CommandInteraction(), log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const channel = client.guilds.cache.get(guildId).channels.cache.get('830550223653830708');
    for (let i = 0; i < roleMessages.length; ++i) {
      channel.messages.fetch(roleMessages[i].id).then(msg => {
        let selectMenu = new MessageSelectMenu().setCustomId(`roles^${roleMessages[i].name}`).setPlaceholder(roleMessages[i].name);
        for (let j = 0; j < roleMessages[i].roles.length; ++j) {
          const role = client.guilds.cache.get(guildId).roles.cache.get(roleMessages[i].roles[j].id);
          selectMenu.addOptions({ label: role.name, value: `${roleMessages[i].roles[j].id}`, emoji: roleMessages[i].roles[j].emoji });
        }
        const components = [
          new MessageActionRow().addComponents(selectMenu)
        ];
        msg.edit({ components: components, embeds: [], content: `\u200B` })
        interaction.reply({ ephemeral: true, content: 'done!' });
      }).catch(err => icoe(err));
    }
  },
  selectMenu: true,
  executeSM(client = new Client(), interaction = new SelectMenuInteraction()) {
    for (let i = 0; roleMessages.length; ++i) {
      if (roleMessages[i].name == interaction.customId.replace('roles^', '')) {
        for (let j = 0; j < interaction.values.length; ++j) {
          const role = client.guilds.cache.get(guildId).roles.cache.get(interaction.values[j]);
          if (!interaction.member._roles.includes(interaction.values[j])) {
            interaction.member.roles.add(role);
            interaction.reply({ ephemeral: true, content: `Added \`${role.name}\`` });
          } else {
            interaction.member.roles.remove(role);
            interaction.reply({ ephemeral: true, content: `Removed \`${role.name}\`` });
          }
        }
        break;
      }
    }
  },
};