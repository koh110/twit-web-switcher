// backgroundページの取得
var background = chrome.extension.getBackgroundPage();

// ファイルが読み込まれた時の処理
$(document).ready(function(){
	// アカウントボタンの生成
	createAccountBtn();

	// ボタンにイベントを追加
	$("#loginButton").click(function(){
		loginAction();
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
		divTag.id="account"+i; // idを追加
		divTag.setAttribute("class","accountColumn"); // 属性に追加
		$('div#contents').append(divTag); // コンテンツエリアにタグを追加
	}
	// ラジオボタンを生成
	for(i=0;i<accountArray.length;i++){
		var radioBtn = document.createElement("input");
		radioBtn.type = "radio";
		radioBtn.name = "accountGroup";
		radioBtn.value = accountArray[i];
		if(i==0){
			radioBtn.checked = true;
		}
		// 対応するdiv tagに設置
		var addTag = "#account"+i;
		$("#account"+i)
			.append(radioBtn)
			.append("\t<label>"+accountArray[i]+"</label>");
	}
}

// loginボタンの処理
function loginAction(){
	// ラジオボタンの選択項目を取得
	var checkedId = $("input[name=accountGroup]:checked").val();
	// backgroundページのログイン機能を呼び出す
	var message={message:G_twitterLoginMessage,id:checkedId};
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