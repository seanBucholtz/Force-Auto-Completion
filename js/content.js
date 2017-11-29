$(document).ready(function() {
    var pageURL = window.location.href;
    setElementClickedPageURL(pageURL);
    queryStorageForURL(enableAutoCompleteOnFields, pageURL);
});

//------------------------------------- Proxy Script ------------------------------------------------//
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

//------------------------------------- Proxy Script ------------------------------------------------//

//--------------------------------Proxy Script Data Listener-----------------------------------------//
var lastElementClickedListener = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if((mutation.type === 'attributes') && (mutation.attributeName === 'data-element-clicked')) {
            console.log("Overwriting last clicked..");
            setElementClickedID(mouseClickProxy.dataset.elementClicked);
        }
    });
});

lastElementClickedListener.observe(mouseClickProxy, {attributes: true});
//--------------------------------Proxy Script Data Listener-----------------------------------------//

//---------------------------------- Background Listener --------------------------------------------//
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log("Message from background:" + sender.tab.url);
    debugger;
    // var elementID = getElementClickedID();
    if(request.greeting === "enable") {
        getElementClickedID(enableAutoComplete);
        // enableAutoComplete(elementID);
        // if(!trackingID(elementID)) {
        //     saveID(elementID, getElementClickedPageURL());
        // }
    }
    else if(request.greeting === "disable") {
        getElementClickedID(disableAutoComplete);
        // disableAutoComplete(elementID);
        // if(trackingID(elementID)) {
        //     deleteID(elementID, getElementClickedPageURL());
        // }
    }
    sendResponse({farewell: "test"});
});
//---------------------------------- Background Listener --------------------------------------------//

//-------------------------------------- Workers ----------------------------------------------------//

function enableAutoComplete(elementID) {
    console.log("enabling auto-complete on: " + elementID);
    toggleAutoComplete("ON", elementID);
    getElementClickedPageURL(saveID, elementID);
    // if(!trackingID(elementID)) {
    //     getElementClickedPageURL(saveID, elementID);
    //     // saveID(elementID, getElementClickedPageURL);
    // }
}

function enableAutoCompleteOnFields(savedFields) {
    if(savedFields !== undefined) {
        $.each(savedFields, function (index, field) {
            enableAutoComplete(field);
        })
    }
}

function disableAutoComplete(elementID) {
    console.log("disabling auto-complete on: " + elementID);
    toggleAutoComplete("OFF", elementID);
    getElementClickedPageURL(deleteID, elementID);
    // if(trackingID(elementID)) {
    //     getElementClickedPageURL(deleteID, elementID);
    //     // deleteID(elementID, getElementClickedPageURL());
    // }
}

function toggleAutoComplete(ON_OFF, elementID) {
    // debugger;
    ON_OFF = ON_OFF.toLowerCase();
    if(ON_OFF !== "on" && ON_OFF !== "off") {
        return false;
    }
    $('#' + elementID).attr("autocomplete", ON_OFF);
}

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
//-------------------------------------- Workers ----------------------------------------------------//

//------------------------------------ Sync Storage ------------------------------------------------//
function queryStorageForURL(callback, pageURL) {
    console.log("queryStorageForURL: " + pageURL);
    chrome.storage.sync.get(pageURL, function(result) {
        debugger;
        console.log("result: " + JSON.stringify(result));
        result = result[pageURL] ? result[pageURL] : undefined;
        callback(result, arguments);
    });
}

function saveID(ID, getPageURL) {
    debugger;
    var pageURL = getPageURL();
    console.log("saveID: pageURL = "+ pageURL + " ID = " + ID);
    queryStorageForURL(addIdToURLArray, pageURL, ID);
}

function addIdToURLArray(urlArray, ID) {
    debugger;
    ID = arguments[1];
    if($.inArray(urlArray, ID) < 0) {
        urlArray.unshift(ID);
        var jsonObj = {};
        jsonObj[pageURL] = urlArray;
        chrome.storage.sync.set(jsonObj, function() {
            console.log("Saved ID: " + ID + " under URL: " + pageURL);
        });
    }
}

function deleteID(ID, pageURL) {
    // debugger;
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
//------------------------------------ Sync Storage ------------------------------------------------//

//------------------------------------ Local Storage ----------------------------------------------//
function getElementClickedID(callback) {
    // debugger;
    chrome.storage.local.get('elementClickedID', function(result) {
        debugger;
        var elementClickedID = result['elementClickedID'];
        console.log("retrieved locally elementClickedID as: " + elementClickedID);
        callback(elementClickedID);
    });
}

function setElementClickedID(elementClickedID) {
    // debugger;
    chrome.storage.local.set({'elementClickedID': elementClickedID}, function() {
        console.log("saved locally elementClickedID as: " + elementClickedID);
    })
}

function getElementClickedPageURL(elementClickedID, callback) {
    // debugger;
    chrome.storage.local.get('elementClickedPageURL', function(result) {
        debugger;
        var elementClickedPageURL = result['elementClickedPageURL'];
        console.log("retrieved locally elementClickedPageURL as: " + elementClickedPageURL);
        callback(elementClickedID, elementClickedPageURL);
    });
}

function setElementClickedPageURL(elementClickedPageURL) {
    // debugger;
    chrome.storage.local.set({'elementClickedPageURL': elementClickedPageURL}, function() {
        console.log("saved locally elementClickedPageURL as: " + elementClickedPageURL);
    })
}
//------------------------------------ Local Storage ----------------------------------------------//