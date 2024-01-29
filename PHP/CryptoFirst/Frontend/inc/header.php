<?php include_once("modules/get_initial_params.php");?>

<html>
	<head>
		<title>Crypto#1</title>
		<meta charset="UTF-8" />
		<link rel="icon" href="images/icon.png" />
		<link href='css/main.css' rel='stylesheet' type='text/css'>
		<link href='css/header.css' rel='stylesheet' type='text/css'>
		<link href='css/homeBody.css' rel='stylesheet' type='text/css'>
		<link href='css/subBody.css' rel='stylesheet' type='text/css'>
		<link href='css/footer.css' rel='stylesheet' type='text/css'>

		<script src = "js/jquery-3.2.1-min.js"></script>
		<script src = "js/ajax.js"></script>
		<script src = "js/actions.js"></script>
	</head>

	<body>
		<script>
			var bkPriceMsg = "<?php echo $words['blockChainPrice'];?>";
		</script>

		<div id = "corverDiv" class = "corverDiv"></div>

		<div id = "fusionTooltip" class = "fusionTooltip">
			<table cellspacing = "0">
				<tr><td align = "center" style = "margin:0px; padding:0px;">
					<div class= "fusionTopTriangle"></div>
				</td></tr>
				<tr><td style = "margin:0px; padding:0px;">
					<div id = "fusionToolTipText" class = "fusionToolTipText"></div>
				</td></tr>
			</table>
		</div>

		<div id = "signUpPopUp" class = "popUpDiv">
			<table width = "100%" height = "100%">
				<tr><td height = "20%"></td></tr>
				<tr><td align = "center" valign = "top">
					<table class ="popUpkWindow">
						<tr>
							<td class ="subWndLeftElement" valign = "center"><?php echo $words["signUp"];?></td>
							<td align = "right" valign = "top" height = "60"><div class = "closeButton01" onclick = "closePopUp()"></td>
						</tr>
						<tr><td colspan ="2" class ="subWndLeftElement"><input type ="text" onfocus="txtFocus(this)" class ="subWndLargeInput" placeholder ="<?php echo $words["userName"];?>"></td></tr>
						<tr><td colspan ="2" class ="subWndLeftElement"><input type ="text" class ="subWndLargeInput" placeholder ="<?php echo $words["email"];?>"></td></tr>
						<tr>
							<td class ="subWndLeftElement"><input type ="password" class ="subWndSmallInput" placeholder ="<?php echo $words["password"];?>"></td>
							<td class ="subWndRightElement"><input type ="password" class ="subWndSmallInput" placeholder ="<?php echo $words["conPass"];?>"></td>
						</tr>
						<tr>
							<td style = "padding-left:16px;" colspan = "2" valign = "center">
								<input type ="checkbox"><small class ="subWndNoteText"><?php echo $sentences["signUpWarning2"];?></small>
							</td>
						</tr>
						<tr>
							<td class ="subWndLeftElement">
								<span class ="subWndButton subWndButton02"><?php echo $words["register"];?></span>
							</td>
							<td align = "right" style = "padding-right:22px;">
								<a class = "linkString" onclick = "logInPopUp()"><?php echo $sentences['loginHere'];?>&nbsp&#9656</a>
							</td>
						</tr>
						<tr><td class ="subWndBlankDown"></td></tr>
					</table>
				</td></tr>
				<tr><td></td></tr>
			</table>
		</div>

		<div id = "logInPopUp" class = "popUpDiv">
			<table width = "100%" height = "100%">
				<tr><td height = "20%"></td></tr>
				<tr><td align = "center" valign = "top">
					<table class ="popUpkWindow">
						<tr>
							<td class ="subWndLeftElement" valign = "center"><?php echo $words["logIn"];?></td>
							<td align = "right" valign = "top" height = "60"><div class = "closeButton01" onclick = "closePopUp()"></td>
						</tr>
						<tr><td colspan = "2" class = "subWndLeftElement"><input type = "text" style = "width:426px;" placeholder = "<?php echo $words["userName"];?>"></td></tr>
						<tr><td colspan = "2" class = "subWndLeftElement"><input type = "password" style = "width:426px;" placeholder = "<?php echo $words["password"];?>"></td></tr>
						<tr>
							<td style = "padding-left:16px;">
								<input type = "checkbox"><small class = "subWndNoteText"><?php echo $sentences["rememberMe"];?></small><br>
							</td>
							<td align = "right" valign = "bottom">
								<div  class = "subWndActiveText" style = "margin-top:8px; margin-right:19px;"><?php echo $sentences["forgetPassword"];?></div>
							</td>
						</tr>
						<tr>
							<td class = "subWndLeftElement" valign = "bottom">
								<div class = "subWndButton subWndButton02" style = "width:60px; margin-right:19px;"><?php echo $words["logIn"];?></div>
							</td>
							<td align = "right">
								<div class = "linkString" onclick = "signUpPopUp()" style = "margin-right:19px;"><?php echo $sentences['signUphere'];?>&nbsp&#9656</div>
							</td>
						</tr>
						<tr><td class = "subWndBlankDown"></td></tr>
					</table>
				</td></tr>
				<tr><td></td></tr>
			</table>
		</div>

		<form id = "btcRateForm" method = "post" action = "modules/getBtcRate.php" style = "position:fixed; z-index:0;">
			<input type = "hidden" id = "chainType" name = "chain">
			<input type = "hidden" id = "currencyType" name = "currency">
		</form>

		<div class = "selDropDownBox" id = "flagSelItems">
			<div class = "selItem" onclick = "langSelect('UK')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-uk.png"/></div>
				<div class = "selItemText"><?php echo $words['en'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('FR')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-fr.png"/></div>
				<div class = "selItemText"><?php echo $words['fr'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('ES')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-es.png"/></div>
				<div class = "selItemText"><?php echo $words['es'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('DE')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-de.png"/></div>
				<div class = "selItemText"><?php echo $words['de'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('IT')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-it.png"/></div>
				<div class = "selItemText"><?php echo $words['it'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('PT')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-pt.png"/></div>
				<div class = "selItemText"><?php echo $words['pt'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('PL')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-pl.png"/></div>
				<div class = "selItemText"><?php echo $words['pl'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('RU')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-ru.png"/></div>
				<div class = "selItemText"><?php echo $words['ru'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('JP')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-jp.png"/></div>
				<div class = "selItemText"><?php echo $words['jp'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('CN')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-cn.png"/></div>
				<div class = "selItemText"><?php echo $words['cn'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('ID')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-id.png"/></div>
				<div class = "selItemText"><?php echo $words['id'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('IN')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-in.png"/></div>
				<div class = "selItemText"><?php echo $words['in'];?></div>
			</div>
			<div class = "selItem" onclick = "langSelect('AE')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/flags/flag-ae.png"/></div>
				<div class = "selItemText"><?php echo $words['ae'];?></div>
			</div>
		</div>

		<div class = "selDropDownBox" id = "currentSelItems">
			<div class = "selItem" onclick = "selectCurrency('EUR')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/currency/EUR.png"/></div>
				<div class = "selItemText"><?php echo $words['EUR'];?></div>
			</div>
			<div class = "selItem" onclick = "selectCurrency('USD')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/currency/USD.png"/></div>
				<div class = "selItemText"><?php echo $words['USD'];?></div>
			</div>
			<div class = "selItem" onclick = "selectCurrency('CAD')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/currency/CAD.png"/></div>
				<div class = "selItemText"><?php echo $words['CAD'];?></div>
			</div>
			<div class = "selItem" onclick = "selectCurrency('GBP')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/currency/GBP.png"/></div>
				<div class = "selItemText"><?php echo $words['GBP'];?></div>
			</div>
			<div class = "selItem" onclick = "selectCurrency('JPY')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/currency/JPY.png"/></div>
				<div class = "selItemText"><?php echo $words['JPY'];?></div>
			</div>
		</div>

		<div class = "selDropDownBox" id = "blockChainSelItems">
			<div class = "selItem" onclick = "selectBlockChain('XBT')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/XBT.png"/></div>
				<div class = "selItemText"><?php echo $words['XBT'];?></div>
			</div>
			<div class = "selItem" onclick = "selectBlockChain('LTC')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/LTC.png"/></div>
				<div class = "selItemText"><?php echo $words['LTC'];?></div>
			</div>
			<div class = "selItem" onclick = "selectBlockChain('ETH')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/ETH.png"/></div>
				<div class = "selItemText"><?php echo $words['ETH'];?></div>
			</div>
			<div class = "selItem" onclick = "selectBlockChain('ETC')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/ETC.png"/></div>
				<div class = "selItemText"><?php echo $words['ETC'];?></div>
			</div>
			<div class = "selItem" onclick = "selectBlockChain('XMR')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/XMR.png"/></div>
				<div class = "selItemText"><?php echo $words['XMR'];?></div>
			</div>
			<div class = "selItem" onclick = "selectBlockChain('ZEC')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/ZEC.png"/></div>
				<div class = "selItemText"><?php echo $words['ZEC'];?></div>
			</div>
			<div class = "selItem" onclick = "selectBlockChain('DASH')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/DASH.png"/></div>
				<div class = "selItemText"><?php echo $words['DASH'];?></div>
			</div>
			<div class = "selItem" onclick = "selectBlockChain('XRP')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/XRP.png"/></div>
				<div class = "selItemText"><?php echo $words['XRP'];?></div>
			</div>
			<div class = "selItem" onclick = "selectBlockChain('XLM')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/XLM.png"/></div>
				<div class = "selItemText"><?php echo $words['XLM'];?></div>
			</div>
			<div class = "selItem" onclick = "selectBlockChain('REP')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/REP.png"/></div>
				<div class = "selItemText"><?php echo $words['REP'];?></div>
			</div>
			<div class = "selItem" onclick = "selectBlockChain('GNO')">
				<div class = "selItemIcon"><img style = "width:100%; height:100%;" src = "images/blockchain/GNO.png"/></div>
				<div class = "selItemText"><?php echo $words['GNO'];?></div>
			</div>
		</div>

		<div class = "header">
			<div class = "logo" id = "logo"><img src = "images/logo.png" style = "cursor:pointer;" onclick = "gotoPage('index.php')"></div>

			<div class = "select" id = "select">
				<img id = "langSel" class = "selMainItem" src = "<?php echo $flagImgSrc;?>" onmouseover = "selectItemDisplay('langSel', 'flagSelItems')">
				<img id = "currentSel" class = "selMainItem" src = "<?php echo $currencyImgSrc;?>" onmouseover = "selectItemDisplay('currentSel', 'currentSelItems')">
				<img id = "blockChainSel" class = "selMainItem" src = "<?php echo $blockChainImgSrc;?>" onmouseover = "selectItemDisplay('blockChainSel', 'blockChainSelItems')">
			</div>

			<table class = "pricePad" id = "pricePad" cellspacing = "0"><tr>
				<td class = "priceLeft"></td>
				<td class = "priceMiddle" id = "priceMiddle" valign = "top" align = "center" onclick = "displayChart()"></td>
				<td class = "priceRight"></td>
			</tr></table>

			<div class = "menu" id = "menu">
				<table width = "100%">
					<tr><td align = "right">
						<table><tr>
							<td align = "right" class = "UpMenuItem">
								<div class="animated-button victoria-two" onclick = "logInPopUp()"><?php echo $words['logIn']?></div>
							</td>
							<td align = "right" class = "UpMenuItem">
								<div class="animated-button victoria-two" onclick = "signUpPopUp()"><?php echo $words['signUp'];?></div>
							</td>
						</tr></table>
					</td></tr>

					<tr><td align = "right">
						<table style = "margin-right:21px; margin-top:15px;"><tr>
							<td class = "downMenuItem" onclick = "gotoPage('buy.php')"><?php echo $words['buy']?></td>
							<td class = "downMenuItem"><?php echo $words['sell']?></td>
							<td id = "faqMenuItem" onclick = "gotoPage('faq.php')" class = "downMenuItem"><?php echo $words['faq']?></td>
							<td id = "blogMenuItem" onclick = "gotoPage('blog.php')" class = "downMenuItem"><?php echo $words['blog']?></td>
							<td id = "aboutUSItem" onclick = "gotoPage('aboutUS.php')" class = "downMenuItem"><?php echo $words['aboutUs']?></td>
							<td id = "contactMenuItem" onclick = "gotoPage('contact.php')" class = "downMenuItem"><?php echo $words['contact']?></td>
						</tr></table>
					</td></tr>
				</table>
			</div>
		</div>

		<div class = "UpButtonGroup" id = "UpButtonGroup" onclick = "upScreen()">
			<image src = "images/upCharacter.png" />
		</div>