console.log("Loaded");
chrome.browserAction.onClicked.addListener(function(tab) {
	// Debug
	alert(tab);
	console.log(tab);

	chrome.tabs.executeScript(null, {file: "/js/alex.js"},function() {
	  	chrome.tabs.executeScript(null, {file: "/js/content_script.js"});
	});
});
