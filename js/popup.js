angular.module('popupApp', ['twitSwitchApp'])
.controller('popupCtrl', function($scope, getAccounts) {
    $scope.accounts = getAccounts;
    $scope.login = function(accountId) {
        var message = {
            message: Message.loginTwitter,
            id: accountId
        };
        chrome.runtime.sendMessage(message, function(response) {
        });
    };
    $scope.openTwitter = function() {
        var message = {
            message: Message.openTwitter
        };
        chrome.runtime.sendMessage(message, function(response) {
        });
    };
    $scope.logout = function() {
        var message = {
            message: Message.logoutTwitter
        };
        chrome.runtime.sendMessage(message, function(response) {
        });
    };
    $scope.openOptionPage = function() {
        var message = {
            message: Message.openOptionPage
        };
        chrome.runtime.sendMessage(message, function(response) {
        });
    };
});
