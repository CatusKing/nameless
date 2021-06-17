module.exports = {
	name: 'unmute',
	description: 'Unmute another user',
	execute(client, msg, reply, getUserMuted, setUserMuted) {
    if (msg.member.roles.cache.has('830496065366130709') || msg.member.roles.cache.has('830495937301577759') || msg.member.roles.cache.has('830495908336369694')) {
      const target = msg.mentions.members.first() || msg.member;
      const muted = getUserMuted(target.id);
      if (muted != 0) {
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
        target.roles.remove(role, `Muted removed by ${msg.author}`);
        setUserMuted(target.id, 0);
        reply(msg.channel.id, `Unmuted ${target}\nAction by ${msg.author}`, '#9e9d9d');
      } else reply(msg.channel.id, 'This user isn\'t muted', '#9e9d9d');
    } else {
      reply(msg.channel.id, `You don't have perms for this`, `#9e9d9d`);
    }
  }
};