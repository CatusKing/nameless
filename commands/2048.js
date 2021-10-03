const { CommandInteraction, Client, MessageActionRow, MessageButton, ButtonInteraction } = require("discord.js");
const game = require('2048_functional');
const { emojiNumbers } = require('../general/config.json');

module.exports = {
  name: '2048',
  description: 'Just a simple test command',
  slash: true,
  options: [],
  executeI(client = new Client(), interaction = new CommandInteraction(), log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const preTable = db.get(`discord.server.table`);
    if (preTable) {
      var table = game.play({ prevField: preTable, isNewGame: false, direction: 'down' }).nextField;
    } else {
      var table = game.play({ isNewGame: true }).nextField;
      db.set(`discord.server.table`, table);
    }
    var components = [];
    for (let i = 0; i < table.length; ++i) {
      components[i] = new MessageActionRow()
      for (let j = 0; j < table[i].length; ++j) {
        var label = emojiNumbers[String(table[i][j])];
        if (label[0] == '') var style = 'SECONDARY';
        else var style = 'SUCCESS';
        components[i].addComponents(new MessageButton().setLabel(`${label[1]}`).setEmoji(`${label[0]}`).setStyle(style).setCustomId(`${i}*${j}`));
      }
    }
    components[0].addComponents(new MessageButton().setEmoji('⬆️').setCustomId(`up!`).setStyle('PRIMARY'));
    components[3].addComponents(new MessageButton().setEmoji('➡️').setCustomId(`right!`).setStyle('PRIMARY'));
    components[4] = new MessageActionRow().addComponents([new MessageButton().setEmoji('⬅️').setCustomId('left!').setStyle('PRIMARY'), new MessageButton().setLabel('ye').setCustomId('fill1').setStyle('SECONDARY'), new MessageButton().setLabel('ye').setCustomId('label2').setStyle('SECONDARY'), new MessageButton().setEmoji('⬇️').setCustomId('down!').setStyle('PRIMARY')]);
    interaction.reply({ content: `${interaction.user}`, components: components });
    db.set(`discord.server.table`, table);
  },
  button: true,
  buttonId: '!',
  executeB(client = new Client(), interaction = new ButtonInteraction(), log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var preTable = db.get(`discord.server.table`);
    if (!preTable) {
      interaction.message.edit({ content: 'No active thingy', components: [] })
    } else {
      var table = game.play({ prevField: preTable, direction: interaction.component.customId.replace('!', '') });
      var components = [];
      for (let i = 0; i < table.nextField.length; ++i) {
        components[i] = new MessageActionRow();
        for (let j = 0; j < table.nextField[i].length; ++j) {
          var label = emojiNumbers[String(table.nextField[i][j])];
          if (label[0] == '') var style = 'SECONDARY';
          else var style = 'SUCCESS';
          components[i].addComponents(new MessageButton().setLabel(`${label[1]}`).setEmoji(`${label[0]}`).setStyle(style).setCustomId(`${i}*${j}`));
        }
      }
      components[0].addComponents(new MessageButton().setEmoji('⬆️').setCustomId(`up!`).setStyle('PRIMARY'));
      components[3].addComponents(new MessageButton().setEmoji('➡️').setCustomId(`right!`).setStyle('PRIMARY'));
      components[4] = new MessageActionRow().addComponents([new MessageButton().setEmoji('⬅️').setCustomId('left!').setStyle('PRIMARY'), new MessageButton().setLabel('ye').setCustomId('fill1').setStyle('SECONDARY'), new MessageButton().setLabel('ye').setCustomId('label2').setStyle('SECONDARY'), new MessageButton().setEmoji('⬇️').setCustomId('down!').setStyle('PRIMARY')]);
      if (table.defeat) {
        interaction.update({ components: [], content: `${interaction.user} lost the game\nsoon we will punish for this` });
        db.set(`discord.server.table`, null);
      } else if (table.victory) {
        interaction.update({ components: components, content: `${interaction.user} won the game` });
        db.set(`discord.server.table`, table.nextField);
      } else {
        db.set(`discord.server.table`, table.nextField);
        interaction.update({ components: components, content: `${interaction.user}` });
      }
    }
  },
}