const { Collection, MessageEmbed } = require('discord.js');
const { prefix } = require('../general/config.json');
module.exports = {
	name: 'help',
	description: 'Sends the current commands',
  usage: `help [command]`,
	execute(msg, args, commands = new Collection()) {
    var embed = new MessageEmbed().setColor('#9e9d9d')
    if (commands.has(args[0])) {
      embed.setTitle(commands.get(args[0]).name)
        .setDescription(`\`\`\`\n${commands.get(args[0]).description}\n\`\`\`\n\`\`\`\n${prefix}${commands.get(args[0]).usage}\n\`\`\``);
    } else {
      let description = '\`\`\`';
      commands.forEach((value, key) => {
        description += `${value.name} - ${value.description}\n`;
      });
      description += `\`\`\``;
      embed.setTitle('Commands:').setDescription(description);
    }
    msg.channel.send(embed);
	},
};