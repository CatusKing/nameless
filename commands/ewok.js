const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'ewok',
	description: 'Sends random image of an ewok',
	usage: `ewok`,
	command: true,
	aliases: ['ewok'],
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor) {
    interaction.reply({ content: [new MessageEmbed().setDescription(`ewok`).setColor('#ffffba')] })
  },
	execute(client, msg, args, reply) {
    reply(msg.channel.id, `ewok`, '#ffffba');
  }
};