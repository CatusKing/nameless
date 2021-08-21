const { MessageEmbed } = require('discord.js');
const { prefix } = require('../general/config.json');
module.exports = {
	name: 'help',
	description: 'Sends the current commands',
  usage: `help [command]`,
  command: true,
  aliases: ['help'],
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands) {
    var embed = new MessageEmbed().setColor('#9e9d9d')
    if (commands.has(args[0]) && commands.get(args[0].toLowerCase()).command) {
      embed.setTitle(commands.get(args[0].toLowerCase()).name)
        .setDescription(`Description:\`\`\`\n${commands.get(args[0].toLowerCase()).description}\n\`\`\`Aliases:\`\`\`\n${commands.get(args[0].toLowerCase()).aliases}\`\`\`Usage:\`\`\`\n${prefix}${commands.get(args[0].toLowerCase()).usage}\n\`\`\``);
    } else {
      let description = '\`\`\`';
      commands.forEach((value, key) => {
        if (value.command) description += `${value.name} - ${value.description}\n`;
      });
      description += `\`\`\``;
      embed.setTitle('Commands:').setDescription(description);
    }
    msg.channel.send({ embeds : [embed] });
	},
};