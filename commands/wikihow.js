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
      console.log(res.socket._httpMessage.path);
      const dom = new jsdom.JSDOM(body);
      var yes = true;
      const embed = new MessageEmbed().setDescription(`${dom.window.document.querySelector("title").textContent}`).setColor('#9e9d9d');
      dom.window.document.querySelectorAll('img').forEach((value) => {
        if (value.src.includes('https://') && value.src.includes(dom.window.document.querySelector("title").textContent.split(' ')[0]) && yes) {
          yes = false;
          embed.setImage(value.src).setDescription(`${embed.description}\n[image](${value.src})`);
        }
      });
      if (embed.description == null) {
        reply(msg.channel.id, `idk dude the code is scuffed(error)`);
      } else {
        msg.channel.send(embed);
      }
    });
  }
};