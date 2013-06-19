nesis = {	
	_init:function(opts){
		opts = opts || {};
			
		document.domain = opts.domain || location.host;
		
		//Displays general runtime messages in the console
		nesis.debugOn = opts.debugOn || true;
		
		/*nesis.core.store - Manages the browsers data store
		 *  debug: true to display console messages
		 */
		this.core.store._init({
			debug:opts.storeDebug || false,
			flush:opts.storeFlush || false
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
			logLevel:opts.logLevel || 0,
			maxLogSize:opts.logSize || 20,
			remoteUrl:opts.logSubmit || location.host
		});
		
		/*nesis.mvc - Model,View,Controller framework
		 *  debugTiming: true to write events that fire a handler
		 *  debugEventFired: true to write runtime events to the console as they fire
		 *  debugEventBind: true to write events added to objects
		 *  debugEventUnbind: true to write events removed from objects
		 *  debugCache: true to write cache management messages
		 *  
		 *  ajaxReqCacheDelay: When offline how long until attepting request again.
		 */
		this.mvc.debugTiming = opts.debugTiming || false;
		this.mvc.debugEventFired = opts.debugHandlers || false;
		this.mvc.debugEventBind = opts.debugBind || false;
		this.mvc.debugEventUnbind = opts.debugUnbind || false;
		this.mvc.debugCache = opts.debugCache || false;
		this.mvc.debugAjax = opts.debugAjax || false;
		
		this.mvc.ajaxReqCacheDelay = opts.ajaxRetry || 2000;
	},
	core:{},
	net:{}	
};