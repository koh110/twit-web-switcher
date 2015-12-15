'use strict';

angular.module('OptionApp', ['TwitSwitchApp', 'ui.sortable'])
.controller('OptionCtrl', ['$scope', 'OptionService', function($scope, OptionService) {
  const update = () => {
    OptionService.accounts = this.data.accounts;
    OptionService.saveAccounts(this.data.accounts);
  };

  this.data = {
    accounts: OptionService.accounts,
    sortableOptions: {
      xis: 'y',
      update: function(e, ui) {
        if (ui.item.sortable.model === 'can\'t be moved') {
          ui.item.sortable.cancel();
        }
      },
      stop: update
    }
  };

  this.func = {
    updateAccount: OptionService.updateAccount,
    saveAccount: OptionService.saveAccounts,
    clearAccount: OptionService.clearAccounts,
    removeAccount: OptionService.removeAccount
  };
}])
.service('OptionService', ['AccountService', function(AccountService) {
  const Account = window.TwitWebSwitcher.Account;

  const accounts = Account.loadAll();
  if (accounts === null) {
    this.accounts = [];
  } else {
    this.accounts = accounts;
  }
  this.accounts = AccountService.accounts;

  // tab更新
  this.tabUpdate = () => {
    chrome.tabs.getSelected(null, (tab) => {
      chrome.tabs.update(tab.id, {url: 'options.html'});
    });
  };

  // アカウント情報の保存
  this.saveAccounts = () => {
    Account.saveAccounts(this.accounts);
    this.tabUpdate();
  };

  this.removeAccount = (index) => {
    this.accounts.splice(index, 1);
    this.saveAccounts();
  };

  // アカウントのクリア
  this.clearAccounts = () => {
    Account.saveAccounts([]);
    this.tabUpdate();

    // デスクトップ通知
    const notification = new Notification('save', {
      body: '削除しました',
      icon: '../icon128.png'
    });
    notification.onshow = function() {
      setTimeout(notification.close, 1800);
    };
    notification.onclick = function() {
      notification.close();
    };

    this.tabUpdate();
  };
}]);
