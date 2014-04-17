angular.module('optionApp', ['twitSwitchApp'])
.controller('optionCtrl', function($scope, accounts, options) {
    var baseAccounts = accounts;
    $scope.accounts = accounts;

    $scope.textOrPassword = options.textOrPassword;
    $scope.saveAccount = function () {
        options.saveAccounts($scope.accounts);
    };
    $scope.clearAccount = function() {
        $scope.accounts = [];
        options.clearAccounts();
    };

    $scope.addAccountId = "";
    $scope.addAccountPassword = "";

    // アカウント追加
    $scope.addAccount = function() {
        var id = $scope.addAccountId;
        // 重複チェック
        var i = 0,len = $scope.accounts.length, isDuplicate = false;
        for (i = 0; i < len; i++) {
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
                'password': $scope.addAccountPassword
            };
            $scope.accounts.push(account);

            $scope.addAccountId = "";
            $scope.addAccountPassword = "";
        }
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
        data = [];
        angular.forEach(accounts, function(value, key) {
            data.push({'id':value.id, 'password': value.password});
        });
        Storage.setLocal(Storage.accountsKey, data);

        // デスクトップ通知
        var popup = webkitNotifications.createNotification('../icon128.png', 'save', '保存しました')
        popup.show();

        setTimeout(function() {
            popup.cancel()
        }, 2000);

        this.tabUpdate;
    };

    // アカウントのクリア
    var clearAccounts = function() {
        Storage.setLocal(Storage.accountsKey, []);

        // デスクトップ通知
        var popup = webkitNotifications.createNotification('../icon128.png', 'clear', '削除しました')
        popup.show();

        setTimeout(function() {
            popup.cancel()
        }, 2000);

        this.tabUpdate;
    };

    return {
        'textOrPassword': textOrPassword,
        'saveAccounts': saveAccounts,
        'clearAccounts': clearAccounts,
    };
});
