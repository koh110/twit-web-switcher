(() => {
  'use strict';

  angular.module('PopupApp', ['TwitSwitchApp'])
  .controller('PopupCtrl', ['$scope', 'AccountService', 'PopupService', function($scope, AccountService, PopupService) {
    $scope.accounts = AccountService.accounts;
    $scope.switchAccount = PopupService.switchAccount;
    $scope.openTwitter = PopupService.openTwitter;
    $scope.logout = PopupService.logout;
    $scope.openOptionPage = PopupService.openOptionPage;
  }])
  .service('PopupService', [function() {
    var Message = window.TwitWebSwitcher.Message;
    this.switchAccount = (accountId) => {
      var message = {
        message: Message.switchTwitterAccount,
        id: accountId
      };
      chrome.runtime.sendMessage(message, () => {
        window.close();
      });
    };

    this.openTwitter = () => {
      var message = {
        message: Message.openTwitter
      };
      chrome.runtime.sendMessage(message, () => {
        window.close();
      });
    };
    this.logout = () => {
      var message = {
        message: Message.logoutTwitter
      };
      chrome.runtime.sendMessage(message, () => {
        window.close();
      });
    };
    this.openOptionPage = () => {
      var message = {
        message: Message.openOptionPage
      };
      chrome.runtime.sendMessage(message, () => {
        window.close();
      });
    };
  }]);
})();
