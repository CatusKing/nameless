const { MessageEmbed, Collection } = require("discord.js");

module.exports = {
	name: 'leaderboard',
	description: 'Updates the leaderboard',
  usage: `leaderboard`,
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const guildMembers = client.guilds.cache.get('830495072876494879').members.cache;
    const lb = db.get(`discord.server.leaderboard`) || [];
    const leaderboard = new Collection();
    for (let i = 0; i < lb.length; ++i) {
      if (guildMembers.has(lb[i][0])) {
        leaderboard.set(lb[i][0], lb[i][1]);
      }
    }
    let description = '```';
    let num = 1;
    leaderboard.sort((a, b) => b - a)
      .filter((value, key) => client.users.cache.has(key))
      .forEach((value, key) => {
        if (num <= leaderboard_count) {
          description += `\n< ${num} > ${round(value)}🦴 ${client.users.cache.get(key).tag}`;
        }
        ++num;
      });
    description += '```';
    var embed = new MessageEmbed().setColor('#ffffba').setDescription(description);
    interaction.reply({ embeds: [embed] });
  }
};