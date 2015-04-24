var mi = {
	LANGUAGE : {
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
		zh : '',
		zt : ''
	},
	LANGUAGE : {
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
		zh : '',
		zt : ''
	},
	LANGUAGE : {
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
		zh : '',
		zt : ''
	},
	LANGUAGE : {
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
		zh : '',
		zt : ''
	},
	LANGUAGE : {
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



STORE_DESCRIPTION = "
KCals Calorie Counter is a new way for you to control your calorie intake.
It displays your calorie usage in real time, and at a glance KCals will show you how much to eat every day.
 
KCals is very easy to understand - It works like a calorie chronometer.
- Calories from food will be added to the total.
- Calories burned (including your exercise) will be subtracted from the total.
 
So all you have to do is keep the counter as close to zero as possible - by logging what you eat.
 
Just set your daily calorie intake, hit start, and you're good to go!
 
Losing weight has never been easier!
 
:: DATA SYNCHRONIZATION FOR MULTIPLE DEVICES
KCals also features automatic backup, and data synchronization.
 
Easily synchronize your data between multiple devices, and keep logging on the go!
 
Whenever you add something to your diary, or update your profile, that information will be instantaneously synchronized across all your devices.

To use data synchronization, simply log into your account using another device, and the app will download all data and synchronize everything exactly as the first device - and then from one device to another in real time!
 
The synchronization service is free, fast, and requires no configuration.
 
KCals is available on 10 different platforms, so no matter which device you use, you will be able log all your information from your favorite device.
 
And to get a feel for how KCals works, go to Kcals.net and you can get started right away. Then later on, you can send the data back to your mobile device.
 
:: MAIN FEATURES
• Real time calorie counting
• Translated into 25 languages
• Available in 10 different platforms
• Simple, clean and intuitive interface
• Automatic backup and data synchronization
• Realistic estimation of weight loss
• Shows how fast your body burns calories
• Complete nutrition information
• Adjustable macronutrient ratio (proteins, fats, and carbohydrates)
• Advanced search engine
• Statistics on calorie consumption
• Large food database
• Foods divided into navigable categories
• Add your own foods and exercises
• Bookmark your favorite items
• Fully editable entries
• Automatic updates
• Today's overview
• Adjustable calorie threshold
• Cyclic mode
";