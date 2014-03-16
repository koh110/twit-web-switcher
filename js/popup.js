angular.module('popupApp', ['twitSwitchApp'])
.controller('popupCtrl', function($scope, getAccounts) {
    // backgroundページの取得
    var background = chrome.extension.getBackgroundPage();

    $scope.accounts = getAccounts;
    $scope.login = function(accountId) {
        var message = {message: G_twitterLoginMessage, id: accountId};
        background.backgroundAction(message);
    };
    $scope.openTwitter = function() {
        var message = {message: G_twitterOpenMessage};
        background.backgroundAction(message);
    };
    $scope.logout = function() {
        var message = {message: G_twitterLogoutMessage};
        background.backgroundAction(message);
    };
    $scope.openOptionPage = function() {
        background.showOption();
    };
});
