<?php
	include_once("inc/header.php");

	$tabName = "";
	if (isset($_GET['tN']) && trim($_GET['tN']) != "") {
		$tabName = $_GET['tN'];
	}
?>

<div id = "bodyDiv" onmousemove = "homeNormal()">
	<div class = "sliderBack01">
		<table class = "worldMap">
		</table>
	</div>

	<table width = "100%"><tr><td align = "center">
		<div style = "width:912px; height:144px; margin-top:38px;">
			<table id = "privacyTab" class = "mainTab01 mainTab01_notSel" style = "margin-left:18px;"><tr><td align = "center" onclick = "selTab('privacyTab')">
				<img id = "privacyImg" src = "images/privacy.png" style = "width:60px; height:30px;">
				<div class = "mainTab01_notSel_text"><?php echo $words['privacyPlicy'];?></div>
			</td></tr></table>
			
			<div id = "tabLin01" class = "tabLine01" style = "width:150px;"></div>

			<table id = "termsTab" class = "mainTab01 mainTab01_notSel"><tr><td align = "center" onclick = "selTab('termsTab')">
				<img id = "govImg" src = "images/gov.png" style = "width:30px; height:30px;">
				<div class = "mainTab01_notSel_text"><?php echo $words['termsSales'];?></div>
			</td></tr></table>

			<div id = "tabLin02" class = "tabLine01" style = "width:150px;"></div>

			<table id = "scaleTab" class = "mainTab01 mainTab01_notSel"><tr><td align = "center" onclick = "selTab('scaleTab')">
				<img id = "scaleImg" src = "images/scale.png" style = "width:60px; height:50px;">
				<div class = "mainTab01_notSel_text"><?php echo $words['legalNotice'];?></div>
			</td></tr></table>
		</div>
	</td></tr></table>
</div>

<script>
	var tabName = "<?php echo $tabName;?>";
	if( tabName == "")
		tabName = "termsTab";

	selTab (tabName);

	function selTab ( tabName ) {
		$("#termsTab").attr("class", "mainTab01_notSel");
		$("#privacyTab").attr("class", "mainTab01_notSel");
		$("#scaleTab").attr("class", "mainTab01_notSel");

		$("#govImg").attr("src", "images/gov.png");
		$("#privacyImg").attr("src", "images/privacy.png");
		$("#scaleImg").attr("src", "images/scale.png");

		$("#govImg").css({width:"30px", height:"30px"});
		$("#privacyImg").css({width:"60px", height:"30px"});
		$("#scaleImg").css({width:"60px", height:"50px"});

		$("#privacyTab").css({"margin-left":"18px"});

		if ( tabName == "termsTab" ) {
			$("#termsTab").attr("class", "mainTab01_sel");
			$("#govImg").attr("src", "images/gov_sel.png");
			$("#govImg").css({width:"36px", height:"36px"});
			$("#tabLin01").css({width:"150px"});
			$("#tabLin02").css({width:"150px"});
		} else if ( tabName == "privacyTab" ) {
			$("#privacyTab").attr("class", "mainTab01_sel");
			$("#privacyImg").attr("src", "images/privacy_sel.png");
			$("#privacyImg").css({width:"72px", height:"36px"});
			$("#tabLin01").css({width:"150px"});
			$("#tabLin02").css({width:"168px"});
			$("#privacyTab").css({"margin-left":"0px"});
		} else if ( tabName == "scaleTab" ) {
			$("#scaleTab").attr("class", "mainTab01_sel");
			$("#scaleImg").attr("src", "images/scale_sel.png");
			$("#scaleImg").css({width:"72px", height:"60px"});
			$("#tabLin01").css({width:"168px"});
			$("#tabLin02").css({width:"150px"});
		}
	}
</script>

<?php
	include_once("inc/footer.php");
?>