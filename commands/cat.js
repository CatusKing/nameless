const { MessageEmbed } = require("discord.js");
const { get } = require("request");
const { icoe } = require("../icoe");

module.exports = {
  name: 'cat',
  description: 'Sends information on a searched cat breed',
  command: false,
  slash: true,
  options: [
    {
      name: 'breed',
      type: 'STRING',
      description: 'The breed of cat you are looking for',
      required: true
    }
  ],
  executeI(client, interaction) {
    get(`https://api.thecatapi.com/v1/breeds/search?q=${interaction.options.getString('breed')}`, { json: true }, (err, res, body) => {
      if (err) return icoe(err);
      if (body.length === 0) return interaction.reply('No results found :(');
      interaction.reply({ embeds: [ new MessageEmbed().setTitle(body[0].name).setURL(body[0].wikipedia_url).setFooter(body[0].id).setDescription(body[0].description).addField('Life Span', `${body[0].life_span} years`, true).addField('Energy Level', `${body[0].energy_level} - 5`, true).addField('Intelligence', `${body[0].intelligence} - 5`, true).addField('Shedding Level', `${body[0].shedding_level} - 5`, true).addField('Social Needs', `${body[0].social_needs} - 5`, true).addField('Affection Level', `${body[0].affection_level} - 5`, true).setColor('#9e9d9d').setThumbnail(`https://cdn2.thecatapi.com/images/${body[0].reference_image_id}.jpg`) ] })
    });
  }
};