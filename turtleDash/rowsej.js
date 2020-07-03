String.prototype.textBefore = function(text) {
	return this.substr(0, this.indexOf(text));
};
String.prototype.textAfter = function(text) {
	return this.substr(this.indexOf(text) + text.length);
};
function setCookie(key, value, otherParameters) {
	document.cookie = key + "=" + value + ";" + (otherParameters || "");
}
function getCookie(key) {
	var toReturn;
	document.cookie.split("; ").forEach(function(cookie) {
		if(cookie.textBefore("=") == key) {
			toReturn = cookie.textAfter("=");
		}
	});
	return toReturn;
}
function removeCookie(key) {
	setCookie(key, getCookie(key) + ";max-age=0;");
}
function selectEl(query) {
  return document.querySelector(query);
}
function selectEls(query) {
  return document.querySelectorAll(query);
}
function getTime() {
  return (new Date()).getTime();
}
function random(a, b) {
	if(a === undefined && b === undefined) {
		return random(0, 2);
	} else if(Number.isInteger(a) && b === undefined) {
		return ~~(Math.random() * a);
	} else if(Number.isInteger(a) && Number.isInteger(b)) {
		return ~~(Math.random() * (b - a)) + a;
	} else if(Array.isArray(a)) {
		return a[random(a.length)];
	} else {
		return undefined;
	}
}
var round = Math.round;
var floor = Math.floor;
var ceil = Math.ceil;
var min = Math.min;
var max = Math.max;
var abs = Math.abs;