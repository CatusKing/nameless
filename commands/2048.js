const { CommandInteraction, Client } = require("discord.js");
const game = require('2048_functional');

module.exports = {
  name: '2048',
  description: 'Just a simple test command',
  slash: true,
  options: [],
  executeI(client = new Client(), interaction = new CommandInteraction()) {
    try {
      var yep = game.play({ isNewGame: true }).nextField();
      console.log(yep)
    } catch (err) {
      interaction.reply(err);
    }
  }
}