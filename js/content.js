(function() {
  'use strict';

  var Const = window.TwitWebSwitcher.Const;
  var Message = window.TwitWebSwitcher.Message;

  var TwitterCtrl = {
    // twitterのログアウト処理
    logout: function() {
      //location.href = Const.twitterLogoutUrl;
      $('#signout-button').click();
      //$('form buttons .primary-btn').click();
    },
    // twitterのログイン処理
    // @param id twitterのid
    // @param pass twitterのpass
    login: function(id, password) {
      var form = null;
      $('form').each(function() {
        var thisElem = $(this);
        if (thisElem.attr('action') === 'https://twitter.com/sessions') {
          form = thisElem;
        }
      });
      if (form) {
        form.find('#signin-email').val(id);
        form.find('#signin-password').val(password);
        form.submit();
      }
    },
    // ログイン状態の確認
    // @return ログアウト状態の時true
    isLogin: function() {
      if ($('#signout-button').size() === 0) {
        return false;
      }
      return true;
    }
  };

  chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      switch(msg.message) {
        case Message.logoutTwitter:
          TwitterCtrl.logout();
        break;
        case Message.loginTwitter:
          TwitterCtrl.login(msg.account.id, msg.account.password);
        break;
        case Message.loginCheckTwitter:
          port.postMessage({message: msg.message, login: TwitterCtrl.isLogin()});
        break;
      }
    });
  });

  // メッセージの受け取り処理
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // messageの内容によって処理
    switch(request.message) {
      case Message.logoutTwitter:
        TwitterCtrl.logout();
        sendResponse({message: request.message});
      break;
      case Message.loginTwitter:
        TwitterCtrl.login(request.account.id, request.account.password);
        sendResponse({message: request.message});
      break;
      case Message.loginCheckTwitter:
        sendResponse({message: request.message, login: TwitterCtrl.isLogin()});
      break;
    }
  });
})();
