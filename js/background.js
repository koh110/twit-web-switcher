(function() {
  'use strict';
  var Message = window.TwitWebSwitcher.Message;
  var Const = window.TwitWebSwitcher.Const;
  var Storage = window.TwitWebSwitcher.Storage;

  var Tab = {
    info: null,
    loading: false
  };

  // localStorageからアカウントデータを読み出す
  var getAccount = function(id) {
    var accounts = Storage.getLocal(Storage.accountsKey);
    var account = accounts.filter(function(item) {
      if (item.id === id) {
        return true;
      }
    });
    return account[0];
  };

  // twitterを新しいタブに開く
  var createTwitterTab = function() {
    return new Promise(function(resolve) {
      chrome.tabs.create({url: Const.twitterUrl, selected: true}, function(tab) {
        resolve(tab);
      });
    });
  };

  var loginCheck = function(tabId) {
    var message = {
      message: Message.loginCheckTwitter
    };
    return new Promise(function(resolve) {
      chrome.tabs.sendMessage(tabId, message, function(response) {
        resolve(response);
      });
    });
  };

  var logout = function() {
    var message = {
      message: Message.logoutTwitter
    };
    return new Promise(function(resolve) {
      chrome.tabs.sendMessage(Tab.info.id, message, function(response) {
        resolve(response);
      });
    });
  };

  var login = function(tabId, accountId) {
    var account = getAccount(accountId);

    var message = {
      message: Message.loginTwitter,
      account: account
    };
    return new Promise(function(resolve) {
      loginCheck(tabId).then(function(response) {
        if (response.login === true) {
          logout().then(function() {
            chrome.tabs.sendMessage(tabId, message, function(data) {
              resolve(data);
            });
          });
        } else {
          chrome.tabs.sendMessage(tabId, message, function(data) {
            resolve(data);
          });
        }
      });
    });
  };

  // オプションページの呼び出し
  var showOption = function() {
    chrome.tabs.query({active: true}, function() {
      chrome.tabs.create({url: 'options.html', selected: true});
    });
  };

  var timeout = function(func) {
    if (Tab.loading) {
      setTimeout(timeout, 1000);
    } else {
      return func();
    }
  };

  // ページ更新イベント
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (Tab.info && Tab.info.id === tabId) {
      if (tab.status === 'complete') {
        Tab.loading = false;
      } else {
        Tab.loading = true;
      }
    }
  });

  // messageの受け取りイベントリスナー
  chrome.runtime.onMessage.addListener(function(request) {
    switch(request.message) {
      // login
      case Message.loginTwitter:
        chrome.tabs.query({active: true}, function(tab) {
          // 動作させるタブを設定
          // 現在みているタブがtwitterのページでなければtwitterを開く
          var reg = new RegExp('.*' + Const.twitterHost + '.*');
          if (tab[0].url.search(reg)) {
            createTwitterTab().then(function(newTab) {
              Tab.info = newTab;
              timeout();
              login(newTab, request.id);
            });
          } else {
            Tab.info = tab[0];
            login(tab[0].id, request.id);
          }
        });
      break;
      // logout
      case Message.logoutTwitter:
        chrome.tabs.query({active: true}, function(tab) {
          logout(tab[0].id);
        });
      break;
      // open twitter
      case Message.openTwitter:
        createTwitterTab();
      break;
      // open option page
      case Message.openOptionPage:
        showOption();
      break;
    }
  });
})();
