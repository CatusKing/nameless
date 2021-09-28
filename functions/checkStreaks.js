const { streaks } = require('../general/config.json');

module.exports = {
  execute(client, db) {
    var users = db.get(`discord.users`) || {};
    var date = new Date();
    var guild = client.guilds.cache.get('830495072876494879');
    guild.members.cache.forEach((member) => {
      if (users[member.id]) {
        if (Number.isNaN(users[member.id].streakTime)) users[member.id].streakTime = 0;
        var streakTime = users[member.id].streakTime || 0;
        if (streakTime <= Math.floor(((date.getTime() / 1000) / 60) / 60)) {
          users[member.id].streak = 0;
        } else {
          for(let i = 0; i < streaks.length; ++i) {
            const role = guild.roles.cache.get(streaks[i][1]);
            if (users[member.id].streak < streaks[i][0] && member.roles.cache.has(role.id)) {
              member.roles.remove(role, 'Reset Streak :(');
            }
          }
        }
      }
    });
    db.set(`discord.users`, users);
  }
};