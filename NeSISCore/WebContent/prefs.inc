
<form method="post" style="margin-top:20px;">
	<div class="row">
		<div class="span2">&nbsp;</div>
		<div class="span4">
			<fieldset>
				<legend>NeSIS Core</legend>
				<label class="checkbox">
      				<input type="checkbox" name="nesis.debugOn" value="true" <?php if($_SESSION['prefs']['nesis.debugOn']==="true"){echo "checked";}?>> General debuging
    			</label>
    			<label class="checkbox">
      				<input type="checkbox" name="store.debug" value="true" <?php if($_SESSION['prefs']['store.debug']==="true"){echo "checked";}?>> Persistent storage Messages
    			</label>
    			<label class="checkbox">
      				<input type="checkbox" name="store.flush" value="true" <?php if($_SESSION['prefs']['store.flush']==="true"){echo "checked";}?>> Flush persistent storage onload
    			</label>
    			<label>Logging Level</label>
    			<input type="text" placeholder="0=prd,1=tst,2=dev" name="error.logLevel" value="<?php echo $_SESSION['prefs']['error.logLevel'];?>"/>
    			<label>Max Log Size</label>
    			<input type="text" placeholder="Max Errors in Log" name="error.maxLogSize" value="<?php echo $_SESSION['prefs']['error.maxLogSize'];?>"/>
    			<label>Remote Log URL</label>
    			<input type="text" placeholder="Submit Errors to" name="error.remoteUrl" value="<?php echo $_SESSION['prefs']['error.remoteUrl'];?>"/>    			
			</fieldset>
		</div>
		<div class="span4">
			<fieldset>
				<legend>NeSIS MVC</legend>
				<label class="checkbox">
      				<input type="checkbox" name="mvc.debugTiming" value="true" <?php if($_SESSION['prefs']['mvc.debugTiming']==="true"){echo "checked";}?>> Display events as they fire
    			</label>
    			<label class="checkbox">
      				<input type="checkbox" name="mvc.debugEventFired" value="true" <?php if($_SESSION['prefs']['mvc.debugEventFired']==="true"){echo "checked";}?>> Display event handlers as they execute
    			</label>
    			<label class="checkbox">
      				<input type="checkbox" name="mvc.debugEventBind" value="true" <?php if($_SESSION['prefs']['mvc.debugEventBind']==="true"){echo "checked";}?>> Notify when event listener is bound
    			</label>
    			<label class="checkbox">
      				<input type="checkbox" name="mvc.debugEventUnbind" value="true" <?php if($_SESSION['prefs']['mvc.debugEventUnbind']==="true"){echo "checked";}?>> Notify when an event listener is unbound
    			</label>
    			<label class="checkbox">
      				<input type="checkbox" name="mvc.debugCache" value="true" <?php if($_SESSION['prefs']['mvc.debugCache']==="true"){echo "checked";}?>> Display caching messages
    			</label>
    			<label class="checkbox">
      				<input type="checkbox" name="mvc.debugAjax" value="true" <?php if($_SESSION['prefs']['mvc.debugAjax']==="true"){echo "checked";}?>> Display ajax messages
    			</label>
    			<label>Offline Ajax Retry</label>
    			<input type="text" placeholder="Retry Ajax Delay Time" name="mvc.ajaxReqCacheDelay" value="<?php echo $_SESSION['prefs']['mvc.ajaxReqCacheDelay'];?>"/>
			</fieldset>
		</div>
		<div class="span=2">&nbsp;</div>
	</div>
	<div class="row">
		<div class="span10">
			<button type="submit" class="btn" style="float:right; margin-top:20px;">Save Preferences</button>
		</div>
	</div>
</form>
