<div class="container">
	<form method="post" style="margin-top:20px;">
	<div class="row">
		<div class="span2">&nbsp;</div>
		<div class="span6">
			<fieldset>
				<legend>Packages</legend>
<?php 
	require_once "funcs.inc";
	
	$buildArr = array(
		"nesis.js"=>"nesis/nesis.js",
		"core"=>array(
			"error.js"=>"nesis/core/nesis.core.error-1.0.js",
			"browser.js"=>"nesis/core/nesis.core.browser-1.0.js",
			"cache.js"=>"nesis/core/nesis.core.cache-1.0.js",
			"store.js"=>"nesis/core/nesis.core.store-1.0.js"
		),
		"net"=>array(
			"http.js"=>"nesis/net/nesis.net.http-1.0.js"
		),
		"mvc"=>array(
			"mvc.js"=>"nesis/mvc/nesis.mvc-1.0.js",
			"gui"=>array(
				"tabsajax.js"=>"nesis/mvc/gui/nesis.mvc.gui.tabsAjax-1.0.js",
				"accordianstatic.js"=>"nesis/mvc/gui/nesis.mvc.gui.accordianStatic-1.0.js",
				"formajax.js"=>"nesis/mvc/gui/nesis.mvc.gui.formAjax-1.0.js",
				"texteditableajax.js"=>"nesis/mvc/gui/nesis.mvc.gui.textEditableAjax-1.0.js",
				"lightbox.js"=>"nesis/mvc/gui/nesis.mvc.gui.lightbox-1.0.js",
				"tabsstatic.js"=>"nesis/mvc/gui/nesis.mvc.gui.tabsStatic-1.0.js",
				"typeahead.js"=>"nesis/mvc/gui/nesis.mvc.gui.typeahead-1.0.js"
			),
			"datasource"=>array(
				"dom.js"=>"nesis/mvc/datasource/nesis.mvc.datasource.dom-1.0.js",
				"ajax.js"=>"nesis/mvc/datasource/nesis.mvc.datasource.ajax-1.0.js"
			),
			"event.js"=>"nesis/mvc/nesis.mvc.event-1.0.js",
			"nodecollection.js"=>"nesis/mvc/nesis.mvc.nodecollection-1.0.js",
			"node.js"=>"nesis/mvc/nesis.mvc.node-1.0.js",
			"router.js"=>"nesis/mvc/nesis.mvc.router-1.0.js",
			"controller.js"=>"nesis/mvc/nesis.mvc.controller-1.0.js",
			"application.js"=>"nesis/mvc/nesis.mvc.application-1.0.js",
			"model.js"=>"nesis/mvc/nesis.mvc.model-1.0.js",
			"view.js"=>"nesis/mvc/nesis.mvc.view-1.0.js",
			"template.js"=>"nesis/mvc/nesis.mvc.template-1.0.js"
		)
	);
	
	$path = getcwd().'\\closure-compiler\\';
	$script='nesis.js';
	$scriptMin='nesis.min.js';
	
	if($fh = fopen($path.$script,'w')){
		fwrite($fh,'//nesisCore framework '.date(DATE_RFC822));
		writePackages($fh,$buildArr);
		fclose($fh);
	}
	
	
	$cmd = 'java -jar '.$path.'compiler.jar --js '.$path.$script.' --js_output_file '.$path.$scriptMin; 
	exec($cmd);
	
	echoInputs($buildArr);
	
	
?>
			</fieldset>
		</div>
		<div class="span4">
			
				<a href="closure-compiler/<?php echo $script.'?time='.time();?>" class="btn btn-success btn-large btn-block" target="_blank">
					<span style="font-size:1.3em;">Download</span>
					<span style="display:block; font-size:.8em; font-weight:normal;">uncompressed</span>
				</a>
			
			
				<a href="closure-compiler/<?php echo $scriptMin.'?time='.time();?>" class="btn btn-success btn-large btn-block" target="_blank">
					<span style="font-size:1.3em;">Download</span>
					<span style="display:block; font-size:.8em; font-weight:normal;">minified</span>
				</a>
			
		</div>
	</div>
	</form>
</div>