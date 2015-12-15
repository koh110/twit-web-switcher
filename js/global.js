'use strict';

const Storage = new class {
  constructor() {
    //localStorage.removeItem('accounts');
    this.accountsKey = 'twitter_accounts';
  }
  setLocal(key, value) {
    localStorage[key] = JSON.stringify(value);
  }
  getLocal(key) {
    var result = localStorage[key];
    if (result === undefined) {
      return null;
    }
    return JSON.parse(result);
  }
}();

const Account = new class {
  constructor() {
    this.current = null;
  }

  save(user) {
    let accounts = Storage.getLocal(Storage.accountsKey);
    if (!accounts) {
      accounts = [];
    }
    let current = null;
    accounts = accounts.map((item) => {
      if (item.id === user.id) {
        item.name = user.name;
        item.token = user.token;
        current = item;
      }
      return item;
    });
    if (!current) {
      current = {
        id: user.id,
        name: user.name,
        token: user.token
      };
      accounts.push(current);
    }
    this.current = current;
    this.saveAccounts(accounts);
  }
  saveAccounts(accounts) {
    const save = [];
    accounts.forEach((account) => {
      save.push({
        id: account.id,
        name: account.name,
        token: account.token
      });
    });
    Storage.setLocal(Storage.accountsKey, accounts);
  }
  load(id) {
    let accounts = this.loadAll();
    const account = accounts.filter((item) => {
      if (item.id === id) {
        return true;
      }
    });
    return account[0] ? account[0] : null;
  }
  loadAll() {
    const accounts = Storage.getLocal(Storage.accountsKey);
    if (!accounts) {
      return null;
    }
    return accounts;
  }
}();

//================================================
// 全体で使う変数などを設定する
//================================================
const Const = {
  // twitterのurl
  twitterUrl: 'https://twitter.com',
  twitterLoginUrl: 'https://twitter.com/login',
  twitterHost: 'twitter.com'
};

//------------------------------------------------
// Message
//------------------------------------------------
const Message = {
  switchTwitterAccount: 'twitterAccountSwitchMessage',

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
window.TwitWebSwitcher.Account = Account;
window.TwitWebSwitcher.Storage = Storage;
