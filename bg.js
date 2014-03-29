chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
		setBadgeText();
		console.log(type);
		getType();
		if (type=='type_all') {
			return rejectRequest();
		}
    },
    {
        urls: ["*://*.facebook.com/*"],
        types: ["main_frame"]
    },
    ["blocking"]
);

var type;
chrome.browserAction.setBadgeBackgroundColor({color: "#3299e8"});
setBadgeText();
initType();

function rejectRequest() {
	return {redirectUrl: "https://www.google.com"};
}

// prevent user delete the localstorage
// and even if user changes computer but user still uses chrome.
// it will be blocked.
function initType() {
    chrome.storage.sync.get({
        limitation_type: '',
        limitation_date: ''
    }, function(item) {
		localStorage.setItem('limitation_date',item.limitation_date);
		localStorage.setItem('limitation_type',item.limitation_type);
    });
}

function getType() {
	type = localStorage.getItem('limitation_type');
}

function setBadgeText() {
	var count = 0;
	if (localStorage.getItem('access_count')) {
		count = localStorage.getItem('access_count');
		count++;
	} else {
		count++;
	}
	localStorage.setItem('access_count',count);
	chrome.browserAction.setBadgeText({text: count.toString() });
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		var storageChange = changes[key];
		if (key == 'limitation_type') {
			type = storageChange.newValue;
		}
		console.log('onChanged');
		localStorage.setItem(key,storageChange.newValue);
	}
});
