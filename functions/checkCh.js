module.exports = {
	execute(client) {
    const videoOnlyCh = client.channels.cache.get('831347288710316032');
    const generalCh = client.channels.cache.get('830495073430929472');
    const smallRoomCh = client.channels.cache.get('832047338456612885');
    const schoolCh = client.channels.cache.get('886267507743268964');
    const date = new Date();
    videoOnlyCh.members.forEach(m => {
      if (!m.voice.selfVideo && !m.user.bot) {
        m.voice.setChannel(generalCh, 'Video not enabled in the video only channel');
      }
    });
    client.guilds.cache.get('830495072876494879').members.cache.forEach((member) => {
      if (member.voice.channel != null) {
        if (!member.roles.cache.has('859270541713211422')) {
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('859270541713211422');
          member.roles.add(role);
        }
      } else if (member.roles.cache.has('859270541713211422')) {
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('859270541713211422');
        member.roles.remove(role);
      }
    });
    var limit = 3;
    smallRoomCh.members.forEach((m) => {
      let yes = true;
      m.roles.cache.forEach(r => {
        if ((r.id == '866842219985502239' || r.id == '833449708013223978') && yes) {
          !yes;
          ++limit;
        }
      });
    });
    smallRoomCh.setUserLimit(limit, 'Update because member with a keycard left or joined');
    if (date.getHours() + 1 >= 7 && date.getHours() + 1 <= 3  && date.getDay() != 0 && date.getDay() != 6 && schoolCh.name.includes('homework-help')) {
      schoolCh.setName(schoolCh.name.replace('homework-help', 'school'), 'School time!');
    } else if (schoolCh.name.includes('school')) {
      schoolCh.setName(schoolCh.name.replace('school', 'homework-help'), 'No longer school time');
    }
  }
};