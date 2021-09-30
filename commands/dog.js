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
    request(`https://api.thedogapi.com/v1/breeds/search?q=${interaction.options.getString('breed')}`, { json: true }, (err, res, body) => {
      if (err) return icoe(err);
      var embed = new MessageEmbed();
      if (body[0].temperament) embed.setDescription(body[0].temperament)
      interaction.reply({ embeds: [ new MessageEmbed().setTitle(body[0].name).addField('Life Span', `${body[0].life_span}`, true).addField('Origin', `${body[0].origin}`, true).addField('Bred For', `${body[0].bred_for}`, true).addField('Breed Group', `${body[0].breed_group}`, true).setColor('#9e9d9d').setThumbnail(`https://cdn2.thedogapi.com/images/${body[0].reference_image_id}.jpg`) ] })
    });
  }
};