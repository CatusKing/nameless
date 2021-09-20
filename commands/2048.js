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
        components[i].addComponents(new MessageButton().setLabel(table[i][j]).setStyle('SECONDARY').setCustomId(`${i}-${j}`))
      }
    }
    interaction.reply({ content: 'hi', components:  })
  }
}