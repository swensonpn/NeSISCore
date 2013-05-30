
<?php
if(empty($_POST)){
	$_POST['name']="";
	$_POST['phone']="";
	$_POST['state']="";
	$_POST['text']="";
	$_POST['tester2']="";
}
else{
	echo "<h5 style=\"color:red;\">saved</h5>";
}
?>
<h3>Ajax Form</h3>
<div style="margin:0 25px;">
<form id="f1" action="http://localhost/nesisCore/NeSISCore/WebContent/content2.php#goodbye">
	<label>Name</label>
	<input name="name" type="text" value="<?php echo $_POST['name']?>"/><br/>
	<label>Phone</label>
	<input name="phone" type="text" value="<?php echo $_POST['phone']?>"/><br/>
	<label>State</label>
	<select name="state">
		<option value="NE" <?php if(strcmp($_POST['state'],'NE')==0) echo "selected";?>>Nebraska</option>
		<option value="KS" <?php if(strcmp($_POST['state'],'KS')==0) echo "selected";?>>Kansas</option>
	</select><br>
	<label>Text</label>
	<textarea name="text"><?php echo $_POST['text']?></textarea>
	<br/><br/>
	<input type="submit" value="Submit"/>
</form>
<!-- 
<form id="f2" action="http://localhost/nesisCore/NeSISCore/WebContent/content3.php"></form>
<label>Field attached to a different form submits on field change</label><input name="tester" type="text" form="f2"/><br/>
-->
<label>Field attached to the main form from somewhere else on the page</label><input name="tester2" type="text" <?php echo $_POST['text'];?> form="f1"/>

</div>