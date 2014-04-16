angular.module('optionApp', ['twitSwitchApp'])
.controller('optionCtrl', function($scope, accounts, options) {
    $scope.accounts = accounts;

    $scope.textOrPassword = options.textOrPassword;
    $scope.saveAccount = function () {
        options.saveAccount($scope.accounts);
    };
    $scope.clearAccount = options.clearAccounts;

    $scope.addAccountId = "";
    $scope.addAccountPassword = "";
    $scope.addAccount = function() {
        var account = {
            'id': $scope.addAccountId,
            'password': $scope.addAccountPassword
        };
        $scope.accounts.push(account);
    };
})
.factory('options', function() {
    // tab更新
    var tabUpdate = function() {
        chrome.tabs.getSelected(null,function(tab){
            chrome.tabs.update(tab.id, {url:"options.html"});
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
        Storage.getLocal(Storage.accountsKey, accounts);

        // デスクトップ通知
        webkitNotifications
          .createNotification('../icon128.png', 'save', '保存しました')
          .show();

        this.tabUpdate;
    };

    // アカウントのクリア
    var clearAccounts = function() {
        Storage.clearLocal();
        // デスクトップ通知
        webkitNotifications
          .createNotification('../icon128.png', 'clear', '削除しました')
          .show();
        this.tabUpdate;
    };

    return {
        'textOrPassword': textOrPassword,
        'saveAccounts': saveAccounts,
        'clearAccounts': clearAccounts,
    };
});
