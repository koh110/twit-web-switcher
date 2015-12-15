'use strict';

var Message = window.TwitWebSwitcher.Message;

var TwitterCtrl = {
  // twitterのログアウト処理
  logout: function() {
    //location.href = Const.twitterLogoutUrl;
    $('#signout-button').click();
    //$('form buttons .primary-btn').click();
  }
};

var account = document.querySelector('.global-nav .pull-right .nav .dropdown .account-group');
chrome.extension.sendMessage({
  message: Message.loginCheckTwitter,
  userId: account.getAttribute('data-user-id'),
  name: account.getAttribute('data-screen-name')
}, () => {});

// メッセージの受け取り処理
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // messageの内容によって処理
  switch(request.message) {
    case Message.logoutTwitter:
      TwitterCtrl.logout();
      sendResponse({message: request.message});
    break;
  }
});
