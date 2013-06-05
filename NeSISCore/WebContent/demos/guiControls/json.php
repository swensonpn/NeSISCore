<?php 
$arr = array(
			"name"=>"Paul Swenson",
			"office"=>"Otto Olsen 111",
			"email"=>"swensonpn@unk.edu",
			"title"=>"Web Applications Developer",
			"emplid"=>"12345678"
		);

header("content-type:text/json");
echo json_encode($arr);
?>