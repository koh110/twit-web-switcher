angular.module('optionApp', ['twitSwitchApp', 'ui.sortable'])
.controller('optionCtrl', function($scope, accounts, options) {
    $scope.accounts = accounts;

    $scope.textOrPassword = options.textOrPassword;
    $scope.saveAccount = function () {
        var save = [];
        // 現在値の適用
        angular.forEach($scope.accounts, function(value, key) {
            account = {
                id: $scope.model.id[value.id],
                password: $scope.model.password[value.id],
            };
            this.push(account);
        }, save);
        // 保存
        options.saveAccounts(save);
        $scope.accounts = save;
    };
    $scope.clearAccount = function() {
        $scope.accounts = [];
        options.clearAccounts();
        savedAccounts = $scope.accounts;
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
        var i; len = $scope.accounts.length, account = null;
        for (i = 0; i < len; i++) {
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
    }

    // uiソート
    $scope.sortableOptions = {
        axis: 'y',
    };

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

    // アカウント削除
    $scope.removeAccount = function(index) {
        $scope.accounts.splice(index, 1);
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
        Storage.setLocal(Storage.accountsKey, accounts);

        // デスクトップ通知
        var popup = webkitNotifications.createNotification('../icon128.png', 'save', '保存しました')
        popup.show();

        setTimeout(function() {
            popup.cancel()
        }, 1800);

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
        }, 1800);

        this.tabUpdate;
    };

    return {
        'textOrPassword': textOrPassword,
        'saveAccounts': saveAccounts,
        'clearAccounts': clearAccounts,
    };
});
