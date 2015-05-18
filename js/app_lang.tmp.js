var mi = {
	STATUS_BAL_0 : {
		en : 'Your energy levels are currently balanced. Keep it that way!',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
	STATUS_NEG_1 : {
		en : 'Your caloric balance is a bit off, but it\'s ok. Just don\'t let it drop below 600.',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
	STATUS_NEG_2 : {
		en : 'Starving only makes you lose muscle mass, don\'t do it. It doesn\'t work in the long run.',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
	STATUS_NEG_3 : {
		en : 'Technically, you`re dead :)',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
	STATUS_POS_1 : {
		en : 'Your caloric balance is a bit off, but it\'s ok. Just don\'t let it go above 600.',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
	STATUS_POS_2 : {
		en : 'You\'re eating excessively. Try holding back until your body uses the excess calories.',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
	STATUS_POS_3 : {
		en : 'Say hello to obesity :)',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
	
	
	
	
	
	
	
	
	EMPTY : {
		en : '',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
	EMPTY : {
		en : '',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
	EMPTY : {
		en : '',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
	EMPTY : {
		en : '',
		pt : '',
		ar : '',
		bg : '',
		cs : '',
		da : '',
		de : '',
		el : '',
		es : '',
		fi : '',
		fr : '',
		hu : '',
		it : '',
		id : '',
		ja : '',
		ko : '',
		nl : '',
		nb : '',
		pl : '',
		ro : '',
		ru : '',
		sv : '',
		tr : '',
		vi : '',
		zh : '',
		zt : ''
	},
}

//’




/*
function calcBMI() {
	////////////////
	// GET HEIGHT //
	////////////////
	var heightBMI;
	if($("#pA2C").val() == "centimetres") {
		heightBMI = parseInt($("#inches").val());
	} else {
		heightBMI = (parseInt($("#feet").val())*12 + parseInt($("#inches").val()))*2.54;
	}
	heightBMI = heightBMI/100;
	////////////////
	// GET WEIGHT //
	////////////////
	var weightBMI;
	if($("#pA3C").val() == "pounds") {
		weightBMI = parseInt($("#pA3B").val())/2.2;
	} else {
		weightBMI = parseInt($("#pA3B").val());
	}
	/////////
	// BMI //
	/////////
	var finalBMI = Math.round(weightBMI / (heightBMI*heightBMI)*100)/100;

$("#bmiInfo").on(touchend, function(evt) {
	getBmiInfo();
});
*/


/*
CSS

#rowBMI { 
background-image: -webkit-gradient(
	linear,
	left top,
	right top,
	color-stop(0%, #E4F6FD),
	color-stop(6%, #E4F6FD),

	color-stop(6%, #E4F6FD),
	color-stop(17%, #E4F6FD),
	
	color-stop(17%, #C8E5B9),
	color-stop(43%, #C8E5B9),

	color-stop(43%, #FDD389),
	color-stop(62%, #FDD389),
	
	color-stop(62%, #F4B8B8),
	color-stop(81%, #F4B8B8),
	
	color-stop(81%, #F68080),
	color-stop(100%, #F68080)
);

height: 25px;
text-indent: 25%;
position: relative;
}
#rowBMI:before				{ position: absolute; top: 8px; left:  29px; font-family: ""; content: "23"; font-size: 24px; line-height: 12px; padding: 0; color: rgba(0,0,0,.3); }
#rowBMI:after				{ position: absolute; top: 6px; left:  0px; font-family: "FontAwesome"; content: "x"; font-size: 28px; line-height: 12px; padding: 0; color: rgba(0,0,0,.3); }

.info { position: relative; }
.info:after				{ font-family: "FontAwesome"; content: "\A0000"; font-size: 14px;
padding-top: 0px; vertical-align:;  margin-bottom: 0px; display: inline-block; color: rgba(0,0,0,.35); font-weight: normal; 
position: absolute; top: -1px; right: -18px; 
 }


background-image: -o-linear-gradient(bottom, #A8C7BE 0%, #405880 100%, #83CD63 100%, #D8DB73 100%, #EEA444 100%, #C84047 100%);
background-image: -moz-linear-gradient(bottom, #A8C7BE 0%, #405880 100%, #83CD63 100%, #D8DB73 100%, #EEA444 100%, #C84047 100%);
background-image: -webkit-linear-gradient(bottom, #A8C7BE 0%, #405880 100%, #83CD63 100%, #D8DB73 100%, #EEA444 100%, #C84047 100%);
background-image: -ms-linear-gradient(bottom, #A8C7BE 0%, #405880 100%, #83CD63 100%, #D8DB73 100%, #EEA444 100%, #C84047 100%);
background-image: linear-gradient(to bottom, #A8C7BE 0%, #405880 100%, #83CD63 100%, #D8DB73 100%, #EEA444 100%, #C84047 100%);



#balanceBar:after				{ position: absolute; bottom: 3px; left:  0px; font-family: "FontAwesome"; content: "\f175"; font-size: 12px; line-height: 12px; padding: 0; color: #555; }
.over div #balanceBar:after		{  color: #000; opacity: .55; }
*/

