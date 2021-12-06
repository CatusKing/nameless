const { MessageEmbed } = require('discord.js');
const request = require('request');
const { apiKey1 } = require('../general/token.json')

module.exports = {
  execute(client, id) {
    request(`https://api.nasa.gov/planetary/apod?api_key=${apiKey1}`, { json: true }, (err, res, body) => {
      if (err) return console.log(err);
      const ch = client.channels.cache.get(id);
      const embed = new MessageEmbed()
          .setImage(body.hdurl)
          .setAuthor(`Credit to NASA for providing the APOD(Astronomy Picture of the Day) <3`)
          .setTitle(body.title)
          .setURL(body.hdurl)
          .setDescription(body.explanation)
          .setColor(`#0b3d91`)
          .setFooter(body.date);
      ch.send({ embeds: [embed] });
    });
  }
};