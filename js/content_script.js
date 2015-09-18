function getSelectionText() {
	var text = "";
	if (window.getSelection) {
		text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
		text = document.selection.createRange().text;
	}
	return text;
}
selection = getSelectionText();
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	sendResponse({selection: selection});
});