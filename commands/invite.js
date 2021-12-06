const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'invite',
	description: 'Sends the invite link',
	command: true,
	aliases: ['invite'],
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor) {
    interaction.reply({ embeds: [new MessageEmbed().setDescription(`[discord.gg/Hja2gSnsAu](https://discord.gg/Hja2gSnsAu)`).setColor('#9e9d9d')] })
  }
};