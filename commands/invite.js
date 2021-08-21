module.exports = {
	name: 'invite',
	description: 'Sends the invite link',
	usage: `invite`,
	command: true,
	aliases: ['invite'],
	execute(client, msg, args, reply) {
    reply(msg.channel.id, `[Hja2gSnsAu](https://discord.gg/Hja2gSnsAu)`, '#ffffba');
  }
};