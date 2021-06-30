const { Collection, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Sends the current commands',
	execute(msg, args, commands = new Collection()) {
    var embed = new MessageEmbed().setColor('#9e9d9d')
    if (commands.has(args[0])) {
      embed.setTitle(commands.get(args[0]).name)
        .setDescription(`\`\`\`${commands.get(args[0]).description}\n\`\`\``);
    } else {
      let description = '\`\`\`';
      commands.forEach((value, key) => {
        description += `${value.name} - ${values.description}\n`;
      });
      description += `\`\`\``;
      embed.setTitle('Commands:').setDescription(description);
    }
    msg.channel.send(embed);
	},
};