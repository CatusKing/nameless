const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'balance',
	description: 'Allows you to look at your or another users balance',
  usage: `balance [@User]`,
  command: true,
  aliases: ['balance', 'bal'],
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
    const target = interaction.user;
    interaction.reply({ embeds: [ new MessageEmbed().setDescription(`${target} has ${floor(getUserBalance(target.id))}🦴(${getUserBalance(target.id)}🦴)`).setColor('#ffffba') ] });
  },
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor) {
    const target = msg.mentions.users.first() || msg.author;
    reply(msg.channel.id, `${target} has ${floor(getUserBalance(target.id))}🦴(${getUserBalance(target.id)}🦴)`, '#ffffba');
  }
};