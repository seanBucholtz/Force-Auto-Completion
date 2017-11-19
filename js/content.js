var lastClicked = null;
var pageURL = null;

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
            console.log("Overwriting last clicked..");
            lastClicked = mouseClickProxy.dataset.elementClicked;
            console.log('Mouse event lastClicked = ' + lastClicked);
        }
    });
});

lastElementClickedListener.observe(mouseClickProxy, {attributes: true});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request === "getElementClicked") {
        sendResponse(lastClicked);
    }
    if(request === "enable") {
        console.log("enabling auto-complete on: " + lastClicked);
        enableAutoComplete(lastClicked);
//        console.log("Saving " + lastClicked + " under URL " + pageURL);
        sendResponse({"URL": pageURL, "ID": lastClicked});
    }
}, false);


function enableAutoComplete(elementID) {
    debugger;
    console.log('elementID: ' + elementID);
    if(elementID === undefined || elementID === null) {
        console.log('ID is null: unable to enable auto-complete on this element');
        return false;
    }
    var inputElement = $('#' + elementID);
    if(hasAutoCompleteDisabled(inputElement)) {
        inputElement.setAttribute("autocomplete", "on")
    }
}

function hasAutoCompleteDisabled(element) {
    var autoComplete = $(element).attr("autocomplete");
    if(!autoComplete) {
        return false;
    }
    else if(autoComplete === "off") {
        return true;
    }
    else {
        return false;
    }
}

$(document).ready(function() {
    pageURL = window.location.href;
});

