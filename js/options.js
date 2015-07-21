(function() {
  'use strict';

  angular.module('OptionApp', ['TwitSwitchApp', 'ui.sortable'])
  .controller('OptionCtrl', ['$scope', 'OptionService', function($scope, OptionService) {
    $scope.accounts = OptionService.accounts;

    // uiソート
    $scope.sortableOptions = {
      xis: 'y',
      update: function(e, ui) {
        OptionService.accounts = $scope.accounts;
      },
    };

    $scope.textOrPassword = OptionService.textOrPassword;
    $scope.updateAccount = OptionService.updateAccount;
    $scope.isChange = OptionService.isUpdatedAccount;
    $scope.saveAccount = OptionService.saveAccounts;
    $scope.clearAccount = OptionService.clearAccounts;

    // 追加アカウント用
    $scope.add = {
      id: '',
      password: ''
    };

    // アカウント追加
    $scope.addAccount = function() {
      OptionService.addAccount($scope.add.id, $scope.add.password);
      $scope.accounts = OptionService.accounts;
      $scope.add.id = '';
      $scope.add.password = '';
    };

    // アカウント削除
    $scope.removeAccount = OptionService.removeAccount;
  }])
  .factory('OptionService', ['AccountService', function(AccountService) {
    var Storage = window.TwitWebSwitcher.Storage;

    var accounts = AccountService.accounts.map(function(elem, index, array) {
      elem.update = {
        id: false,
        password: false
      };
      return elem;
    });

    // アカウントが更新されたら更新フラグを建てる
    // param 'id' or 'password'
    var updateAccount = function(param, account) {
      account.update[param] = true;
    };
    // アカウントの情報が保存時と変化しているかチェック
    var isUpdatedAccount = function(account) {
      return account.update;
    };
    // アカウントの追加
    var addAccount = function(id, password) {
      // 重複チェック
      var duplicate = accounts.filter(function(elem, index, array) {
        if (elem.id === id) {
          return elem;
        }
      });
      if (duplicate.length > 0) {
        alert("アカウント名が重複しています");
        return;
      }
      // アカウント追加
      accounts.push({
        id: id,
        password: password,
        update: {
          id: true,
          password: true
        }
      });
    };
    var removeAccount = function(index) {
      accounts.splice(index, 1);
    };

    // tab更新
    var tabUpdate = function() {
      chrome.tabs.getSelected(null,function(tab){
        chrome.tabs.update(tab.id, {url: 'options.html'});
      });
    };

    // パスワードを表示するフラグ
    var passwordIsVisible = false;
    // inputタグのタイプをtextかpasswordか選択する関数
    var textOrPassword = function() {
      return this.passwordIsVisible ? 'text' : 'password';
    };

    // アカウント情報の保存
    var saveAccounts = function() {
      Storage.setLocal(Storage.accountsKey, accounts);

      // デスクトップ通知
      var notification = new Notification('save', {
        body: '保存しました',
        icon: '../icon128.png'
      });
      notification.onshow = function () {
        setTimeout(notification.close, 1800);
      };
      notification.onclick = function() {
        notification.close();
      };

      tabUpdate();
    };

    // アカウントのクリア
    var clearAccounts = function() {
      Storage.setLocal(Storage.accountsKey, []);

      // デスクトップ通知
      var notification = new Notification('save', {
        body: '削除しました',
        icon: '../icon128.png'
      });
      notification.onshow = function () {
        setTimeout(notification.close, 1800);
      };
      notification.onclick = function() {
        notification.close();
      };

      tabUpdate();
    };

    return {
      accounts: accounts,
      updateAccount: updateAccount,
      addAccount: addAccount,
      removeAccount: removeAccount,
      isUpdatedAccount: isUpdatedAccount,
      textOrPassword: textOrPassword,
      saveAccounts: saveAccounts,
      clearAccounts: clearAccounts,
    };
  }]);
})();
