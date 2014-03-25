chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return {redirectUrl: "https://www.google.com"};
    },
    {
        urls: ["*://*.facebook.com/*"],
        types: ["main_frame"]
    },
    ["blocking"]
);
