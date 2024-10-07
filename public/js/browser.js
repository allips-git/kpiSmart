$(function(){


	jQuery(document).ready(function($) {
		var isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;

		if (isTouchDevice) {
			
		}//isTouchDevice
		else {
			$(window).load(function(){
				checkBroswer();    
			 }) ;    


			function checkBroswer(){

				var agent = navigator.userAgent.toLowerCase(),
					name = navigator.appName,
					browser = '';
			  
				// MS 계열 브라우저를 구분
				if(name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
					browser = 'ie';
					if(name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
						agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
						browser += parseInt(agent[1]);
						
					} else { // IE 11+
						if(agent.indexOf('trident') > -1) { // IE 11
							browser += 11;
							
						} else if(agent.indexOf('edge/') > -1) { // Edge
						   browser = 'edge';
						   
						}
					}
					$('body').addClass('ie');

				} else if(agent.indexOf('safari') > -1) { // Chrome or Safari
					if(agent.indexOf('opr') > -1) { // Opera
						browser = 'opera';
					} else if(agent.indexOf('chrome') > -1) { // Chrome
						browser = 'chrome';
						
					} else { // Safari
						browser = 'safari';
						
					}
				} else if(agent.indexOf('firefox') > -1) { // Firefox
					browser = 'firefox';
					
				}
			$('body').addClass(browser);
			//alert(browser);

			}
		}
	});//ready

	
});