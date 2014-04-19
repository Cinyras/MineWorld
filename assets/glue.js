var xmlhttp;
if (window.XMLHttpRequest) {
    //code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
}

else {
    //code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
          
function isUsernameTaken(username) {
    if (username.length != 0) {
              document.getElementById("error-hole").innerHTML="CHECK";
              return;
          };
    
    xmlhttp.open("GET","assets/php/master.php?u="+username,true);
    xmlhttp.send();
}