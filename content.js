// ファイル読み込み終了時の処理
$(document).ready(function(){
	// tabにファイル読み込み完了messageを送信
	// 送信message
	var message = {
		message:G_documentReadyMessage,
		login:isLogin()
	};
	// messageの送信
	chrome.extension.sendRequest(message,function(response){

	});
});

// twitterのログアウト処理
function twitterLogoutAction(){
	$('.signout-form').submit();
}

// twitterのログイン処理
// @param id	twitterのid
// @param pass	twitterのpass
function twitterLoginAction(id,pass){
	$('.js-username-field.email-input').val(id);
	$('.js-password-field').val(pass);
	$('.js-signin.signin').submit();
}

// ログイン状態の確認
// @return ログアウト状態の時true
function isLogin(){
	console.log($("#signout-button").size());
	// signout-buttonが存在すれば
	if($("#signout-button").size()==0){
		return false;
	}else{
		return true;
	}
}

// メッセージの受け取り処理
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse){
		console.log(request.message);
		// messageの内容によって処理
		switch(request.message){
			case G_twitterLogoutMessage:	// logout
				twitterLogoutAction();
				break;
			case G_twitterLoginMessage:	// login
				twitterLoginAction(request.id,request.pass);
				break;
			case G_twitterLoginCheckMessage:	// login状態の確認
				// messageの送信
				var message={
					message:G_twitterLoginCheckMessage,
					login:isLogin()
				};
				chrome.extension.sendRequest(message,function(response){
					
				});
				break;
		}
	}
);