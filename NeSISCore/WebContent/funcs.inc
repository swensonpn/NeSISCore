<?php 
	function echoInputs($arr){
		uksort($arr,"sortFunc");
		echo '<ul style="list-style-type:none;">';
		foreach($arr as $key=>$val){
			if(strpos($key,'.js') === false){
				echo '<h4>'.$key.'</h4>';
				echoInputs($arr[$key]);
			}
			else{
				echo '<li><input id="'.$key.'" type="checkbox" name="'.$key.'" checked/>';
				echo '<label style="display:inline; padding:5px;"  for="'.$key.'">'.$val.'</label></li>';
			}
		}
		echo '</ul>';
	}
	
	function sortFunc($a,$b){
		$aIsFile = strpos($a,'.js');
		$bIsFile = strpos($b,'.js');
		
			
		if($a == $b) return 0;
		else if($aIsFile === false && $bIsFile === false){
			return ($a < $b) ? -1 : 1;
		}
		else if($aIsFile !== false && $bIsFile !== false){
			return ($a < $b) ? -1 : 1;
		}
		else{
			return ($aIsFile === false) ? 11 : -1;
		}
	}
	
	function writePackages($fh,$arr){
		foreach($arr as $key=>$val){
			if(is_array($val)){
				writePackages($fh,$val);
			}
			else{
				fwrite($fh,"\n\n//Package: ".$val."\n");
				fwrite($fh,file_get_contents($val));
			}
		}
	}
?>
