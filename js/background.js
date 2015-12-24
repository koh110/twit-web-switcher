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

  const Tabs = new class {
    getCurrent() {
      return new Promise((resolve) => {
        chrome.tabs.query({active: true}, (tab) => {
          resolve(tab[0]);
        });
      });
    }
    createTwitter() {
      return new Promise((resolve) => {
        chrome.tabs.create({url: Const.twitterUrl, selected: true}, (tab) => {
          resolve(tab);
        });
      });
    }
    // オプションページの呼び出し
    showOption() {
      chrome.tabs.query({active: true}, () => {
        chrome.tabs.create({url: 'options.html', selected: true});
      });
    }
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
      const set = () => {
        const token = Account.load(request.id).token;
        Cookie.setToken(token).then(() => {
          chrome.tabs.getSelected(null, (tab) => {
            chrome.tabs.reload(tab.id);
          });
        });
      };
      Tabs.getCurrent().then((tab) => {
        if (tab.url.indexOf(Const.twitterHost) !== -1) {
          set();
        } else {
          Tabs.createTwitter().then(() => {
            set();
          });
        }
      });
    } else if (request.message === Message.openTwitter) {
      Tabs.createTwitter();
    } else if (request.message === Message.openOptionPage) {
      Tabs.showOption();
    }
  });
})();
