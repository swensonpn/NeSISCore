nesis = {	
	_init:function(){
		document.domain="localhost";
		
		//Displays general runtime messages in the console
		nesis.debugOn = true;
		
		/*nesis.core.store - Manages the browsers data store
		 *  debug: true to display console messages
		 */
		this.core.store._init({
			debug:false,
			flush:true
		});
		
		/*nesis.core.error - Handles error logging 
		 * logLevels:
		 * 	2 development: write to console
		 * 	1 testing: sends log messages to server immediately
		 * 	0 production: retains errors on the browser. Only send to server when requested
		 * 
		 * maxLogSize
		 *  Maximum number of errors to save in the local log
		 */
		this.core.error._init({
			logLevel:2,
			maxLogSize:20,
			remoteUrl:"http://localhost/nesisCore/WebContent/echo.php"
		});
		//this.core.error._init({logLevel:1,remoteUrl:"http://unkwebprd.unk.edu/echo.php"});
		
		/*nesis.mvc - Model,View,Controller framework
		 *  debugEventFired: true to write runtime events to the console as they fire
		 *  debugEventBind: true to write events added to objects
		 *  debugEventUnbind: true to write events removed from objects
		 *  debugCache: true to write cache management messages
		 *  
		 *  ajaxReqCacheDelay: When offline how long until attepting request again.
		 */
		this.mvc.debugTiming = false;
		this.mvc.debugEventFired = false;
		this.mvc.debugEventBind = false;
		this.mvc.debugEventUnbind = false;
		this.mvc.debugCache = false;
		this.mvc.debugAjax = false;
		
		this.mvc.ajaxReqCacheDelay = 2000;
	},
	core:{},
	net:{}	
};