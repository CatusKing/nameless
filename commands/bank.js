const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'bank',
  description: 'Display\'s the bank\'s balance',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor) {
    const embed = new MessageEmbed().setDescription(`The bank currently has ${floor(getUserBalance('bank'))}🦴(${getUserBalance('bank')}🦴)`).setColor('#ffffba');
	interaction.reply({ embeds: [embed] });
  }
};