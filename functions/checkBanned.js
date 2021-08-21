module.exports = {
	execute(client, db) {
    const users = db.get(`discord.server.banned`) || [];
    for(let i = 0; i < users.length; i++) {
      const banned = users[i][1];
        if (banned > 0 || banned == -1) {
          if (client.guilds.cache.get('830495072876494879').members.cache.has(users[i][0])) {
            const member = client.guilds.cache.get('830495072876494879').members.cache.get(users[i][0]);
            member.ban({reason: `Temp banned`, days: 1});
          }
          if (banned != -1) users[i][1] = banned - 1;
        } else if (banned == 0) {
          client.guilds.cache.get('830495072876494879').bans.fetch().then(bannedMembers => {
            const banned = bannedMembers.find(user => user.user.id == users[i][0]);
            if (banned) client.guilds.cache.get('830495072876494879').members.unban(banned.user, 'Temp ban over')
          });
        }
    }
    db.set(`discord.server.banned`, users);
  }
};