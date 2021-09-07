const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = {
  name: 'dog',
  description: 'Sends a random dog image',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction) {
    request('https://dog.ceo/api/breeds/image/random', { json: true }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setImage(body.message) ] });
    });
  }
};