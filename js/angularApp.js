angular.module('twitSwitchApp', [])
// account情報の取得
.factory('accounts', function() {
    var accounts = Storage.getLocal(Storage.accountsKey);
    if (accounts === null) {
        accounts = [];
    }
    return accounts;
})
