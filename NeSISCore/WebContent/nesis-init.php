<?php 
session_start();

header("Content-type:text/javascript");
?>
nesis = {	
	_init:function(){		
<?php
echo "\t\tdocument.domain = '{$_SERVER['HTTP_HOST']}';\n\n";

echo "\t\tnesis.debugOn = ".strval($_SESSION['prefs']['nesis.debugOn']).";\n\n";

echo "\t\tthis.core.store._init({\n";
echo "\t\t\tdebug:{$_SESSION['prefs']['store.debug']},\n";
echo "\t\t\tflush:{$_SESSION['prefs']['store.flush']}\n";
echo "\t\t});\n\n";

echo "\t\tthis.core.error._init({\n";
echo "\t\t\tlogLevel:{$_SESSION['prefs']['error.logLevel']},\n";
echo "\t\t\tmaxLogSize:{$_SESSION['prefs']['error.maxLogSize']},\n";
echo "\t\t\tremoteUrl:'{$_SESSION['prefs']['error.remoteUrl']}'\n";
echo "\t\t});\n\n";

echo "\t\tthis.mvc.debugTiming = {$_SESSION['prefs']['mvc.debugTiming']};\n";
echo "\t\tthis.mvc.debugEventFired = {$_SESSION['prefs']['mvc.debugEventFired']};\n";
echo "\t\tthis.mvc.debugEventBind = {$_SESSION['prefs']['mvc.debugEventBind']};\n";
echo "\t\tthis.mvc.debugEventUnbind = {$_SESSION['prefs']['mvc.debugEventUnbind']};\n";
echo "\t\tthis.mvc.debugCache = {$_SESSION['prefs']['mvc.debugCache']};\n";
echo "\t\tthis.mvc.debugAjax = {$_SESSION['prefs']['mvc.debugAjax']};\n\n";

echo "\t\tthis.mvc.ajaxReqCacheDelay = {$_SESSION['prefs']['mvc.ajaxReqCacheDelay']};\n";

		
?>		
	},
	core:{},
	net:{},
	application:function(appId,config){
		return new this.mvc.Application(appId,config);
	}
};