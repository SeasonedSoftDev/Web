<?php
	include_once("inc/header.php");
?>

<script>
	pageName = "CONTACT";
	$("#contactMenuItem").css({color:"#7fc4e4"});
</script>

<script src='https://www.google.com/recaptcha/api.js'></script>

<div id = "bodyDiv" onmousemove = "homeNormal()">
	<div class = "sliderBack01">
		<table class = "worldMap">
			<tr>
				<td valign = "top" align = "left" class = "screenText"><?php echo $sentences['contactUsBy'];?></td>
				<td align = "center" valign = "bottom">
					<img src = "images/chain-02.png" style = "padding-bottom:20px; opacity:0.5;">
				</td>
			</tr>
		</table>
	</div>

	<table id = "recaptchaGroup" class = "captchaNoneView" cellspacing = "0"><tr>
		<td><div class="g-recaptcha" data-sitekey="6LcTUgsUAAAAAJBxZXni71M96TRIcLifr5VQCZ_B"></div></td>
	</tr></table>

	<table width = "100%"><tr><td align = "center">
		<div style = "width:1056px; height:144px; margin-top:38px;">
			<table id = "phoneTab" class = "mainTab01 mainTab01_sel"><tr><td align = "center" onclick = "mainTabClick('phoneTab')">
				<img src = "images/phone-tab.png" class = "tab01_phone">
				<div class = "mainTab01_notSel_text"><?php echo $words['phone02'];?></div>
			</td></tr></table>

			<div id = "tabLin01" class = "tabLine01"></div>

			<table id = "mailTab" class = "mainTab01 mainTab01_notSel"><tr><td align = "center" onclick = "mainTabClick('mailTab')">
				<img src = "images/mail-tab.png" class = "tab01_mail">
				<div class = "mainTab01_notSel_text"><?php echo $words['mail'];?></div>
			</td></tr></table>

			<div id = "tabLin02" class = "tabLine01"></div>

			<table id = "contactTab" class = "mainTab01 mainTab01_notSel" onclick = "mainTabClick('contactTab')"><tr><td align = "center">
				<img src = "images/pen-tab.png" class = "tab01_contact">
				<div class = "mainTab01_notSel_text"><?php echo $words['contactFrom'];?></div>
			</td></tr></table>

			<div id = "tabLin03" class = "tabLine01"></div>

			<table id = "liveTab" class = "mainTab01 mainTab01_notSel" onclick = "mainTabClick('liveTab')"><tr><td align = "center">
				<img src = "images/live-tab.png" class = "tab01_live">
				<div class = "mainTab01_notSel_text"><?php echo $words['liveSupport'];?></div>
			</td></tr></table>
		</div>
	</td></tr></table>

	<div class = "clientPad" id = "clientPad"></div>

	<table style = "width:100%;"><tr><td align = "center">
		<img src = 'images/separaterShadow.png'>
	</td></tr></table>

	<table style = "width:100%; height:150px;"><tr><td valign = "center" align = "center" class = "subDivmainText01">
		<?php echo $sentences['answer77'];?>
	</td></tr></table>
</div>

<?php
	include_once("inc/footer.php");
?>

<script>
	var phoneTab = 
		'<table class = "clientPad01">' +
			"<tr><td height = '35' class = 'clientUpPadding01'></td></tr>" +
			"<tr>" +
				"<td height = '130'></td>" +
				"<td width = '131' align = 'center'><img src = 'images/twitter main icon.png' class = 'mainTabIcon01'></td>" +
				"<td width = '40'></td>" +
				"<td width = '131' align = 'center'><img src = 'images/ring main icon.png' class = 'mainTabIcon01'></td>" +
				"<td width = '40'></td>" +
				"<td width = '131' align = 'center'><img src = 'images/msg main icon.png' class = 'mainTabIcon01'></td>" +
				"<td width = '40'></td>" +
				"<td width = '131' align = 'center'><img src = 'images/skype main icon.png' class = 'mainTabIcon01' onclick = 'skypeContactClk()'></td>" +
				"<td></td>" +
			"<tr>" +
				"<td></td>" +
				"<td class = 'mainLabel01'><?php echo $words['telegram'];?></td>" +
				"<td></td>" +
				"<td class = 'mainLabel01'><?php echo $words['ring'];?></td>" +
				"<td></td>" +
				"<td class = 'mainLabel01'><?php echo $words['signal'];?></td>" +
				"<td></td>" +
				"<td class = 'mainLabel01'><?php echo $words['skype'];?></td>" +
				"<td></td>" +
			"</td></tr>" +
			"</tr>" +
			"<tr><td height = '35'></td></tr>" +
			"<tr>" +
				"<td></td>" +
				'<td colspan = "7" align = "center" valign = "center" class = "subDivmainText01"><?php echo $words["cryptofirstMail"];?></td>' +
				"<td></td>" +
			"</tr>" +
			"<tr><td height = '35'></td></tr>" +
		"</table>";

	var mailTab =
		'<table style = "width:100%;">' +
			"<tr><td height = '35' class = 'clientUpPadding01'></td></tr>" +
			'<tr>' +
				'<td></td>' +

				'<td class = "mainTabGroup02" align = "center">' +
					'<div class = "mainTabIcon02">' +
						'<div class = "mainTabIcon02_1" style = "background:url(\'images/buySelIcon01.png\')">' +
							'<div class = "mainTabGoast01"></div>' +
						'</div>' +
					'</div>' +
					'<div class = "mainLabel02"><?php echo $words["buySell"];?></div>' +
					'<div class = "mainLabel01" style = "padding-right:20px; height:50px;"><?php echo $sentences["transaction01"];?></div>' +
					'<div class = "mainLabel03"><a href = "mailto:<?php echo $sentences["buySellEmailAddr"];?>" class = "emailLined02"><?php echo $sentences["buySellEmailAddr"];?></div></div>' +
				'</td>' +

				'<td class = "mainTabGroup02" align = "center">' +
					'<div class = "mainTabIcon02">' +
						'<div class = "mainTabIcon02_1" style = "background:url(\'images/infoIcon01.png\')">' +
							'<div class = "mainTabGoast01"></div>' +
						'</div>' +
					'</div>' +
					'<div class = "mainLabel02"><?php echo $words["generalInfo"];?></div>' +
					'<div class = "mainLabel01" style = "padding-left:20px; padding-right:20px; height:50px;"><?php echo $sentences["info01"];?></div>' +
					'<div class = "mainLabel03"><a href = "mailto:<?php echo $sentences["emailAddress"];?>" class = "emailLined02"><?php echo $sentences["emailAddress"];?></div></div>' +				
				'</td>' +
				
				'<td class = "mainTabGroup02" align = "center" >' +
					'<div class = "mainTabIcon02">' +
						'<div class = "mainTabIcon02_1" style = "background:url(\'images/serviceSymbol01.png\')">' +
							'<div class = "mainTabGoast01"></div>' +
						'</div>' +
					'</div>' +
					'<div class = "mainLabel02"><?php echo $words["afterSalesService"];?></div>' +
					'<div class = "mainLabel01" style = "padding-left:20px; padding-right:20px; height:50px;"><?php echo $sentences["afterService01"];?></div>' +
					'<div class = "mainLabel03"><a href = "mailto:<?php echo $sentences["afterSevAddr"];?>" class = "emailLined02"><?php echo $sentences["afterSevAddr"];?></div></div>' +
				'</td>' +

				'<td></td>' +
			'</tr>' +

		'</table>';

	var contactTab =
		'<table style = "width:100%;">' +
			"<tr><td height = '35' class = 'clientUpPadding01'></td></tr>" +
			'<tr>' +
				'<td id = "blankLeft"></td>' +
				'<td><?php echo $words["name"];?></td>' +
				'<td style = "padding-left:30px;"><?php echo $words["service"];?></td>' +
				'<td></td>' +
			'</tr>' +
			'<tr>' +
				'<td></td>' +
				'<td width = "380"><input type = "text" style = "width:350px;"></td>' +
				'<td width = "380" align = "right">' +
					'<select style = "width:350px;">' +
						'<option><?php echo $words["buySell"];?></option>' +
						'<option><?php echo $words["generalInfo"];?></option>' +
						'<option><?php echo $words["sav"];?></option>' +
					'</select>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr><td height = "10"></td></tr>' +

			'<tr>' +
				'<td></td>' +
				'<td><?php echo $words["emailAddr"];?></td>' +
				'<td style = "padding-left:30px;"><?php echo $sentences["haveKnownCrypto1"];?></td>' +
				'<td></td>' +
			'</tr>' +
			'<tr>' +
				'<td></td>' +
				'<td><input type = "text" style = "width:350px;"></td>' +
				'<td style = "padding-left:30px;">' +
					'<select style = "width:350px;">' +
					'</select>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr><td height = "10"></td></tr>' +

			'<tr>' +
				'<td></td>' +
				'<td><?php echo $words["subject"];?></td>' +
			'</tr>' +
			'<tr>' +
				'<td></td>' +
				'<td colspan = "2"><input type = "text" style = "width:100%;"></td>' +
				'<td></td>' +
			'</tr>' +

			'<tr><td height = "10"></td></tr>' +
			'<tr>' +
				'<td></td>' +
				'<td><?php echo $words["message"];?></td>' +
			'</tr>' +
			'<tr>' +
				'<td></td>' +
				'<td colspan = "2">' +
					'<textarea type="text" name="message" style = "width:760px; max-width:760px;  height:135px; max-height:135px;"></textarea>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr><td height = "10"></td></tr>' +

			'<tr>' +
			'<td></td>' +
			'<td id = "captchaTD" align = "center" height = "82"></td>' +
			'<td align = "center">' +
				'<div class = "animated-button-client victoria-four" style = "width:150px; font-weight:bold; margin-top:20px;"><?php echo $words["submit"];?></div>' +
			'</td>' +
			'</tr>' +
		'</table>';

	var liveTab =
		'<table width = "100%" height = "250px">' +
			"<tr><td height = '35' class = 'clientUpPadding01'></td></tr>" +
			'<tr><td valign = "bottom" align = "center" class = "subDivmainText01" style = "padding-bottom:75px;">' +
			'<?php echo $sentences["allrightButtom"];?>&nbsp&nbsp&nbsp<img src = "images/faceIcon01.png" style = "width:40px; height:40px;">' +
			'</td></tr>' +
			'<tr><td height = "35"></td></tr>' +
		'</table>';

	mainTabClick ( "phoneTab" );

	function mainTabClick ( tabName ) {
		if ( $("#" + tabName).attr("class") == "mainTab01_sel" )
			return;

		$("#phoneTab").attr("class", "mainTab01_notSel");
		$("#mailTab").attr("class", "mainTab01_notSel");
		$("#contactTab").attr("class", "mainTab01_notSel");
		$("#liveTab").attr("class", "mainTab01_notSel");

		$(".tab01_phone").attr("src", "images/phone-tab.png");
		$(".tab01_mail").attr("src", "images/mail-tab.png");
		$(".tab01_contact").attr("src", "images/pen-tab.png");
		$(".tab01_live").attr("src", "images/live-tab.png");

		$("#recaptchaGroup").attr("class", "captchaNoneView");

		if ( tabName == "phoneTab" ) {
			$(".tab01_phone").attr("src", "images/phone-white.png");

			$("#phoneTab").css({"margin-left":"0px"});
			$("#tabLin01").css({"width":"82px"});
			$("#tabLin02").css({"width":"100px"});
			$("#tabLin03").css({"width":"100px"});

			$("#clientPad").html(phoneTab);
		} else if ( tabName == "mailTab" ) {
			$(".tab01_mail").attr("src", "images/mail-white.png");

			$("#phoneTab").css({"margin-left":"18px"});
			$("#tabLin01").css({"width":"82px"});
			$("#tabLin02").css({"width":"82px"});
			$("#tabLin03").css({"width":"100px"});

			$("#clientPad").html(mailTab);
		} else if ( tabName == "contactTab" ) {
			$(".tab01_contact").attr("src", "images/pen-white.png");

			$("#phoneTab").css({"margin-left":"18px"});
			$("#tabLin01").css({"width":"100px"});
			$("#tabLin02").css({"width":"82px"});
			$("#tabLin03").css({"width":"82px"});

			$("#clientPad").html(contactTab);
			$("#recaptchaGroup").attr("class", "captchaView");
			var blankLeft = $('#blankLeft').innerWidth();
			$("#recaptchaGroup").css({left:blankLeft + 45, top:$('#captchaTD').offset().top - 362});
		} else if ( tabName == "liveTab" ) {
			$(".tab01_live").attr("src", "images/live-white.png");

			$("#phoneTab").css({"margin-left":"18px"});
			$("#tabLin01").css({"width":"100px"});
			$("#tabLin02").css({"width":"100px"});
			$("#tabLin03").css({"width":"82px"});

			$("#clientPad").html(liveTab);
		}

		$("#" + tabName).attr("class", "mainTab01_sel");
	}
</script>