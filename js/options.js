(function() {
  'use strict';

  angular.module('OptionApp', ['TwitSwitchApp', 'ui.sortable'])
  .controller('OptionCtrl', function($scope, AccountService, OptionService) {
    $scope.accounts = AccountService.accounts;

    $scope.textOrPassword = OptionService.textOrPassword;
    $scope.saveAccount = function () {
      var save = [];
      // 現在値の適用
      angular.forEach($scope.accounts, function(value, key) {
        var account = {
          id: $scope.model.id[value.id],
          password: $scope.model.password[value.id],
        };
        this.push(account);
      }, save);
      // 保存
      OptionService.saveAccounts(save);
      $scope.accounts = save;
    };
    $scope.clearAccount = function() {
      $scope.accounts = [];
      OptionService.clearAccounts();
    };

    // 追加アカウント用
    $scope.addAccountId = "";
    $scope.addAccountPassword = "";

    // アカウントごとの現在値格納用
    $scope.model = {
      id: {},
      password: {},
    };

    // アカウントの情報が保存時と変化しているかチェック
    $scope.isChange = function(accountId) {
      var i = 0, len = $scope.accounts.length, account = null;
      for (; i < len; i++) {
        if ($scope.accounts[i].id === accountId) {
          account = $scope.accounts[i];
          break;
        }
      }

      var change = {id: false, password: false};
      if (account !== null) {
        var currentId = $scope.model.id[accountId];
        var currentPassword = $scope.model.password[accountId];
        if (currentId !== account.id) {
          change.id = true;
        }
        if (currentPassword !== account.password) {
          change.password = true;
        }
      }

      return change;
    };

    // uiソート
    $scope.sortableOptions = {
      xis: 'y',
    };

    // アカウント追加
    $scope.addAccount = function() {
      var id = $scope.addAccountId;
      // 重複チェック
      var i = 0, len = $scope.accounts.length, isDuplicate = false;
      for (; i < len; i++) {
        if ($scope.accounts[i].id === id) {
          isDuplicate = true;
          break;
        }
      }

      if (isDuplicate) {
        alert("アカウント名が重複しています");
      } else {
        // アカウント追加
        var account = {
          'id': $scope.addAccountId,
          'password': $scope.addAccountPassword,
        };
        $scope.accounts.push(account);

        $scope.addAccountId = "";
        $scope.addAccountPassword = "";
      }
    };

    // アカウント削除
    $scope.removeAccount = function(index) {
      $scope.accounts.splice(index, 1);
    };
  })
  .factory('OptionService', function() {
    var Storage = window.TwitWebSwitcher.Storage;

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
    var saveAccounts = function(accounts) {
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
      textOrPassword: textOrPassword,
      saveAccounts: saveAccounts,
      clearAccounts: clearAccounts,
    };
  });
})();
