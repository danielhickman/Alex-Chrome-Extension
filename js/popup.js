var inputEle = document.getElementById("input");
var noIssuesEle = document.getElementById("no-issues");
var issuesEle = document.getElementById("issues");
var selection = "";

// Get and Restore Selection
/*var saveSelection, restoreSelection;

if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        var start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        };
    };

    restoreSelection = function(containerEl, savedSel) {
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
} else if (document.selection) {
    saveSelection = function(containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
    };
}*/

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
				// Issues
				issue = document.createElement('li');
				issue.className = 'issue';
				issue.source = messages[i].toString();
				issue.innerHTML = decorateMessage(messages[i]);
				issues.appendChild(issue);

				/*// Input Styling
				var cursor = saveSelection(inputEle);
				inputEle.innerHTML = inputEle.innerHTML.replace(/<span class="label label\-nok">(.+?)<\/span>/gi, "$1");
				var position = messages[i].location;
				var start = position.start && position.start.offset;
				var end = position.end && position.end.offset;
				// alert(start);
				var regex = new RegExp("(.{" + start + "})(.{" + end + "})","gi");
				inputEle.innerHTML = inputEle.innerHTML.replace(regex, "$1<span class=\"label label-nok\">$2</span>");
				restoreSelection(inputEle, cursor);*/
			};
		} else {
			// Issues
			issuesEle.style.display = "none";
			noIssuesEle.style.display = "block";

			/*// Input Styling
			if ($("#input").is(":focus")) {
				var cursor = saveSelection(inputEle);
				inputEle.innerHTML = inputEle.innerHTML.replace(/<span class="label label\-nok">(.+?)<\/span>/gi, "$1");
				restoreSelection(inputEle, cursor);
			} else {
				inputEle.innerHTML = inputEle.innerHTML.replace(/<span class="label label\-nok">(.+?)<\/span>/gi, "$1");
			}*/
		}
	}
}

document.addEventListener('DOMContentLoaded', function () {
		onchange();
		inputEle.addEventListener("input", function() {onchange();}, false);
		document.getElementById('close-popup').addEventListener('click', function() {window.close()});
		$('#overflow-menu').dropdown({
			inDuration: 300,
			outDuration: 225,
			constrain_width: false,
			hover: false,
			gutter: 0,
			belowOrigin: false,
			alignment: 'right'
			}
		);
});