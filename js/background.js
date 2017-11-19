var context = "editable";
var contextID = "enableAutoComplete";
var title = "Auto-complete for this element";

var elementClickedID = null;
var elementClickedPageURL = null;

function setElementClicked(elementClicked) {
    elementClickedID = elementClicked["ID"];
    elementClickedPageURL = elementClicked["URL"];
}


chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({"title": "On", "contexts": [context], "type": "radio",
        "id": "enable"});
    chrome.contextMenus.create({"title": "Off", "contexts": [context], "type": "radio",
        "id": "disable"});
});


function onClickHandler(info, tab) {
    // debugger;

    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

    var menuItem = info.menuItemId;
    if(menuItem === "enable") {
        chrome.tabs.sendMessage(tab.id, "enable", setElementClicked);
        console.log(elementClickedID);
        if(!trackingID(elementClickedID)) {
            saveID(elementClickedID, elementClickedPageURL);
        }
    }
    else if(menuItem === "disable") {
        if(trackingID(elementClickedID)) {
            deleteID(elementClickedID, elementClickedPageURL);
        }
    }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);


function logStuff(elementID) {
    alert("I received the following DOM content:\n" + elementID);
    console.log("I received the following DOM content:\n" + elementID);
}

//document.addEventListener('DOMContentLoaded', function() {
//    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
//        var url = tabs[0].url;
//        console.log(url);
//    });
//}, false);

function trackingID(URL, ID) {
    console.log(URL);
    var urlArray = queryStorageForURL(URL);
    if(!urlArray) {
        return false;
    }
    else {
        return $.inArray(urlArray, ID) > -1;
    }
}

function queryStorageForURL(URL) {
    console.log(URL);
    chrome.storage.sync.get([URL], function(result) {
        debugger;
        console.log("reslt: " + JSON.stringify(result));
        return result[pageURL] ? result[pageURL] : null;
    });
}

//function saveSetting(setting) {
//    var pageURL = setting.URL;
//    var elementClickedID = setting.ID;
//    debugger;
//    console.log("save settings: pageURL = "+ pageURL + " elementClickedID = " + elementClickedID);
//    saveID(pageURL, elementClickedID);
//}

function saveID(ID, pageURL) {
    debugger;
    console.log("save ID: pageURL = "+ pageURL + " ID = " + ID);
    var urlArray = queryStorageForURL(pageURL);
    if($.inArray(urlArray, ID) < 0) {
        urlArray.unshift(ID);
        var jsonObj = {};
        jsonObj[pageURL] = urlArray;
        chrome.storage.sync.set(jsonObj, function() {
            console.log("Saved ID: " + ID + " under URL: " + pageURL);
        });
    }
//    chrome.storage.sync.get([pageURL], function(result) {
//        debugger;
//        console.log("reslt: " + JSON.stringify(result));
//        var array = result[pageURL] ? result[pageURL] : [];
//        if(!$.inArray(ID, array)) {
//            array.unshift(ID);
//            var jsonObj = {};
//            jsonObj[pageURL] = array;
//            chrome.storage.sync.set(jsonObj, function() {
//                console.log("Saved ID: " + ID + " under URL: " + pageURL);
//            });
//        }
//    });
}

function deleteID(ID, pageURL) {
    debugger;
    console.log("save ID: pageURL = "+ pageURL + " ID = " + ID);
    var urlArray = queryStorageForURL(pageURL);
    var index = $.inArray(urlArray, ID);
    if(index > -1) {
        urlArray = $.grep(urlArray, function(value) {
            return value !== ID;
        });
        var jsonObj = {};
        jsonObj[pageURL] = urlArray;
        chrome.storage.sync.set(jsonObj, function() {
            console.log("re ID: " + ID + " under URL: " + pageURL);
        });
    }
}

