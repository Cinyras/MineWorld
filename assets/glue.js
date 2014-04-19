var xmlhttp;
if (window.XMLHttpRequest) {
    //code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
}

else {
    //code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}

/*********************************************************************\
|*********************     TABLE-OF-CONTENTS     *********************|
|                                                                     |
| isUsernameTaken(username):                                          |
|   Check if the username is taken. If not, then return false. If it's|
|   taken, return true                                                |
|                                                                     |
|                                                                     |
\*********************************************************************/

function isUsernameTaken(username) {
    
    if (username.length > 0) {
        
        document.getElementById("error-hole").innerHTML="CHECK";
        return;
        
    };
    
    xmlhttp.onreadystatechange=function() {
        
        if (xmlhttp.readystate==4 && xmlhttp.status==200) {
            
            
            return;
            
        }
        
    }
    
    xmlhttp.open("GET","assets/php/master.php?u="+username,true);
    xmlhttp.send();
}