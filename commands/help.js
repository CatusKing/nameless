module.exports = {
	name: 'help',
	description: 'Sends the current commands',
	execute(msg, reply) {
    let description = '';
    for (let i = 0; i < config.help.length; ++i) {
      description += `\n${prefix}${config.help[i]}`;
    }
    var embed = new Discord.MessageEmbed().setDescription(description).setColor('#ffffba');
    msg.author.send(embed)
      .catch(() => {
        reply(msg.channel.id, description, '#ffffba');
      });
    reply(msg.channel.id, 'You got mail! :mailbox_with_mail:', '#9e9d9d');
	},
};