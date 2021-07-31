const { MessageEmbed } = require("discord.js");
const jsdom = require("jsdom");
const request = require('request');
module.exports = {
  name: 'wikihow',
  description: 'Retrieves a random WikiHow image',
  usage: `wikihow`,
  command: true,
  aliases: ['wikihow'],
  execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    request('http://www.wikihow.com/Special:Randomizer', { json: false }, (err, res, body) => {
      if (err) console.warn(err);
      const dom = new jsdom.JSDOM(body);
      console.log(dom.window.document.querySelector("title").textContent);
      msg.channel.send(dom.window.document.querySelector("title").textContent);
      msg.channel.send(new MessageEmbed().setImage(`https://www.wikihow.com/images/thumb/b/b2/${dom.window.document.querySelector("title").textContent.replace(/[# ]/g, '-')}-2.jpg/v4-460px-${dom.window.document.querySelector("title").textContent.replace(/[# ]/g, '-')}-2.jpg`))
    });
  }
};