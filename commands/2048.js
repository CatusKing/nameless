const { CommandInteraction, Client, MessageActionRow, MessageButton, ButtonInteraction } = require("discord.js");
const game = require('2048_functional');

module.exports = {
  name: '2048',
  description: 'Just a simple test command',
  slash: true,
  options: [],
  executeI(client = new Client(), interaction = new CommandInteraction(), log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const preTable = db.get(`discord.server.table`);
    var table = game.play({ isNewGame: true }).nextField;
    db.set(`discord.server.table`, table);
    var components = [];
    for(let i = 0; i < table.length; ++i) {
      components[i] = new MessageActionRow()
      for(let j = 0; j < table[i].length; ++j) {
        components[i].addComponents(new MessageButton().setLabel(`${table[i][j]}`).setStyle('SUCCESS').setCustomId(`${i}*${j}`));
      }
    }
    components[0].addComponents(new MessageButton().setEmoji('⬆️').setCustomId(`up!`).setStyle('PRIMARY'));
    components[3].addComponents(new MessageButton().setEmoji('⬇️').setCustomId(`down!`).setStyle('PRIMARY'));
    components[4] = new MessageActionRow().addComponents([ new MessageButton().setEmoji('⬅️').setCustomId('left!').setStyle('PRIMARY'), new MessageButton().setLabel('ye').setCustomId('fill1').setStyle('SECONDARY'), new MessageButton().setLabel('ye').setCustomId('label2').setStyle('SECONDARY'), new MessageButton().setEmoji('➡️').setCustomId('right!').setStyle('PRIMARY') ]);
    interaction.reply({ content: 'text', components: components });
  },
  button: true,
  buttonId: '!',
  executeB(client = new Client(), interaction = new ButtonInteraction(), log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var preTable = db.get(`discord.server.table`);
    if (!preTable) {
      interaction.message.edit({ content: 'No active thingy', components: [] })
    } else {
      console.log(interaction.component.customId.replace('!', ''))
      var table = game.play({ prevField: preTable, direction: interaction.component.customId.replace('!', '') });
      console.log(table)
      var components = [];
      for(let i = 0; i < table.length; ++i) {
        components[i] = new MessageActionRow()
        for(let j = 0; j < table[i].length; ++j) {
          components[i].addComponents(new MessageButton().setLabel(`${table[i][j]}`).setStyle('SUCCESS').setCustomId(`${i}*${j}`));
        }
      }
      components[0].addComponents(new MessageButton().setEmoji('⬆️').setCustomId(`up!`).setStyle('PRIMARY'));
      components[3].addComponents(new MessageButton().setEmoji('⬇️').setCustomId(`down!`).setStyle('PRIMARY'));
      components[4] = new MessageActionRow().addComponents([ new MessageButton().setEmoji('⬅️').setCustomId('left!').setStyle('PRIMARY'), new MessageButton().setLabel('ye').setCustomId('fill1').setStyle('SECONDARY'), new MessageButton().setLabel('ye').setCustomId('label2').setStyle('SECONDARY'), new MessageButton().setEmoji('➡️').setCustomId('right!').setStyle('PRIMARY') ]);
      interaction.message.edit({ components: components })
    }
  },
}