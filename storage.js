//================================================
// localStorageを扱う
//================================================

// localStorageにJSON型でデータを保存する
// @param key	storageのkey
// @param value	storageに保存されるデータ内容
function setLocalStorage(key,value){
	localStorage[key] = JSON.stringify(value);
}

// localStorageのkeyの要素を削除
// @param key	storageのkey
function deleteLocalStorage(key){
	delete localStorage[key];
}

// localStorageの内容を削除
function clearLocalStorage(){
	localStorage.clear();
}

// localStorageのデータをJSON型で取得する
// @param key	取得するkey
// @return	keyのデータをJSON型にparseしたもの
//			存在しなければnull
function getLocalStorage(key){
	var result = localStorage[key];
	if(result==undefined){
		return null;
	}
	return JSON.parse(result);
}