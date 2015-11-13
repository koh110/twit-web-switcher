(function() {
  'use strict';

  //================================================
  // 全体で使う変数などを設定する
  //================================================
  var Const = {
    // twitterのurl
    twitterUrl: 'https://twitter.com',
    twitterLoginUrl: 'https://twitter.com/login',
    twitterHost: 'twitter.com'
  };

  //------------------------------------------------
  // Message
  //------------------------------------------------
  var Message = {
    // twitterpageを開く
    openTwitter: 'twitterOpenMessage',

    // login用message
    loginTwitter: 'twitterLoginMessage',

    // logout用message
    logoutTwitter: 'twitterLogoutMessage',
    // logout終了
    finishLogoutTwitter: 'twitterLogoutFinishMessage',

    // loginチェック用message
    loginCheckTwitter: 'twitterLoginCheckMessage',

    // twitterのログインページに遷移したmessage
    moveLoginPageTwitter: 'moveLoginPageTwitterMessage',

    // optionページを開く
    openOptionPage: 'openOptionPageMessage'
  };

  if (!window.TwitWebSwitcher) {
    window.TwitWebSwitcher = {};
  }
  window.TwitWebSwitcher.Const = Const;
  window.TwitWebSwitcher.Message = Message;
})();
