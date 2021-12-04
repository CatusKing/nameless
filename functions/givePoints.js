module.exports = {
  execute(client, addUserBalance, log) {
    const guild = client.guilds.cache.get('830495072876494879');
    guild.channels.cache.forEach(ch => {
      
      if (ch.type == 'GUILD_VOICE' && ch.id != '830505700269883412') {
        ch.members.forEach(member => {
          
          if (!member.voice.deaf) {
            
            if (member.user.bot) return;
            let amount = 2;
            
            if (!member.voice.mute) {
              amount += 3;
              
              if (member.voice.selfVideo) amount += 3;
              else if (member.voice.streaming) amount += 1;
            }
            let yes = false;
            if (member.roles.cache.has('867226596103946250')) {
              amount = Math.floor(amount * 1.5);
              yes = true;
            }
            if (member.presence) {
              for (let i of member.presence.activities) {
                if (i.type == 'CUSTOM_STATUS' && i.state.includes('discord.gg/Hja2gSnsAu') && !yes) {
                  amount = Math.floor(amount * 1.5);
                  break;
                }
              }
            }
            addUserBalance(member.id, amount, `sitting in vc`, true);
          }
        });
      }
    });
  }
}