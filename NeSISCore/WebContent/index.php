<?php
	include "global.inc";
	
	if(isset($_GET['demo'])){
		if(strcmp($_GET['demo'],'tryit') == 0){
			if(isset($_POST['app'])){
				$js = $_POST['app'];
				$_SESSION['tryit'] = $_POST['app'];
			}
			else{
				$js = file_get_contents("demos/guiControls/js/app.js");
			}
		}
		else{
			$js = file_get_contents("demos/".$_GET['demo']."/js/app.js");
		}
	}
	
?>
<!DOCTYPE html>
<html>
<head>
<title>NeSIS Core</title>
<link type="text/css" rel="stylesheet" href="css/bootstrap.min.css"/>
<?php 
if(isset($_GET['demo'])){
	if(strcmp($_GET['demo'],'tryit') == 0){
		echo '<link type="text/css" rel="stylesheet" href="demos/guiControls/css/styles.css"/>';
	}
	else{
		echo '<link type="text/css" rel="stylesheet" href="demos/'.$_GET['demo'].'/css/styles.css"/>';
	}
}

?>
</head>
<body>
<div id="app/lightbox"></div>
<div class="navbar navbar-inverse navbar-fixed-top">
	<div class="navbar-inner">
		<div class="container">
			<button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a style="float:right;" class="brand" href="./index.php">NeSIS Core</a>
			<div class="nav-collapse collapse">
				<ul class="nav">
					<li class>
						<a href="./index.php">Home</a>
					</li>
					<li class>
						<a href="./index.php?page=demos">Examples</a>
					</li>
					<li class>
						<a href="./index.php?page=prefs">Preferences</a>
					</li>
					<li class>
						<a href="./index.php?page=download" >Download</a>
					</li>
					<li class>
						<a href="./index.php?page=try" >Try It</a>
					</li>
					<li class>
						<a href="https://github.com/swensonpn/NeSISCore" target="_blank">GitHub</a>
					</li>					
				</ul>
			</div>
		</div>
	</div>
</div>
<?php 
if(isset($_GET['demo'])){
	if(strcmp($_GET['demo'],'tryit') == 0){
		include "demos/guiControls/index.html";
	}
	else{
		include "demos/".$_GET['demo']."/index.html";
	}
}
else{
	$title = "NeSIS Core";
	$text = "Library agnostic client-side framework.  Provides core level support for the PeopleSoft dashboard mod.";
	$content = "home.inc";

	if(isset($_GET['page'])){
		switch($_GET['page']){
			case "demos":
				$title = "Examples";
				$text = "Run demonstration applications and view the code used to bring them to life.";
				$content = "demos.inc";
				break;
			case "prefs":
				$title="Preferences";
				$text = "Change configuration settings to change behavior and get familiar with the debugging tools.";
				$content = "prefs.inc";
				break;
			case "download":
				$title="Download";
				$text = "Create a single minified JavaScript file.";
				$content = "download.inc";
				break;
			case "try":
				$title="Roll Your Own";
				$text = "Expirement with the framework using the default demo packages.";
				$content = "try.inc";
				break;
		}
	}

?>
<header class="jumbotron subhead" id="overview">
	<div class="container">
		<h1><?php echo $title; ?></h1>
		<p class="lead"><?php echo $text; ?></p>
	</div>
</header>
<div class="row">
<?php 
	include $content;
}
?>
</div>
<footer class="footer">
	<div class="container">
		<p>
			This page makes use of resources from various libraries for asthetic purposes only.
		 	The point of this project is to provide a shared baseline framework for dashboard construction.  
		 	A single modular code base makes maintenance easier.  
		 	Not creating library dependancies allows campuses to brand their projects with the tools that best fit their needs.
		</p>
	</div>
</footer>
<script type="text/x-template" id="test2">
	<h3>JavaScript Templates</h3>
	<div id="<%=emplid%>">
		<a href="#app/tabs/templates/tpl:list">Switch Template</a>
		<table style="width:80%; margin:10px auto; ">
			<thead>
				<tr>
					<th style="border-bottom: 1px solid #DDDDDD;">NUID</th>
					<th style="border-bottom: 1px solid #DDDDDD;">NAME</th>
					<th style="border-bottom: 1px solid #DDDDDD;">OFFICE</th>
					<th style="border-bottom: 1px solid #DDDDDD;">EMAIL</th>
					<th style="border-bottom: 1px solid #DDDDDD;">TITLE</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><%=emplid%></td>
					<td><%=name%></td>
					<td><%=office%></td>
					<td><%=email%></td>
					<td><%=title%></td>
				</tr>
		</table>
	</div>
</script>
<script type="text/x-template" id="test">
	<h3>JavaScript Templates</h3>
	<div id="<%=emplid%>">
	<a href="#app/tabs/templates/tpl:table">Switch Template</a>
		<table style=" margin:10px 10%; ">
			<tr><td><b>Name:</b></td><td><%=name%></td></tr>
			<tr><td><b>Office:</b></td><td><%=office%></td></tr>
			<tr><td><b>Email:</b></td><td><%=email%></td></tr>
			<tr><td><b>Title:</b></td><td><%=title%></td></tr>
		</table>
	</div>
</script>
<script type="text/x-template" id="inBody">
<div>
	<table style="width:50%; margin:10px auto; ">
		<caption><h4>Countries of the World</h4></caption>
		<thead>
			<tr><th>Country Code</th><th>Country Name</th></tr>
		</thead>
		<tbody>
			<% for(var i=0,l=data.length; i<l; i++){ %>
			<tr><td><%=data[i].code%></td><td><%=data[i].name%></td></tr>
			<% } %>
		</tbody>
	</table>
</div>
</script>
<?php 
	if(isset($_GET['mode'])){
		if(strcmp($_GET['mode'],'prod') == 0){
			echo '<script type="text/javascript" src="closure-compiler/nesis.js"></script>';
		}
		else if(strcmp($_GET['mode'],'min') == 0){
			echo '<script type="text/javascript" src="closure-compiler/nesis.min.js"></script>';
		}
	}
	else{
?>
<script src="nesis-init.php"></script>
<script type="text/javascript" src="nesis/core/nesis.core.error-1.0.js"></script>
<script type="text/javascript" src="nesis/core/nesis.core.browser-1.0.js"></script>
<script type="text/javascript" src="nesis/core/nesis.core.cache-1.0.js"></script>
<script type="text/javascript" src="nesis/core/nesis.core.store-1.0.js"></script>
<script type="text/javascript" src="nesis/net/nesis.net.http-1.0.js"></script>
<script type="text/javascript" src="nesis/mvc/nesis.mvc-1.0.js"></script>
<script type="text/javascript" src="nesis/gui/nesis.mvc.gui.tabsAjax-1.0.js"></script>
<script type="text/javascript" src="nesis/gui/nesis.mvc.gui.accordianStatic-1.0.js"></script>
<script type="text/javascript" src="nesis/gui/nesis.mvc.gui.formAjax-1.0.js"></script>
<script type="text/javascript" src="nesis/gui/nesis.mvc.gui.textEditableAjax-1.0.js"></script>
<script type="text/javascript" src="nesis/gui/nesis.mvc.gui.lightbox-1.0.js"></script>
<script type="text/javascript" src="nesis/gui/nesis.mvc.gui.tabsStatic-1.0.js"></script>
<script type="text/javascript" src="nesis/gui/nesis.mvc.gui.typeahead-1.0.js"></script>
<script type="text/javascript" src="nesis/datasource/nesis.mvc.datasource.dom-1.0.js"></script>
<script type="text/javascript" src="nesis/datasource/nesis.mvc.datasource.ajax-1.0.js"></script>
<script type="text/javascript" src="nesis/mvc/nesis.mvc.event-1.0.js"></script>
<script type="text/javascript" src="nesis/mvc/nesis.mvc.nodecollection-1.0.js"></script>
<script type="text/javascript" src="nesis/mvc/nesis.mvc.node-1.0.js"></script>
<script type="text/javascript" src="nesis/mvc/nesis.mvc.router-1.0.js"></script>
<script type="text/javascript" src="nesis/mvc/nesis.mvc.controller-1.0.js"></script>
<script type="text/javascript" src="nesis/mvc/nesis.mvc.application-1.0.js"></script>
<script type="text/javascript" src="nesis/mvc/nesis.mvc.model-1.0.js"></script>
<script type="text/javascript" src="nesis/mvc/nesis.mvc.view-1.0.js"></script>
<script type="text/javascript" src="nesis/mvc/nesis.mvc.template-1.0.js"></script>
<?php 
	}
	if(isset($js)){
		echo '<script type="text/javascript">';
		echo $js;
		echo '</script>';
	}	
?>
</body>
</html>