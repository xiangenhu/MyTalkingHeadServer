//
// HTML5 Character Builder RSS API (c) 2010-2012, Media Semantics, Inc.
//
// To use this class, create an instance of RSSFeed, then, on the onSceneLoaded, call reloadRSSFeed() and listen to onRSSSentence(text) events, passing each sentence to msSpeakQueued.
// Finally, listen for onQueueLengthChange events from the scene - when n falls below, say, 2, call reloadRSSFeed() again to get some more sentences.
//

function RSSFeed(url, subs)
{
    var url = url;                  // RSS feed URL
    
    // Pickup passed in substitutions, add &, as in AT&T
    var substitutions = subs.split(",");
    if (substitutions.length %2 == 1) substitutions.push("");
    substitutions.push("&amp;"); substitutions.push(" and ");

    var titlesRead = [];            // Keeps track of which titles we have read
    var loadingFeed = false;        // True while we are loading the feed
    var xhr = null;                 // Request object

    this.processRSS = function(rssxml)
    {
        // For each item get the title, description, and link
        var numitems = 0;
	    var itemElements = rssxml.getElementsByTagName("item");
	    for (var i=0; i<itemElements.length; i++)
	    {
	        numitems++;
	        var elem;
    	    
	        elem = itemElements[i].getElementsByTagName("title")[0];
	        var t = "";
	        if (elem != null) t = elem.childNodes[0].nodeValue;

	        elem = itemElements[i].getElementsByTagName("description")[0];
	        var d = "";
	        if (elem != null) d = elem.childNodes[0].nodeValue;

	        elem = itemElements[i].getElementsByTagName("link")[0];
	        var l = "";
	        if (elem != null) l = elem.childNodes[0].nodeValue;

            var i;
            var found = false;
            for (i = 0; i < titlesRead.length; i++)
		    {
			    if (t == titlesRead[i]) {found = true; break;}
		    }	  
            // If title not already read then read it
		    if (!found)
		    {
			    titlesRead.push(t);
		        this.readRSS(t,d,l);
			    return;
		    }		  
	    }
    	
	    // If we get here then all the items have been read - delete the first item in the list and try again.
	    // Unless we never read any items, as this may indicate a bad feed - simply try again in a while.
	    if (numitems == 0)
	    {
		    // No items in the feed - try again in a bit
		    //var interval = setInterval(function() {clearInterval(interval); loadingFeed = false;}, 3000);
	    }
	    else
	    {
		    // All items read - remove oldest item read and try again in a bit
		    titlesRead.shift();
	    }
    }

    this.readRSS = function(t,d,l)
    {
	    //alert("Read "+t+","+d+","+l);

	    var s = "";
    	
	    // First set Title and Link variables if they are defined
	    s = s + '<builderscript>Title="'+t+'"; URL="'+l+'";</builderscript>';
    	
	    // Begin with a random head action
	    var r = Math.random();
	    if (r < 0.2) s += "<headleft/>";
	    else if (r < 0.4) s += "<headright/>";
	    else if (r < 0.6) s += "<headtiltright/>";
	    else if (r < 0.8) s += "<headtiltleft/>";
	    r = Math.random();
	    if (r < 0.5)
		    s += "<eyeswide/>";
	    s += this.filterXML(t);
	    if (!this.isSentenceEndingPunct(s.substr(s.length-1,1)))	// titles often don't end in punctuation but are spoken better with punctuation
		    s += "."
    		
	    var ss = this.doSubstitute(s);
	    //alert("onRSSSentence "+ss);
	    onRSSSentence(ss);
    	
	    a = this.splitSentence(this.filterXML(d));
	    var i;
	    for (i = 0; i < a.length; i++)
	    {
		    var ss = this.doSubstitute(a[i]);
	        //alert("onRSSSentence "+ss);
	        onRSSSentence(ss);
	    }
    	
	    loadingFeed = false;
    }

    this.isSentenceEndingPunct = function(s) {return s == "." || s =="!" || s == "?";}
    this.isSpace = function(s) {return s == " " || s =="\t" || s == "\r" || s == "\n";}

    /*
    Test cases:
    splitSentence("");
    splitSentence("  ");
    splitSentence("abc");
    splitSentence(" abc");
    splitSentence("abc ");
    splitSentence(" abc ");
    splitSentence("abc. def.");
    splitSentence("abc. def. ");
    splitSentence("abc. def");
    splitSentence("A 7.0 earthquake.");
    */
    
    this.splitSentence = function(s)
    {
	    //alert('"'+s+'"'+" -> ");
	    var a = new Array;
	    var l = 0;
	    var t;
	    var i = 0;
	    while (i < s.length)
	    {
		    while (i < s.length && this.isSpace(s.substr(i,1)))
			    i++;
		    l = i; // begin at first non-white
		    while (i < s.length && !(this.isSentenceEndingPunct(s.substr(i,1)) && this.isSpace(s.substr(i+1,1))))
			    i++;
		    if (i < s.length)
		    {
			    while (i < s.length && this.isSentenceEndingPunct(s.substr(i,1)))
				    i++;	// end after last sentence-ending-punct, e.g. ...
			    t = s.substr(l, i - l);
			    a.push(t);
			    l = i;
		    }
	    }
	    if (l < s.length) // last sentence did not end in punctuation!
	    {
		    //alert("last sentence did not end in punctuation!");
		    t = s.substr(l, s.length-l);
		    while(t.length > 0 && this.isSpace(t.substr(t.length-1,1)))
			    t = t.substr(0, t.length - 1);
		    if (!this.isSentenceEndingPunct(t.substr(t.length-1,1)))
			    t += ".";
		    a.push(t);
	    }
	    //for (i = 0; i < a.length; i++)
	    //	alert('"'+a[i]+'"');
	    return a;
    }

    this.doSubstitute = function(s)
    {
	    //alert('"'+s+'"'+" -> ");
	    var t = s;
	    for (i = 0; i < substitutions.length; i += 2)
	    {
		    var p = t.indexOf(substitutions[i]);
		    //if (p != -1 && (p == 0 || !IsLetter(s.substr(p-1,1))) && p+
		    if (p != -1)
			    t = t.substr(0, p) + substitutions[i+1] + t.substr(p+substitutions[i].length);
	    }
	    var r;
	    if (t == s)
		    r = s;
	    else
		    r = "<bubble>" + s + "</bubble>" + t;
	    //alert('"'+r+'"');
	    return r;
    }

    // Remove all xml tags, e.g. <img>, and add a little additional action.
    // Consider expanding abbreviated terms, and inserting emotional actions based on keywords
    this.filterXML = function(s)
    {
	    var i;
	    var fInXML = false;
	    var t = "";
	    for (i = 0; i < s.length; i++)
	    {
		    var c = s.substr(i,1);
		    if (!fInXML && c == '<')
			    fInXML = true;
		    else if (fInXML && c == '>')
		 	    fInXML = false;
		    else if (!fInXML)
		    {
			    t = t + c;
			    if (c == ",")
			    {
				    t = t + "<eyeswide/>";
			    }
		    }
	    }
	    //alert("'"+s+"'->'"+t+"'");
	    return t;
    }

    var thisforevent = this;
    
    this.onReadyStateChange = function()
    {
	    if (xhr.readyState == 4)
	    {
	        loadingFeed = false;
		    if (xhr.status == 200)
		    {
			    if (xhr.responseText != null)
			    {
				    thisforevent.processRSS(xhr.responseXML);
			    }
			    else
			    {
				    alert("Failed to receive RSS file from the server - file not found.");
				    return false;
			    }
		    }
		    else
		    {
			    alert("Error code " + xhr.status + " received: " + xhr.statusText);
			}
	    }
    }    
	    
    // End private fns
    
    // Public fns   
    this.reloadRSSFeed = function()
    {
        loadingFeed = true;
        
	    // Call the right constructor for the browser being used
	    if (window.ActiveXObject)
		    xhr = new ActiveXObject("Microsoft.XMLHTTP"); // code for IE6, IE5
	    else if (window.XMLHttpRequest)
		    xhr = new XMLHttpRequest();
	    else
		    alert("not supported");

	    //prepare the xmlhttprequest object
	    xhr.open("GET", url, true);
	    xhr.setRequestHeader("Cache-Control", "no-cache");
	    xhr.setRequestHeader("Pragma", "no-cache");
	    xhr.onreadystatechange = this.onReadyStateChange;

	    //send the request
	    xhr.send(null);
    }
}
