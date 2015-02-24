Function.prototype.inherits = function (className) {
	this.prototype = new className ();
}

function Enum () {
	for (var i = 0; i < arguments.length; i++) {
		this [arguments [i]] = arguments [i];
	}
}

var parseXML;

if (typeof window.DOMParser != "undefined") {
    parseXML = function(xmlStr) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLDOM")) {
    parseXML = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
} else {
    throw new Error("No XML parser found");
}

function removeTextNodes (node) {
	for (var i = 0; i < node.childNodes.length; i++) {
        var badNodeTypes = [3, 8];

		if (badNodeTypes.indexOf (node.childNodes [i].nodeType) !== -1) {
			node.removeChild (node.childNodes [i]);
			i--;
		}
	}
}