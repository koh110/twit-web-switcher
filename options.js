// ファイル読み込み終了時の処理
$(document).ready(function(){
	// ボタンにイベントを追加
	$("#saveBtn").click(function(){
		storageSave();
		chrome.tabs.getSelected(null,function(tab){
			// tabを更新する
			chrome.tabs.update(tab.id,{url:"options.html"});
		});
	});
	$("#clearBtn").click(function(){
		storageClear();
		chrome.tabs.getSelected(null,function(tab){
			// tabを更新する
			chrome.tabs.update(tab.id,{url:"options.html"});
		});
	});

	// アカウント情報をセットエリアを表示する
	showAccountSetArea();

	// localStorageのdataをtextboxに配置
	restore();
});

// 登録可能アカウント数
const g_accountNum = 5;

// 保存処理
function storageSave(){
	// アカウントのidを保持する配列
	var accountArray = new Array();
	// 前回のアカウント情報を取得
	var eveAccountArray = getLocalStorage(G_accountKey);
	// アカウント情報の保存
	for(var i=0;i<g_accountNum;i++){
		// idとpassを取得
		var accountId = $("#ID"+i).attr("value");
		var accountPass = $("#PASS"+i).attr("value");
		if(accountId == ""){
			continue;
		}
		// アカウントidを配列に追加
		accountArray.push(accountId);			
		// json形式に変換
		var account = {
			id:accountId,
			pass:accountPass
		};
		// localStorageに保存
		setLocalStorage(accountId,account);
	}
	// localStorageにアカウント一覧情報を追加
	setLocalStorage(G_accountKey,accountArray);

	if(eveAccountArray!=null){
		// 前回からの差分のアカウントをstorageから削除
		var diffAccountArray= arrayDiff(eveAccountArray,accountArray);
		for(i=0;i<diffAccountArray.length;i++){
			deleteLocalStorage(diffAccountArray[i]);
		}
	}
}

// アカウント情報をクリア
function storageClear(){
	clearLocalStorage();
}

// 配列の差分
// @return (array_0 - array_1)の差分配列
function arrayDiff(array_0,array_1){
	var result,tmp_f;
	result = new Array();
	for(var i=0;i<array_0.length;i++){
		tmp_f = true;
		for (var ii = 0; ii < array_1.length; ii++) {
			if (array_0[i] === array_1[ii]) {
				tmp_f = false;
				break;
			}
		}
		if (tmp_f) {
			result.push(array_0[i]);
		}
	}
	return result;
}

// アカウント情報をセットするエリア
function showAccountSetArea(){
	// accountAreaにaccount数個のdivタグを生成
	for(var i=0;i<g_accountNum;i++){
		var divTag = document.createElement("div");
		divTag.id = "account"+i;
		divTag.setAttribute("class", "accountColumn");
		$('div#accountArea').append(divTag);
	}

	// アカウント情報要素の配列
	var objectArray = new Array(g_accountNum);

	for(i=0;i<g_accountNum;i++){
		// 連想配列用オブジェクト
		var object = new Object();

		// id用のinput area
		var objectId = document.createElement("input");
		objectId.id = "ID"+i;
		object.id = objectId;	// 連想配列に追加

		// pass用のinput area
		var objectPass = document.createElement("input");
		objectPass.id = "PASS"+i;
		objectPass.type = "password";
		object.pass = objectPass;	// 連想配列に追加

		// 要素配列に追加
		objectArray[i] = object;
	}

	// css情報の取得
	var accountAreaData = $("#accountArea");
	console.log(accountAreaData.css( "border-left-color" ));
	// エリアにアカウント情報内容を追加
	for(i=0;i<g_accountNum;i++){
		// objectを末尾に追加
		$("#account"+i)
				.append("<strong>"+(i+1)+".</storong> \t")
				.append("\tid:").append(objectArray[i].id)
				.append("\tpass:").append(objectArray[i].pass);
	}
}

// ローカルストレージに保存された内容の読み出し
function restore(){
	// localStorageからアカウント情報をJSON形式で取得する
	var accountArray=getLocalStorage(G_accountKey);
	// localStorageにアカウントデータがある時
	if(accountArray!=null){
		for(var i=0;i<accountArray.length;++i){
			var account = accountArray[i];
			//console.log(account);
			var accountValue = getLocalStorage(account);
			$("#ID"+i).val(accountValue.id);
			$("#PASS"+i).val(accountValue.pass);
		}
	}
}