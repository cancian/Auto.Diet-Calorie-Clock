/**
 *	Mobile Checkbox
 *	This plugin is designed to enable iOS style checkboxes in an HTML environment
 *
 *	@author William George <code@williamgeorge.co.uk>
 *	@copyright (c) 2012 William George
 *	@license CodeCanyon Regular 
 *	@version 1.4
 *	@link http://williamgeorge.co.uk/demos/jquery-ios-checkboxes/
 */
;(function($, window, document, undefined){
	
	var MobileCheckbox = function(element, options){
	
		/**
		 *	Plugin Options
		 *	@var String checkedText - The on label text
		 *	@var String uncheckedText - The off label text
		 *	@var String color - The on label color eg. (orange: #F18C3D, blue: #448DFF) nb. Can be RGB.
		 *	@var (String | Int) width - The width of the checkbox - set to "auto" for a size depending on the font size
		 *	@var Int height - The height of the checkbox - set to "auto" for a size depending on the font size
		 *	@var Int borderRadius - The difference between iOS 5+ and iOS 4 and below (For round set at the same size as the height, or a rediculous amount)
		 *	@var Int textMargin - The margin between the handle and the text
		 *	@var Int checkMargin - The margin between the text and the edge (Only used in auto width mode)
		 *	@var Boolean draggable - Enable swiping the checkbox
		 *	@var Boolean enableThreshold - If true you must drag at least half way for the checkbox to complete, else it will fallback
		 *	@var Object animation - Animation properties, duration and easing.
		 */
		var options = $.extend({},{
			checkedText: "ON",
			uncheckedText: "OFF", 
			//color: "#65B240",
			color: "#53D769",
			//color: "#5094FD",
			//width: "auto",
			//height: "auto",
			width: 88,
			height: 26,
			borderRadius: 1000,
			textMargin: 10,
			checkMargin: 5,
			draggable: true,
			enableThreshold: true,
			animation: {
				easing: "swing",
				duration: 300
			}
/*
$("input[type=checkbox].iOS7").mobileCheckbox({
	color:"#53D769",
	checkedText:"ON",
	uncheckedText:"OFF",
	width: 88,
	height: 26,
	animation: {
	easing: "swing",
	duration: 200
	}
});	
*/
		}, $.mobileCheckbox, options);

		//Internal Vars
		var $CheckboxContainer, $CheckboxHandle, $CheckboxOnLabel;
		
		/**
		 *	Construct Function
		 */
		this.init = function(){
		
			//Make Checkbox 
			_.makeCheckbox();
			
			//Bind touch events
			_.bindHandlers();
		};
		
		/**
		 *	Toggle Checkbox
		 *	This function will toggle the checkbox between a checked state and an unchecked state
		 *	@return VOID
		 */
		this.toggle = function(){
			$(element).closest(".MobileCheckboxContainer").trigger("mousedown").trigger("mouseup");
		}
		
		/**
		 *	Checked
		 *	This function can set a specific checked state
		 *	@param BOOL checked - True = checked, false = unchecked
		 *	@return VOID
		 */
		this.checked = function(checked){
			if($(element).prop("checked") !== checked){
				this.toggle();
			}
		}
		
		/**
		 *	Disabled
		 *	This function can disable the given checbox
		 *	@param BOOL disabled - True = disabled, false = enabled
		 *	@return VOID
		 */
		this.disabled = function(disabled){
			if($(element).prop("disabled") !== disabled){
				$(element).prop("disabled", disabled);
				$(element).closest(".MobileCheckboxContainer").toggleClass("disabled", disabled);
			}
		}
		
		/**
		 *	Private Functions
		 */
		var _ = {
			bindHandlers: function(){
				
				//This adds label click support.
				$(element).on("change", function(e){
					if(e.originalEvent){
						//Reverse Check As We Assume Current State In Calculations, Not Wanted State.
						$(element).prop("checked", !$(element).prop("checked"));
						
						//Simulate Our Click Function
						var mousedown = jQuery.Event("mousedown"), mouseup = jQuery.Event("mouseup");
							mousedown.originalEvent = mouseup.originalEvent = e.originalEvent;
						$CheckboxContainer.trigger(mousedown).trigger(mouseup);	
					}
				});
				
				//Attach Draggable Event
				$CheckboxContainer.on("mousedown.MobileCheckbox " + touchstart + ".MobileCheckbox", function(e){
					e.preventDefault();
					var $labelOffSpan = $CheckboxContainer.find(".CheckboxLabel.Unchecked span"),
						startX = e.pageX || (e.originalEvent && e.originalEvent.changedTouches !== undefined?e.originalEvent.changedTouches[0].pageX:0),
						$CheckboxOnLabelSpan = $CheckboxOnLabel.find("span"),
						CheckboxOnLabelSpanWidth = $CheckboxOnLabelSpan.width(),
						handlePos = $CheckboxHandle.position().left,
						handleWidth = $CheckboxHandle.outerWidth(),
						maxPos = $CheckboxContainer.width() - handleWidth,
						clicked = true;
						
					//Stop if Disabled
					if($CheckboxContainer.is(".disabled")){
						return;
					}
					//Stop Click Spamming
					if($labelOffSpan.is(":animated")){
						return;
					}	
					
					if(options.draggable){
						$(document).on("mousemove.MobileCheckbox touchmove.MobileCheckbox", function(e){
							e.preventDefault();
							var x = e.pageX || (e.originalEvent.changedTouches !== undefined?e.originalEvent.changedTouches[0].pageX:0),
								pos = x + handlePos - startX;
								
								//We Dragged.
								clicked = false;
								
								//Min Max
								pos = (pos < 0)?0:pos;
								pos = (pos > maxPos)?maxPos:pos;
							
							
							//Set Handle Pos
							$CheckboxHandle.css("left", pos);
							
							//Set On Label Pos
							$CheckboxOnLabel.css("width", pos + (handleWidth / 2));
							
							//Set On Label Text pos
							$CheckboxOnLabelSpan.css("marginLeft", pos - options.textMargin - CheckboxOnLabelSpanWidth);
							
							//Set Off Label Text pos
							$labelOffSpan.css("paddingLeft", pos + handleWidth + options.textMargin);
						});
					}
					
					return $(document).off(touchend + ".MobileCheckbox").on(touchend + ".MobileCheckbox", function(e){
						e.preventDefault();
						var x = e.pageX || (e.originalEvent && e.originalEvent.changedTouches !== undefined?e.originalEvent.changedTouches[0].pageX:0),
							currentState = !!$(element).prop("checked"),
							handlePos = $CheckboxHandle.position().left + (handleWidth / 2),
							endPos;
												
						if(!clicked && options.enableThreshold){
							if(	(handlePos >= ($CheckboxContainer.width() / 2) && !currentState) || 
								(handlePos >= ($CheckboxContainer.width() / 2) && currentState)){
								endPos = maxPos;
								$(element).prop("checked", true);
							} else if(	(handlePos <= ($CheckboxContainer.width() / 2) && !currentState) || 
										(handlePos <= ($CheckboxContainer.width() / 2) && currentState)){
								endPos = 0;
								$(element).prop("checked", false);
							}
						} else {
							//Change Checked Value
							$(element).prop("checked", !currentState);
														
							//Animate to a end position 
							endPos = $(element).is(":checked")?maxPos:0;
						}
						
						//Trigger the checkbox change event only if state is different.
						if(((e.originalEvent && e.originalEvent.type != "change") || !e.originalEvent) && currentState != $(element).is(":checked")){
							$(element).trigger("change");
						}
						
						//Set Handle Pos
						$CheckboxHandle.animate({
							left:endPos
						}, options.animation.duration, options.animation.easing, function(){
							//Trigger the checkbox complete after the animation has finished
							$(element).trigger("complete", currentState != $(element).is(":checked"));
						});
						
						//Set On Label Pos
						$CheckboxOnLabel.animate({
							width: endPos + (handleWidth / 2)
						}, options.animation.duration, options.animation.easing);
						
						//Set On Label Text pos
						$CheckboxOnLabel.find("span").animate({
							marginLeft: endPos - options.textMargin - CheckboxOnLabelSpanWidth
						}, options.animation.duration, options.animation.easing);
						
						//Set Off Label Text pos
						$labelOffSpan.animate({
							paddingLeft: endPos + handleWidth + options.textMargin
						}, options.animation.duration, options.animation.easing);
						
					//	$(document).off("mousemove.MobileCheckbox touchmove.MobileCheckbox");
						return $(document).off(touchmove + ".MobileCheckbox" + touchend + ".MobileCheckbox");
					});
				});
			
			},
			getCheckboxSize: function(labelText){
				//Make Autobox
				$autoWidth = $("<div/>", {
					'class': "MobileCheckboxContainer",
					html: 	$("<div/>", {
								'class': "CheckboxLabel",
								html: $("<span/>", {
									text: labelText
								})
							}),
					css: {
						position: "absolute",
						top: "-1000px"
					}
				}).appendTo($(element).parent());
				
				var autoSpan = $autoWidth.find("div.CheckboxLabel span"),
					labelSizeWidth = autoSpan.width(),
					labelSizeHeight = autoSpan.height();
				
				//Remove auto width container
				$autoWidth.remove();
				
				return [labelSizeWidth, labelSizeHeight];
			},
			makeCheckbox: function(){
				var checked = $(element).is(":checked"),
					disabled = $(element).is(":disabled"),
					checkboxWidth = options.width,
					checkboxHeight = checkboxHandleWidth = options.height;
										
				//Checkbox
				$CheckboxContainer = $("<div/>", {
					'class': "MobileCheckboxContainer",
					width: checkboxWidth,
					height: checkboxHeight,
					css: {
						borderRadius: options.borderRadius
					}
				}).addClass((disabled?"disabled":""));
					
				//Sizing
				var checkLabelSize = _.getCheckboxSize(options.checkedText);
							
				//Auto Height	
				if(!$.isNumeric(checkboxHeight)){
					var uncheckLabelHeight = _.getCheckboxSize(options.uncheckedText)[1];
					checkboxHeight = checkboxHandleWidth = (checkLabelSize[1]>uncheckLabelHeight?checkLabelSize[1]:uncheckLabelHeight) + options.checkMargin;
					$CheckboxContainer.height(checkboxHeight);
				}
				
				//Auto Width
				if(!$.isNumeric(checkboxWidth)){
					var uncheckLabelWidth = _.getCheckboxSize(options.uncheckedText)[0];
					checkboxWidth = (checkLabelSize[0]>uncheckLabelWidth?checkLabelSize[0]:uncheckLabelWidth) 
										+ checkboxHandleWidth + (options.textMargin * 2) + options.checkMargin;
					$CheckboxContainer.width(checkboxWidth);
				}
				
				//Add Old Checkbox
				var oldCheck = $(element).clone(true).css("display", "none").data("MobileCheckbox", true).appendTo($CheckboxContainer);

				//Unchecked Label
				$("<div/>", {
					'class': "CheckboxLabel Unchecked",
					html: $("<span/>", {
						text: options.uncheckedText,
						css: {
							lineHeight: checkboxHeight + "px",
							paddingLeft: (checked?checkboxWidth:checkboxHandleWidth) + options.textMargin
						}
					})
				}).appendTo($CheckboxContainer);

				//Checked Label
				$CheckboxOnLabel = $("<div/>", {
					'class': "CheckboxLabel Checked",
					html: $("<span/>", {
						text: options.checkedText,
						css: {
							lineHeight: checkboxHeight + "px",
							marginLeft: (checked?checkboxWidth - checkboxHandleWidth:0) - options.textMargin - checkLabelSize[0]
						}
					}),
					css: {						
						backgroundColor: options.color,
						width: (checked)?checkboxWidth-(checkboxHandleWidth/2):(checkboxHandleWidth/2),
						borderTopLeftRadius: options.borderRadius + "px",
						borderBottomLeftRadius: options.borderRadius + "px"
					}
				}).appendTo($CheckboxContainer);
				
				//Glow
				$("<div/>", {
					'class': "CheckboxGlow",
					css: {
						position: "absolute",
						left: 0,
						top: 0,
						width: "100%",
						height: "100%",
						borderRadius: options.borderRadius + "px",
						boxShadow: "inset 0px "+Math.floor(checkboxHeight/3)+"px 0px 4px rgba(0, 0, 0, 0.05), inset 3px 3px 15px -3px rgba(0, 0, 0, 0.5)"
					}
				}).appendTo($CheckboxContainer);
				
				//Handle
				$CheckboxHandle = $("<div/>", {
					'class': "CheckboxHandle",
					css: {
						width: checkboxHandleWidth,
						height: checkboxHandleWidth,
						left: (checked)?checkboxWidth-checkboxHandleWidth:0,
						borderRadius: options.borderRadius + "px"
					}
				}).appendTo($CheckboxContainer);
				
				//Swap Input With Our Toggle
				$(element).replaceWith($CheckboxContainer);
				element = oldCheck;
			}
		};
		
		//To stop the plugin binding to a checkbox that itself creates.
		if(!$.data(element, 'MobileCheckbox')){
			this.init();
			return this;
		}
	};
	
	//Side Wide Defaults
	$.mobileCheckbox = {};
	
	//Assign To Fn
	$.fn.mobileCheckbox = function(options){
		if(options === undefined || typeof options === 'object'){
			return this.each(function(){
				if(!$.data(this, 'plugin_MobileCheckbox')){
					$.data(this, 'plugin_MobileCheckbox', new MobileCheckbox(this, options));
				}	
			});
		} else if(typeof options === 'string' && options[0] !== '_' && options !== 'init'){
			var args = Array.prototype.slice.call(arguments, 1);

			return this.each(function(){
				var instance = $.data(this, 'plugin_MobileCheckbox');
				if(instance instanceof MobileCheckbox && typeof instance[options] === 'function'){
					instance[options].apply(instance, args);
				}
			});
		}
	};
	
})(jQuery, this, document);