const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = {
	name: 'cat',
	description: 'Sends a random cat image',
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
    request(`https://api.thecatapi.com/v1/breeds/search?q=${interaction.options.getString('breed')}`, { json: true }, (err, res, body) => {
      if (err) return icoe(err);
      interaction.reply({ embeds: [ new MessageEmbed().setTitle(body[0].name).setURL(body[0].wikipedia_url).setDescription(body[0].id).setDescription(body[0].description || '').addField('Life Span', `${body[0].life_span} years`, true).addField('Energy Level', `${body[0].energy_level} - 5`, true).addField('Intelligence', `${body[0].intelligence} - 5`, true).addField('Shedding Level', `${body[0].shedding_level} - 5`, true).addField('Social Needs', `${body[0].social_needs} - 5`, true).addField('Affection Level', `${body[0].affection_level} - 5`, true).setColor('#9e9d9d').setThumbnail(`https://api.thecatapi.com/v1/images/${body[0].reference_image_id}`) ] })
    });
  }
};