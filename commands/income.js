module.exports = {
	name: 'income',
	description: 'Sends explanation of the currency system',
	usage: `income`,
	execute(msg, reply) {
    reply(msg.channel.id, `Ok this is a quick explanation on how points are made on this server. As of when the server first started the two ways to make points goes as follows:\n1. You can make +5🦴 points per minute of messaging. This use's a cooldown system that starts a 1 minute cooldown on point gain.\n2. Spending 1 minute in vc will give you +2🦴 points. If you are not muted you will instead get a total of +5🦴 points. If you are not muted and use camera you will get a total +8🦴 points. If you can not use your camera you can instead screenshare while unmuted to get a total of +6🦴 points.\n3. also events may give points :D\n\n**If you put https://discord.gg/Hja2gSnsAu in your status you will get about 1.5x as many points**`, '#ffffba');
  }
};