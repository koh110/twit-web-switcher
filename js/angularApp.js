(function() {
  'use strict';

  angular.module('TwitSwitchApp', [])
  // account情報の取得
  .service('AccountService', function() {
    const Account = window.TwitWebSwitcher.Account;
    this.accounts = [];
    const accounts = Account.loadAll();
    if (accounts) {
      this.accounts = accounts;
    }
  });
})();
