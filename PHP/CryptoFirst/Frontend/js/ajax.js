function httpRequest( target_url, functionReference) {

    try {
        if( window.XMLHttpRequest ) {
            httpObj = new XMLHttpRequest();
        } else if( window.ActiveXObject) {
            httpObj = new ActiveXObject( "Microsoft.XMLHTTP" );
        } else {
            httpObj = false;
        }
    } catch( e ) {
        httpObj = false;
    }
    if( !httpObj ) {
        httpObjGenerateFail();
    }
    
    httpObj.open( "GET", target_url, true );

    httpObj.onreadystatechange = function() {
        if ( httpObj.readyState == 4 ) {
            if ( httpObj.status == 200 ) {
                functionReference( httpObj.responseText );
            } else {
                alert( httpObj.status + ':' + httpObj.statusText );
                return false;
            }
        }
    }

    httpObj.send(null);
}

function newXMLHTTP() {
    if(window.XMLHttpRequest) {
        try {
            xmlhttp = new XMLHttpRequest();
        } catch(e) {
            alert("Can't initialize XMLHTTP.");
            return false;
        }
    } else if(window.ActiveXObject) {
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
                alert("Can't initialize XMLHTTP.");
                return false;
            }
        }
    } else {
        alert("Can't initialize XMLHTTP.");
        return false;

    }
    return xmlhttp;
}

function postForm(obj, callback) {
    var xmlhttp = newXMLHTTP();
    if(!xmlhttp) return false;

    var child = obj.elements;
    var data = new Array();
    for(i = 0; i < child.length;i++) {
        if(child[i].tagName != "INPUT" && child[i].tagName != "TEXTAREA" && child[i].tagName != "SELECT") continue;

        if(child[i].type == "submit" || child[i].type == "button" || child[i].type == "reset") continue;

        if((child[i].type == "radio" || child[i].type == "checkbox") && !child[i].checked) continue;

        if(child[i].getAttributeNode("required") && !child[i].value) {
            child[i].style.backgroundColor = "#FF9";
            child[i].focus();
            alert("error occur.");
            return false;
        }

           data.push ( child[i].name+"="+child[i].value);

    }

    senddata = data.join("&");

    xmlhttp.open("POST", obj.action,true);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlhttp.send(senddata);

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4) {            
            if(xmlhttp.status == 200) {
                callback(xmlhttp.responseText);
            } else if (xmlhttp.status == 404){
                alert("Several files of this program was damaged. Please reinstall the CCF.");
            }
        }
    }
}