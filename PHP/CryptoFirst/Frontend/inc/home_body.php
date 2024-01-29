<script>pageName = "HOME";</script>

<div class = "smartBackground">
	<img src = "images/smartImage.jpg" style = "width:100%; height:100%">
</div>

<script>
	var quickSignUpHTML = 
	'<table class ="quickWindow">' +
		'<tr><td class ="subWndBlankUp"></td></tr>' +
		'<tr>' +
			'<td class ="subWndLeftElement"><?php echo $words["signUp"];?></td>' +
			'<td class ="subWndRightElement"><span class ="subWndButton subWndButton01" onclick = "loginDivShow()"><?php echo $words["logIn"];?>&nbsp&#10097</span></td>' +
		'</tr>' +
		'<tr><td colspan ="2" class ="subWndLeftElement"><input type ="text" onfocus="txtFocus(this)" class ="subWndLargeInput" placeholder ="<?php echo $words["userName"];?>"></td></tr>' +
		'<tr><td colspan ="2" class ="subWndLeftElement"><input type ="text" class ="subWndLargeInput" placeholder ="<?php echo $words["email"];?>"></td></tr>' +
		'<tr>' +
			'<td class ="subWndLeftElement"><input type ="password" class ="subWndSmallInput" placeholder ="<?php echo $words["password"];?>"></td>' +
			'<td class ="subWndRightElement"><input type ="password" class ="subWndSmallInput" placeholder ="<?php echo $words["conPass"];?>"></td>' +
		'</tr>' +
		'<tr>' +
			'<td style = "padding-left:16px;" colspan = "2">' +
				'<input type ="checkbox"><small class ="subWndNoteText"><?php echo $sentences["signUpWarning"];?></small>' +
			'</td>' +
		'</tr>' +
		'<tr>' +
			'<td class ="subWndLeftElement">' +
				'<span class ="subWndButton subWndButton02"><?php echo $words["register"];?></span>' +
			'</td>' +
		'</tr>' +
		'<tr><td class ="subWndBlankDown"></td></tr>' +
	'</table>';

	var quickLoginHTML =
	'<table class = "quickWindow">' +
		'<tr><td class = "subWndBlankUp"></td></tr>' +
		'<tr>' +
			'<td class = "subWndLeftElement"><?php echo $words["logIn"];?></td>' +
			'<td class = "subWndRightElement"><span class = "subWndButton subWndButton01" onclick = "regDivShow()">&#10096&nbsp<?php echo $words["signUp"];?></span></td>' +
		'</tr>' +
		'<tr><td colspan = "2" class = "subWndLeftElement"><input type = "text" style = "width:426px;" placeholder = "<?php echo $words["userName"];?>"></td></tr>' +
		'<tr><td colspan = "2" class = "subWndLeftElement"><input type = "password" style = "width:426px;" placeholder = "<?php echo $words["password"];?>"></td></tr>' +
		'<tr>' +
			'<td style = "padding-left:16px;" colspan = "2">' +
				'<table width = "100%"><tr>' +
					'<td>' +
						"<input type = 'checkbox'><small class = 'subWndNoteText'><?php echo $sentences['rememberMe'];?></small><br>" +
					'</td>' +
					'<td align = "right" style = "padding-right:20px;">' +
						'<div style = "margin-left:4px; margin-top:2px;">' +
							'<small  class = "subWndNoteText"><?php echo $sentences["forgetPassword"];?></small>' +
							'&nbsp' +
							'<small  class = "subWndActiveText"><?php echo $sentences["toRecover"];?></small>' +
						'</div>' +
					'</td>' +
				'</tr></table>' +
			'</td>' +
		'</tr>' +
		'<tr>' +
			'<td class = "subWndLeftElement">' +
				'<span class = "subWndButton subWndButton02"><?php echo $words["logIn"];?></span>' +
			'</td>' +
		'</tr>' +
		'<tr><td class = "subWndBlankDown"></td></tr>' +
	'</table>';
</script>

<div id = "bodyDiv">
	<div class = "sliderBack" onmousemove = "homeNormal()">
		<div class = "sliderChain">
			<table class = "sliderSentences01">
				<tr><td style = "height:130px;"></td></tr>
				<tr>
					<td colspan = "4" style = "height:50px;"></td>
					<td rowspan = "5" id = "quickSpan" valign = "top" align = "right"></td>
				</tr>
				<tr style = "font-size:45px;" height = "130" valign = "bottom">
					<td width = "200"><?php echo $sentences['buySell'];?></td>
					<td width = "200" height = "100" align = "center">
						<div class = "cube_bc">
							<div class = "cb_bc_front"></div>
							<div class = "cb_bc_left"></div>
							<div class = "cb_bc_back"></div>
							<div class = "cb_bc_right"></div>
						</div>
					</td>
					<td width = "50" valign = "center"><?php echo $sentences['by'];?></td>
					<td width = "210" align = "center">
						<div class = "cube_pay">
							<div class = "cb_pay_front"></div>
							<div class = "cb_pay_left"></div>
							<div class = "cb_pay_back"></div>
							<div class = "cb_pay_right"></div>
						</div>
					</td>
				</tr>
				<tr><td style = "height:50px;"></td></tr>
				<tr style = "font-size:30px;" height = "50px" valign = "top">
					<td colspan = "4" height = "80"><?php echo $sentences['buySellNote'];?></td>
				</tr>
				<tr><td colspan = "4"></td></tr>
				<tr><td colspan = "5" align = "center" valign = "bottom">
					<div class = "downIcon" onclick = "downPage()">
						<img src = "images/down.png" style = "width:20px; height:12px; margin-top:22px;">
					</div>
				</td></tr>
			</table>
		</div>
	</div>

	<div style = "z-index:96; padding-left:0px; position:relative; background:white;">
		<div id = "flipGroup" class = "flipGroup" onmousemove = "homeNormal()">
			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/easy.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['easy'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['easyText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/fast.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['fast'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['fastText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/safe.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['safe'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['safeText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/cheap.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['cheap'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['cheapText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/bankTransfer.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['bankTransfer'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['bankTransferText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/cash.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['cash'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['cashText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/creditCard.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['creditCard'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['creditCardText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/regulate.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['regulate'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['regulateText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/international.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['international'];?>
							</div>
						</div>
						<table class = "flipAfter" style = "font-size:18px;"><tr><td>
							<?php echo $sentences['internationalText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/appMobile.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['appMobile'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['appMobileText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/tChat.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['tChat'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['tChatText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div class = "flipElement">
				<div class = "flipRegion">
					<div class = "flipContainer">
						<div class = "flipPrev">
							<div class = "flipFirstImg">
								<img src = "images/onlineHelp.png">
							</div>
							<div class = "flipFirstText">
								<?php echo $words['onlineHelp'];?>
							</div>
						</div>
						<table class = "flipAfter"><tr><td>
							<?php echo $sentences['onlineHelpText'];?>
						</td></tr></table>
					</div>
				</div>
			</div>

			<div style="clear:both"></div>
		</div>

		<div class = "triangleContainer" onmousemove = "homeNormal()">
			<div class = "triangle-bottomright" id = "triangleTop"></div>

			<div class = "triAngleGroup">
				<div class = "triAngleTopText">3&nbsp<?php echo $words['steps'];?></div>

				<div class = "triAngleElement" style = "margin-left: 5%; float:left;">
					<div class = "triangleBody" style = "background:url('images/circleOrder.png');">
						<div class = "triangleGhost"></div>
					</div>
					<div class = "triAngleText"><?php echo $words['order'];?></div>
				</div>

				<div class = "triAngleElement" style = "float:left;">
					<div class = "triangleBody" style = "background:url('images/circlePay.png');">
						<div class = "triangleGhost"></div>
					</div>
					<div class = "triAngleText"><?php echo $words['pay'];?></div>
				</div>

				<div class = "triAngleElement" style = "float:left;">
					<div class = "triangleBody" style = "background:url('images/circleGet.png');">
						<div class = "triangleGhost"></div>
					</div>
					<div class = "triAngleText"><?php echo $words['get'];?></div>
				</div>

				<div style = "clear:both;"></div>
			</div>

			<div class = "triangle-topleft" id = "triangleBottom"></div>
		</div>

		<div style = "width:100%; height:120px; background:white; z-index:95; position:relative;" onmousemove = "homeNormal()"></div>

		<div class = "counterBoxGroup" id = "counterBoxGroup">
			<div class = "counterBox" style = "float:left;">
				<div class = "counterTopText" id = "langsDiv">0</div>
				<div class = "counterDownText"><?php echo $words['langs'];?></div>
			</div>
			<div class = "counterBox" style = "float:left;">
				<div class = "counterTopText" id = "currenciesDiv">0</div>
				<div class = "counterDownText"><?php echo $words['currencies'];?></div>
			</div>
			<div class = "counterBox" style = "float:left;">
				<div class = "counterTopText" id = "paywaysDiv">0</div>
				<div class = "counterDownText"><?php echo $words['PayWays'];?></div>
			</div>
			<div class = "counterBox" style = "float:left;">
				<div class = "counterTopText" id = "cryptoCursDiv">0</div>
				<div class = "counterDownText"><?php echo $words['cryptoCurs'];?></div>
			</div>
			<div class = "counterBox" style = "float:left;">
				<div class = "counterTopText" id = "happyCustomersDiv">0</div>
				<div class = "counterDownText"><?php echo $words['happyCustoms'];?>&nbsp!</div>
			</div>
		</div>

		<div style = "clear:both;"></div>

		<div class = "feedbackFrame">
			<div class = "feedbackMark"><?php echo $words['feedbacks'];?></div>
			<div style = "width:50px; border-top:1px solid red; margin:auto;"></div>
			<table width = "100%"><tr>
				<td style = "padding-left:25px" align = "left"><div class = "prevNextButton" onclick = "goPrevFeedBack()">&nbsp&#10096</div></td>
				<td width = "90%" height = "130" style = "position:relative; overflow:hidden;">
					<div id = "feedBackForm" style = "position: absolute; width:200%; top:0px;">
						<div style = "float:left; width:50%;" id = "leftFeedBack"></div>
						<div style = "float:left; width:50%;" id = "rightFeedBack"></div>
					</div>
				</td>
				<td style = "padding-right:25px" align = "right"><div class = "prevNextButton" onclick = "feedbackChage()">&nbsp&#10097</div></td>
			</tr></table>

			<table width = "100%" id = "selectFeedBackBtnGroup" style = "padding-top:20px;"></table>
		</div>

		<div style = "width:100%; height:80px;"></div>
	</div>

	<div style = "width:100%; height:300px;"></div>

	<div class = "paymentSlideContainer" onmousemove = "homeNormal()">
		<table class = "paymentSlider">
			<tr><td style = "width:100%;">
				<table width = "100%"><tr>
					<td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell payPalSlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell visaSlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell laPoste"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell westernSlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell sepaSlider"></td><td></td>
				</tr></table>
			</td>
			<td style = "width:100%;">
				<table width = "100%"><tr>
					<td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell wireTransferSlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell sofortSlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell giroPaySlider"></td><td></td>					
					<td valign = "center" align = "center" class = "paymentSliderCell skrillSlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell neteuseSlider"></td><td></td>
				</tr></table>
			</td>
			<td style = "width:100%;">
				<table width = "100%"><tr>
					<td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell perfectMoneySlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell okPaySlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell webMoneySlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell ueosurfSlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell paySafeSlider"></td><td></td>
				</tr></table>
			</td>
			<td style = "width:100%;">
				<table width = "100%"><tr>
					<td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell payPalSlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell visaSlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell laPoste"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell westernSlider"></td><td></td>
					<td valign = "center" align = "center" class = "paymentSliderCell sepaSlider"></td><td></td>
				</tr></table>
			</td></tr>
		</table>
	</div>
</div>

<script type="text/javascript">
	var feedBAckID = 0;
	var feedBAckPrevID = 0;
	var feedBackCnt = 3;
	var feedbackTxt = [feedBackCnt];

	feedbackTxt[0] = '<table feedbackFrame width = "100%" height = "130"><tr>' +
			'<td width = "9%"></td>' +
			'<td class = "feedbackBlock" valign = "top">' +
				'<div class = "feedbackName">James Gehart&nbsp</div>' +
				'<div class = "feedbackBlank"></div>' +
				'<div class = "feedbackProp">&nbsp35 olds / New york</div>' +

				'<table cellspacing = "0" width = "100%" class = "feedbackContent">' +
					'<tr><td height = "20"></td></tr>' +
					'<tr>' +
						'<td width = "25"></td>' +
						'<td>The only site where I can buy anonymously ♥</td>' +
						'<td width = "25"></td>' +
					'</tr>' +
				'</table>' +
			'</td>' +

			'<td width = "2%"></td>' +

			'<td class = "feedbackBlock" valign = "top">' +
				'<div class = "feedbackName">Alex Smith&nbsp</div>' +
				'<div class = "feedbackBlank"></div>' +
				'<div class = "feedbackProp">&nbsp27 olds / Toronto</div>' +

				'<table cellspacing = "0" width = "100%" class = "feedbackContent">' +
					'<tr><td height = "20"></td></tr>' +
					'<tr>' +
						'<td width = "25"></td>' +
						'<td>The most simple and quick exchanger !</td>' +
						'<td width = "25"></td>' +
					'</tr>' +
				'</table>' +
			'</td>' +
			'<td width = "9%"></td>' +
		'</tr></table>';

	feedbackTxt[1] = '<table feedbackFrame width = "100%" height = "130"><tr>' +
			'<td width = "9%"></td>' +
			'<td class = "feedbackBlock" valign = "top">' +
				'<div class = "feedbackName">Samba Saidy&nbsp</div>' +
				'<div class = "feedbackBlank"></div>' +
				'<div class = "feedbackProp">&nbsp52 olds / Amsterdam</div>' +

				'<table cellspacing = "0" width = "100%" class = "feedbackContent">' +
					'<tr><td height = "20"></td></tr>' +
					'<tr>' +
						'<td width = "25"></td>' +
						'<td>Serious, reliable, responsive, what more can you ask for ?!</td>' +
						'<td width = "25"></td>' +
					'</tr>' +
				'</table>' +
			'</td>' +

			'<td width = "2%"></td>' +

			'<td class = "feedbackBlock" valign = "top">' +
				'<div class = "feedbackName">Anatoli Shimakov</div>' +
				'<div class = "feedbackBlank"></div>' +
				'<div class = "feedbackProp">&nbsp27 olds / Moscow</div>' +

				'<table cellspacing = "0" width = "100%" class = "feedbackContent">' +
					'<tr><td height = "20"></td></tr>' +
					'<tr>' +
						'<td width = "25"></td>' +
						'<td>Transaction very simple and very fast! I will be back !</td>' +
						'<td width = "25"></td>' +
					'</tr>' +
				'</table>' +
			'</td>' +
			'<td width = "9%"></td>' +
		'</tr></table>';

	feedbackTxt[2] = '<table feedbackFrame width = "100%" height = "130"><tr>' +
			'<td width = "9%"></td>' +
			'<td class = "feedbackBlock" valign = "top">' +
				'<div class = "feedbackName">Wang Lin&nbsp</div>' +
				'<div class = "feedbackBlank"></div>' +
				'<div class = "feedbackProp">&nbsp43 olds / Shenyang</div>' +

				'<table cellspacing = "0" width = "100%" class = "feedbackContent">' +
					'<tr><td height = "20"></td></tr>' +
					'<tr>' +
						'<td width = "25"></td>' +
						'<td>Cheaper than elsewhere and more efficient, the top!</td>' +
						'<td width = "25"></td>' +
					'</tr>' +
				'</table>' +
			'</td>' +

			'<td width = "2%"></td>' +

			'<td class = "feedbackBlock" valign = "top">' +
				'<div class = "feedbackName">Ichihashi Dakeno</div>' +
				'<div class = "feedbackBlank"></div>' +
				'<div class = "feedbackProp">&nbsp19 olds / Tokyo</div>' +

				'<table cellspacing = "0" width = "100%" class = "feedbackContent">' +
					'<tr><td height = "20"></td></tr>' +
					'<tr>' +
						'<td width = "25"></td>' +
						'<td>The most safe, reliable and kind exchanger.<br>I won\'t know any other site which is better than it !</td>' +
						'<td width = "25"></td>' +
					'</tr>' +
				'</table>' +
			'</td>' +
			'<td width = "9%"></td>' +
		'</tr></table>';

	var i = 0;
	var selFedCode = "<tr><td></td>";
	for(i = 0; i < feedBackCnt; i++) {
		selFedCode += '<td align = "center" valign = "center" width = "45"><div id = "selFedBtn' + i + '" onclick = "selFeedback(' + i + ')"></div></td>';
	}
	selFedCode += '<td></td></tr>';
	$('#selectFeedBackBtnGroup').html(selFedCode);

	$('#leftFeedBack').html(feedbackTxt[0]);
	$('#rightFeedBack').html(feedbackTxt[0]);

	feedbackChage ();

	function feedbackChage () {
		$("#feedBackForm").css({"-webkit-animation":"slide-feedback-animation 2s"});

		for(i = 0; i < feedBackCnt; i++)
			$('#selFedBtn'+i).attr("class", "selFedBtn");
		$('#selFedBtn'+feedBAckID).attr("class", "selFedBtnSel");

		if ( intervalID > 0 ) {
			clearTimeout ( intervalID );
		}

		intervalID = setTimeout(feedbackNext, 1000);
	}

	function feedbackNext () {
		$("#feedBackForm").css({"-webkit-animation":""});
		
		feedBAckPrevID = feedBAckID;
		feedBAckID = (feedBAckID + 1) % feedBackCnt;

		$("#leftFeedBack").html(feedbackTxt[feedBAckPrevID]);
		$("#rightFeedBack").html(feedbackTxt[feedBAckID]);

		clearTimeout ( intervalID );
		intervalID = setTimeout(feedbackChage, feedBackPeriod);
	}

	function goPrevFeedBack() {
		feedBAckPrevID = feedBAckID;

		if (feedBAckID >= 2)
			feedBAckID -= 2;
		else if (feedBAckID == 1)
			feedBAckID = feedBackCnt - 1;
		else if (feedBAckID == 0)
			feedBAckID = feedBackCnt - 2;

		clearTimeout ( intervalID );
		intervalID = -1;
		$('#rightFeedBack').html(feedbackTxt[feedBAckID]);

		feedbackChage ();
	}

	function selFeedback ( id ) {
		clearTimeout ( intervalID );
		intervalID = -1;
		$('#rightFeedBack').html(feedbackTxt[id]);

		feedBAckPrevID = feedBAckID;
		feedBAckID = id;
		feedbackChage ();
	}
</script>

