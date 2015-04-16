<?php
	$return = new stdClass();
   	$return->row = $_POST['data'];

	echo json_encode((array)$return);
?>