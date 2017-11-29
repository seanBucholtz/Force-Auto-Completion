// function setElementClicked(elementClicked) {
//     setElementClickedID(elementClicked["ID"]);
//     setElementClickedPageURL(elementClicked["URL"]);
// }

// function getElementClickedID() {
//     var elementClickedID = null;
//     chrome.storage.local.get('elementClickedID', function(result) {
//         elementClickedID = result.elementClickedID;
//         console.log("retrieved locally elementClickedID as: " + elementClickedID);
//     });
//     return elementClickedID;
// }
//
// function setElementClickedID(elementClickedID) {
//     chrome.storage.local.set({'elementClickedID': elementClickedID}, function() {
//         console.log("saved locally elementClickedID as: " + elementClickedID);
//     })
// }
//
// function getElementClickedPageURL() {
//     var elementClickedPageURL = null;
//     chrome.storage.local.get('elementClickedPageURL', function(result) {
//         elementClickedPageURL = result.elementClickedPageURL;
//         console.log("retrieved locally elementClickedPageURL as: " + elementClickedPageURL);
//     });
//     return elementClickedPageURL;
// }
//
// function setElementClickedPageURL(elementClickedPageURL) {
//     chrome.storage.local.set({'elementClickedPageURL': elementClickedPageURL}, function() {
//         console.log("saved locally elementClickedPageURL as: " + elementClickedPageURL);
//     })
// }

chrome.runtime.onInstalled.addListener(function() {
    var context = "editable";
    chrome.contextMenus.create({"title": "On", "contexts": [context], "type": "radio",
        "id": "enable"});
    chrome.contextMenus.create({"title": "Off", "contexts": [context], "type": "radio",
        "id": "disable"});
});


function onClickHandler(info, tab) {

    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
    debugger;
    // chrome.tabs.sendMessage(tab.id, "getElementClicked", setElementClicked);
    // var elementClickedID = getElementClickedID();
    // var elementClickedPageURL = getElementClickedPageURL();

    var menuItem = info.menuItemId;
    chrome.tabs.sendMessage(tab.id, {greeting: menuItem}, function(response) {
        console.log(menuItem + "d " + response.farewell);
    });
    // if(menuItem === "enable") {
    //     chrome.tabs.sendMessage(tab.id, {greeting: "enable"}, function(response) {
    //         console.log("Enabled " + response.farewell);
    //     });
    //     // chrome.tabs.sendMessage({active: true, currentWindow: true}, function (tabs)
    //     // {
    //     //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "enable"}, function(response) {
    //     //         console.log("Enabled " + response.farewell);
    //     //     });
    //     // });
    // }
    // else if(menuItem === "disable") {
    //     chrome.tabs.sendMessage(tab.id, {greeting: "enable"}, function(response) {
    //         console.log("Enabled " + response.farewell);
    //     });
    //     // chrome.tabs.sendMessage({active: true, currentWindow: true}, function (tabs)
    //     // {
    //     //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "disable"}, function(response) {
    //     //         console.log("Disabled " + response.farewell);
    //     //     });
    //     // });
    // }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);


// function trackingID(URL, ID) {
//     console.log(URL);
//     var urlArray = queryStorageForURL(URL);
//     if(!urlArray) {
//         return false;
//     }
//     else {
//         return $.inArray(urlArray, ID) > -1;
//     }
// }

// function queryStorageForURL(URL) {
//     console.log(URL);
//     chrome.storage.sync.get([URL], function(result) {
//         debugger;
//         console.log("reslt: " + JSON.stringify(result));
//         return result[pageURL] ? result[pageURL] : null;
//     });
// }

//function saveSetting(setting) {
//    var pageURL = setting.URL;
//    var elementClickedID = setting.ID;
//    debugger;
//    console.log("save settings: pageURL = "+ pageURL + " elementClickedID = " + elementClickedID);
//    saveID(pageURL, elementClickedID);
//}

// function saveID(ID, pageURL) {
//     debugger;
//     console.log("save ID: pageURL = "+ pageURL + " ID = " + ID);
//     var urlArray = queryStorageForURL(pageURL);
//     if($.inArray(urlArray, ID) < 0) {
//         urlArray.unshift(ID);
//         var jsonObj = {};
//         jsonObj[pageURL] = urlArray;
//         chrome.storage.sync.set(jsonObj, function() {
//             console.log("Saved ID: " + ID + " under URL: " + pageURL);
//         });
//     }
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
// }

// function deleteID(ID, pageURL) {
//     debugger;
//     console.log("save ID: pageURL = "+ pageURL + " ID = " + ID);
//     var urlArray = queryStorageForURL(pageURL);
//     var index = $.inArray(urlArray, ID);
//     if(index > -1) {
//         urlArray = $.grep(urlArray, function(value) {
//             return value !== ID;
//         });
//         var jsonObj = {};
//         jsonObj[pageURL] = urlArray;
//         chrome.storage.sync.set(jsonObj, function() {
//             console.log("re ID: " + ID + " under URL: " + pageURL);
//         });
//     }
// }

