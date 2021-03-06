const { get } = require('request');
const { abc } = require('../general/config.json');
const { icoe } = require('../icoe');
const { apiKey2 } = require('../general/token.json');

module.exports = {
  async execute(client, msg, get_attrs, reply, log, getServerAdmins, getServerIgnoredCh, attributes) {
    //Message Content
    try {
      const characters = msg.content.split('');
      let letters = false;
      for (let i of characters) {
        if (abc.includes(i.toLowerCase())) {
          letters = true;
          break;
        }
      }
      const admins = getServerAdmins(),
          ignoredCh = getServerIgnoredCh();
      if (letters && !ignoredCh.includes(msg.channel.id) && !admins.includes(msg.author.id)) {
        let warn = 0,
            severity = 0,
            reason = [];
        const scores = await get_attrs(msg.content);
        for (let i of attributes) {
          if (scores[i] >= 0.75) {
            ++warn;
            severity = severity + scores[i];
            reason.push(i);
          }
        }
        const date = new Date();
        if (warn === 1 && severity >= .9 || warn > 1 && severity <= 1.65) {
          reply(msg.channel.id, `${msg.author}, this is a warning. You have been flagged for the following reason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\n\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#9e9d9d');
          log('834179033289719839', `Warned <t:${Math.floor(date.getTime() / 1000)}:R>\n\nReason:\n**${reason[0].toLowerCase()}**: ${scores[reason[0]]}\n\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n[Jump to!](${msg.url})`, '#9e9d9d');
          return true;
        } else if (warn > 1 && severity > 1.65) {
          var description = '';
          for (let i of reason) {
            description += `**${i.toLowerCase()}**: ${scores[i]}\n`;
          }
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          reply(msg.channel.id, `${msg.author}, you have been **Level 2 warned** for the following reasons:\n${description}\nThis has been brought to the moderators attention and will be dealt with accordingly.`, '#ff0000');
          log('834179033289719839', `**Level 2 warned** <t:${Math.floor(date.getTime() / 1000)}:R>\n\nReasons:\n${description}\nAuthor: ${msg.author}\n\nContent:\n${msg.content}\n\n[Jump to!](${msg.url})`, '#9e9d9d');
          return true;
        }
      } else return false;
    } catch (error) { }
  }
}