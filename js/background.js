// ファイル読み込み終了時の処理
$(document).ready(function(){
	// global.jsの読み込み
	var script_node = document.createElement('script');
	script_node.src = "./global.js";
	$("head").append(script_node);
	// storage用ファイルの読み込み
	script_node.src = "./storage.js";
	$("head").append(script_node);
});

// tab生成後に行われるべきアクション
var g_act = {action:null};

// アカウント情報を読み出す
// @return 読み出したアカウントの配列
function getAccountArray(){
	return getLocalStorage(G_accountKey);
}

// popup.htmlから呼ばれbackgroundで行われる処理
// @param action	行う処理のmessage
function backgroundAction(action){
	console.log("start:");
	console.log(action);
	chrome.tabs.getSelected(null,function(tab){
		if(tab.url.indexOf(G_twitterURL)==-1){	// 現在のタブがtwitterでなければ
			// タブを開く
			createTwitterTab();
			// タブをloadし終わったらリスナーに処理してもらう
			g_act=action;
		}else{	// 現在のタブでtwitterを開いている場合
			//twitterAction(action);	// twitter上で処理を行う
			g_act=action;
			// tabを更新する
			chrome.tabs.update(tab.id,{url:G_twitterURL});
		}
	});
}

// twitter上の処理を行わせるmessageを送信する
// @param action	行う処理のmessage
function twitterAction(action){
	chrome.tabs.getSelected(null,function(tab){
		// contentscriptに送るmessage
		var message = {message:null};
		// actionによってmessage内容を変える
		switch(action.message){
			case G_twitterLoginMessage:	// login
				// localStorageからデータを読み出す
				var accountValue = getLocalStorage(action.id);
				// message内容の生成
				message.message=G_twitterLoginMessage;
				message.id=accountValue.id;
				message.pass=accountValue.pass;
				break;
			case G_twitterLogoutMessage:	// logout
				// message内容の生成
				message.message=G_twitterLogoutMessage;
				break;
			case G_twitterLoginCheckMessage:	// loginCheck
				// message内容の生成
				message.message=G_twitterLoginCheckMessage;
				break;
			case G_twitterOpen: //open
				// message内容の生成
				message.message=G_twitterOpen;
				break;
		}
		// tabにmessageを送信する
		chrome.tabs.sendRequest(tab.id,message,function(response){

		});
	});
}

// content scriptからのメッセージを受け取る処理
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
	console.log(request.message);
	console.log(request.login);
	// タブ読み込み完了メッセージを受信したら
	if(request.message==G_documentReadyMessage){
		console.log("listener:"+g_act.message);
		switch(g_act.message){
		case G_twitterLoginMessage:
			if(request.login){ // login状態の時
				twitterAction({message:G_twitterLogoutMessage}); // logoutさせる
				// tabの更新が起きるのでもう一度このlistenerが呼ばれる
			}else{
				twitterAction({message:G_twitterLoginMessage,id:g_act.id,pass:g_act.pass}); // loginさせる
				g_act = {message:null}; // 終了
			}
			break;
		case G_twitterLogoutMessage:
			if(request.login){
				g_act = {message:null};
				twitterAction({message:G_twitterLogoutMessage}); // logoutさせる
			}
			break;
		case G_twitterOpenMessage:
			g_act = {message:null}; // 終了
			break;
		default:
			g_act = {message:null};
			break;
		}
		/*
		if(request.login){	// login状態ならば
			if(g_act.message!=null){
				// logout
				twitterAction({message:G_twitterLogoutMessage});
				if(g_act.message==G_twitterLogoutMessage){	// logout messageがきたならばそこで処理終了
					g_act = {message:null};
				}
			}
		}else{	// logout状態ならば
			if(g_act.message==G_twitterLoginMessage){
				twitterAction({message:G_twitterLoginMessage,id:g_act.id,pass:g_act.pass});
				g_act = {message:null};
			}
		}
		*/
	}
});

// 現在のタブを閉じる
function removeTab(id){
	// idのタブを閉じる
	chrome.tabs.remove(id,function(){});
}


// オプションページの呼び出し
function showOption(){
	chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.create(
			{
				url: "options.html",
				selected: true
          	},
			function(tab) { }
		);
	});
}

// twitterを新しいタブに開く
function createTwitterTab(){
	//console.log("create tab");
	chrome.tabs.create(
		{url:G_twitterURL}
	);
}
