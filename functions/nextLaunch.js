const { MessageEmbed } = require("discord.js");
const { get } = require('request');
const { icoe } = require("../icoe");

module.exports = {
  execute(client) {
    client.channels.cache.get('841137170525716480').messages.fetch('880297426508972113')
      .then(message => {
        get(`https://ll.thespacedevs.com/2.2.0/launch/upcoming/?format=json&limit=20`, { json: true }, (err, res, body) => {
          if (err) return console.log(err);
          const date = new Date();
          let id = 0;
          let temp = -1;
          for (let i = 0; i < body.results.length; ++i) {
            const tempDate = new Date(body.results[i].net);
            if (temp == -1 && (tempDate.getTime() - date.getTime()) > 0 || temp > (tempDate.getTime() - date.getTime()) && (tempDate.getTime() - date.getTime()) > 0) {
              id = i;
              temp = tempDate.getTime() - date.getTime();
            }
          }
          const launchTime = new Date(body.results[id].net);
          const embed = new MessageEmbed()
              .setColor('#0b3d91')
              .setAuthor(`Updated on ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} EST`)
              .setTitle(body.results[id].name)
              .setThumbnail(body.results[id].image)
              .addField(`Status and probability`, `Status: ${body.results[id].status.name}\nProbability: ${body.results[id].probability}`)
              .addField(`Provider: ${body.results[id].launch_service_provider.name}`, `Type: ${body.results[id].launch_service_provider.type}`)
              .setImage(body.results[id].ideographic);
          if (body.results[id].mission != null) {
            embed.setDescription(`Launch <t:${Math.floor(launchTime.getTime() / 1000)}:R>\n\n${body.results[id].mission.description}`)
              .addField(`Mission ${body.results[id].mission.name}`, `Type: ${body.results[id].mission.type}`)
            if (body.results[id].mission.orbit != null) {
              embed.addField(`Orbit`, body.results[id].mission.orbit.name);
            }
          }
          message.edit({ content: '\u200B', embeds: [embed] });
        });
      }).catch(err => icoe(err));
  }
};