var lastClicked = null;

var mouseClickProxy = document.createElement('script');
mouseClickProxy.id = 'mouseClickProxyID';
mouseClickProxy.dataset.elementClicked = null;

mouseClickProxy.textContent = [
    '',
    'var script = document.querySelector("script#' + mouseClickProxy.id + '");',
    'document.addEventListener("mousedown", function(event) {',
    '    if(event.button === 2) {',
    '        script.dataset.elementClicked = event.target.id;',
    '        console.log(event.target);',
    '    }',
    '});',
    ''
].join('\n');

document.documentElement.appendChild(mouseClickProxy);

var lastElementClickedListener = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if((mutation.type === 'attributes') && (mutation.attributeName === 'data-element-clicked')) {
            lastClicked = mouseClickProxy.dataset.elementClicked;
            console.log('lastClicked = ' + lastClicked);
        }
    });
});

lastElementClickedListener.observe(mouseClickProxy, {attributes: true});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request === "getElementClicked") {
        sendResponse(lastClicked);
    }
    if(request === "enable") {
        // sendResponse(lastClicked);
        console.log("enabling auto-complete on: " + lastClicked);
        enableAutoComplete(lastClicked);
    }
}, false);


function enableAutoComplete(elementID) {
    console.log('elementID: ' + elementID);
    if(elementID === undefined || elementID === null) {
        console.log('ID is null: unable to enable auto-complete on this element');
        return false;
    }
    var inputElement = document.getElementById(elementID);
    if(hasAutoCompleteDisabled(inputElement)) {
        // inputElement.removeAttribute("autocomplete");
        inputElement.setAttribute("autocomplete", "on")
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