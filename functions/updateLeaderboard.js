const { MessageEmbed, Collection } = require('discord.js');
const { leaderboard_count } = require('../general/config.json');
module.exports = {
	execute(client, db, round) {
    const guildMembers = client.guilds.cache.get('830495072876494879').members.cache;
    const lb = db.get(`discord.server.leaderboard`) || [];
    const leaderboard = new Collection();
    for (let i = 0; i < lb.length; ++i) {
      if (guildMembers.has(lb[i][0])) {
        leaderboard.set(lb[i][0], lb[i][1]);
      }
    }
    client.channels.cache.get('830506017304477726').messages.fetch('830507916812353556')
      .then(message => {
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
        message.edit(embed);
      });
  }
};