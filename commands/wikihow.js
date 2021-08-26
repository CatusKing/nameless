const { MessageEmbed } = require("discord.js");
const jsdom = require("jsdom");
const request = require('request');
module.exports = {
  name: 'wikihow',
  description: 'Retrieves a random WikiHow article',
  usage: `wikihow`,
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    request('http://www.wikihow.com/Special:Randomizer', { json: false }, (err, res, body) => {
      if (err) console.warn(err);
      const dom = new jsdom.JSDOM(body);
      var yes = true;
      const embed = new MessageEmbed().setDescription(`[link](https://www.wikihow.com${res.socket._httpMessage.path})\n${dom.window.document.querySelector("title").textContent}`).setColor('#9e9d9d');
      dom.window.document.querySelectorAll('img').forEach((value) => {
        if (value.src.includes('https://') && value.src.includes(dom.window.document.querySelector("title").textContent.split(' ')[0]) && yes) {
          yes = false;
          embed.setImage(value.src).setDescription(`${embed.description}\n[image](${value.src})`);
        }
      });
      if (embed.description == null) {
        interaction.reply(`idk dude the code is scuffed(error)`);
      } else {
        interaction.reply({ embeds: [embed] });
      }
    });
  }
};