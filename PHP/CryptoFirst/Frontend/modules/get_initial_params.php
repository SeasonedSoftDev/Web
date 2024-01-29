<?php
	//SET LANGUAGE
	//---------------------------------------------------------------------
	$lang = "EN";
	if(isset($_GET['lang']) && trim($_GET['lang']) != "") {
		$lang = trim($_GET['lang']);
	}

	$flagImgSrc = "images/flags/";
	switch ( $lang ) {
		case "FR":	$flagImgSrc.= "flag-fr.png";/* include_once("lang/fr.php");*/ break;
		case "AE":	$flagImgSrc.= "flag-ae.png";/* include_once("lang/ae.php");*/ break;
		case "CN":	$flagImgSrc.= "flag-cn.png";/* include_once("lang/cn.php");*/ break;
		case "DE":	$flagImgSrc.= "flag-de.png";/* include_once("lang/de.php");*/ break;
		case "ES":	$flagImgSrc.= "flag-es.png";/* include_once("lang/es.php");*/ break;
		case "ID":	$flagImgSrc.= "flag-id.png";/* include_once("lang/id.php");*/ break;
		case "IT":	$flagImgSrc.= "flag-it.png";/* include_once("lang/it.php");*/ break;
		case "JP":	$flagImgSrc.= "flag-jp.png";/* include_once("lang/jp.php");*/ break;
		case "PL":	$flagImgSrc.= "flag-pl.png";/* include_once("lang/pl.php");*/ break;
		case "PT":	$flagImgSrc.= "flag-pt.png";/* include_once("lang/pt.php");*/ break;
		case "RU":	$flagImgSrc.= "flag-ru.png";/* include_once("lang/ru.php");*/ break;
		case "IN":	$flagImgSrc.= "flag-in.png";/* include_once("lang/in.php");*/ break;
		default:	$flagImgSrc.= "flag-uk.png";/* include_once("lang/en.php");*/ break;
	}												include_once("lang/en.php");
	//---------------------------------------------------------------------

	//SET CURRENCY
	//---------------------------------------------------------------------
	$currency = "EUR";
	if(isset($_GET['cur']) && trim($_GET['cur']) != "") {
		$currency = trim($_GET['cur']);
	}

	$currencyImgSrc = "images/currency/";
	switch ( $currency ) {
		case "USD":	$currencyImgSrc.= "USD.png"; break;
		case "CAD":	$currencyImgSrc.= "CAD.png"; break;
		case "GBP":	$currencyImgSrc.= "GBP.png"; break;
		case "JPY":	$currencyImgSrc.= "JPY.png"; break;
		default:	$currencyImgSrc.= "EUR.png"; break;
	}
	//---------------------------------------------------------------------

	//SET BLOCKCHAIN
	//---------------------------------------------------------------------
	$blockChain = "XBT";
	if(isset($_GET['bk']) && trim($_GET['bk']) != "") {
		$blockChain = trim($_GET['bk']);
	}

	$blockChainImgSrc = "images/blockChain/";
	switch ( $blockChain ) {
		case "LTC":	$blockChainImgSrc.= "LTC.png"; break;
		case "ETH":	$blockChainImgSrc.= "ETH.png"; break;
		case "ETC":	$blockChainImgSrc.= "ETC.png"; break;
		case "XMR":	$blockChainImgSrc.= "XMR.png"; break;
		case "ZEC":	$blockChainImgSrc.= "ZEC.png"; break;
		case "DASH":$blockChainImgSrc.= "DASH.png";break;
		case "XRP":	$blockChainImgSrc.= "XRP.png"; break;
		case "XLM":	$blockChainImgSrc.= "XLM.png"; break;
		case "REP":	$blockChainImgSrc.= "REP.png"; break;
		case "GNO":	$blockChainImgSrc.= "GNO.png"; break;
		default:	$blockChainImgSrc.= "XBT.png"; break;
	}
	//---------------------------------------------------------------------
?>

<script type="text/javascript">
	var currency = "<?php echo $currency;?>";
	var blockChain = "<?php echo $blockChain;?>";
	var language = "<?php echo $lang;?>";
</script>