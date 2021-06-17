const { dailyAmount } = require('../general/config.json');
module.exports = {
	name: 'daily',
	description: 'Claim your daily reward',
	execute(msg, reply, log, getUserDaily, setUserDaily, addUserBalance) {
    var date = new Date();

    if (getUserDaily(msg.author.id) != date.getDate()) {
      addUserBalance(msg.author.id, dailyAmount);
      addUserBalance('bank', -dailyAmount);
      setUserDaily(msg.author.id, date.getDate());
      reply(msg.channel.id, `${msg.author} just claimed ${dailyAmount}🦴 for the day`, '#baffc9');
      log('830503210951245865', `+${dailyAmount}🦴 to ${msg.author} for their daily claim`, '#baffc9');
    } else {
      let result = 24 - date.getHours();
  
      if (result == 1) result = `${result} hour`;
      else result = `${result} hours`;
      reply(msg.channel.id, `${msg.author} you have already claimed for the day\nYou can claim again in ${result}`, '#9e9d9d');
    }
  }
};