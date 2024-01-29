<?php
	include_once("inc/header.php");
	include_once("inc/contentsFAQ.php");
?>

<script>	pageName = "FAQ";	</script>

<div id = "bodyDiv" onmousemove = "homeNormal()">
	<div class = "sliderBack01">
		<table class = "chain02" cellspacing = "0">
			<tr>
				<td class = "screenText" valign = "top" align = "left">
					<?php echo $words['doYouHaveQuestions'];?>
				</td>
				<td style = "padding-top:100px;" valign = "top"></td>
				<td style = "padding-top:75px; width:200px"><img src = "images/faqCharacter01.png"></td>
			</tr>
		</table>
	</div>

	<table width = "100%"><tr><td align = "center">
		<div style = "width:518px; height:144px; margin-top:38px;">
			<table id = "howWorkTab" class = "mainTab01 mainTab01_sel" onclick = "mainTabClick('howWorkTab')"><tr><td align = "center">
				<img id = "glassImg" src = "images/glass_tab.png" style = "width:45px; height:45px;">
				<div class = "mainTab01_notSel_text"><?php echo $words['howWork'];?></div>
			</td></tr></table>

			<div id = "tabLin01" class = "tabLine01" style = "width:104px;"></div>

			<table id = "cryptoTab" class = "mainTab01 mainTab01_notSel" onclick = "mainTabClick('cryptoTab')"><tr><td align = "center">
				<img id = "chainImage" src = "images/tab-chain.png" style = "width:45px; height:45px;">
				<div class = "mainTab01_notSel_text"><?php echo $words['Cryptocurrencies'];?></div>
			</td></tr></table>
		</div>
	</td></tr></table>
</div>

<div id = "subTabFrame" style = "width:100%;"></div>

<div id = "contentFrame" style = "width:100%;"></div>

<script>
	var presentationContent = 
		'<table style = "width:100%;" class = "contentFrame">' +
			'<tr>' +
				'<td></td>' +
				'<td width = "1000px;">' +
					'<table style = "width:100%; border-bottom:1px solid #e3e3e3;">' +
						'<tr onclick = "displayContents(\'010101\')"><td id = "010101" class = "contentTitle"><?php echo $title["010101"];?></td><td align = "center" class = "initCloseBtn" width = "15"><div id = "010101_B">+</div></td></tr>' +
						'<tr><td id = "010101_C" colspan = "2"></td></tr>' +
					'</table>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr>' +
				'<td></td>' +
				'<td width = "1000px;">' +
					'<table style = "width:100%; border-bottom:1px solid #e3e3e3;">' +
						'<tr onclick = "displayContents(\'010102\')"><td id = "010102" class = "contentTitle"><?php echo $title["010102"];?></td><td align = "center" class = "initCloseBtn" width = "15"><div id = "010102_B">+</div></td></tr>' +
						'<tr><td id = "010102_C" colspan = "2"></td></tr>' +
					'</table>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr>' +
				'<td></td>' +
				'<td width = "1000px;">' +
					'<table style = "width:100%; border-bottom:1px solid #e3e3e3;">' +
						'<tr onclick = "displayContents(\'010103\')"><td id = "010103" class = "contentTitle"><?php echo $title["010103"];?></td><td align = "center" class = "initCloseBtn" width = "15"><div id = "010103_B">+</div></td></tr>' +
						'<tr><td id = "010103_C" colspan = "2"></td></tr>' +
					'</table>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr>' +
				'<td></td>' +
				'<td width = "1000px;">' +
					'<table style = "width:100%; border-bottom:1px solid #e3e3e3;">' +
						'<tr onclick = "displayContents(\'010104\')"><td id = "010104" class = "contentTitle"><?php echo $title["010104"];?></td><td align = "center" class = "initCloseBtn" width = "15"><div id = "010104_B">+</div></td></tr>' +
						'<tr><td id = "010104_C" colspan = "2"></td></tr>' +
					'</table>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr>' +
				'<td></td>' +
				'<td width = "1000px;">' +
					'<table style = "width:100%; border-bottom:1px solid #e3e3e3;">' +
						'<tr onclick = "displayContents(\'010105\')"><td id = "010105" class = "contentTitle"><?php echo $title["010105"];?></td><td align = "center" class = "initCloseBtn" width = "15"><div id = "010105_B">+</div></td></tr>' +
						'<tr><td id = "010105_C" colspan = "2"></td></tr>' +
					'</table>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr>' +
				'<td></td>' +
				'<td width = "1000px;">' +
					'<table style = "width:100%; border-bottom:1px solid #e3e3e3;">' +
						'<tr onclick = "displayContents(\'010106\')"><td id = "010106" class = "contentTitle"><?php echo $title["010106"];?></td><td align = "center" class = "initCloseBtn" width = "15"><div id = "010106_B">+</div></td></tr>' +
						'<tr><td id = "010106_C" colspan = "2"></td></tr>' +
					'</table>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr>' +
				'<td></td>' +
				'<td width = "1000px;">' +
					'<table style = "width:100%; border-bottom:1px solid #e3e3e3;">' +
						'<tr onclick = "displayContents(\'010107\')"><td id = "010107" class = "contentTitle"><?php echo $title["010107"];?></td><td align = "center" class = "initCloseBtn" width = "15"><div id = "010107_B">+</div></td></tr>' +
						'<tr><td id = "010107_C" colspan = "2"></td></tr>' +
					'</table>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr>' +
				'<td></td>' +
				'<td width = "1000px;">' +
					'<table style = "width:100%; border-bottom:1px solid #e3e3e3;">' +
						'<tr onclick = "displayContents(\'010108\')"><td id = "010108" class = "contentTitle"><?php echo $title["010108"];?></td><td align = "center" class = "initCloseBtn" width = "15"><div id = "010108_B">+</div></td></tr>' +
						'<tr><td id = "010108_C" colspan = "2"></td></tr>' +
					'</table>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr>' +
				'<td></td>' +
				'<td width = "1000px;">' +
					'<table style = "width:100%; border-bottom:1px solid #e3e3e3;">' +
						'<tr onclick = "displayContents(\'010109\')"><td id = "010109" class = "contentTitle"><?php echo $title["010109"];?></td><td align = "center" class = "initCloseBtn" width = "15"><div id = "010109_B">+</div></td></tr>' +
						'<tr><td id = "010109_C" colspan = "2"></td></tr>' +
					'</table>' +
				'</td>' +
				'<td></td>' +
			'</tr>' +

			'<tr><td height = "50"></td></tr>' +

		'</table>';

	var howWordTab =
		'<table style = "width:100%;" class = "subTabGroup">' +
			'<tr><td height = "30"></td></tr>' +
			'<tr>' +
				'<td width = "20%">&nbsp</td>' +

				'<td id = "presentationTab" onclick = "subTabClick(\'presentationTab\')" class = "subTab01 subTab01_notSel"><?php echo $words["presentation"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "buyCashTab" onclick = "subTabClick(\'buyCashTab\')" class = "subTab01 subTab01_notSel"><?php echo $words["buyCash"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "buyOnlineTab" onclick = "subTabClick(\'buyOnlineTab\')" class = "subTab01 subTab01_notSel"><?php echo $words["buyOnline"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "sellCashTab" onclick = "subTabClick(\'sellCashTab\')" class = "subTab01 subTab01_notSel"><?php echo $words["sellingCash"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "sellOnTab" onclick = "subTabClick(\'sellOnTab\')" class = "subTab01 subTab01_notSel"><?php echo $words["sellingOnline"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "partnerTab" onclick = "subTabClick(\'partnerTab\')" class = "subTab01 subTab01_notSel"><?php echo $words["partnership"];?></td>' +
				'<td width = "10"></td>' +

				'<td width = "20%">&nbsp</td>' +
			'</tr>' +
			'<tr><td height = "20">&nbsp</td></tr>' +
		'</table>';

	var cryptoTab =
		'<table style = "width:100%;" class = "subTabGroup">' +
			'<tr><td height = "30"></td></tr>' +
			'<tr>' +
				'<td width = "5%">&nbsp</td>' +

				'<td id = "inGeneralTab" onclick = "subTabClick(\'inGeneralTab\')" class = "subTab01 subTab01_notSel"><?php echo $words["inGeneral"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "XBT_TAB" onclick = "subTabClick(\'XBT_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["XBT"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "LTC_TAB" onclick = "subTabClick(\'LTC_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["LTC"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "ETH_TAB" onclick = "subTabClick(\'ETH_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["ETH"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "ETC_TAB" onclick = "subTabClick(\'ETC_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["ETC"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "XMR_TAB" onclick = "subTabClick(\'XMR_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["XMR"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "ZEC_TAB" onclick = "subTabClick(\'ZEC_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["ZEC"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "DASH_TAB" onclick = "subTabClick(\'DASH_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["DASH"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "XRP_TAB" onclick = "subTabClick(\'XRP_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["XRP"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "XLM_TAB" onclick = "subTabClick(\'XLM_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["XLM"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "REP_TAB" onclick = "subTabClick(\'REP_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["REP"];?></td>' +
				'<td width = "10"></td>' +

				'<td id = "GNO_TAB" onclick = "subTabClick(\'GNO_TAB\')" class = "subTab01 subTab01_notSel"><?php echo $words["GNO"];?></td>' +
				'<td width = "10"></td>' +

				'<td width = "5%">&nbsp</td>' +
			'</tr>' +
			'<tr><td height = "20">&nbsp</td></tr>' +
		'</table>';
</script>

<?php
	include_once("inc/footer.php");
?>

<script>
	function displayContents ( id ) {
		if ($("#" + id + "_C").html() == "" ) {
			$("#" + id + "_C").html( contents[id] );
			$("#" + id + "_C").attr("class", "contentCntent");
			$("#" + id + "_B").attr("class", "rotatedCloseBtn");
		} else {
			$("#" + id + "_C").html( "" );
			$("#" + id + "_C").attr("class", "contentBlank");
			$("#" + id + "_B").attr("class", "initCloseBtn");
		}
	}

	function subTabClick ( tabName ) {
		$("#presentationTab").attr("class", "subTab01 subTab01_notSel");
		$("#buyCashTab").attr("class", "subTab01 subTab01_notSel");
		$("#buyOnlineTab").attr("class", "subTab01 subTab01_notSel");
		$("#sellCashTab").attr("class", "subTab01 subTab01_notSel");
		$("#sellOnTab").attr("class", "subTab01 subTab01_notSel");
		$("#partnerTab").attr("class", "subTab01 subTab01_notSel");

		$("#inGeneralTab").attr("class", "subTab01 subTab01_notSel");
		$("#XBT_TAB").attr("class", "subTab01 subTab01_notSel");
		$("#LTC_TAB").attr("class", "subTab01 subTab01_notSel");
		$("#ETH_TAB").attr("class", "subTab01 subTab01_notSel");
		$("#ETC_TAB").attr("class", "subTab01 subTab01_notSel");
		$("#XLM_TAB").attr("class", "subTab01 subTab01_notSel");
		$("#ZEC_TAB").attr("class", "subTab01 subTab01_notSel");
		$("#DASH_TAB").attr("class", "subTab01 subTab01_notSel");
		$("#XRP_TAB").attr("class", "subTab01 subTab01_notSel");
		$("#XMR_TAB").attr("class", "subTab01 subTab01_notSel");
		$("#REP_TAB").attr("class", "subTab01 subTab01_notSel");
		$("#GNO_TAB").attr("class", "subTab01 subTab01_notSel");

		$("#" + tabName).attr("class", "subTab01 subTab01_sel");

		if ( tabName == "presentationTab" ) {
			$("#contentFrame").html (presentationContent);
		} else {
			$("#contentFrame").html ("");
		}

		locationOrder ();
	}

	$("#faqMenuItem").css({color:"#7fc4e4"});

	mainTabClick ( 'howWorkTab' );

	function mainTabClick ( tabName ) {
		if ( $("#" + tabName).attr("class") == "mainTab01_sel" )
			return;

		if ( tabName == "howWorkTab" ) {
			$("#glassImg").css({width:"54px", height:"54px"});
			$("#chainImage").css({width:"45px", height:"45px"});
			$("#glassImg").attr("src", "images/glass_tab-white.png");
			$("#chainImage").attr("src", "images/tab-chain.png");
			$("#howWorkTab").attr("class", "mainTab01_sel");
			$("#cryptoTab").attr("class", "mainTab01_notSel");
			$("#howWorkTab").css({"margin-left":"0px"});

			$("#subTabFrame").html(howWordTab);
			subTabClick ("presentationTab");
		} else if ( tabName == "cryptoTab" ) {
			$("#chainImage").css({width:"54px", height:"54px"});
			$("#glassImg").css({width:"45px", height:"45px"});
			$("#chainImage").attr("src", "images/tab-chain-white.png");
			$("#glassImg").attr("src", "images/glass_tab.png");
			$("#howWorkTab").attr("class", "mainTab01_notSel");
			$("#cryptoTab").attr("class", "mainTab01_sel");
			$("#howWorkTab").css({"margin-left":"18px"});

			$("#subTabFrame").html(cryptoTab);
			subTabClick ("inGeneralTab");
		}
	}
</script>