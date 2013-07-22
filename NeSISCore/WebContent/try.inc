<form action="./index.php?demo=tryit" method="post" style="margin-top:20px;">
	<div class="row">
		<div class="span2">&nbsp;</div>
		<div class="span10">
			<input type="submit" class="btn" style="float:right;" value="Run"/>
			<textarea spellcheck='false' id="code-here" name="app" style="width:100%; margin-top:20px; height:1000px;">
<?php 
	if(isset($_SESSION['tryit'])){
		echo $_SESSION['tryit'];
	}
	else{
?>
/*
 * Example code demonstrates available options.
 * Items displayed with a value of undefined are optional.
 */
 
var app = new nesis.mvc.Application({	
	config:{
		domain:undefined,//Defaults to location.host
		debugOn:undefined,//If true uncaught errors are allowed to stop processing
		storeDebug:undefined,//Display messages from the browser storage object
		storeFlush:undefined,//Flush browser storage on page refresh
		logLevel:undefined,//2=development,1=testing,0=production
		logSize:undefined,//Number of error messages retained in the browser log
		logSubmit:undefined,//Where browser can be submitted default=location.host
		debugTiming:undefined,//Displays when a handled event gets called
		debugHandlers:undefined,//Show event handler functions as they are called
		debugBind:undefined,//Show when events are bound to an object
		debugUnbind:undefined,//Show when events are unbound from an object
		debugCache:undefined,//Show cache process messages
		debugAjax:undefined,//Display Ajax messages
		ajaxRetyr:undefined,//If application is offline how long to wait before retrying request
	},
	model:{
		contentType:undefined,//Mime Type: defaults to text/html
		data:undefined,//Feed data directly to the object*
		domId:undefined,//Get data from the displayed html* **
		url:undefined,//Use Ajax to get the data*
		// *  one of data, domId, or url is required
		// ** domId is future functionality
		expires:undefined,//load from cache until this date (UTC string)
		lastModified:undefined,//use cached version if it current (UTC string)
		persist:undefined,//true keeps cache between sessions false retains only for the curren session
		onbeforesync:undefined,//function to run before syncing w/cache
		onaftersync:undefined,//function to run after syncing w/cache
		onbeforesave:undefined,//function to run before saving to server
		onaftersave:undefined,//function to run after saving to server
		oncreate:undefined,//function to run when object is created
		onchange:undefined,//function to run when object changes
		debug:undefined,//true to output message related to this object
		optionalAttributes:undefined//Any non-reserved attribute [id,path,parent,type]	
	},
	view:{
		label:undefined,//Friendly text to display in place of id
		description:undefined,//Descriptive text for object
		templates:{//This is optional and only used with json or xml data types
			uniqueTemplateName:{
				templateType:'javascript',//javascript for json and xsl for xml
				domId:undefined,//id of a script tag on the page must be type="text/x-template" *
				data:undefined,//pass template text in directly * **
				url:undefined,//location of template to be retrieved from the server *
				// *  one of data, domId, or url is required
				// ** Untested
				callback:undefined,//function to call when template is returned from server
				datasource:undefined,//function for custom methods of getting a template
				persist:undefined,//true to retain template between sessions (recommended)
				expires:undefined,//load from cache until this date (UTC string)
				lastModified:undefined,//use cached version if it current (UTC string)(recommended)
				debug:undefined,//true to output message related to this object
				defaultNode:true//Default template to use
			}
		},
		onbeforerender:undefined,//function to run before a view displays
		onafterrender:undefined,//function to run after a viw displays
		oncreate:undefined,//function to run when object is created
		onchange:undefined,//function to run when object changes
		debug:undefined,//true to output message related to this object
		optionalAttributes:undefined//Any non-reserved attribute [id,path,parent,type]	
	},
	onbeforeexecute:undefined,//function to run before the execute process
	onafterexecute:undefined,//function to run after the execute process
	oncreate:undefined,//function to run when object is created
	onchange:undefined,//function to run when object changes
	optionalAttributes:undefined,//Any non-reserved attribute [id,path,parent,type]	
	debug:undefined,//true to output message related to this object
	defaultNode:true//display this node on execute optional in other controllers
});

<?php 
}
?>
			</textarea>
<script type="text/javascript">
	var t = document.getElementById('code-here');
	t.addEventListener('keydown',function(e){
		var keyCode = e.keyCode || e.which;

	    if (keyCode == 9) {
	    	e.preventDefault();
	     	var start = this.selectionStart;
	    	var end = this.selectionEnd;
	
	    	// set textarea value to: text before caret + tab + text after caret
	    	this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
	
	    	// put caret at right position again
	    	this.selectionStart =
	    	this.selectionEnd = start + 1;
	    }
	},false);
</script>		
		</div>
	</div>
</form>