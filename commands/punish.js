const Discord = require('discord.js');
module.exports = {
	name: 'punish',
	description: 'Punishes a user',
	execute(msg, args, reply, log, setUserMuted, ) {
    if (msg.member.roles.cache.has('830496065366130709') || msg.member.roles.cache.has('830495937301577759') || msg.member.roles.cache.has('830495908336369694')) {
      const target = msg.mentions.members.first();
      if (target == null || target.id == msg.author.id) return reply(msg.channel.id, `You must mention a user that is not yourself`, '#9e9d9d');
      if (isNaN(args[0]) || args[0] < 0 || args[0] > 5) return reply(msg.channel.id, `The punishment level must be between 2-5`, '#9e9d9d');
      else {
        if (args[0] == 2) {
          const duration = 120;
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          target.roles.add(role, `Muted by ${msg.author}`);
          setUserMuted(target.id, duration);
          reply(msg.channel.id, `Muted ${target} for 1 hour\nAction by ${msg.author}\n${target} was muted for 1h due to a level 2 infraction`, '#9e9d9d');
          log('834179033289719839', `Muted ${target} for 1 hour\nAction by ${msg.author}\n${target} was muted for 1h due to a level 2 infraction`, '#9e9d9d');
        } else if (args[0] == 3) {
          const duration = 2880;
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          target.roles.add(role, `Muted by ${msg.author}`);
          setUserMuted(target.id, duration);
          reply(msg.channel.id, `Muted ${target} for 1 day\nAction by ${msg.author}\n${target} was muted for 1h due to a level 3 infraction`, '#9e9d9d');
          log('834179033289719839', `Muted ${target} for 1 day\nAction by ${msg.author}\n${target} was muted for 1h due to a level 3 infraction`, '#9e9d9d');
        } else if (args[0] == 4) {
          const duration = 2880;
          target.ban({reason: `Temp banned`, days: 1});
          setUserBanned(target.id, duration);
          reply(msg.channel.id, `Banned ${target} for 1 day\nAction by ${msg.author}\n${target} was muted for 1h due to a level 4 infraction`, '#9e9d9d');
          log('834179033289719839', `Banned ${target} for 1 day\nAction by ${msg.author}\n${target} was muted for 1h due to a level 4 infraction`, '#9e9d9d');
        } else if (args[0] == 5) {
          const duration = -1;
          target.ban({reason: `Perm banned`, days: 1});
          setUserBanned(target.id, duration);
          reply(msg.channel.id, `Banned ${target} for 1 day\nAction by ${msg.author}\n${target} was muted for 1h due to a level 4 infraction`, '#9e9d9d');
          log('834179033289719839', `Banned ${target} for 1 day\nAction by ${msg.author}\n${target} was muted for 1h due to a level 4 infraction`, '#9e9d9d');
        }
      }
    } else reply(msg.channel.id, `You don't have perms for this`, `#9e9d9d`);
  }
};