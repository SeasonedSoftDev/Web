<?php
	include_once("inc/header.php");
	include_once("inc/blogContents.php");
?>



<table class = "selDropByBox recommendDropbox" id = "recommendSelItems"><tr>
	<td class = "faceBookRecommend"></td>
	<td class = "googleBookRecommend"></td>
	<td class = "linkedinRecommend"></td>
	<td class = "twitterRecommend"></td>
	<td class = "redditRecommend"></td>
</tr></table>

<script>	pageName = "BLOG";	</script>

<div id = "bodyDiv" onmousemove = "homeNormal()">
	<div class = "sliderBack01" style = "text-align:left;">
		<img src = "images/blogSymbol.png" style = "opacity:0.5; position:absolute;">
		<table width = "100%" height = "100%" class = "blogSlider">
			<tr><td style = "font-size:45px; color:white; padding-bottom:20px;" align = "center" valign = "bottom"><?php echo $sentences['haveRead'];?></td></tr>
		</table>
	</div>

	<!--<div class = "sliderBack01" style = "padding-left:0px; padding-bottom:30px;">
		 <?php echo $sentences['haveRead'];?>
	</div>-->

	<!--<img src = "images/currency/EUR.png" class = "circleIcon02 circle21">
	<img src = "images/currency/USD.png" class = "circleIcon02 circle22">
	<img src = "images/currency/CAD.png" class = "circleIcon02 circle23">
	<img src = "images/currency/GBP.png" class = "circleIcon02 circle24">
	<img src = "images/currency/JPY.png" class = "circleIcon02 circle25">
	<img id = "hand02" src = "images/hand02.png" class = "blogBackSymbolImage" style = "width:200px; height:200px; top:520;">

	<img src = "images/blockChain/XBT.png" class = "circleIcon01 circle11">
	<img src = "images/blockChain/LTC.png" class = "circleIcon01 circle12">
	<img src = "images/blockChain/ETH.png" class = "circleIcon01 circle13">
	<img src = "images/blockChain/ETC.png" class = "circleIcon01 circle14">
	<img src = "images/blockChain/XMR.png" class = "circleIcon01 circle15">
	<img src = "images/blockChain/ZEC.png" class = "circleIcon01 circle16">
	<img src = "images/blockChain/DASH.png" class = "circleIcon01 circle17">
	<img src = "images/blockChain/XMR.png" class = "circleIcon01 circle18">
	<img src = "images/blockChain/XLM.png" class = "circleIcon01 circle19">
	<img src = "images/blockChain/REP.png" class = "circleIcon01 circle10">
	<img src = "images/blockChain/GNO.png" class = "circleIcon01 circle101">
	<img id = "hand01" src = "images/hand01.png" class = "blogBackSymbolImage" style = "width:350px; height:120px; top:1050;">-->

	<table cellspacing = "0" style = "width:100%">
		<tr>
			<td height = "50"></td>
			<td></td>
			<td width = "20%" onmouseover = "hideRecommond()" valign = "top" rowspan = "2">
				<table width = "160px" style = "margin:auto; margin-top:50px;">
					<tr><td id = "blogPeriodHeader"></td></tr>
					<tr><td class = "blogPeriodTitle">Archive</td></tr>
					<tr><td height = "15"></td></tr>
					<tr><td class = "blogPeriodList">January 2017</td></tr>
					<tr><td class = "blogPeriodList">March 2017</td></tr>
					<tr><td class = "blogPeriodList">November 2017</td></tr>
					<tr><td class = "blogPeriodList">Febrary 2018</td></tr>
					<tr><td class = "blogPeriodList">April 2018</td></tr>
					<tr><td class = "blogPeriodList">May 2018</td></tr>
					<tr><td class = "blogPeriodList">July 2018</td></tr>
				</table>
			</td>
		</tr>

		<tr>
			<td width = "10%"></td>
			<td width = "70%" valign = "top" id = "blogsPad"></td>
		</tr>

		<tr onmouseover = "hideRecommond()"><td height = "50"></td></tr>

		<tr onmouseover = "hideRecommond()">
			<td colspan = "3">
				<table width = "100%" cellspacing = "0" id = "pageNumberList"><tr>
					<td></td>
					<td align = "center" valign = "center" class = "pageMoving pageMovingStart">1</td>
					<td align = "center" valign = "center" class = "pageMoving pageMovingMiddle">2</td>
					<td align = "center" valign = "center" class = "pageMoving pageMovingMiddle">3</td>
					<td align = "center" valign = "center" class = "pageMoving pageMovingMiddle">4</td>
					<td align = "center" valign = "center" class = "pageMoving pageMovingMiddle">5</td>
					<td align = "center" valign = "center" class = "pageMoving pageMovingMiddle">6</td>
					<td></td>
				</tr></table>
			</td>
		</tr>

		<tr><td height = "30"></td></tr>
	</table>
</div>

<script>
	$("#blogMenuItem").css({color:"#7fc4e4"});
	var perPageBlogCnt = 10;
	var toListWord = "<?php echo $words['toList'];?>";

	viewBlogList (0);
	function viewBlogList ( pageNo ) {
		var i = 0;
		var pageSrc = "";

		$("#pageNumberList").css({"visibility":"visible"});

		for ( i = 0; i < perPageBlogCnt; i ++ ) {
			pageSrc += '<table width = "100%" style = "border-bottom:1px solid #f8f8f8;">';
			pageSrc += '<tr onmouseover = "hideRecommond()">';
			pageSrc += '<td class = "blogTitle" align = "center" colspan = "3">' + blogTitle[i] + '</td></tr>';
			pageSrc += '<tr onmouseover = "hideRecommond()">';
			pageSrc += '<td width = "300" rowspan = "4" align = "center"><img src = "' + blogImgPath[i] + '" class = "blogSymbolImg"></td>';
			pageSrc += '</tr>';
			pageSrc += '<tr onmouseover = "hideRecommond()">';
			
			pageSrc += '<td align = "left" width = "28px;" colspan = "2">';
			pageSrc += '<img src = "images/calendar01.png" class = "blogSubImg">&nbsp';
			pageSrc += blogDate[i];
			pageSrc += '</td>';
			pageSrc += '</td></tr>';
			pageSrc += '<tr><td class = "blogContents" align = "left" style = "padding-top:10px;" colspan = "3" onmousemove = "hideRecommond()">';
			pageSrc += blogContents[i].substring(0, 250) + "...";
			pageSrc += '</td></tr>';
			pageSrc += '<tr>';
			pageSrc += '<td width = "60" onmousemove = "hideRecommond()">';
			pageSrc += '<div id = "viewIcon01" class = "blogView" onclick = "viewBlog(' + i + ')">';
			pageSrc += '</td>';
			pageSrc += '<td>';
			pageSrc += '<div id = "recommendIcon' + i + '" class = "blogRecommend" onmouseover = "selectItemDisplay2(\'recommendIcon' + i + '\', \'recommendSelItems\')">';
			pageSrc += '</td>';
			pageSrc += '</tr>';
			pageSrc += '<tr><td style = "height:35px;"></td></tr>';
			pageSrc += '</table>';
		}

		$("#blogsPad").html(pageSrc);
	}

	function viewBlog ( id ) {
		$("#pageNumberList").css({"visibility":"hidden"});

		var pageSrc = "";
		pageSrc += '<table width = "100%">';
		pageSrc += '<tr>';
		pageSrc += '<td align = "left" width = "28px;"><img src = "images/calendar01.png" class = "blogSubImg"></td>';
		pageSrc += '<td class = "blogSubTitle" colspan = "2">' + blogDate[id] + '</td>';
		pageSrc += '</tr>';
		pageSrc += '<tr><td colspan = "2" height = "150" align = "center">';
		pageSrc += '<table style = "margin:auto;"><tr>';
		pageSrc += '<td valign = "center"><img src = "' + blogImgPath[id] + '"</td>';
		pageSrc += '<td width = "15"></td>';
		pageSrc += '<td class = "blogTitle" valign = "top">' + blogTitle[id] + '</td>';
		pageSrc += '</tr></table>';
		pageSrc += '</td></tr>';
		pageSrc += '<tr><td colspan = "2" style = "padding-top:10px; padding-bottom:25px;">';
		pageSrc += blogContents[id];
		pageSrc += '</td></tr>';
		pageSrc += '<tr><td colspan = "2">';
		pageSrc += '<table class = "replyButton" onclick = "viewBlogList(0)"><tr>';
		pageSrc += '<td width = "5" height = "30"></td>';
		pageSrc += '<td><img src = "images/reply.png" style = "width:23px; height:21px;"></td>';
		pageSrc += '<td width = "5"></td>';
		pageSrc += '<td style = "color:white; font-size:21px;">' + toListWord + '</td>';
		pageSrc += '<td width = "10"></td>';
		pageSrc += '</tr></table>';
		pageSrc += '</td></tr>';
		pageSrc += '</table>';

		$("#blogsPad").html(pageSrc);
	}
</script>

<?php
	include_once("inc/footer.php");
?>