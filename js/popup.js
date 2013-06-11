// backgroundページの取得
var background = chrome.extension.getBackgroundPage();

// ファイルが読み込まれた時の処理
$(document).ready(function(){
	// アカウントボタンの生成
	createAccountBtn();

	$("#header").click(function(){
		openTwitter();
	});
	$("#logoutButton").click(function(){
		logoutAction();
	});
	$("#optionPage").click(function(){
		showOptionPage();
	});
});

// アカウント選択ボタンの生成
function createAccountBtn(){
	// アカウント情報の読み出し
	var accountArray = background.getAccountArray();
	if(accountArray==null){	// アカウントが作られていなければ終了
		return;
	}
	// div tagを生成
	for(var i=0;i<accountArray.length;i++){
		var divTag = document.createElement("div");
		divTag.id=accountArray[i]; // idを追加
		divTag.setAttribute("class","accountRow"); // 属性に追加
		$('div#contents').append(divTag); // コンテンツエリアにタグを追加
	}
	// ラジオボタンを生成
	for(i=0;i<accountArray.length;i++){
		// 対応するdiv tagに設置
		$("#"+accountArray[i])
			.append("<label>")
			.append(accountArray[i])
			.append("</label>");

		// クリックイベントの追加
		$("#"+accountArray[i]).click(function(){
			var id = $(this).attr("id");
			loginUser(id);
		});
	}
}

// twitter画面に遷移
function openTwitter(){
	var message={message:G_twitterOpenMessage};
	background.backgroundAction(message);
}

// ユーザlogin
function loginUser(user){
	var message={message:G_twitterLoginMessage,id:user};
	background.backgroundAction(message);
}

// logoutボタンの処理
function logoutAction(){
	// backgroundページのlogout機能を呼び出す
	var message={message:G_twitterLogoutMessage};
	background.backgroundAction(message);
}

// optionページを表示する
function showOptionPage(){
	background.showOption();
}
