$(document).ready(function () {
    $('#chatmessage').keypress(function (e) {
        if (e.keyCode == 13)
            $('.sendsignalr').trigger('click');
    });
});
var ajaxAlways = function (object) {
    hideLoader();
};
var ajaxError = function (object) {
    alert("An error has occured processing your request. Please check your internet connection and try again.");
    hideLoader();
};
$(document).on("pageshow", "#landing", function() { // When entering pagetwo

    setTimeout(function() {
       // $('#landing').remove();
       // $('body').removeClass('bdloading');
        $('#menupanel').show();
    }, 1000);
});
$(document).on("pageshow", "#login", function () { // When entering login

    $('#btnLogin').off('click').on("click", function (e) {
        var allFilled = true;
        $('#frm-login :input:not(:button)').each(function (index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
        });

        if (allFilled) {
            var url = $('#RootUrl').val() + 'Account/MobileLogin/';
            var data = $('#frm-login').serialize();
            console.log(url);
            showLoader();
            $.post(url, data).done(function (data) {
                hideLoader();
                var rdata = data.trim();

                if (rdata.indexOf("Error") === 0) {
                    alert(rdata);
                }
                else if (rdata === "incorrect") {
                    alert("Email and password did not match.");
                }
                else {
                    $("#UserId").val(rdata);
                    startChat();


                     try{
                     SaveUserDetails(data);
                     }catch(err){}
                     

                   // $('.span-success').show();
                    $.mobile.changePage('#landing', {
                        type: "get",
                        transition: "slide"
                    });
                }
            }).fail(ajaxError).always(ajaxAlways);


        } else {
            alert('All fields are required');
        }
        e.preventDefault();
        return false;
    });
});

$(document).on("pageshow", function () { // When entering login

    $("body>[data-role='panel']").panel();
    $(".jqm-navmenu-link,#mainmenu a, #footermenu").off('click').on("click", function () {
        menuOpen();
    });
    $("#mainmenu a").off('click').on("click", function () {
        //  menuClose();
        menuOpen();
    });
}); //pageshow


$(document).on("pageshow", "#forgot-password", function () {
    $('.passwordResetButton').off('click').on('click', function() {
    if(!validateEmail($('#txtEmailReset').val())){
        return false;
    }

    var options = {
        url: $('#RootUrl').val()+'account/ForgotPassword/'+$('#txtEmailReset').val()+'/',
        type: 'get',

    };
    showLoader();
    $.ajax(options).success(function (data) {
        if (data.trim().toLowerCase() === 'success') {
            $.dynamic_popup('<span>New password sent to your email.</span>');
            $('#frm-enquiry')[0].reset();
        }else if(data.trim() === 'notFound'){
            $.dynamic_popup('<span class="error">Email address not registered.</span>');
        }else if(data.trim() === 'fail'){
            $.dynamic_popup('<span class="error">Sorry we haven\'t managed to reset your password\nKindly try again or Contact us .</span>');
        }

        hideLoader();
    }).error(ajaxError).always(ajaxAlways);

});

});





function convertDateTime(strDate) {
    alert('convertDateTime');
    return 'here';
}
$(document).on("pageshow", "#chatList", function () {

    // $('html,body,#chatList .ui-content').scrollTop(1E10);
   // var target = $("#chatmessage").get(0).offsetTop;
   // alert(target);
    $("html, body").animate({ "scrollTop" : 1E10 }, 500);
});

function indexByKeyValue(arraytosearch, key, valuetosearch) {

    for (var i = 0; i < arraytosearch.length; i++) {

        if (arraytosearch[i][key] == valuetosearch) {
            return i;
        }
    }
    return null;
}
function menuOpen() {
    var activePage = $.mobile.activePage[0].id;
    // if (activePage != 'login' && activePage != 'validate' && activePage != 'register' && activePage != 'forgotpassword') {

    if ($('#menupanel').hasClass('ui-panel-open')) {
        $('#menuclose').trigger('click');
    } else {
        $('#menuicon').trigger('click');
    }
    //}//end if
}

function showLoader() {

    $.mobile.loading("show", {
        text: 'loading',
        textVisible: false,
        theme: 'a',
        textonly: false,
        html: ''
    });
}

function hideLoader() {
    $.mobile.loading("hide");
}

$.urlParam = function (shows) {
    var results = new RegExp('[\\?&]' + shows + '=([^&#]*)').exec(window.location.href);
    if (!results) {
        return '';
    }
    return results[1] || '';
}
function OpenExternal(linktarget) {
    navigator.app.loadUrl(linktarget, {openExternal: true});
}
function fomartTimeShow(h_24) {
    var dArray = h_24.split(":");

    h_24 = dArray[0];
    var h = ((h_24 + 11) % 12) + 1;
    return (h < 10 ? '0' : '') + h + ':' + dArray[1] + (h_24 < 12 ? 'am' : 'pm');
}

function menuClose() {
    $('#menuclose').trigger('click');
}

function menuOpen(){
    var activePage = $.mobile.activePage[0].id;
    if (activePage != 'login' && activePage != 'validate' && activePage != 'register' && activePage != 'forgotpassword') {

        if ($('#menupanel').hasClass('ui-panel-open')) {

            $('#menuclose').trigger('click');
        } else {

            $('#menuicon').trigger('click');
        }

    }//end if
}
function validateEmail(email){

    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;

    if (email == '' || !re.test(email)) {

        $.dynamic_popup('<span class="error">Please enter a valid email address.</span>');
        return false;
    }
    return true;
}