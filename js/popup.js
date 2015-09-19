var inputEle = document.getElementById("input");
var noIssuesEle = document.getElementById("no-issues");
var issuesEle = document.getElementById("issues");
var selection = "";
chrome.tabs.executeScript(null, {file: "/js/alex.js"},function() {
	chrome.tabs.executeScript(null, {file: "/js/content_script.js"},function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {message: "open"}, function(response) {
				selection = response.selection;
				if (selection.length > 0 ) {
					// Add Selection to Input
					inputEle.innerHTML = selection;
					// Select Input
					var s = window.getSelection(),
						r = document.createRange();
					r.setStart(inputEle, 0);
					r.setEnd(inputEle, 0);
					s.removeAllRanges();
					s.addRange(r);
					// Run through Alex
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
			noIssuesEle.style.display = "none";
			issuesEle.style.display = "block";
			for (var i = messages.length - 1; i >= 0; i--) {
				issue = document.createElement('li');
				issue.className = 'issue';
				issue.source = messages[i].toString();
				issue.innerHTML = decorateMessage(messages[i]);
				issues.appendChild(issue);
			};
		} else {
			issuesEle.style.display = "none";
			noIssuesEle.style.display = "block";
		}
	}
}

onchange();
inputEle.addEventListener("input", function() {onchange();}, false);