angular.module('twitSwitchApp', [])
// account情報の取得
.factory('getAccounts', function() {
    var accounts = Storage.getLocal(Storage.accountsKey);
    return accounts;
})
