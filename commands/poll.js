const { prefix, choicesEmojis } = require('../general/config.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'poll',
	description: 'Starts a poll',
	execute(client, msg, args, reply) {
    if (!args) return reply(msg.channel.id, `Can't start a poll with no arguments`, '#9e9d9d');
    const arguments = msg.content.slice(prefix.length).trim().split(' ');
    arguments.shift();
    let question = false;
    let choices = false;
    for(let i = 0; i < arguments.length; ++i) {
      if (arguments[i].endsWith('?')) {
        if (arguments[i + 1] == null) {
          question = false;
          break;
        }
        for(let j = i; j > -1; --j) {
          if (question == false) question = `${arguments[j]}`;
          else question = `${arguments[j]} ${question}`;
        }
        arguments.splice(0, i + 1)
        choices = arguments.join(' ');
        choices = choices.split('-');
        if (choices.length < 2) choices = false;
        break;
      }
    }
    if (question == false || choices == false) return reply(msg.channel.id, `You need a question and multiple options split with dashes\n(Max of 10 choices)`, '#9e9d9d');
    var embed = new MessageEmbed().setTitle(question).setColor('#9e9d9d');
    let description = '\`\`\`';
    var emojis = [];
    for(let i = 0; i < choices.length; ++i) {
      description += `${choicesEmojis[i]} - ${choices[i]}\n`;
      emojis.push(choicesEmojis[i]);
    }
    description += `\`\`\``
    msg.channel.send(embed.setDescription(description)).then((message) => {
      for(let i = 0; i < emojis.length; ++i) {
        message.react(emojis[i]).then(() => {});
      }
      message.awaitReactions((reaction, user) => emojis.includes(reaction.emoji.name) && user.id != client.user.id, { max: 500, time: 60000 }).then(collected => {
        console.log(1);
      }).catch((error) => console.log(2));
    });
  }
};