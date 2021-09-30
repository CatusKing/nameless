const { MessageEmbed, CommandInteraction } = require("discord.js");
const request = require("request");
const { icoe } = require('../icoe');

module.exports = {
  name: 'dog',
  description: 'Sends a random dog image',
  command: false,
  slash: true,
  options: [
    {
      name: 'breed',
      type: 'STRING',
      description: 'The breed being searched for',
      required: true
    }
  ],
  executeI(client, interaction = new CommandInteraction()) {
    request(`https://api.thecatapi.com/v1/breeds/search?q=${interaction.options.getString('breed')}`, { json: true }, (err, res, body) => {
      if (err) return icoe(err);
      interaction.reply({ embeds: [ new MessageEmbed().setTitle(body[0].name).setURL(body[0].wikipedia_url).setFooter(body[0].id).setDescription(body[0].description).addField('Life Span', body[0].life_span).setColor('#9e9d9d').setThumbnail(`https://api.thecatapi.com/v1/images/${body[0].reference_image_id}`) ] })
    });
  }
};