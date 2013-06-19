<?php 
session_start();

//Clear
if(isset($_GET['clear'])){
	unset($_SESSION['prefs']);
}

//Defaults
if(!isset($_SESSION['prefs'])){
	$_SESSION['prefs'] = array(
			"nesis.debugOn"=>"false",
			"store.debug"=>"false",
			"store.flush"=>"false",
			"error.logLevel"=>"2",
			"error.maxLogSize"=>"20",
			"error.remoteUrl"=>"echo.php",
			"mvc.debugTiming"=>"false",
			"mvc.debugEventFired"=>"false",
			"mvc.debugEventBind"=>"false",
			"mvc.debugEventUnbind"=>"false",
			"mvc.debugCache"=>"false",
			"mvc.debugAjax"=>"false",
			"mvc.ajaxReqCacheDelay"=>"2000"
	);
}

if(!empty($_POST) && !isset($_POST['app'])){
	foreach($_SESSION['prefs'] as $key=>$val){
		$postKey = str_replace('.','_',$key);
		if(isset($_POST[$postKey])){
			$_SESSION['prefs'][$key] = $_POST[$postKey];
		}
		else{
			$_SESSION['prefs'][$key] = "false";
		}
	}
}
?>