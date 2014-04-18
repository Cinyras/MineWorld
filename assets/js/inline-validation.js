var isEmailValid = function (address) { //Check String Against Valid Email Regular Expression
  var pattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/i);
  return pattern.test(address);
};

var isUserValid = function (username) { //Check String Against Valid Username Regular Expression
  var pattern = new RegExp(/^[a-zA-Z0-9._-]{3,45}$/i);
  return pattern.test(username);
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

  var value = jQuery.trim($field.val().toLowerCase());

  if(value.length > 0)
  {
    if(isUserValid(value))
    {
      makeValid($group,"You're Good<br><br>Note: Usernames are case insensitive and trailing spaces are ignored.",true);
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
};

var validateEmail = function ($field1, $field2, $group1, $group2)
{
  $field1 = (typeof $field1 === "string") ? $($field1) : $field1;
  $field2 = (typeof $field2 === "string") ? $($field2) : $field2;
  $group1 = (typeof $group1 === "string") ? $($group1) : $group1;
  $group2 = (typeof $group2 === "string") ? $($group2) : $group2;

  var value = jQuery.trim($field1.val().toLowerCase());

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
      makeInvalid($group1, "Invalid Email<br><br>All Emails Must:<br>&emsp;-Be Correctly Formatted", true);
      makeInvalid($group2, null, true);
    }
  }
  else
  {
    //empty
    clearValidity($group1);
    clearValidity($group2);
  }
};

var validatePassword = function ($field1, $field2, $group1, $group2) {
  $field1 = (typeof $field1 === "string") ? $($field1) : $field1;
  $field2 = (typeof $field2 === "string") ? $($field2) : $field2;
  $group1 = (typeof $group1 === "string") ? $($group1) : $group1;
  $group2 = (typeof $group2 === "string") ? $($group2) : $group2;

  var value = $field1.val();

  if(value.length > 0)
  {
    if(doMatch($field1,$field2))
    {
      makeValid($group1, "You're Good", true);
      makeValid($group2, "You're Good", true);
    }
    else
    {
      makeWarning($group1, "Warnings:<br>&emsp;-Confirmation Password Doesn't Match", true);
      makeWarning($group2, "Warnings:<br>&emsp;-Confirmation Password Doesn't Match", true);
    }
  }
  else
  {
    clearValidity($group1);
    clearValidity($group2);
  }
};

$(document).ready(function () {
  /*
    NOTES:
      -All functions that take elements can take strings or jquery objects, if it is a string use it as a selector eg. doMatch("#ID1","#ID2"); or doMatch($a,$b); or doMatch("#ID1",$a);
      -If a function takes a boolean it will default to false if unspecified
      -When using makeValid()/makeInvalid()/makeWarning() functions and you want to use a symbol but don't want a message simply put null for message eg. makeValid($object,null,true);
      -if there is a span directly after an input the clearValidity() function will assume its a validity symbol (might not affect anything just be wary)
  */
  //Elements
  var $modals = $('.modal'); //all modals (For use with triggering events)
  var $newUserField =  $('#createUsername'); //Create Account : Username
  var $newEmailField = $('#createEmail'); //Create Account : Email
  var $newEmailFieldC = $('#createEmailConfirm'); //Create Account : Confirm Email
  var $newPassField = $('#createPassword'); //Create Account : Password
  var $newPassFieldC = $('#createPasswordConfirm'); //Create Account : Confirm Password

  //bootstrap
  $(".hasPop").popover({ trigger: "hover", html: true }); //Init popover for elements with class hasPop

  //Events
  $newUserField.keyup(function () {validateUsername($newUserField,"#usernameGroup");});
  $newEmailField.keyup(function () {validateEmail($newEmailField,$newEmailFieldC,"#emailGroup","#emailGroupC");});
  $newEmailFieldC.keyup(function () {validateEmail($newEmailField,$newEmailFieldC,"#emailGroup","#emailGroupC");});
  $newPassField.keyup(function () {validatePassword($newPassField,$newPassFieldC,"#passwordGroup","#passwordGroupC");});
  $newPassFieldC.keyup(function () {validatePassword($newPassField,$newPassFieldC,"#passwordGroup","#passwordGroupC");});
  $modals.on('hidden.bs.modal',function(evt) {clearForm($(this).find("form"));}); //when any modal closes find forms inside them and run the clearForm() function on them.
});
