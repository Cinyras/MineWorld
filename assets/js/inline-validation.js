/*
  --__--__NOTES__--__--
    1. all variable names with '$' at the beginning contain a jQuery object
    2. any parameter that takes a jQuery object can also take a css selector as a string
    3. all parameters that are booleans will default to false if unspecified
    4. all <span>s directly under an input will be assumed to be a validity glyphicon by any function that changes validity status

  --__--__TABLE OF CONTENTS__--__--
    1. isEmailValid(String[address]); Description:"Checks if email is in a valid format, returns a boolean" Line:
    2. isUserValid(String[username]); Description:"Checks if username is in a valid format, returns a boolean" Line:
    3. isPassValid(String[password]); Description:"Checks if password is in a valid format, returns a boolean" Line:
    4. doMatch($input1, $input2, clean); Description:"Tests if to form fields have equal content, there is an optional 'clean' parameter that will trim content and make it lowercase, returns a boolean" Line:
    5. enableButton(Object[$button]); Description:"" Line:
    6. disableButton(Object[$button]); Description:"" Line:
    7. clearForm(Object[$form]); Description:"" Line:
    8. clearValidity(Object[object]); Description:"" Line:
    9. makeValid(Object[object], String[message], Boolean[hasSymbol]); Description:"" Line:
    10. makeWarning(Object[object], String[message], Boolean[hasSymbol]); Description:"" Line:
    11. makeInvalid(Object[object], String[message], Boolean[hasSymbol]); Description:"" Line:
    12. validateUsername(Object[$field], Object[$group]); Description:"" Line:
    13. validateEmail(Object[$field1], Object[$field2], Object[$group1], Object[$group2]); Description:"" Line:
    14. validatePassword(Object[$field1], Object[$field2], Object[$group1], Object[$group2]); Description:"" Line:
    15. userAvailable(); Description:"" Line:
*/
var isEmailValid = function (address) { //Check String Against Valid Email Regular Expression
  var pattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/i);
  return pattern.test(address);
};

var isUserValid = function (username) { //Check String Against Valid Username Regular Expression
  var pattern = new RegExp(/^[a-zA-Z0-9._-]{3,45}$/i);
  return pattern.test(username);
};

var isPassValid = function (password) { //Check Password For Validity
  var pattern = new RegExp(/(drop table|show tables|`|\*|--|\\\\)/i); //THIS IS NOT WORKING AND I DON'T KNOW WHY
  var pattern2 = new RegExp(/.{6,64}/i);
  return (!pattern.test(password)) && pattern2.test(password);
};

var doMatch = function ($input1, $input2, clean) { //function to test if inputs match
  $input1 = (typeof $input1 === "string") ? $($input1) : $input1;
  $input2 = (typeof $input2 === "string") ? $($input2) : $input2;
  $clean = (typeof $clean === "boolean") ? clean : false;

  var value1 = (clean) ? jQuery.trim($input1.val().toLowerCase()) : $input1.val();
  var value2 = (clean) ? jQuery.trim($input2.val().toLowerCase()) : $input2.val();

  return (value1 === value2);
};

var enableButton = function ($button) { //function to enable a disabled button
  $button = (typeof $button === "string") ? $($button) : $button;

  if($button.hasClass('disabled'))
  {
    $button.removeClass('disabled');
  }
  $button.removeAttr('disabled');
};

var disableButton = function ($button) { //function to disable an enabled button
  $button = (typeof $button === "string") ? $($button) : $button;

  if(!($button.hasClass('disabled')))
  {
    $button.addClass('disabled');
  }
  $button.removeAttr('disabled');
  $button.attr('disabled','disabled');
};

var clearForm = function ($form) {
  $form = (typeof $form === "string") ? $($form) : $form;

  $form.find("input").val("");
  $form.find(".form-group").each(function (i, $item) {
    clearValidity($($item));
  });
};

var clearValidity = function(object){ //function to get rid of green/yellow/red
  object = (typeof object === "string") ? $(object) : object;

  //remove color
  if(object.hasClass('has-success'))
  {
    object.removeClass('has-success');
  }
  if(object.hasClass('has-warning'))
  {
    object.removeClass('has-warning');
  }
  if(object.hasClass('has-error'))
  {
    object.removeClass('has-error');
  }

  //check for/remove symbol (all spans after inputs are excepcted to be symbols)
  object.find("span").each(function(i, sym) {
    sym = $(sym);
    if(sym.prev().is("input"))
    {
      if(sym.hasClass('glyphicon-ok'))
      {
        sym.removeClass('glyphicon-ok');
      }
      if(sym.hasClass('glyphicon-warning-sign'))
      {
        sym.removeClass('glyphicon-warning-sign');
      }
      if(sym.hasClass('glyphicon-remove'))
      {
        sym.removeClass('glyphicon-remove');
      }
    }
  });

  //check for/remove message
  object.find(".hasPop").removeAttr('data-content');
  object.find(".hasPop").removeAttr('data-original-title');
};

var makeValid = function(object, message, hasSymbol){ //function to make green
  object = (typeof object === "string") ? $(object) : object;
  showMessage = (typeof message === "string"); //whether or not a message was specified
  hasSymbol = (typeof hasSymbol === "boolean") ? hasSymbol : false; //default has symbol to false

  clearValidity(object);

  //change color
  if(!(object.hasClass('has-success')))
  {
    object.addClass('has-success');
  }

  //change symbol
  if(hasSymbol)
  {
    object.find("span").each(function(i, sym) {
      sym = $(sym);
      if(sym.prev().is("input"))
      {
        if(!(sym.hasClass('glyphicon-ok')))
        {
          sym.addClass('glyphicon-ok');
        }
      }
    });
  }

  //change message
  if(showMessage)
  {
    object.find(".hasPop").attr("data-original-title","Valid");
    object.find(".hasPop").attr("data-content",message);
  }
};

var makeWarning = function(object, message, hasSymbol){ //function to make red
  object = (typeof object === "string") ? $(object) : object;
  showMessage = (typeof message === "string"); //whether or not a message was specified
  hasSymbol = (typeof hasSymbol === "boolean") ? hasSymbol : false; //default has symbol to false

  clearValidity(object);

  //change color
  if(!(object.hasClass('has-warning')))
  {
    object.addClass('has-warning');
  }

  //change symbol
  if(hasSymbol)
  {
    object.find("span").each(function(i, sym) {
      sym = $(sym);
      if(sym.prev().is("input"))
      {
        if(!(sym.hasClass('glyphicon-warning-sign')))
        {
          sym.addClass('glyphicon-warning-sign');
        }
      }
    });
  }

  //change message
  if(showMessage)
  {
    object.find(".hasPop").attr("data-original-title","Warning");
    object.find(".hasPop").attr("data-content",message);
  }
};

var makeInvalid = function(object, message, hasSymbol){ //function to make red
  object = (typeof object === "string") ? $(object) : object;
  showMessage = (typeof message === "string"); //whether or not a message was specified
  hasSymbol = (typeof hasSymbol === "boolean") ? hasSymbol : false; //default has symbol to false

  clearValidity(object);

  //change color
  if(!(object.hasClass('has-error')))
  {
    object.addClass('has-error');
  }

  //change symbol
  if(hasSymbol)
  {
    object.find("span").each(function(i, sym) {
      sym = $(sym);
      if(sym.prev().is("input"))
      {
        if(!(sym.hasClass('glyphicon-remove')))
        {
          sym.addClass('glyphicon-remove');
        }
      }
    });
  }

  //change message
  if(showMessage)
  {
    object.find(".hasPop").attr("data-original-title","Invalid");
    object.find(".hasPop").attr("data-content",message);
  }
};

var validateUsername = function ($field, $group) { //Check for valid username and style input accordingly
  $field = (typeof $field === "string") ? $($field) : $field;
  $group = (typeof $group === "string") ? $($group) : $group;

  var isGood = false;

  var value = jQuery.trim($field.val().toLowerCase());
  if(typeof $group != "undefined")
  {
    if(value.length > 0)
    {
      if(isUserValid(value))
      {
        makeValid($group,"You're Good<br><br>Note: Usernames are case insensitive and trailing spaces are ignored.",true);
        isGood = true;
      }
      else
      {
        makeInvalid($group,"Invalid Username<br><br>Usernames Must:<br>&emsp;-Be at least 3 characters<br>&emsp;-Be less than 45 characters<br>&emsp;-Not have spaces<br>&emsp;-Not include symbols other than [._-]",true);
      }
    }
    else
    {
      clearValidity($group);
    }
  }
  else
  {
    if(value.length > 0)
    {
      if(isUserValid(value))
      {
        isGood = true;
      }
    }
  }
  return isGood;
};

var validateEmail = function ($field1, $field2, $group1, $group2)
{
  $field1 = (typeof $field1 === "string") ? $($field1) : $field1;
  $field2 = (typeof $field2 === "string") ? $($field2) : $field2;
  $group1 = (typeof $group1 === "string") ? $($group1) : $group1;
  $group2 = (typeof $group2 === "string") ? $($group2) : $group2;

  var isGood = false;

  var value = jQuery.trim($field1.val().toLowerCase());

  if(typeof $group1 != "undefined" && typeof $group2 != "undefined")
  {
    if(value.length > 0)
    {
      //not empty
      if(isEmailValid(value))
      {
        //valid
        if(doMatch($field1, $field2, true))
        {
          //valid and match
          makeValid($group1, "You're Good", true);
          makeValid($group2, "You're Good", true);
          isGood = true;
        }
        else
        {
          //valid but don't match
          makeWarning($group1, "Warnings:<br>&emsp;-Confirmation Email Doesn't Match", true);
          makeWarning($group2, "Warnings:<br>&emsp;-Confirmation Email Doesn't Match", true);
        }
      }
      else
      {
        makeInvalid($group1, "Invalid Email<br><br>All Emails Must:<br>&emsp;-Be Valid", true);
        makeInvalid($group2, null, true);
      }
    }
    else
    {
      //empty
      clearValidity($group1);
      clearValidity($group2);
    }
  }
  else
  {
    if(value.length > 0)
    {
      if(isEmailValid(value))
      {
        if(doMatch($field1, $field2, true))
        {
          isGood = true;
        }
      }
    }
  }
  return isGood;
};

var validatePassword = function ($field1, $field2, $group1, $group2) {
  $field1 = (typeof $field1 === "string") ? $($field1) : $field1;
  $field2 = (typeof $field2 === "string") ? $($field2) : $field2;
  $group1 = (typeof $group1 === "string") ? $($group1) : $group1;
  $group2 = (typeof $group2 === "string") ? $($group2) : $group2;

  var isGood = false;

  var value = $field1.val();

  if(typeof $group1 != "undefined" && typeof $group2 != "undefined")
  {
    if(value.length > 0)
    {
      if(isPassValid(value))
      {
        if(doMatch($field1,$field2))
        {
          makeValid($group1, "You're Good", true);
          makeValid($group2, "You're Good", true);
          isGood = true;
        }
        else
        {
          makeWarning($group1, "Warnings:<br>&emsp;-Confirmation Password Doesn't Match", true);
          makeWarning($group2, "Warnings:<br>&emsp;-Confirmation Password Doesn't Match", true);
        }
      }
      else
      {
        //Invalid Password
        makeInvalid($group1, "Invalid Password<br><br>All Passwords Must:<br>&emsp;-Be at least 6 characters<br>&emsp;-Be less than 64 characters", true);
        makeInvalid($group2, "Invalid Password<br><br>All Passwords Must:<br>&emsp;-Be at least 6 characters<br>&emsp;-Be less than 64 characters", true);
      }
    }
    else
    {
      //Field Empty
      clearValidity($group1);
      clearValidity($group2);
    }
  }
  else
  {
    //Test Onlyd
    if(value.length > 0)
    {
      if(isPassValid(value))
      {
        if(doMatch($field1, $field2))
        {
          isGood = true;
        }
      }
    }
  }

  return isGood;
};

//Non-reusable functions
var userAvailable = function ($field, $group) {
  $field = (typeof $field === "string") ? $($field) : $field;
  $group = (typeof $group === "string") ? $($group) : $group;

  var username = jQuery.trim($field.val().toLowerCase());

  if(username === "taken")
  {
    makeWarning($group,"Warnings:<br>&emsp;-Username Taken",true);
  }
  return (username != "taken"); //eventually this will test for availability lol
};

var createAccountReady = function ($user, userAvailable, $email, $emailC, $pass, $passC) {
  var username = jQuery.trim($user.val().toLowerCase());

  return(userAvailable && validateUsername($user) && validateEmail($email,$emailC) && validatePassword($pass,$passC));
};

$(document).ready(function () {
  //Elements
  var $modals = $('.modal'); //all modals (For use with triggering events)
  var $newUserField =  $('#createUsername'); //Create Account : Username
  var $newEmailField = $('#createEmail'); //Create Account : Email
  var $newEmailFieldC = $('#createEmailConfirm'); //Create Account : Confirm Email
  var $newPassField = $('#createPassword'); //Create Account : Password
  var $newPassFieldC = $('#createPasswordConfirm'); //Create Account : Confirm Password

  //Other vars
  var usernameAvailable = false;
  var currentUsername = null;
  var currentEmail = null;
  var currentPassword = null;

  //bootstrap
  $(".hasPop").popover({ trigger: "hover", html: true }); //Init popover for elements with class hasPop

  //Events
  $newUserField.keyup(function () {
    usernameAvailable = false; //assume username taken until tested
    validateUsername($newUserField,"#usernameGroup");
  });
  $newUserField.focusout(function () {
    usernameAvailable = userAvailable($newUserField,"#usernameGroup");
    if(createAccountReady($newUserField, usernameAvailable, $newEmailField,$newEmailFieldC,$newPassField,$newPassFieldC))
    {
      enableButton("#createAccountSubmit");
    }
    else
    {
      disableButton("#createAccountSubmit");
    }
  });
  $newEmailField.keyup(function (evt) {validateEmail($newEmailField,$newEmailFieldC,"#emailGroup","#emailGroupC");});
  $newEmailFieldC.keyup(function (evt) {validateEmail($newEmailField,$newEmailFieldC,"#emailGroup","#emailGroupC");});
  $newPassField.keyup(function (evt) {validatePassword($newPassField,$newPassFieldC,"#passwordGroup","#passwordGroupC");});
  $newPassFieldC.keyup(function (evt) {validatePassword($newPassField,$newPassFieldC,"#passwordGroup","#passwordGroupC");});
  $modals.on('hidden.bs.modal',function(evt) {
    clearForm($(this).find("form"));
    disableButton("#createAccountSubmit");
  });
  $modals.find('input').keyup(function (evt) {
    if(createAccountReady($newUserField, usernameAvailable, $newEmailField,$newEmailFieldC,$newPassField,$newPassFieldC))
    {
      enableButton("#createAccountSubmit");
    }
    else
    {
      disableButton("#createAccountSubmit");
    }

    currentUsername = jQuery.trim($newUserField.val().toLowerCase());
    currentEmail = jQuery.trim($newEmailField.val().toLowerCase());
    currentPassword = $newPassField.val();
  });

  //Submit Button Clicked
  $("#createAccountSubmit").click(function (evt) {
    alert("BAM, you now have an account! (NOT REALLY D:)\nDetails:\n" + "Username: " + currentUsername + "\nEmail: " + currentEmail + "\nPassword: " + currentPassword + "\n\nUnfinished Password will be encrypted in the future before being sent to the server...");
  });
});
