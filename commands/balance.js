const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'balance',
	description: 'Allows you to look at your or another users balance',
  command: false,
  slash: true,
  options: [
    {
      name: 'user',
      type: 'USER',
      description: 'The person you want to check the balance of',
      required: false
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const target = interaction.options.getUser('user') || interaction.user;
    interaction.reply({ embeds: [ new MessageEmbed().setDescription(`${target} has ${floor(getUserBalance(target.id))}🦴(${getUserBalance(target.id)}🦴)`).setColor('#ffffba') ] });
  }
};