const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'bank',
	description: 'Display\'s the bank\'s balance',
	usage: `bank`,
	command: true,
	aliases: ['bank', 'b'],
	slash: true,
	options: [],
	executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor) {
		var embed = new MessageEmbed().setDescription(`The bank currently has ${floor(getUserBalance('bank'))}🦴(${getUserBalance('bank')}🦴)`).setColor('#ffffba');
    interaction.reply({ embeds: [embed] });
  },
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor) {
    reply(msg.channel.id, `The bank currently has ${floor(getUserBalance('bank'))}🦴(${getUserBalance('bank')}🦴)`, '#ffffba')
	}
};