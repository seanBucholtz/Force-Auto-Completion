// var context = "editable";
// var contextID = "enableAutoComplete";
// var title = "Auto-complete for this element";
// var elementClicked;
//
//
// chrome.runtime.onInstalled.addListener(function() {
//     var contextMenu = {"title": title, "contexts": [context], "id": contextID};
//     var id = chrome.contextMenus.create(contextMenu);
//     console.log("'" + context + "' item: " + contextID);
//     chrome.contextMenus.create({"title": "Enable", "contexts": [context], "type": "radio",
//         "id": "enable"});
//     chrome.contextMenus.create({"title": "Disable", "contexts": [context], "type": "radio",
//         "id": "disable"});
//
//     document.addEventListener('mousedown', function (e) {
//         if(e.button === 2) {
//             console.log(e.target);
//             elementClicked = e.target.value;
//         }
//     });
// });

// function onClickHandler(info, tab) {
//     debugger;
//     if(info.menuItemId === contextID) {
//         console.log(title + " was clicked");
//         console.info(title + " was clicked")
//     }
//     else {
//         console.log("item " + info.menuItemId + " was clicked");
//         console.log("info: " + JSON.stringify(info));
//         console.log("tab: " + JSON.stringify(tab));
//     }
// }
//
// chrome.contextMenus.onClicked.addListener(onClickHandler);

// function enableAutoComplete() {
//     var inputElements = getInputElements();
//     for(var index = 0; index < inputElements.length; index++) {
//         var inputElement = inputElements[index];
//         if(hasAutoCompleteDisabled(inputElement)) {
//             var script = 'inputElement.removeAttribute("autocomplete");';
//             chrome.tabs.executeScript({
//                 code: script
//             });
//         }
//     }
// }
//
// function hasAutoCompleteDisabled(element) {
//     var autoComplete = element.getAttribute("autocomplete");
//     if(autoComplete === null) {
//         return false;
//     }
//     else if(autoComplete === "off") {
//         return true;
//     }
//     else {
//         return false;
//     }
// }
//
// function getInputElements() {
//     return document.body.getElementsByTagName('input');
// }