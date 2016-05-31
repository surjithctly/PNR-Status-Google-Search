// Show the config file on installation
chrome.runtime.onInstalled.addListener(function(object) {

    if (localStorage.firsttime != 'false' || localStorage.firsttime == 'undefined' || !localStorage.firsttime) {
        var optionsurl = chrome.extension.getURL("options.html");
        chrome.tabs.create({
            url: optionsurl
        }, function(tab) {});

        localStorage.firsttime = false;
    }

    var currentversion = chrome.app.getDetails().version;

    if (!localStorage.version || localStorage.version != currentversion) {
        chrome.browserAction.setBadgeText({
            text: "NEW"
        });
        localStorage.version = currentversion

    }
});


// Get Local Storage value in Content Script

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch (message.method) {
        // ...
        case "getLocalStorage":
            if (message.key) { // Single key provided
                sendResponse({
                    data: localStorage[message.key]
                });
            } else if (message.keys) { // An array of keys requested
                var data = {};
                message.keys.forEach(function(key) {
                    data[key] = localStorage[key];
                })
                sendResponse({
                    data: data
                });
            }
            break;
            // ...
    }
});


/**
 * Possible parameters for request:
 *  action: "xhttp" for a cross-origin HTTP request
 *  method: Default "GET"
 *  url   : required, but not validated
 *  data  : data to send in a POST request
 *
 * The callback function is called upon completion of the request */
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            callback(xhttp.responseText);
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            callback();
        };
        xhttp.open(method, request.url, true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhttp.send(request.data);
        return true; // prevents the callback from being called too early on return
    }
});


chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
     chrome.tabs.create({url: "https://www.google.co.in/#q=pnr+status"});
});

