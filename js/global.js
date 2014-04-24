//================================================
// 全体で使う変数などを設定する
//================================================
// const
var Const = (function() {

});

// twitterのurl
Const.twitterUrl = "https://twitter.com/";
Const.twitterLoginUrl = "https://twitter.com/login";
Const.twitterLogoutUrl = "https://about.twitter.com/";
Const.twitterHost = "twitter.com";

//------------------------------------------------
// Message
//------------------------------------------------
var Message = (function() {

});
Message = {
    // twitterpageを開く
    openTwitter: "twitterOpenMessage",

    // login用message
    loginTwitter: "twitterLoginMessage",

    // logout用message
    logoutTwitter: "twitterLogoutMessage",
    // logout終了
    finishLogoutTwitter: "twitterLogoutFinishMessage",

    // loginチェック用message
    loginCheckTwitter: "twitterLoginCheckMessage",

    // twitterのログインページに遷移したmessage
    moveLoginPageTwitter: "moveLoginPageTwitterMessage",

    // optionページを開く
    openOptionPage: "openOptionPageMessage",
}


