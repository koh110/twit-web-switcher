var TabStatus = (function() {
    var account = null;
    var message = null;
    var info = null;
});

// localStorageからアカウントデータを読み出す
function getAccount(id) {
    var accounts = Storage.getLocal(Storage.accountsKey);
    var account = accounts.filter(function(item, index) {
        if (item.id === id) return true;
    });
console.log(account[0]);
    /*
    account = {
        id: id,
        pass: accounts[id].password,
    };
    */
    return account[0];
}

// ページ更新イベント
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.status === 'complete') {
        TabStatus.info = tab;
        switch (TabStatus.message) {
            case Message.logoutTwitter:
                if (tab.url.indexOf(Const.twitterLogoutUrl) >= 0) {
                    login(TabStatus.account.id);
                }
            break;
            case Message.moveLoginPageTwitter:
                if (tab.url.indexOf(Const.twitterLoginUrl) >= 0) {
                    login(TabStatus.account.id);
                }
            break;
            case Message.openTwitter:
                if (tab.url.indexOf(Const.twitterUrl) >= 0) {
                    login(TabStatus.account.id);
                }
            break;
        }
    }
});

function login(accountId) {
    // アカウント確認処理
    if (TabStatus.account === null || TabStatus.account === undefined) {
        TabStatus.account = getAccount(accountId);
    } else if (accountId !== TabStatus.account.id) {
        TabStatus.account = getAccount(accountId);
    }
    var loginMessage = {message: Message.loginTwitter, account: TabStatus.account};

    chrome.tabs.query({active: true}, function(tab) {
        var targetTab = tab[0];

        // 現在みているタブがtwitterのページでなければtwitterを開く
        var reg = new RegExp(".*" + Const.twitterHost + ".*");
        if (tab[0].url.search(reg)) {
            createTwitterTab(function(tab) {
                TabStatus.message = Message.openTwitter;
            });
        }

        var port = chrome.tabs.connect(targetTab.id, {name: 'login'});
        port.postMessage({message: Message.loginCheckTwitter});
        port.onMessage.addListener(function(msg) {
            switch(msg.message) {
                // login check
                case Message.loginCheckTwitter:
                    if (msg.login === true) {
                        TabStatus.message = Message.logoutTwitter;
                        port.postMessage({message: Message.logoutTwitter});
                    } else {
                        TabStatus.message = Message.loginTwitter;
                        port.postMessage(loginMessage);
                    }
                break;
                // ページ遷移
                case Message.moveLoginPageTwitter:
                    TabStatus.message = Message.moveLoginPageTwitter;
                    chrome.tabs.update(targetTab.id, {url: Const.twitterLoginUrl}, function(tab){});
                break;
            }
        });
    });
}

function logout(tab, callback) {
    message = {
        message: Message.logoutTwitter
    }
    chrome.tabs.sendMessage(tab.id, message, function(response) {
        callback(response);
    });
}

// オプションページの呼び出し
function showOption() {
    chrome.tabs.query({active: true}, function(currentTab) {
        chrome.tabs.create({url: "options.html", selected: true}, function(tab) {});
    });
}

// twitterを新しいタブに開く
function createTwitterTab(callback) {
    chrome.tabs.create({url: Const.twitterUrl, selected: true}, function(tab){
        callback(tab);
    });
}

// messageの受け取りイベントリスナー
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.message) {
        // login
        case Message.loginTwitter:
            login(request.id);
        break;
        // logout
        case Message.logoutTwitter:
            chrome.tabs.query({active: true}, function(tab) {
                logout(tab[0], function(response) {});
            });
        break;
        // open twitter
        case Message.openTwitter:
            createTwitterTab(function (tab){});
        break;
        // open option page
        case Message.openOptionPage:
            showOption();
        break;
    }
});
