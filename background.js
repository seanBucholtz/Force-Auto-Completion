var context = "editable";
var contextID = "enableAutoComplete";
var title = "Auto-complete for this element";


chrome.runtime.onInstalled.addListener(function() {
    var contextMenu = {"title": title, "contexts": [context], "id": contextID};
    var id = chrome.contextMenus.create(contextMenu);
    console.log("'" + context + "' item: " + contextID);
    chrome.contextMenus.create({"title": "Enable", "contexts": [context], "type": "radio",
        "id": "enable"});
    chrome.contextMenus.create({"title": "Disable", "contexts": [context], "type": "radio",
        "id": "disable"});
});


function onClickHandler(info, tab) {
    // debugger;
    if(info.menuItemId === contextID) {
        console.log(title + " was clicked");
        console.info(title + " was clicked")
    }
    else {
        console.log("item " + info.menuItemId + " was clicked");
        console.log("info: " + JSON.stringify(info));
        console.log("tab: " + JSON.stringify(tab));

        chrome.tabs.sendMessage(tab.id, "getElementClicked", logStuff);
        chrome.tabs.sendMessage(tab.id, "enable");
    }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);


function logStuff(elementID) {
    alert("I received the following DOM content:\n" + elementID);
}

function enableAutoComplete(elementID) {
    console.log('elementID: ' + elementID);
    if(elementID === undefined || elementID === null) {
        console.log('ID is null: unable to enable auto-complete on this element');
        return false;
    }
    var inputElement = document.getElementById(elementID);
    if(hasAutoCompleteDisabled(inputElement)) {
        inputElement.removeAttribute("autocomplete");
        // var script = 'inputElement.removeAttribute("autocomplete");';
        // chrome.tabs.executeScript({
        //     code: script
        // });
    }
}

function hasAutoCompleteDisabled(element) {
    var autoComplete = element.getAttribute("autocomplete");
    if(autoComplete === null) {
        return false;
    }
    else if(autoComplete === "off") {
        return true;
    }
    else {
        return false;
    }
}