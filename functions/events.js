const { MessageEmbed } = require("discord.js");
const request = require('request');
const { eventsMessages } = require('../general/config.json');

module.exports = {
  execute(client) {
    var embeds = [];
    request(`https://ll.thespacedevs.com/2.0.0/event/upcoming/?format=json&limit=20`, { json: true }, (err, res, body) => {
      if (err) return console.log(err);
      var date = new Date();
      for (let i of body.results) {
        var launchTime = new Date(i.date);
        if (launchTime.getTime() - date.getTime() < 0) continue;
        var embed = new MessageEmbed()
          .setColor('#0b3d91')
          .setAuthor(`Updated on ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} EST`)
          .setTitle(i.name)
          .setURL(i.news_url)
          .setDescription(`<t:${Math.floor(launchTime.getTime() / 1000)}:R>\n\n${i.description}`)
          .addField('Type', i.type.name)
          .setImage(i.feature_image);
        embeds.push(embed);
      }
      var time = 0;
      for (let j = 0; j < eventsMessages.length; ++j) {
        client.channels.cache.get('841334897825415199').messages.fetch(eventsMessages[j])
          .then(message => {
            time = time + 5000;
            if (embeds[j] != null) {
              setTimeout(() => message.edit({ embeds: [embeds[j]], content: '\u200B' }), time);
            } else {
              setTimeout(() => message.edit({ embeds: [new MessageEmbed().setDescription('\u200B').setColor('#9e9d9d')], content: '\u200B' }), time);
            }
          });
      }
    });
  }
};