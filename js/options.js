angular.module('optionApp', ['twitSwitchApp', 'ui.sortable'])
.controller('optionCtrl', function($scope, accounts, options) {
    var savedAccounts = accounts;
    $scope.accounts = accounts;

    $scope.textOrPassword = options.textOrPassword;
    $scope.saveAccount = function () {
        options.saveAccounts($scope.accounts);
        savedAccounts = $scope.accounts;
    };
    $scope.clearAccount = function() {
        $scope.accounts = [];
        options.clearAccounts();
        savedAccounts = $scope.accounts;
    };

    // 追加アカウント用
    $scope.addAccountId = "";
    $scope.addAccountPassword = "";

    // アカウントごとのモデル格納用
    $scope.model = {
        id: {},
        password: {},
    };

    // アカウントの情報が保存時と変化しているかチェック
    $scope.isChange = function(accountId) {
        var i; len = savedAccounts.length, account = null;
        for (i = 0; i < len; i++) {
            if (savedAccounts[i].id === accountId) {
                account = savedAccounts[i];
                break;
            }
        }

        var change = {id: false, password: false};
        if (account !== null) {
            if ($scope.model.id[accountId] !== account.id) {
                change.id = true;
            }
            if ($scope.model.password[accountId] !== account.password) {
                change.password = true;
            }
        }

        return change;
    }

    // uiソート
    $scope.sortableOptions = {
        axis: 'y',
        start: function(e, ui) {
        },
        update: function(e, ui) {
        },
        stop: function(e, ui) {
        },
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
