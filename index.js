var RtmClient = require('slack-client').RtmClient
  , WebClient = require('slack-client').WebClient
  , config = require('./config')
  , token = config.slack_token;

var web = new WebClient(token);
var rtm = new RtmClient(token, {logLevel: 'error'});
rtm.start();

var RTM_EVENTS = require('slack-client').RTM_EVENTS;
rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  var channel = message.channel
    , user = message.user
    , text = message.text;

  if (message.bot_id) return;

  console.log(message);

  if (contains(text, 'left')) {
    postSlackMessage(channel, 'Bye Bye ~ ' + user.createUserTag());
  } else if (contains(text, 'joined')) {
    postSlackMessage(channel, user.createUserTag() + ' 님, 웰컴~ 아무 사람이나 이미지 클릭해보면 자기소개(?) 비스무리한게 적혀있는데 자기 프로필 what do i에 작성해주면 감사 ㅋㅋ');
  } else if (contains(text, 'hello jarvis')) {
    postSlackMessage(channel, 'hello! ' + user.createUserTag());
  } else if (contains(text, "할까말까")) {
    var result = Math.floor(Math.random() * 10) % 2;
    if (result == 0) {
      postSlackMessage(channel, '해라 ' + user.createUserTag());
    } else {
      postSlackMessage(channel, '치아라 ' + user.createUserTag());
    }
  }
});

String.prototype.createUserTag = function () {
  return '<@' + this + '>';
};

function postSlackMessage(channel, msg) {
  web.chat.postMessage(channel, msg, {username: "jarvis"});
}

function contains(ori, compare) {
  return ori.toLowerCase().indexOf(compare) > -1;
}
