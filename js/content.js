// ファイル読み込み終了時の処理
$(document).ready(function(){
    console.log("ready");
    console.log(location.hostname);
});

// twitterのログアウト処理
function twitterLogoutAction() {
    $('.signout-form').submit();
}

// twitterのログイン処理
// @param id twitterのid
// @param pass twitterのpass
function twitterLoginAction(id, pass) {
    if (location.href === 'https://twitter.com/login') {
        var target = $('.clearfix.signin.js-signin');
        target.find('.js-username-field').val(id);
        target.find('.js-password-field').val(pass);
        target.find('.subchck').find('input').click();
        target.find('.submit').click();
    } else {
        $('#signin-email').val(id);
        $('#signin-password').val(pass);
        $('button.submit.flex-table-btn.js-submit').click();
    }

    console.log($('button.submit.flex-table-btn.js-submit'));
}

// ログイン状態の確認
// @return ログアウト状態の時true
function isLogin() {
    // signout-buttonが存在すれば
    if ($("#signout-button").size() == 0) {
        return false;
    } else {
        return true;
    }
}

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
console.log(msg);
        switch(msg.message) {
            case Message.logoutTwitter:
                twitterLogoutAction();
            break;
            case Message.loginTwitter:
                if (location.hostname === 'twitter.com') {
                    twitterLoginAction(msg.account.id, msg.account.pass);
                } else {
                    // loginできるホスト名じゃない時は遷移させる
                    port.postMessage({message: Message.moveLoginPageTwitter});
                }
            break;
            case Message.loginCheckTwitter:
                port.postMessage({message: msg.message, login: isLogin()});
            break;
        }
    });
});

// メッセージの受け取り処理
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
console.log(request);
    // messageの内容によって処理
    switch(request.message) {
        case Message.logoutTwitter:
            twitterLogoutAction();
        break;
        case Message.loginTwitter:
console.log("loginAction");
            twitterLoginAction(request.account.id, request.account.pass);
        break;
    }
});
