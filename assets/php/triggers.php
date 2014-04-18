<?php

/*
===HOW TO USE===

Make a request to triggers.php (ONLY TRANSFER ENCRYPTED DATA!!!! If the AES-compliant encryption function hasn't been ported to your language, do NOT transfer data)
	xmlhttp.open("GET","assets/php/triggers.php?login&username="+encrypt(username),true);
Send your request
	xmlhttp.send();
This file will process the information, I have no idea if there's anything else

===TABLE OF CONTENTS===

login
	Will log the user in with the username in the url
	/triggers.php?login&username=Bob
*/

require "master.php";

if (isset($_GET['login'])) {
	$user->login($_GET['username']);
}

?>