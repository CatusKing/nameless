module.exports = {
	name: 'mute',
	description: 'Mute another user',
	execute(client, msg, args, reply, getUserMuted, setUserMuted) {
    if (msg.member.roles.cache.has('830496065366130709') || msg.member.roles.cache.has('830495937301577759') || msg.member.roles.cache.has('830495908336369694')) {
      const target = msg.mentions.members.first() || msg.member;
      const muted = getUserMuted(target.id);
      const duration = Math.floor(args[0] * 120) || -1;
      if (muted == 0) {
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
        target.roles.add(role, `Muted by ${msg.author}`);
        setUserMuted(target.id, duration);
        if (duration >= 1) {
          reply(msg.channel.id, `Muted ${target} for ${duration / 120} hour(s)\nAction by ${msg.author}`, '#9e9d9d');
          log('834179033289719839', `Muted ${target} for ${duration / 120} hour(s)\nAction by ${msg.author}`, '#9e9d9d')
        } else {
          reply(msg.channel.id, `Muted ${target}\nAction by ${msg.author}`, '#9e9d9d');
          log('834179033289719839', `Muted ${target}\nAction by ${msg.author}`, '#9e9d9d')
        }
      } else reply(msg.channel.id, 'This user is already muted', '#9e9d9d');
    } else reply(msg.channel.id, `You don't have perms for this`, `#9e9d9d`);
  }
};