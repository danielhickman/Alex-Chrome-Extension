var inputEle = document.getElementById("input");
var noIssuesEle = document.getElementById("no-issues");
var issuesEle = document.getElementById("issues");
var selection = "";

document.addEventListener('DOMContentLoaded', function () {
		document.getElementById('back-popup').addEventListener('click', function() {window.location = "/html/popup.html"});
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