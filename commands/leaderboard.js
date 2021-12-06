const { MessageEmbed, Collection } = require("discord.js");
const { leaderboard_count } = require("../general/config.json");

module.exports = {
	name: 'leaderboard',
	description: 'Updates the leaderboard',
  command: false,
  slash: true,
  options: [
    {
      type: 'SUB_COMMAND',
      name: 'streaks',
      description: 'Gives you the Streak Leaderboard',
    },
    {
      type: 'SUB_COMMAND',
      name: 'balance',
      description: 'Gives you the Balance Leaderboard',
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    let embed;
    if (interaction.options.getSubcommand() == 'balance') {
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
      embed = new MessageEmbed().setColor('#9e9d9d').setDescription(description);
      interaction.reply({ embeds: [embed] });
    } else {
      const guildMembers = client.guilds.cache.get('830495072876494879').members.cache;
      const users = db.get(`discord.users`) || {};
      const leaderboard = new Collection();
      guildMembers.forEach((member) => {
        if (users[member.id]) {
          leaderboard.set(member.id, users[member.id].streak || 0);
        }
      });
      let description = '```';
      let num = 1;
      leaderboard.sort((a, b) => b - a)
        .filter((value, key) => client.users.cache.has(key))
        .forEach((value, key) => {
          if (num <= leaderboard_count) {
            description += `\n< ${num} > ${value}🔥 ${client.users.cache.get(key).tag}`;
          }
          ++num;
        });
      description += '```';
      embed = new MessageEmbed().setColor('#9e9d9d').setDescription(description);
      interaction.reply({ embeds: [embed] });
    }
  }
};