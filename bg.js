chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
		setAccessCount();
		setBadgeText();

		if (!canAccess()) {
			return {redirectUrl: "https://www.google.com"};
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
		chrome.tabs.get(activeInfo.tabId,function(tab){
			if (tab.url.match(/^https:\/\/\w+.facebook.com/)!=null) {
				setAccessCount();
				setBadgeText();
			}
		});
	}
);

chrome.alarms.create('refresh', {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(function(alarm){
	var date = new Date();
	if (date.getDate() != localStorage.getItem('today') ) {
		localStorage.clear();
		localStorage.setItem('today',date.getDate());
		setBadgeText();
	}
});

chrome.browserAction.setBadgeBackgroundColor({color: "#3299e8"});
setBadgeText();
initType();


function canAccess() {
	var type = getType();
	var limitationDate = getDate();
	var limitationHour = getHour();
	var limitationFrom = getFrom();
	var limitationTo   = getTo();

	var date = new Date();
	var nowHours = date.getHours();
	var nowMin 	= date.getMinutes();

	if (limitationDate != date.getDate()) {
		return true;
	}


	if (type == 'type_all') {
		return false;
	} else if (type=='type_range' && limitationFrom<=nowHours && (limitationTo>nowHours || (limitationTo==nowHours && nowMin==0)) ) {
		return false;
	} else if (type=='type_after' && limitationHour <= nowHours) {
		return false;
	} else if (type=='type_before' && (limitationHour > nowHours || (limitationHour == nowHours && nowMin==0)  )) {
		return false;
	} else {
		return true;
	}
}

// can modify setting
function canModify() {
	var type = getType();
	var limitationDate = getDate();
	var limitationHour = getHour();
	var limitationFrom = getFrom();
	var limitationTo   = getTo();

	var date = new Date();
	var nowHours = date.getHours();
	var nowMin 	= date.getMinutes();

	if (limitationDate != date.getDate()) {
		return true;
	}

	if (type=='type_range' && (limitationTo<nowHours || (limitationTo==nowHours && nowMin!=0)) ) {
		return true;
	} else if (type=='type_before' && limitationHour < nowHours) {
		return true;
	}

	return false;

}

// prevent user delete the localstorage
// and even if user changes computer but user still uses chrome.
// it will be blocked.
function initType() {
    var date = new Date();
    localStorage.setItem('today',date.getDate());
    chrome.storage.sync.get({
        limitation_type: '',
        limitation_date: '',
        limitation_hour: '',
        limitation_to: '',
        limitation_from: ''
    }, function(item) {
		localStorage.setItem('limitation_date',item.limitation_date);
		localStorage.setItem('limitation_type',item.limitation_type);
		localStorage.setItem('limitation_hour',item.limitation_hour);
		localStorage.setItem('limitation_from',item.limitation_from);
		localStorage.setItem('limitation_to',item.limitation_to);
    });
}

function getType() {
	return (localStorage.getItem('limitation_type')) ? localStorage.getItem('limitation_type') : '';
}

function getDate() {
	return (localStorage.getItem('limitation_date')) ? localStorage.getItem('limitation_date') : '';
}

function getHour() {
	return (localStorage.getItem('limitation_hour')) ? localStorage.getItem('limitation_hour') : 0;
}

function getAccessCount() {
	return (localStorage.getItem('access_count')) ? localStorage.getItem('access_count') : 0;
}

function getFrom() {
	return (localStorage.getItem('limitation_from')) ? localStorage.getItem('limitation_from') : 0;
}

function getTo() {
	return (localStorage.getItem('limitation_to')) ? localStorage.getItem('limitation_to') : 0;
}

function getErrorMsg() {
	var type = getType();

	if (type == 'type_all') {
		return ' <code>All Day</code>';
	} else if (type=='type_range') {
		var limitationFrom = getFrom();
		var limitationTo   = getTo();
		return '<code>From: ' +  limitationFrom+ ':00 To:' + limitationTo+ ':00</code>';
	} else if (type=='type_after' ) {
		var limitationHour = getHour();
		return '<code>After: ' + limitationHour + ':00</code>';
	} else if (type=='type_before') {
		var limitationHour = getHour();
		return '<code>Before:' + limitationHour+ ':00</code>';
	}
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
	}
});
