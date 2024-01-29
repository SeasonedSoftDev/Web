var smallFailMsg = "Failed";
var getPriceInterval = 0;
var curPrice = "0.00";
var timerID = -1;
var pageName = "";

var upScrolling = false;
var upScrollingTimerID = -1;

var cntCustomer = 28749;
var intervalID = -1;
var feedBackPeriod = 12000;

function gotoPage( pageName ) {
	if ( pageName.indexOf("?") > 0 )
		location.href = pageName + "&lang=" + language + "&cur=" + currency + "&bk=" + blockChain;
	else
		location.href = pageName + "?lang=" + language + "&cur=" + currency + "&bk=" + blockChain;
}

function selectItemDisplay (selIDStr, itemIDStr) {
	homeNormal ();
	var parentPos = $("#" + selIDStr).position();
	var scrollLeft = $(window).scrollLeft ();
	if(scrollLeft > 0) {
		parentPos.left -= scrollLeft;
	}
	parentWidth = $("#" + selIDStr).width();
	parentHeight = $("#" + selIDStr).height();
	$("#" + itemIDStr).css({top:parentPos.top + parentHeight + 3, left:parentPos.left, display:"block"});
}

function downPage () {
	var scrollValue = $(window).scrollTop();
	$("html, body").animate({ scrollTop: "630px" });
}

function selectItemDisplay2 (selIDStr, itemIDStr) {
	homeNormal ();
	var parentPos = $("#" + selIDStr).position();
	var scrollLeft = $(window).scrollLeft ();
	var scrollTop = $(window).scrollTop (); 
	if(scrollLeft > 0) {
		parentPos.left -= scrollLeft;
	}
	parentWidth = $("#" + selIDStr).width();
	parentHeight = $("#" + selIDStr).height();
	$("#" + itemIDStr).css({top:parentPos.top - scrollTop + parentHeight + 3, left:parentPos.left, display:"block"});
}

function homeNormal () {
	$("#flagSelItems").css({display:"none"});
	$("#currentSelItems").css({display:"none"});
	$("#blockChainSelItems").css({display:"none"});
}

function hideRecommond () {
	$("#recommendSelItems").css({display:"none"});
}

function locationOrder () {
	homeNormal ();

	var priceLen = curPrice.length;
	var cntOne = (curPrice.match(/1/g) || []).length;
	if(!cntOne)
		cntOne = 0;
	priceWidth = cntOne * 15 + (curPrice.length - 1 - cntOne) * 35 + 12;
	if (priceWidth < 110) {
		$(".priceMiddle").css({"width":130});
		$("#firstPriceNumber").css({"margin-left":(130 - priceWidth) / 2});
	} else {
		$(".priceMiddle").css({"width":priceWidth});
	}

	var bodyWidth = $(window).outerWidth();
	bodyWidth -= 20;

	var bodyHeight = $(window).height();
	var logoWidth = $("#logo").outerWidth();
	var selectWidth = $("#select").outerWidth();
	var priceWidth = $("#pricePad").outerWidth();
	var menuWidth = $("#menu").outerWidth();
	var upMenuItemWidth = $("#logInItem").outerWidth() + $("#signUpItem").outerWidth();

	if ( bodyWidth < 1360 ) {
		window.resizeTo( 1360, bodyHeight);
		bodyWidth = 1360;
		$("body").css("width", 1360);
		$(".sliderSentences01").css("width", 1140);
	} else {
		$("body").css("width", "100%");
		$(".sliderSentences01").css("width", bodyWidth - 140);
	}

	var priceLeft = (bodyWidth - priceWidth) / 2;
	$("#select").css("margin-left", (priceLeft - logoWidth - selectWidth) / 2 + "px");
	$("#pricePad").css("margin-left", (priceLeft - logoWidth - selectWidth) / 2 + "px");
	$("#menu").css("margin-left", priceLeft - menuWidth + "px");

	if ( bodyWidth > 550 ) {
		$(".subWnd").css("margin-left", bodyWidth - 550);
	} else {
		$(".subWnd").css("margin-left", 0);
	}

	$(".flipElement").css({"margin-left":(bodyWidth - 1200) / 8, "margin-right":(bodyWidth - 1200) / 8});

	$("#triangleTop").css("border-left", bodyWidth + "px solid transparent");
	$('#triangleBottom').css("border-right", bodyWidth + "px solid transparent");

	if ( bodyWidth > 1260 ) {
		$('.counterBox').css({"margin-left":(bodyWidth - 1260) / 10, "margin-right":(bodyWidth - 1260) / 10});
	}

	var clientHeight = window.innerHeight;
	var clientWidth = window.innerWidth;
	var footerHeight = $(".footer").outerHeight ();
	$(".UpButtonGroup").css("margin-top", clientHeight - footerHeight - 32);
	$(".UpButtonGroup").css("margin-left", clientWidth - 60);

	var footerPos = $('.footer').position();
	var footerHeight = $('.footer').innerHeight();
	var bodyDivHeight = $('#bodyDiv').innerHeight();
	var windowHeight = window.innerHeight;
	if (bodyDivHeight > windowHeight)
		windowHeight = bodyDivHeight;

	if ( (footerPos.top + footerHeight) < windowHeight ) {
		$(".footer").css( { "margin-top":(windowHeight - footerHeight - bodyDivHeight) } );
	}

	if (pageName == "CONTACT") {
		var blankLeft = $('#blankLeft').innerWidth();
		$("#recaptchaGroup").css({left:blankLeft + 35});
	} else if ( pageName == "ABOUT US") {
		$("#worldMap01").css({"left":(bodyWidth - 993) / 2});
	}
}

$(function() {
    function imageLoaded() {
    	locationOrder ();
    }

    $('img').each(function() {
        if( this.complete ) {
            imageLoaded.call( this );
        } else {
            $(this).one('load', imageLoaded);
        }
    });

    $( window ).resize(function() {
    	locationOrder ();
	});

	$(document).ready(function () {
		displayRate ();
		if ( typeof(quickSignUpHTML) != "undefined" && quickSignUpHTML != null ) {
			$('#quickSpan').html(quickSignUpHTML);
		}
	});
});

function upScreen () {
	$("html, body").animate({ scrollTop: "0px" });
}

$(window).scroll(function(){
	if ( $(window).scrollTop() > 0 ) {
	    $(".header").css("background", "url('images/menuBack.png')");
	    $(".header").css("background-repeat", "repeat-x");
	} else {
		$(".header").css("background", "none");
	}

	if ($(window).scrollTop() > 400) {
		$(".UpButtonGroup").css("visibility", "visible");
	} else {
		$(".UpButtonGroup").css("visibility", "hidden");
	}

	var hScrollValue = $(window).scrollLeft();
	if (hScrollValue > 0) {
		$(".header").css("margin-left", -hScrollValue);
	} else {
		$(".header").css("margin-left", 0);
	}

	var scrollValue = $(window).scrollTop();
	var counterPos = $("#counterBoxGroup").position();
	if ( typeof(counterPos) != "undefined" && counterPos != null ) {
		if ( scrollValue > counterPos.top ) {
			if ((parseInt($('#happyCustomersDiv').html()) <= 0) && (timerID < 0)) {
				timerID = setTimeout(counterBoxAnimation, 10);
			}
		}
	}

	hideRecommond ();
});

function counterBoxAnimation () {
	var value = parseInt($('#happyCustomersDiv').html());
	if (value < cntCustomer ) {
		value += 500;
		$('#happyCustomersDiv').html(value);
		clearTimeout(timerID);
		timerID = setTimeout(counterBoxAnimation, 1);
	} else {
		clearTimeout(timerID);
		$('#happyCustomersDiv').html(cntCustomer);
	}

	if ( (value / 2000) <= 11 ) {
		$('#cryptoCursDiv').html(parseInt(value / 2000));
	}

	if ( (value / 1800) <= 15 ) {
		$('#paywaysDiv').html(parseInt(value / 1800));
	}

	if ( (value / 5000) <= 5 ) {
		$('#currenciesDiv').html(parseInt(value / 5000));
	}

	if ( (value / 2000) <= 13 ) {
		$('#langsDiv').html(parseInt(value / 2000));
	}
}

function selectCurrency ( _currency ) {
	homeNormal ();
	currency = _currency;
	displayRate ();
	$("#currentSel").attr("src", "images/currency/" + _currency + ".png");
}

function selectBlockChain ( _blockChain ) {
	homeNormal ();
	blockChain = _blockChain;
	$("#blockChainSel").attr("src", "images/blockChain/" + _blockChain + ".png");
	displayRate ();
}

function displayRate () {
	var _blockChain = blockChain;
	if (_blockChain == "XBT") _blockChain = "BTC";

	document.getElementById('chainType').value = _blockChain;
	document.getElementById('currencyType').value = currency;
	document.getElementById('corverDiv').style.display = "block";
	postForm ( document.getElementById('btcRateForm'), setRate );
}

function setRate ( res ) {
	res = res.trim();
	if (!isNaN(res)) {
		if ( (currency == "JPY") && (blockChain == "XRP" || blockChain == "XLM" ) ) {
			var pos = res.indexOf(".");
			var len = res.length - pos - 1;
			if ( pos > 0 && len > 2 ) {
				res = res.substring(0, pos + 3);
			}
		}

		pos = res.indexOf(".");
		if ( pos <= 0 )
			res += ".00";
		else {
			len = res.length - pos - 1;
			if ( len == 1 )
				res += "0";
		}

		curPrice = res;
		var tabStr;
		if(pageName != "")
			tabStr = " - Crypto#1 - " + pageName;
		else
			tabStr = "Crypto#1";

		$('#priceMiddle').html( "<div class = 'priceTitle'>" + blockChain + " / " + currency + "</div>" +  getDigitalPad ( res ));
		if ( currency == "EUR" ) {
			document.title = "€" + curPrice + tabStr;
		} else if (  currency == "USD"  ) {
			document.title ="$" + curPrice + tabStr;
		} else if (  currency == "CAD"  ) {
			document.title = "$" + curPrice + " (CAD)" + tabStr;
		} else if (  currency == "GBP"  ) {
			document.title = "£" + curPrice + tabStr;
		} else if (  currency == "JPY"  ) {
			document.title = "¥" + curPrice + tabStr;
		}
	} else {
		/*document.getElementById('priceTitle').innerHTML = "";
		document.getElementById('priceBoard').innerHTML = smallFailMsg;*/
	}

	locationOrder ();
	document.getElementById('corverDiv').style.display = "none";
}

function getDigitalPad ( res ) {
	var source = "", i = 0, c = 0;

	for(i = 0; i < res.length; i++ ) {
		c = res.substring(i, i + 1);
		if ( c == "" )
			break;

		if ( i == 0 )
			source += "<img id = 'firstPriceNumber' ";
		else
			source += "<img ";

		if ( c== "0" ) {
			source += "src = 'images/Characters/00.png' class = 'digitalNumber' />"; 
		} else if ( c== "1" ) {
			source += "src = 'images/Characters/01.png' class = 'digitalNumber01' />"; 
		} else if ( c== "2" ) {
			source += "src = 'images/Characters/02.png' class = 'digitalNumber' />"; 
		} else if ( c== "3" ) {
			source += "src = 'images/Characters/03.png' class = 'digitalNumber'/>"; 
		} else if ( c== "4" ) {
			source += "src = 'images/Characters/04.png' class = 'digitalNumber'/>"; 
		} else if ( c== "5" ) {
			source += "src = 'images/Characters/05.png' class = 'digitalNumber'/>"; 
		} else if ( c== "6" ) {
			source += "src = 'images/Characters/06.png' class = 'digitalNumber'/>"; 
		} else if ( c== "7" ) {
			source += "src = 'images/Characters/07.png' class = 'digitalNumber'/>"; 
		} else if ( c== "8" ) {
			source += "src = 'images/Characters/08.png' class = 'digitalNumber'/>"; 
		} else if ( c== "9" ) {
			source += "src = 'images/Characters/09.png' class = 'digitalNumber'/>"; 
		} else if ( c== "." ) {
			source += "src = 'images/Characters/0P.png' class = 'digitalPointer'/>"; 
		}
	}

	return source;
}

function displayChart () {
	var url = "https://dwq4do82y8xi7.cloudfront.net/widgetembed/?symbol=KRAKEN%3A" + blockChain + currency + "&interval=D&symboledit=1&toolbarbg=f1f3f6&hideideas=1&studies=&theme=White&style=1&timezone=exchange";
	var attr = 'toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no,address = no';
	window.open (url, '_blank', attr);
}

function langSelect ( langType ) {
	location = "?lang=" + langType;
	language = langType;
}

function loginDivShow () {
	$('#quickSpan').html(quickLoginHTML);
}

function regDivShow () {
	$('#quickSpan').html(quickSignUpHTML);
}

function footerFacebookClick() {
	window.open("https://www.facebook.com/cryptofirst/");
}

function footerTwitterClick() {
	window.open("https://twitter.com/CryptoFirst/");	
}

function footerLinkDinClick() {
	window.open("https://www.linkedin.com/company/cryptofirst");	
}

function footerTeltegramClick() {
	window.open("https://t.me/CryptoFirst");
}

function newWindowOpen ( address ) {
	var attr = 'toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no,address = no';
	window.open (address, '_blank', attr);
}

function txtFocus ( obj ) {
	//obj.style.boxShadow = "0px 0px 10px rgba(127, 196, 228, 0.3)";
}

function signUpPopUp () {
	$("#logInPopUp").css({display:"none"});
	$("#signUpPopUp").css({display:"block"});
}

function logInPopUp () {
	$("#signUpPopUp").css({display:"none"});
	$("#logInPopUp").css({display:"block"});
}

function closePopUp () {
	$("#signUpPopUp").css({display:"none"});
	$("#logInPopUp").css({display:"none"});	
}

function showFusionTooltip ( obj, msg ) {
	var rect = obj.getBoundingClientRect ();
	$("#fusionToolTipText").text(msg);
	var width = $("#fusionTooltip").outerWidth();
	$("#fusionTooltip").css({display:"block", "margin-top":rect.bottom + 4.5, "margin-left":rect.left - width / 2 + (rect.right - rect.left) / 2});

}

function hideFusionTooltip () {
	$("#fusionTooltip").css({display:"none"});
}

function goHome () {
	location.href = "index.php";
}

function changeImg ( obj, imgPath ) {
	obj.src = imgPath;
}

function skypeContactClk () {
	location.href = "skype:CryptoFirst?chat";
}