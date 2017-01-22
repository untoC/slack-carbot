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

  if (contains(text, 'left')) {
    postSlackMessage(channel, 'Bye Bye ~ ' + getTagString(user));
  } else if (contains(text, 'joined')) {
    postSlackMessage(channel, text.extractUserTag() + '님, 웰컴~ 아무 사람이나 이미지 클릭해보면 자기소개(?) 비스무리한게 적혀있는데 자기 프로필 what do i에 작성해주면 감사 ㅋㅋ');
  } else if (contains(text, 'hello jarvis')) {
    postSlackMessage(channel, 'hello! ' + text.extractUserTag());
  }
});

String.prototype.extractUserTag = function () {
  var pattern = /<@[\w]*>/gi;
  var matched = this.match(pattern);
  var str = '';

  for (var i = 0, li = matched.length; i < li; i++) {
    str += matched[i];

    if (i + 1 < li) {
      str += ', ';
    }
  }

  return str;
};

function postSlackMessage(channel, msg) {
  web.chat.postMessage(channel, msg, {username: "jarvis"});
}

function contains(ori, compare) {
  return ori.toLowerCase().indexOf(compare) > -1;
}
