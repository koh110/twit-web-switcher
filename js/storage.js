(function() {
  'use strict';

  //================================================
  // Storageを扱うクラス
  //================================================
  var Storage = {
    // Storageで利用されるキー
    // accountのオブジェクト配列
    accountsKey: 'accounts',

    // localStorageにJSON型でデータを保存する
    // @param key storageのkey
    // @param value storageに保存されるデータ内容
    setLocal: function(key,value) {
      localStorage[key] = JSON.stringify(value);
    },

    // localStorageのkeyの要素を削除
    // @param key storageのkey
    deleteLocal: function(key) {
      delete localStorage[key];
    },

    // localStorageの内容を削除
    clearLocal: function() {
      localStorage.clear();
    },

    // localStorageのデータをJSON型で取得する
    // @param key 取得するkey
    // @return keyのデータをJSON型にparseしたもの
    //   存在しなければnull
    getLocal: function(key) {
      var result = localStorage[key];
      if (result === undefined) {
        return null;
      }
      return JSON.parse(result);
    },
  };

  if (!window.TwitWebSwitcher) {
    window.TwitWebSwitcher = {};
  }
  window.TwitWebSwitcher.Storage = Storage;
})();
