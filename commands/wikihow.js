const { MessageEmbed } = require("discord.js");
const jsdom = require("jsdom");
const request = require('request');
module.exports = {
  name: 'wikihow',
  description: 'Retrieves a random WikiHow image',
  usage: `wikihow`,
  command: true,
  aliases: ['wikihow', 'wh'],
  execute(client, msg, args, reply) {
    request('http://www.wikihow.com/Special:Randomizer', { json: false }, (err, res, body) => {
      if (err) console.warn(err);
      const dom = new jsdom.JSDOM(body);
      reply(msg.channel.id, dom.window.document.querySelector("title").textContent, '#9e9d9d');
      var yes = true;
      const embed = new MessageEmbed()
      dom.window.document.querySelectorAll('img').forEach((value) => {
        if (value.src.includes('https://') && value.src.includes(dom.window.document.querySelector("title").textContent.split(' ')[0]) && yes) {
          yes = false;
          embed.setImage(value.src).setDescription(`[link](${value.src})`);
        }
      });
      msg.channel.send(embed);
    });
  }
};