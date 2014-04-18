<?php
/*
===TABLE OF CONTENTS===

sql
    sanitize()
        Sanitizes inputted content to make it safe for sql
        $sql->sanitize($_POST['email'])

log -- [[MOST LIKELY TO BE DEPRECATED]]
    logEvent()
        Logs an event, to be reviewed
        $log->logEvent($logged_in_user, $logged_in_users_ip, $user_being_acted_upon, $user_bring_acted_upons_stored_ip, $what_is_going_on, $url_of_page_this_is_beig_used_on, $some_relevant_id)
    changeFlag()
        ?? Needs to auto-detect what the current flag is, and change it
        Changes the flag status of a log
        $log->changeFlag(284, 0)

user
    chash()
        Hashes the inputted content
        $user->chash($password,$usersalt)
    createsalt()
        ?? Making the random number cryptographically secure would rock
        Creates a salt to be used with a user's password
        $user->createsalt("Bob")
    insertBlob()
        Inserts a blob (System Action -- logins, password recoveries, 2Step Auths, etc) for a user with a code and stuff
        $user->insertBlob("Bob", "gyhvji59yw85")
    login()
        Logs in a user, and then redirects them to the desired URL
        $user->login("Bob", "cake.com")
    logout()
        ?? Should allow for redirects like login() does
        ?? Needs to allow for deletion of all sessions
        Logs a user out of their current session, or all sessions
        $user->logout("Bob", "rtngv825", true)
    verify()
        Verifies a user session (input a cookie)
        $user->verify("fdghberthebth")
    get()
        Gets some information about a user -- The second input is not necessary
        $user->get("email", $bobsUsername)
    encrypt()
        Encrypts a user's content -- may not be needed
        $user->encrypt($newuseremail, $username, $usersalt)
    decrypt()
        Decrypts a user's content -- may not be needed
        $user->decrypt($encrypted_string, $username_of_owner_of_encrypted_string, $salt_of_owner)
    create()
        Creates a new user
        $user->create($_POST['username'], $_POST['email'], $_POST['password'])
    edit()
        Edit a user's stuff
        $user->edit("email", $newemail, "id", $usersID);
    ban()
        ?? Needs a matching bancheck() and unban()
        Bans a user
        $user->ban("Bob", $bobs_ip, "Was harassing people", "Zbee")
    nameAvailable()
        Checks if a username is available
        $user->nameAvailable("Bob")

blog
    create()
        Creates a new blog
        $blog->create($creatorofblog, $titleofblog, $contentofblog, $urlsofpicturesforblog)
    edit()
        Edit a blog's content
        $blog->edit("title", $newtitle, "id", $id)
    delete()
        Delete a blog
        $blog->delete("56", $username)

resources
    create()
        Creates a new resource pack
        $resource->create($creatorofresourcepack, $titleofresourcepack, $contentofresourcepack, $urlsofpicturesforresourcepack, $dlurl1, $dlurl2)
    edit()
        Edit a resource pack's content
        $resource->edit("title", $newtitle, "id", $id)
    delete()
        Delete a resource pack
        $resource->delete("56", $username)

content
    votecheck()
        Checks if the user has upvoted this yet or not
        $content->votecheck("blog", "56", $username)
    upvote()
        Upvotes the content
        $content->upvote("blog", "56", $username)
    downvote()
        Downvotes the content
        $content->downvote("blog", "56", $username)
    report()
        Reports the content to the moderators
        $content->report("blog", "56", $username, "I HATE IT! ARGGGGHH! D=")
    reportcheck()
        ?? Add in checking to see if the report has been cleared
        Checks if the content has been reported, and if it has it returns how many times it has been reported
        $content->reportcheck("blog", "56")
    addComment()
        ?? Need to check to see if that's how we want comments to be replies
        ?? Still need to figure out markdown situation
        Adds a comment to any content, can support being replied to
        $content->addComment("blog", "56", $username, "4", "I'm $username and I am commenting on blog 56 and replying to comment 4")
*/

class sql {
    
    #$sql->sanitize($_POST['email'])
    #Would return the sanitized version of the inputted email
    function sanitize($sql, $htmlAllowed = false) {
		$sql = preg_replace("/(drop table|show tables|`|\*|--|\\\\)/i","",$sql);
		$sql = trim($sql);
		if ($htmlAllowed ==== false) { $sql = strip_tags($sql); } #Some areas might have HTML, I dunno
        $sql = addslashes($sql);
		return $sql;
	}
    
}

class log {
    
    #$log->logEvent($logged_in_user, $logged_in_users_ip, $user_being_acted_upon, $user_bring_acted_upons_stored_ip, $what_is_going_on, $url_of_page_this_is_beig_used_on, $some_relevant_id)
    #Would insert a log of the event
    function logEvent($actinguser, $actinguserip, $affecteduser="SYSTEM", $affecteduserip="NA", $event, $sourceurl, $relevantid) {
        $actinguser     = $sql->sanitize($actinguser);
        $actinguserip   = $sql->sanitize($actinguserip);
        $affecteduser   = $sql->sanitize($affecteduser);
        $affecteduserip = $sql->sanitize($affecteduserip);
        $event          = $sql->sanitize($event);
        $sourceurl      = $sql->sanitize($sourceurl);
        $relevantid     = $sql->sanitize($relevantid);
        $date           = time();
        mysql_query("INSERT INTO log (actinguser, actinguserip, affecteduser, affecteduserip, event, sourceurl, date) VALUES (
        '".$actinguser."', '".$actinguserip."', '".$affecteduser."', '".$affecteduserip."', '".$event."', '".$sourceurl."', '".$date."')");
    }
    
    #$log->changeFlag(284, 0)
    #Would changethe flag of the log item with the id of 284 to "0" which is off (unflagged)
    function changeFlag($logid, $newstatus) {
        $logid        = $sql->sanitize($logid);
        $newstatus    = $sql->sanitize($newstatus);
        mysql_query("UPDATE log SET flag='".$newstatus."' WHERE id='".$logid."'");
    }

}

class user {
    
    #$user->chash($password,$usersalt)
    #Will return a hashed version of the password + the salt
    function chash($data, $salt) {
        return hash("sha256", $data.$salt);
    }
    
    #$user->createsalt("Bob")
    #Will create a custom salt for Bob that will be 64 characters long
    function createsalt($username, $length = 3) {
        return hash("sha256", $username.substr(str_shuffle(str_repeat("123456789073", 5)), 0, $length));
    }
    
    #$user->insertBlob("Bob", "gyhvji59yw85")
    #Will insert a session blob for Bob with the given hash, it will also tie the blob to the user's current IP
    function insertBlob($username, $hash, $action="session") {
        $username = $sql->sanitize($username);
        $hash     = $sql->sanitize($hash);
        $ip       = $_SERVER['REMOTE_ADDR'];
		$time     = time();

		$query    = mysql_query("INSERT INTO userblobs (user, code, action, ip, date) VALUES ('$username', '$hash', '$action', '$ip', '$time')");   
    }

    #$user->login("Bob", "cake.com")
    #Will login the user Bob, and then redirect to cake.com
    function login($username, $url="/") {
        $username = $sql->sanitize($username);
        $hash     = $user->createsalt($username, 7);

        setcookie("MWS", $hash, strtotime('+60 days'), "/", **DOMAIN**);
        $user->insertBlob($username, $hash);
        header("Location: ".$url);
    }

    #$user->logout("Bob", "rtngv825", true)
    #Would log bob out of all sessions and destroy his current one
    function logout($username, $hash, $all=false) {
        $username = $sql->sanitize($username);
        $hash     = $sql->sanitize($hash);
        $all      = $sql->sanitize($all);

        #Remove cookie
        #Remove that one hash from the blob-abase
        #If all=true, then remove ALL blobs in blob-abase for that user
    }

    #$user->verify("fdghberthebth")
    #Would search through current blobs and see if there's a blob with the code of "fdghberthebth", if so, it returns true
    function verify($hash) {
        $hash     = $sql->sanitize($hash);
        $time     = time();
        
        $query    = mysql_query("SELECT * FROM blobs WHERE code='$hash' AND date>'$time' AND action='session'");
        $numrows  = mysql_num_rows($query);
        if ($numrows > 0) { return TRUE; } else { return FALSE; }
    }

    #$user->get("email")
    #Would return the email of the current logged in user
    #$user->get("email", $bobsUsername)
    #Would return the email with the username of $bobsUsername
    function get($what, $session = false) {
        $what    = $sql->sanitize($what);
        $where   = $sql->sanitize($where);
        $is      = $sql->sanitize($is);
        $session = $sql->sanitize($session);

        #search through blob-abase for the set session
        #then grab the username attached to the blob
        #search through user-base for grabbed username
        #return the $what value

        if ($session === false) {
            $session = $_COOKIE[**DOMAIN**];
            $time    = time();
            
            $query = mysql_query("SELECT * FROM blobs WHERE code='$session' AND date>'$time' AND action='session'");
            $numrows = mysql_num_rows($query);
            while($value = mysql_fetch_array($query)) { $username = $value['user']; }

            if ($numrows > 0)
            {
                $query = mysql_query("SELECT * FROM users WHERE username='$username'");
                while($value = mysql_fetch_array($query))
                {
                    return $value[$what];
                }
            }
        }
        else {
            $query = mysql_query("SELECT * FROM users WHERE username='$session'");
            $numrows = mysql_num_rows($query);
            if ($numrows === 1)
            {
                while($value = mysql_fetch_array($query))
                {
                    return $value[$what];
                }
            }
        }
    }

    #$user->encrypt($newuseremail, $newuserusername, $newusersalt)
    #Will return the encrypted version of $newuseremail
    function encrypt($decrypted, $username, $salt) {
        $key       = hash('SHA256', $salt . $username, true);
        srand();
        $iv        = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC), MCRYPT_RAND);
        if (strlen($iv_base64 = rtrim(base64_encode($iv), '=')) != 22) { return false; }
        $encrypted = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $decrypted . md5($decrypted), MCRYPT_MODE_CBC, $iv));
        return $iv_base64 . $encrypted;
     } 
    
    #$user->decrypt($encrypted_string, $username_of_owner_of_encrypted_string, $salt_of_owner)
    #Would return the decrypted version of $encrypted_string
    function decrypt($encrypted, $username, $salt) {
        $key        = hash('SHA256', $salt . $username, true);
        $iv         = base64_decode(substr($encrypted, 0, 22) . '==');
        $encrypted  = substr($encrypted, 22);
        $decrypted  = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, base64_decode($encrypted), MCRYPT_MODE_CBC, $iv), "\0\4");
        $hash       = substr($decrypted, -32);
        $decrypted  = substr($decrypted, 0, -32);
        if (md5($decrypted) != $hash) { return false} ;
        return $decrypted;
     }
    
    #$user->create($_POST['username'], $_POST['email'], $_POST['password'])
    #Would create a user directly from the posted content of a form
    function create($username, $email, $password) {
        $username = strtolower($sql->sanitize($username));
        $email    = $sql->sanitize($email);
        $salt     = $user->createsalt($username);
        $password = $user->chash($password, $salt);
        $date     = time();
        $lli      = "0000000000";

        mysql_query("INSERT INTO users (username, permusername, email, permemail, password, salt, date_r, date_l, date_lo) VALUES ('$username', '$username', '$email', '$email', '$password', '$salt', '$date', '$date', '$date')");
    }
    
    #$user->edit("email", $newemail, "id", $id);
    #Would update the email of a user where the id was equal to the current set id
    #$user->edit("2step", "1", "username", $username)
    #Would update the 2step setting of the user to 1, which would enable it
    function edit($what, $to, $where, $is) {
        $what  = $sql->sanitize($what);
        $to    = $sql->sanitize($to);
        $where = $sql->sanitize($where);
        $is    = $sql->sanitize($is);
        
        if ($what === "password") {
            $extra = ", salt='".createsalt(get("username"))."'";
        }
        
        mysql_query("UPDATE users SET ".$what."='".$to."'".$extra." WHERE ".$where."='".$is."'");
    }
    
    #$user->ban("Bob", $bobs_ip, "Was harassing people", "Zbee")
    #Zbee would be banning Bob and his IP since he was harassing people
    function ban($username, $ip, $reason, $issuer="SYSTEM") {
        $username = strtolower($sql->sanitize($username));
        $ip       = $sql->sanitize($ip);
        $reason   = $sql->sanitize($reason);
        $issuer   = $sql->sanitize($issuer);
        $date     = time();

        mysql_query("INSERT INTO banned (username, ip, reason, issuer, date) VALUES ('$username', '$ip', '$reason', '$date')");
    }
    
    #$user->nameAvailable("Bob")
    #Would check if there's already a useranme named Bob
    function nameAvailable($username) {
        $username = $sql->sanitize($username);

        $query    = mysql_query("SELECT * FROM users WHERE username='".$username."'");
		$numrows  = mysql_num_rows($query);
        if ($numrows !== 0) {
            return false;
        } else {
            return true;
        }
    }
}

class blog {
    
    #$blog->create($creatorofblog, $titleofblog, $contentofblog, $urlsofpicturesforblog)
    #Would create a blog post
    function create($byuser, $title, $content, $picurls) {
        $byuser  = $sql->sanitize($byuser);
        $title   = $sql->sanitize($title);
        $content = $sql->sanitize($content);
        $picurls = $sql->sanitize($picurls);
        $date    = time();

        mysql_query("INSERT INTO blogs (byuser, title, picurls, content, date) VALUES ('".$byuser."', '".$title."', '".$picurls."', '".$content."', '".$date."')");
    }
    
    #blog->edit($whatisbeingchanged, $whatitisbeingchangedto, $wheremodifier, $modifierofwhere)
    #Would update the blog post where $wheremodifier equals $modiferofwhere
    function edit($what, $to, $where, $is) {
        $what  = $sql->sanitize($what);
        $to    = $sql->sanitize($to);
        $where = $sql->sanitize($where);
        $is    = $sql->sanitize($is);

        mysql_query("UPDATE blogs SET ".$what."='".$to."' WHERE ".$where."='".$is."'");
    }

    #$blog->delete("56", $username)
    #Would delete blog 56 by user $username
    function delete($id, $byuser) {
        $id      = $sql->santize($id);
        $byuser  = $sql->sanitize($byuser);

        mysql_query("DELETE FROM blogs WHERE id='".$id."' AND username='".$byuser."' LIMIT 1");
    }        
}

class resource {
    
    #$resource->create($creatorofresourcepack, $titleofresourcepack, $contentofresourcepack, $urlsofpicturesforresourcepack, $dlurl1, $dlurl2)
    #Would create a recource pack with pictures
    function create($byuser, $title, $content, $picurls, $dlurl1, $dlurl2) {
        $byuser  = $sql->sanitize($byuser);
        $title   = $sql->sanitize($title);
        $content = $sql->sanitize($content);
        $picurls = $sql->sanitize($picurls);
        $dlurl1  = $sql->sanitize($dlurl1);
        $dlurl2  = $sql->sanitize($dlurl2);

        mysql_query("INSERT INTO resources (byuser, title, picurls, content, date, dlurl1, dlurl2) VALUES ('".$byuser."', '".$title."', '".$picurls."', '".$content."', '".$date."', '".$dlurl1."', '".$dlurl2."')");
    }
    
    #$resource->edit("title", "boboboobob", "id", $idofresourcepack)
    #Would edit the title of the resource pack with the id of $idofresourcepack to be "boboboobob"
    function edit($what, $to, $where, $is) {
        $what  = $sql->sanitize($what);
        $to    = $sql->sanitize($to);
        $where = $sql->sanitize($where);
        $is    = $sql->sanitize($is);

        mysql_query("UPDATE resources SET ".$what."='".$to."' WHERE ".$where."='".$is."'");
    }

    #$resource->delete("56", $username)
    #Would delete resource pack 56 by user $username
    function delete($id, $byuser) {
        $id      = $sql->santize($id);
        $byuser  = $sql->sanitize($byuser);

        mysql_query("DELETE FROM resources WHERE id='".$id."' AND username='".$byuser."' LIMIT 1");
    }    
    
}

class content {
    
    #$content->votecheck("blog", "56", $username)
    #Would check if $username is inside of blog 56's vote column
    function votecheck($whatisit, $id, byuser) {
        $whatisit = $sql->sanitize($whatisit);
        $id       = $sql->sanitize($id);
        $byuser   = $sql->sanitize($byuser);

        $query = mysql_query("SELECT * FROM `".$whatisit."` WHERE id='".$id."'");
		while($value = mysql_fetch_array($query)) { 
			if (strpos($value['upvotes'],$byuser) !== FALSE) {
                return "upvoted";
            } elseif (strpos($value['downtes'],$byuser) !== FALSE) {
                return "downvoted";
            } else {
                return false;
            }
		}
    }
    
    #$content->upvote("blog", "56", $username)
    #Would add $username to blog 56's upvotes column 
    function upvote($whatisit, $id, $byuser) {
        $whatisit = $sql->sanitize($whatisit);
        $id       = $sql->sanitize($id);
        $byuser   = $sql->sanitize($byuser);

        $query = mysql_query("SELECT * FROM `".$whatisit."` WHERE id='".$id."'");
		while($value = mysql_fetch_array($query)) { 
			if (strpos($value['downvotes'],$byuser) !== FALSE) {
                $votes = str_replace('[@~]'.$byuser, '', $value['downvotes']);
                mysql_query("UPDATE `".$whatisit."` SET downvotes='".$votes."' WHERE id='".$id."'");
                return true;
            }
            
            if (strpos($value['upvotes'],$byuser) !== FALSE) {
                return true;
            } else {
                $votes = $value['upvotes']."[@~]".$byuser;
                mysql_query("UPDATE `".$whatisit."` SET upvotes='".$votes."' WHERE id='".$id."'");
                return true;
            }
		}
    }
    
    #$content->downvote("blog", "56", $username)
    #Would add $username to blog 56's downvotes column 
    function downvote($whatisit, $id, $byuser) {
        $whatisit = $sql->sanitize($whatisit);
        $id       = $sql->sanitize($id);
        $byuser   = $sql->sanitize($byuser);

        $query = mysql_query("SELECT * FROM `".$whatisit."` WHERE id='".$id."'");
		while($value = mysql_fetch_array($query)) { 
			if (strpos($value['upvotes'],$byuser) !== FALSE) {
                $votes = str_replace('[@~]'.$byuser, '', $value['upvotes']);
                mysql_query("UPDATE `".$whatisit."` SET upvotes='".$votes."' WHERE id='".$id."'");
                return true;
            }
            
            if (strpos($value['downvotes'],$byuser) !== FALSE) {
                return true;
            } else {
                $votes = $value['downvotes']."[@~]".$byuser;
                mysql_query("UPDATE `".$whatisit."` SET downvotes='".$votes."' WHERE id='".$id."'");
                return true;
            }
		}
    }
    
    #$content->report("blog", "56", $username, "I HATE IT! ARGGGGHH! D=")
    #Would report blog 56 to the moderators
    function report($whatisit, $id, $byuser, $reason) {
        $whatisit = $sql->sanitize($whatisit);
        $id       = $sql->sanitize($id);
        $byuser   = $sql->sanitize($byuser);
        $reason   = $sql->sanitize($reason);
        $date     = time();
        $query    = mysql_query("SELECT * FROM `reports` WHERE cid='".$id."' AND type='".$whatisit."' AND by='".$byuser."'");
		$numrows  = mysql_num_rows($query);

        if ($numrows <= 2) {
            mysql_query("INSERT INTO `reports` (type, cid, by, date, reason) VALUES ('".$whatisit."', '".$id."', '".$byuser."', '".$date."', '".$reason."')");
        }
    }
    
    #$content->reportcheck("blog", "56")
    #Would check if blog 56 has been reported -- It returns a number if it has been, so you could not show it if it had more than 10 reports or something
    function reportcheck($whatisit, $id) {
        $id = $sql->sanitize($id);

        $query    = mysql_query("SELECT * FROM `reports` WHERE cid='".$id."' AND type='".$whatisit."'");
		$numrows  = mysql_num_rows($query);
        if ($numrows !== 0) {
            return $numrows;
        } else {
            return false;
        }
    }

    #$content->addComment("blog", "56", $username, "4", "I'm $username and I am commenting on blog 56 and replying to comment 4")
    #Would add a comment to blog 56 by $username which is a reply to comment number 4
    function addComment($whatisit, $id, $byuser, $replyto, $content) {
        $whatisit  = $sql->sanitize($whatisit);
        $id        = $sql->sanitize($id);
        $byuser    = $sql->sanitize($byuser);
        $replyto   = $sql->sanitize($replyto);
        $content   = $sql->sanitize($conrent); #This will need to have markdown[basic] enabled (italics, bold, links)
        $time      = time();

        mysql_query("INSERT INTO `comments` (type, cid, by, date, replyto, content) VALUES ('".$whatisit."', '".$id."', '".$byuser."', '".$time."', '".$replyto."', '".$content."')");
    }
    
}

?>