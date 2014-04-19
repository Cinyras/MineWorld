<?php

/*
===HOW TO USE===

Make a request to triggers.php (ONLY TRANSFER ENCRYPTED DATA!!!! If the AES-compliant encryption function hasn't been ported to your language, do NOT transfer data)
	xmlhttp.open("GET","assets/php/triggers.php?login&username="+encrypt(username),true);
Send your request
	xmlhttp.send();
This file will process the information, then echo out any pertinent info

===TABLE OF CONTENTS===

nameAvailable
	Will check if the username is avilable
	/triggers.php?nameAvailable&username=Bob
login
	Will log the user in with the username in the url
	/triggers.php?login&username=Bob
*/

require "master.php";

#/triggers.php?nameAvailable&username=Bob
if (isset($_GET['nameAvailable'])) {
	echo $user->nameAvailable($_GET['username']);
}

#/triggers.php?login&username=Bob
if (isset($_GET['login'])) {
	echo $user->login($_GET['username']);
}

?>