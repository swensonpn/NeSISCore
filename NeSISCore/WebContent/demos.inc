<div class="container">
	<div class="row">
		<div class="span3 bs-docs-sidebar">
			<ul class="nav nav-list bs-docs-sidenav affix-top">
				<li>
					<a href="#guiControls">Available Controls</a>
				</li>
				<li>
					<a href="#dashboard1">Dashboard One</a>
				</li>
				<li>
					<a href="#dashboard2">Dashboard Two</a>
				</li>
			</ul>
		</div>
		<div class="span9">
			<section id="guiControls">
				<div class="page-header">
					<button class="btn" style="float:right;" onclick="javascript:window.location='./index.php?demo=guiControls';">Run</button>
					<h1>1. Available Controls</h1>					
				</div>
				<p class="lead">
					Demonstrates the basic controls provided in the framework.  
					Developers can override default controls in the beforerender event handler.  
					It's also possible to build custom controls or bolt additional functionality onto the default control.
				</p>
				<h2>Initialization Code:</h2>
				<pre>
					<?php echo htmlspecialchars(file_get_contents("demos/guiControls/js/app.js"));?>
				</pre>
			</section>
			<section id="dashboard1">
				<div class="page-header">
					<button style="float:right;" onclick="javascript:window.location='./index.php?demo=dashboard1';">Run</button>
					<h1>2. UNK Style Dashboard</h1>
				</div>
				<p class="lead">
					Shows what the current UNK dashboards might look like in the framework.  
					Additional branding added to more closely replicate the current dashboard.
				</p>
				<h2>Initialization Code:</h2>
				<pre>
					<?php //echo file_get_contents("demos/guiControls/js/app.js")?>
				</pre>
			</section>
			<section id="dashboard2">
				<div class="page-header">
					<button style="float:right;" onclick="javascript:window.location='./index.php?demo=dashboard2';">Run</button>
					<h1>3. UNL Style Dashboard</h1>
				</div>
				<p class="lead">
					Shows what the current UNL dashboards might look like in the framework.  
					Additional branding added to more closely replicate the current dashboard.
				</p>
				<h2>Initialization Code:</h2>
				<pre>
					<?php //echo file_get_contents("demos/guiControls/js/app.js")?>
				</pre>
			</section>			
		</div>
	</div>
</div>