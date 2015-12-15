'use strict';

(() => {
  var Message = window.TwitWebSwitcher.Message;
  var Const = window.TwitWebSwitcher.Const;
  const Account = window.TwitWebSwitcher.Account;

  const Cookie = new class {
    constructor() {
      this.tokenKey = 'auth_token';
    }
    getToken() {
      return new Promise((resolve) => {
        chrome.cookies.get({
          url: 'https://twitter.com',
          name: this.tokenKey
        }, (cookie) => {
          resolve(cookie.value);
        });
      });
    }
    setToken(token) {
      return new Promise((resolve) => {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 10);
        // Set token cookie
        chrome.cookies.set({
          url: 'https://twitter.com',
          name: this.tokenKey,
          value: token,
          domain: '.twitter.com',
          path: '/',
          secure: true,
          httpOnly: true,
          expirationDate: expires / 1000
        }, (cookie) => {
          resolve(cookie);
        });

        chrome.cookies.remove({
          url: 'https://twitter.com',
          name: 'twid'
        });
      });
    }
  }();

  var Tab = {
    info: null,
    loading: false
  };

  // ページ更新イベント
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (Tab.info && Tab.info.id === tabId) {
      if (tab.status === 'complete') {
        Tab.loading = false;
      } else {
        Tab.loading = true;
      }
    }
  });

  // twitterを新しいタブに開く
  var createTwitterTab = () => {
    return new Promise((resolve) => {
      chrome.tabs.create({url: Const.twitterUrl, selected: true}, (tab) => {
        resolve(tab);
      });
    });
  };

  var logout = () => {
    var message = {
      message: Message.logoutTwitter
    };
    var sendLogoutMessage = (resolve) => {
      chrome.tabs.sendMessage(Tab.info.id, message, (response) => {
        resolve(response);
      });
    };
    return new Promise((resolve) => {
      sendLogoutMessage(resolve);
    });
  };

  // オプションページの呼び出し
  var showOption = () => {
    chrome.tabs.query({active: true}, () => {
      chrome.tabs.create({url: 'options.html', selected: true});
    });
  };

  // messageの受け取りイベントリスナー
  chrome.runtime.onMessage.addListener((request, sender) => {
    if (sender.id !== window.location.host) {
      return;
    }
    if (request.message === Message.loginCheckTwitter) {
      Cookie.getToken().then((token) => {
        Account.save({
          id: request.userId,
          name: request.name,
          token: token
        });
      });
    } else if (request.message === Message.switchTwitterAccount) {
      const token = Account.load(request.id).token;
      Cookie.setToken(token).then(() => {
        chrome.tabs.getSelected(null, (tab) => {
          chrome.tabs.reload(tab.id);
        });
      });
    } else if (request.message === Message.logoutTwitter) {
      chrome.tabs.query({active: true}, (tab) => {
        logout(tab[0].id);
      });
    } else if (request.message === Message.openTwitter) {
      createTwitterTab();
    } else if (request.message === Message.openOptionPage) {
      showOption();
    }
  });
})();
