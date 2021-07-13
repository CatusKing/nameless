module.exports = {
	execute(client) {
    const playersCh = client.channels.cache.get('834038553632702505');
    const botsCh = client.channels.cache.get('834038738756567071');
    const rolesCh = client.channels.cache.get('862174910678958080');
    const channelsCh = client.channels.cache.get('862175116325421056');
    var players = 0;
    var bots = 0;
    var roles = 0;
    var channels = 0;
    client.guilds.cache.get('830495072876494879').members.cache.forEach((member) => {
      if (member.user.bot) ++bots;
      else ++players;
    });
    client.guilds.cache.get('830495072876494879').roles.cache.forEach((role) => {
      if (role.id != null) ++roles;
    });
    client.guilds.cache.get('830495072876494879').channels.cache.forEach((ch) => {
      if (ch.id != null) ++channels;
    });
    if (playersCh.name != `「Players」⇢ ${players}`) {
      playersCh.setName(`「Players」⇢ ${players}`, `They're now ${players} members in the guild`);
    }
    if (botsCh.name != `「Bots」⇢ ${bots}`) {
      botsCh.setName(`「Bots」⇢ ${bots}`, `They're now ${bots} bots in the guild`);
    }
    if (rolesCh.name != `「Roles」⇢ ${roles}`) {
      rolesCh.setName(`「Roles」⇢ ${roles}`, `They're now ${roles} roles in the guild`);
    }
    if (channelsCh.name != `「Channels」⇢ ${channels}`) {
      channelsCh.setName(`「Channels」⇢ ${channels}`, `They're now ${channels} channels in the guild`);
    }
  }
};