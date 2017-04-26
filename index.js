var Botkit = require('botkit')
  , controller = Botkit.slackbot()
  , config = require('./config')
  , bot = controller.spawn({token: config.slack_token})
  , decision = require('./decision.js');

bot.startRTM(function(err, bot, payload) { 
  if (err) {
    throw new Error('Could not connect to Slack'); 
  } 
}); 

controller.on('bot_channel_join', function(bot, message) {
  console.log("bot_channel_join");
});

controller.on('user_channel_join', function(bot, message) {
  bot.reply(message, message.user.createUserTag() + ', 웰컴~ 아무 사람이나 이미지 클릭해보면 자기소개(?) 비스무리한게 적혀있는데 자기 프로필 what do i에 작성해주면 감사 ㅋㅋ');
});

controller.on('channel_leave', function(bot, message) {
  bot.reply(message, message.user.createUserTag() + ', 어디가노?');
});

controller.hears(["안녕","안녕하세요", "하이"], ["direct_message","direct_mention","mention","ambient"], function(bot, message) { 
  bot.reply(message, '오냐, 밥뭇나?'); 
});

controller.on('ambient', function(bot, message){
  var text = message.text;
  var response = decision.checkKeywordAndGetResponse(text);

  if(response != null) {
    bot.reply(message, response);	
  }
});

controller.hears('','direct_message, direct_mention, mention', function(bot, message) {  
  console.log('all_message');
  console.log(message);
  // bot.reply(message, "I'm here!")
});

String.prototype.createUserTag = function () {
  return '<@' + this + '>';
};
