module.exports = {
	execute(client, db) {
    const users = db.get(`discord.users`) || {};
    client.guilds.cache.get('830495072876494879').members.cache.forEach((member, id) => {
      if (users[id] != null) {
        const muted = users[id].muted || 0;
        if (muted > 0 || muted == -1) {
          if (!member.roles.cache.has('830495536582361128')) {
            const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
            member.roles.add(role, `${member.user.username} is still muted`);
          }
          if (muted != -1) users[id].muted = muted - 1;
        } else if (muted == 0) {
          if (member.roles.cache.has('830495536582361128')) {
            const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
            member.roles.remove(role, `${member.user.username} is not muted`);
          }
        }
      }
    });
    db.set(`discord.users`, users);
  }
};