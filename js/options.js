angular.module('optionApp', ['twitSwitchApp'])
.controller('optionCtrl', function($scope, getAccounts, options) {
    $scope.accounts = getAccounts;

    $scope.textOrPassword = options.textOrPassword;
    $scope.saveAccount = options.saveAccounts;
    $scope.clearAccount = options.clearAccounts;
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
    var saveAccounts = function() {
        var saveData = {};

        // 保存用データ取得
        var accounts = angular.element('.accountData');
        angular.forEach(accounts, function(record, i) {
            var accountObj = angular.element(record);
            var id = accountObj.find('.accountId').val();
            var pass = accountObj.find('.accountPass').val();
            saveData[id] = {'id': id, 'password': pass};
        });

        // 保存
        Storage.setLocal(Storage.accountsKey, saveData);

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
