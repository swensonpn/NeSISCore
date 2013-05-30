<h3>Ajax Editable Content</h3>
<?php 
if(empty($_POST)){
	$_POST['edit1']="";
	$_POST['edit2']="";
	$_POST['edit3']="";
	$_POST['edit4']="";
	$_POST['edit5']="";
}
?>
<div style="margin:0 25px;">
<h4>Personal Information</h4>
<table>
<tr>
<td align="right"><b>Home Address: </b></td>
<td>
<div id="edit1" contenteditable="true"><?php if(!empty($_POST['edit1'])){echo $_POST['edit1'];}else{echo "empty";}; ?></div>
</td>
</tr>
<tr>
<td align="right"><b>Phone Number: </b></td>
<td>
<div id="edit3" contenteditable="true"><?php if(!empty($_POST['edit3'])){echo $_POST['edit3'];}else{echo "empty";}; ?></div>
</td>
</tr>
<tr>
<td align="right"><b>Personal Email: </b></td>
<td>
<div id="edit5" contenteditable="true"><?php if(!empty($_POST['edit5'])){echo $_POST['edit5'];}else{echo "empty";}; ?></div>
</td>
</tr>
<tr>
<td align="right"><b>Campus Email: </b></td>
<td>
<div id="edit2" contenteditable="false">swensonpn@unk.edu</div>
</td>
</tr>
</table>
</div>