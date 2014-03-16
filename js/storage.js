//================================================
// Storageを扱うクラス
//================================================
var Storage = (function() {
    // private
});

// Storageで利用されるキー
// accountのオブジェクト配列
Storage.accountsKey = 'accounts';

// localStorageにJSON型でデータを保存する
// @param key storageのkey
// @param value storageに保存されるデータ内容
Storage.setLocal =  function(key,value) {
    localStorage[key] = JSON.stringify(value);
};

// localStorageのkeyの要素を削除
// @param key storageのkey
Storage.deleteLocal = function(key) {
    delete localStorage[key];
};

// localStorageの内容を削除
Storage.clearLocal = function() {
    localStorage.clear();
};

// localStorageのデータをJSON型で取得する
// @param key 取得するkey
// @return keyのデータをJSON型にparseしたもの
//   存在しなければnull
Storage.getLocal = function(key) {
    var result = localStorage[key];
    if (result === undefined) {
      return null;
    }
    return JSON.parse(result);
};
