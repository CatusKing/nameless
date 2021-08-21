const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'invite',
	description: 'Sends the invite link',
	usage: `invite`,
	command: true,
	aliases: ['invite'],
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor) {
    interaction.reply({ embeds: [new MessageEmbed().setDescription(`[discord.gg/Hja2gSnsAu](https://discord.gg/Hja2gSnsAu)`).setColor('#ffffba')] })
  },
	execute(client, msg, args, reply) {
    reply(msg.channel.id, `[discord.gg/Hja2gSnsAu](https://discord.gg/Hja2gSnsAu)`, '#ffffba');
  }
};