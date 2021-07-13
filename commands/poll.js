const { prefix, choicesEmojis } = require('../general/config.json');
const { MessageEmbed, Collection } = require('discord.js');
module.exports = {
	name: 'poll',
	description: 'Starts a poll',
  usage: `poll <question with a question mark at the end> <options separated by dashes>`,
  command: true,
  aliases: ['poll'],
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
    msg.delete();
    msg.channel.send(embed.setDescription(`${description}\`\`\``)).then((message) => {
      for(let i = 0; i < emojis.length; ++i) {
        message.react(emojis[i]).then(() => {});
      }
      message.awaitReactions((reaction, user) => emojis.includes(reaction.emoji.name), { max: 500, time: 60000 }).then(collected => {
        const collectedEmojis = new Collection();
        for(let i = 0; i < emojis.length; ++i) {
          collectedEmojis.set(emojis[i], collected.get(emojis[i]).count);
        }
        let first = true;
        collectedEmojis.sort((a, b) => b - a).forEach((value, key) => {
          if (first == true) {
            first = [key, value];
          }
        });
        embed.setTitle(`${embed.title}\n${first[0]} is the winning choice with ${first[1] - 1} votes!`).setColor('#baffc9');
        message.edit(embed);
        message.reactions.removeAll();
      }).catch((error) => console.log(error));
    });
  }
};