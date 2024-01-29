<?php
	if ( isset($_POST['currency']) && trim($_POST['currency']) != "" && isset($_POST['chain']) && trim($_POST['chain']) != "" ) {
		$chain = trim($_POST['chain']);
		$currency = trim($_POST['currency']);

		$rateStr = file_get_contents('https://min-api.cryptocompare.com/data/price?fsym='.$chain.'&tsyms='.$chain.','.$currency);

		$strpos = strrpos($rateStr, ":");
		if ( $strpos > 0 ) {
			die(substr($rateStr, $strpos + 1, strlen($rateStr) - $strpos - 2));
		} else
			die("400");
	} else
		die("400");
?>