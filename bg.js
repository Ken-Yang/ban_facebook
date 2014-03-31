chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
		setAccessCount();
		setBadgeText();
		type = getType();
		var date = new Date();
		var bReject = false;
		if (type == 'type_all') {
			bReject = true;
		} else if (getDate() == date.getDate()) {
			if (type=='type_range') {
			} else if (type=='type_after' && getHour() <= date.getHours()) {
				bReject = true;
			} else if (type=='type_before' && getHour() > date.getHours()) {
				bReject = true;
			}
		}

		if (bReject) {
			return rejectRequest();
		}

    },
    {
        urls: ["https://*.facebook.com/*"],
        types: ["main_frame"]
    },
    ["blocking"]
);

chrome.tabs.onActivated.addListener(
	function(activeInfo){
		console.log(activeInfo.tabId);
		chrome.tabs.get(activeInfo.tabId,function(tab){
			if (tab.url.indexOf("facebook.com")!=-1) {
				setAccessCount();
				setBadgeText();
			}
		});
	}
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
        limitation_date: '',
        limitation_hour: ''
    }, function(item) {
		localStorage.setItem('limitation_date',item.limitation_date);
		localStorage.setItem('limitation_type',item.limitation_type);
		localStorage.setItem('limitation_hour',item.limitation_hour);
    });
}

function getType() {
	return (localStorage.getItem('limitation_type')) ? localStorage.getItem('limitation_type') : '';
}

function getDate() {
	return (localStorage.getItem('limitation_date')) ? localStorage.getItem('limitation_date') : '';
}

function getHour() {
	return (localStorage.getItem('limitation_hour')) ? localStorage.getItem('limitation_hour') : '';
}

function getAccessCount() {
	return (localStorage.getItem('access_count')) ? localStorage.getItem('access_count') : 0;
}

function setBadgeText() {
	var count = getAccessCount();
	chrome.browserAction.setBadgeText({text: count.toString() });
}


function setAccessCount() {
	var count = getAccessCount();
	count++;
	localStorage.setItem('access_count',count);
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		var storageChange = changes[key];
		localStorage.setItem(key,storageChange.newValue);
		console.log(key);
	}
});
