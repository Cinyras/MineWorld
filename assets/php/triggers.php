<?php

/*
===HOW TO USE===

Make a request to triggers.php (ONLY TRANSFER ENCRYPTED DATA!!!! If the AES-compliant encryption function hasn't been ported to your language, do NOT transfer data)
	xmlhttp.open("GET","assets/php/triggers.php?login&username="+encrypt(username),true);
Send your request
	xmlhttp.send();
This file will process the information, then echo out any pertinent info

===TABLE OF CONTENTS===

login
	Will log the user in with the username in the url
	/triggers.php?login&username=Bob
logout
	Will log the user out, it can log out all sessions of the uset
	/triggers.php?logout&username=Bob&code=gfrnhiwe5thywn7v68&all=false
get
	Will get user information
	/triggers.php?get&type=email
nameAvailable
	Will check if the username is avilable
	/triggers.php?nameAvailable&username=Bob
*/

require "master.php";

#/triggers.php?login&username=Bob
if (isset($_GET['login'])) {
	echo $user->login($_GET['username']);
}

#/triggers.php?logout&username=Bob&code=gfhetvyurtghysftyi&all=false
if (isset($_GET['logout'])) {
	if ($_GET['all'] === 'true') { $all = true } else { $all = false; }
	echo $user->logout($_GET['username'], $_GET['code'], $all);
}

#/triggers.php?verify&code=gfnhw785nmhyw9857yvw875y
if (isset($_GET['verify'])) {
	echo $user->verify($_GET['code'])
}

#/triggers.php?get&type=email
if (isset($_GET['get'])) {
	if (isset($_GET['session'])) { $session = $_GET['session']; } else { $session = false; }
	echo $user->get($_GET['type'], $session);
}

#/triggers.php?nameAvailable&username=Bob
if (isset($_GET['nameAvailable'])) {
	echo $user->nameAvailable($_GET['username']);
}

?>