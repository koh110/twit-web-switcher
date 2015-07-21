(function() {
  'use strict';

  angular.module('PopupApp', ['TwitSwitchApp'])
  .controller('PopupCtrl', ['$scope', 'AccountService', 'PopupService', function($scope, AccountService, PopupService) {
    $scope.accounts = AccountService.accounts;
    $scope.login = PopupService.login;
    $scope.openTwitter = PopupService.openTwitter;
    $scope.logout = PopupService.logout;
    $scope.openOptionPage = PopupService.openOptionPage;
  }])
  .factory('PopupService', [function() {
    var Message = window.TwitWebSwitcher.Message;

    var login = function(accountId) {
      var message = {
        message: Message.loginTwitter,
        id: accountId
      };
      chrome.runtime.sendMessage(message, function(response) {});
    };
    var openTwitter = function() {
      var message = {
        message: Message.openTwitter
      };
      chrome.runtime.sendMessage(message, function(response) {});
    };
    var logout = function() {
      var message = {
        message: Message.logoutTwitter
      };
      chrome.runtime.sendMessage(message, function(response) {});
    };
    var openOptionPage = function() {
      var message = {
        message: Message.openOptionPage
      };
      chrome.runtime.sendMessage(message, function(response) {});
    };
    return {
      login: login,
      openTwitter: openTwitter,
      logout: logout,
      openOptionPage: openOptionPage,
    };
  }]);
})();
