		
		<div class = "footer">
			<table class = "upFooter" cellspacing = "0">
				<tr><td height = "30" colspan = "5"></td></tr>
				<tr>
					<td width = "2%"></td>
					<td width = "32%" valign="top">
						<table class = "trollBox" style = "margin-top:8px; border-radius:5px;">
							<tr onclick = "trollBoxSpread()">
								<td width = "25" valign = "center" align = "right">
									<img src = "images/line3Icon.png">
								</td>
								<td valign = "center">
									<?php echo $sentences['welcomeTrollbox'];?>
								</td>
								<td width = "20" valign = "center">
									<img src = "images/human.png" style = "width:20px; height:20px;">
								</td>
								<td align = "center">13</td>
							</tr>
							<tr><td id = "trollBoxPad" colspan = "4"></td></tr>
							<tr><td id = "trollBoxFooter" colspan = "4"></td></tr>
						</table>
					</td>
					<td width = "32%" valign = "top">
						<table style = "width:100%; text-align:center; margin-top:8px;"><tr>
							<td></td>
							<td width = "40px;"><img src = "images/facbookIcon.png" class = "footerCenterUpButton" onclick = "footerFacebookClick();" onmousemove = "showFusionTooltip(this, 'Facebook')" onmouseout = "hideFusionTooltip();"></td>
							<td width = "15"></td>
							<td width = "40px;"><img src = "images/twitterIcon.png" class = "footerCenterUpButton" onclick = "footerTwitterClick();" onmouseout = "hideFusionTooltip();" onmousemove = "showFusionTooltip(this, 'Twitter')"></td>
							<td width = "15"></td>
							<td width = "40px;"><img src = "images/inIcon.png" class = "footerCenterUpButton" onclick = "footerLinkDinClick();" onmouseout = "hideFusionTooltip();" onmousemove = "showFusionTooltip(this, 'Linkedin')"></td>
							<td></td>
						</tr></table>

						<!--<table style = "width:100%; height:98px;">
							<tr><td align = "right" width = "50%" style = "padding-right:10px;">
								<table class = "footerButton01" title = "<?php echo $sentences['likeTitle'];?>"><tr>
									<td width = "2"></td>
									<td><img src = "images/like01.png" style = "width:10px; height:10px;"></td>
									<td style = "color:white; font-size:14px; padding-left:5px;" onclick = "newWindowOpen('https://www.facebook.com/cryptofirst/');"><?php echo $words['like'];?></td>
									<td width = "2"></td>
								</tr></table>
							</td>

							<td align = "left" width = "50%">
								<table class = "footerButton01"><tr>
									<td width = "2"></td>
									<td style = "color:white; font-size:14px;"  onclick = "newWindowOpen('https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/cryptofirst/&display=popup&ref=plugin&src=like&kid_directed_site=0');"><?php echo $words['share'];?></td>
									<td width = "2"></td>
								</tr></table>
							</td></tr>
						</table>-->
						<iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Fcryptofirst%2F&width=125&layout=button&action=like&show_faces=false&share=true&height=65&appId" width="125" height="65" style="border:none;overflow:hidden; margin-top:45px; margin-left:210px;" scrolling="no" frameborder="0" allowTransparency="true"></iframe>

						<table style = "width:100%; text-align:center;"><tr>
							<td align = "right"><img src = "images/downloadAppStoreIcon.png" style = "width:150px; height:45px;"></td>
							<td width = "15"></td>
							<td align = "left"><img src = "images/googlePlayButton.png" style = "width:150px; height:45px;"></td>
						</table>
					</td>
					<td width = "32%" valign = "top" align = "center">
						<table height = "100%">
							<tr><td colspan = "2" align = "center" valign = "top" class = "footerContactTitle" valign = "top"><?php echo $words['contact2'];?></td></tr>
							<tr>
								<td class = "footerContactContent" align = "right"><img src = "images/spin.png" style = "width:18px; height:24px;">&nbsp&nbsp&nbsp&nbsp</td>
								<td class = "footerContactContent" align = "left"><?php echo $sentences['addressValue'];?></td>
							</tr>
							<tr>
								<td class = "footerContactContent" align = "right" valign = "center"><img src = "images/mailBox.png" style = "width:20px; height:15px;">&nbsp&nbsp&nbsp&nbsp</td>
								<td class = "footerContactContent" align = "left">
									<a href="mailto:info@cryptofirst.com" class = "emailLined">
										<?php echo $sentences['emailAddress'];?>
									</a>
								</td>
							</tr>
							<tr>
								<td class = "footerContactContent" align = "right"><img src = "images/phone.png" style = "width:20px; height:30px;">&nbsp&nbsp&nbsp&nbsp</td>
								<td class = "footerContactContent" align = "left">
									<img src = "images/telegram_add.png" class = "footerAddSocialButton" onclick = "footerTeltegramClick()">
									&nbsp&nbsp
									<img src = "images/facebook_add.png" class = "footerAddSocialButton" onclick = "skypeContactClk()">
								</td>
							</tr>
							<tr><td height = "25"></td></tr>
							<tr>
								<td class = "footerContactContent" align = "center" colspan = "2">
									<div class = "emailLined2"><?php echo $sentences['temsConditionPrivacy'];?></div>
								</td>
							</tr>
						</table>
					</td>
					<td width = "2%"></td>
				</tr>
				<tr><td height = "10" colspan = "5"></td></tr>
				<tr>
					<td class = "downFooter"></td>
					<td class = "downFooter" valign = "center" align = "left">
						<div style = "float:left; color:#afafaf; margin-right:5px;"><?php echo $sentences['makeLove'];?></div>
						<div style = "float:left;"><img src = "images/loveCrypto.png" style = "width:20px; height:17px;"></div>
					</td>
					<td valign = "center" align = "center" class = "downFooter">
						CryptoFirst © 2016-2017, All Right Reserved
					</td>
					<td class = "downFooter"></td>
					<td class = "downFooter"></td>
				</tr>
			</table>
		</div>

		<script type="text/javascript">
			var trollPadSrc = 
				"<div style = 'width:96%; margin:auto; margin-top:10px; height:120px; background:white;'></div>";

			var trollFooterSrc =
				"<table width = '100%'><tr>" +
				"<td width = '32' align = 'right'><img src = 'images/camera.png' style = 'width:25px; height:19px;'></td>" +
				"<td></td>" +
				"<td width = '40' align = 'left'><img src = 'images/smile.png' style = 'width:25px; height:25px;'></td>" +
				"<td width = '31' height = '40' align = 'left'><img src = 'images/plane.png' style = 'width:25px; height:25px;'></td>" +
				"</tr></table>";

			function trollBoxSpread () {
				if ( $("#trollBoxPad").html() == "" ) {
					$("#trollBoxPad").html(trollPadSrc);
					$("#trollBoxFooter").html(trollFooterSrc);
				} else {
					$("#trollBoxPad").html("");
					$("#trollBoxFooter").html("");
				}
			}
		</script>
	</body>
</html>