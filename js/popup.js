var inputEle = document.getElementById("input");
var selection = "";
chrome.tabs.executeScript(null, {file: "/js/alex.js"},function() {
	chrome.tabs.executeScript(null, {file: "/js/content_script.js"},function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {message: "open"}, function(response) {
				selection = response.selection;
				if (selection.length > 0 ) {
					inputEle.innerHTML = selection;
					onchange();
				} else {
					// Don't use selection
				};
			});
		});
	});
});


var previousValue = undefined;
function decorateMessage(message) {
	var value = message.reason;
	var index = value.indexOf('use');
	return value.replace(/`(.+?)`/g, function ($0, $1, position) {
		var name = position > index ? 'ok' : 'nok';
		return '<code class="label label-' + name + '">' + $1 + '</code>';
	});
}

function onchange() {
	var value = document.getElementById("input").innerHTML.replace(/[\n\r]+/gi, "");
	var messages = undefined;
	var message = undefined;
	if (value !== previousValue) {
		previousValue = value;
		messages = alex(value).messages.reverse();
		while (issues.firstChild) {
			issues.removeChild(issues.firstChild);
		}
		if (messages.length > 0) {
			for (var i = messages.length - 1; i >= 0; i--) {
				issue = document.createElement('li');
				issue.className = 'issue';
				issue.source = messages[i].toString();
				issue.innerHTML = decorateMessage(messages[i]);
				issues.appendChild(issue);
			};
		} else {
			issue = document.createElement('div');
			issue.className = 'issue';
			issue.innerHTML = "No issues found."
			issues.appendChild(issue);
		}
	}
}

inputEle.addEventListener("input", function() {onchange();}, false);