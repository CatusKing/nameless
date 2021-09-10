const { default: Collection } = require('@discordjs/collection');
const { status: stat } = require('../general/config.json');

module.exports = {
	execute(client, db, status, round) {
    ++status;

    if (status == stat.length) status = 0;
    const lb = db.get(`discord.server.leaderboard`) || [];
    const guildMembers = client.guilds.cache.get('830495072876494879').members.cache;
    const leaderboard = new Collection();
    for (let i = 0; i < lb.length; ++i) {
      if (guildMembers.has(lb[i][0])) {
        leaderboard.set(lb[i][0], lb[i][1]);
      }
    }
    let num = 1;
    let top;
    leaderboard.sort((a, b) => b - a)
      .filter((value, key) => client.users.cache.has(key))
      .forEach((value, key) => {
        if (num == 1) top = client.users.cache.get(key).tag;
        ++num;
      });
    let bank = round(getUserBalance('bank'));
    client.user.setActivity(config.status[status]
      .replace('%bank%', bank)
      .replace('%prefix%', prefix)
      .replace('%top%', top)
      .replace('%topCount%', topCount)
    );
    return status;
  }
};