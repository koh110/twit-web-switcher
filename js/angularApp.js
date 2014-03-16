angular.module('twitSwitchApp', [])
// account情報の取得
.factory('getAccounts', function() {
    var accounts = Storage.getLocal(Storage.accountsKey);
    accounts = [{id:'hogehoge', password:'hogepass'}, {id:'fugafuga',password:'fugapass'}];
    return accounts;
})
