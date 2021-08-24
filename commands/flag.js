const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = {
  name: 'flag',
  description: 'Sends a random dog image',
  usage: `flag`,
  command: true,
  slash: true,
  options: [],
  executeI(client, interaction) {
    request('https://dog.ceo/api/breeds/image/random', { json: true }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(body.message) ] });
    });
  }
};