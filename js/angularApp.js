(function() {
  'use strict';

  var Storage = window.TwitWebSwitcher.Storage;

  angular.module('TwitSwitchApp', [])
  // account情報の取得
  .factory('AccountService', function() {
    var accounts = Storage.getLocal(Storage.accountsKey);
    if (accounts === null) {
      accounts = [];
    }
    return {
      accounts: accounts
    };
  });
})();
