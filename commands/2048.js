const { CommandInteraction, Client, MessageActionRow, MessageButton } = require("discord.js");
const game = require('2048_functional');

module.exports = {
  name: '2048',
  description: 'Just a simple test command',
  slash: true,
  options: [],
  executeI(client = new Client(), interaction = new CommandInteraction()) {
    var table = game.play({ isNewGame: true }).nextField;
    var components = [];
    for(let i = 0; i < table.length; ++i) {
      components[i] = new MessageActionRow()
      for(let j = 0; j < table[i].length; ++j) {
        components[i].addComponents(new MessageButton().setLabel(`${table[i][j]}`).setStyle('SUCCESS').setCustomId(`${i}-${j}`))
      }
    }
    components[0].addComponents(new MessageButton().setEmoji('⬆️').setCustomId(`up`).setStyle('PRIMARY'));
    components[3].addComponents(new MessageButton().setEmoji('⬇️').setCustomId(`down`).setStyle('PRIMARY'));
    components[4] = new MessageActionRow()
    components[4].addComponents([ new MessageButton().setEmoji('⬅️').setCustomId('left').setStyle('PRIMARY'), new MessageButton().setLabel('ye').setCustomId('fill1').setStyle('SECONDARY'), new MessageButton().setLabel('ye').setCustomId('label2').setStyle('SECONDARY'), new MessageButton().setEmoji('➡️').setCustomId('right').setStyle('PRIMARY') ])
    interaction.reply({ content: 'hi', components: components })
  }
}