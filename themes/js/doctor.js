var ajaxError = function (object) {
    alert("Error!!!\n\nAn error has occured processing your request. \n\nPlease try again or Contact Us.");
    hideLoader();
   // $('#output').text(JSON.stringify(object, null, 4));
};

var app = angular.module("clientApp", ["ngSanitize"]);
app.controller('clientCtrl',['$scope','$http','$filter', function (scope,http,filter){
    var rootUrl = $('#RootUrl').val();
    scope.SiteUrl=$('#SiteUrl').val();
    scope.getPatientQueries=function(){
        var url = $('#RootUrl').val() + 'Doctor/Queries/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
//           scope.countries = data;
            console.log(data);
            scope.queries = data;
            $.mobile.changePage( '#patient-queries', {type: "get", transition: "slide"});
            hideLoader();
        });
    };
    scope.register=function(){
        var url =rootUrl+'Doctor/Register/';
        showLoader();
        http.get(url).success(function(data) {
            scope.specialities = data;
            $.mobile.changePage( '#register', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
    scope.getChatList=function(id){
        var url = rootUrl+'Doctor/Queries/'+id+'/Details/';
        showLoader();
        http.get(url).success(function(data) {
            $('.sendsignalr').attr('rel',data[0].Id);
            scope.chatList = data[0].ChatMessages;
            console.log( scope.chatList);
            $.mobile.changePage( '#chatList', {type: "get", transition: "slide"});
            hideLoader();
        }).error(ajaxError);
    };// End Function
    scope.getClinic=function(){
        var url = rootUrl+'Doctor/Clinics/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
            scope.clinics = data;
            $.mobile.changePage( '#my-clinics', {type: "get", transition: "slide"});
            hideLoader();
        });
    };
    scope.getHospitalSearchResults=function(){
        var url = rootUrl+'Hospitals/'+$('#searchTerm').val()+'/'+$('#SearchCountyId').val();
        showLoader();
        http.get(url).success(function(data) {
            scope.hospitals = data;
            $.mobile.changePage( '#hospitals-list', {type: "get", transition: "slide"});
            hideLoader();
        });
    };// End Function

    scope.getHospitalDetails=function(id){
        var url = rootUrl+'Hospitals/Details/'+id;
        showLoader();
        http.get(url).success(function(data) {
            scope.hospital = data.hospital;
            scope.hospitalBranches = data.branches;
            $.mobile.changePage( '#hospitals-details', {type: "get", transition: "slide"});
            hideLoader();
        });
    };// End Function

    scope.askQuiz=function(){
        var url =rootUrl+'PatientQueries/Init/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
            scope.user = data['user'];
            scope.hospitals = data['hospitals'];
            scope.specialities = data['specialities'];
            $.mobile.changePage( '#ask-quiz', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
    scope.getBranches=function(){
        var url =rootUrl+'Hospitals/Branches/'+scope.selectedHospital;
        showLoader();
        http.get(url).success(function(data) {
            scope.branches = data;
            hideLoader();
        });


    }; // End Function
    scope.getDoctors=function(){
        var url =rootUrl+'Client/Doctors/'+scope.selectedBranch+'/'+scope.selectedSpeciality;
        showLoader();
        http.get(url).success(function(data) {
            scope.doctors = data;
            hideLoader();
        });
    }; // End Function
    scope.getMyAppointments=function(){
        var url =rootUrl+'Appointments/Doctor/List/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
            scope.appointments = data;
            $.mobile.changePage( '#my-appointments', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
    scope.getAppointmentDetails=function(id){
        var url = rootUrl+'Appointments/'+id;
        showLoader();
        http.get(url).success(function(data) {
            scope.appointment = data;
            $('.insurance-cont').removeClass('ng-hide');
            $.mobile.changePage( '#appointmentDetails', {type: "get", transition: "slide"});
            $('input:radio[name="GenderId"]').filter('[value="'+data.GenderId+'"]').parent().find("label[for].ui-btn").click();
            hideLoader();
        });
    };
    scope.getFirstAidList=function(){
        var url =rootUrl+'FirstAid';
        showLoader();
        http.get(url).success(function(data) {
            scope.firstAidList = data;
            $.mobile.changePage( '#first-aid', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
    scope.getFirstAid=function(id){
        var url =rootUrl+'FirstAid/'+id;
        showLoader();
        http.get(url).success(function(data) {
            scope.firstAidItem = data;
            $.mobile.changePage( '#first-aid-details', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function


    scope.getProfile=function(id){
        var url =rootUrl+'Doctor/Profile/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
            scope.user = data.user;
            scope.specialities = data.specialities;
            $.mobile.changePage( '#profile', {type: "get", transition: "slide"});

            $('input:radio[name="GenderId"]').filter('[value="'+data.user.GenderId+'"]').parent().find("label[for].ui-btn").click();
            hideLoader();
        });
    }; // End Function


}]);

$(window).load(function(e) {
    $('#customPreloader').remove();

});
$(function(){

startChat();
var rootUrl = $('#RootUrl').val();
var  ajaxAlways = function (object) {
   // showResponse;
    hideLoader();
};
var showResponse = function (object) {
    $('.ui-mobile .ui-footer').show();
    $('#output').text(JSON.stringify(object, null, 4));
};

$('#updateProfile').on('click',function(){
    var $form = $('#frmUpdateProfile');
    var options = {
        url: rootUrl+'Account/UpdateProfile',
        type:'Post',
        data: $form.serialize()
    };
    showLoader();
    $.ajax(options).done(function (data) {
        hideLoader();
        $('#lnk-profile-popup').trigger('click');
    });
});
$(document).on("pageshow", function () {

});
$(document).on("pageshow",'#my-appointments', function () {
    $('.li-appointment').off('click').on('click',function(){
      $(this).find('.read-status-0').removeClass('read-status-0');
    });
});
$(document).on("pageshow", "#register", function () {
    $('#registerSpecialityId').selectmenu(); // initialize
    $('#registerSpecialityId').selectmenu('refresh');
     $('#btnRegister').off('click').on("click", function(e) {
         var allFilled = true;
        $('#frm-register :input:not(:button)').each(function(index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
        });
		 if ($('.password').val().length < 4) {
            alert("Passwords must be at least 4 characters.");
            return false;
        }
		if ($('.password').val() != $('.passwordconfirm').val()) {
            alert("Password and Confirm Password must match");
            return false;
        }
		 var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
         var $email = $('#RegUserEmail');
        if ($email.val() == '' || !re.test($email.val())) {
            alert('Please enter a valid email address.');
            return false;
        }
        if (allFilled) {
	   var url = $('#RootUrl').val() + 'account/register/';
	   var data=$('#frm-register').serialize();
        console.log(url);
        showLoader();
        $.post(url,data).done(function(data) {
            hideLoader();
			var rdata=data.trim();
			
            if (rdata.indexOf("Error") === 0) {
                alert(rdata);
            } else{
               $("#USERID").val(rdata);
			   $('.span-success').show();
                try {
                    //Save Data
                    SaveUserDetails(rdata, '1');
                }catch(err){}
			   $.mobile.changePage( '#login', {
					type: "get",
					transition: "flip"
				});
            } 
        }).error(function(data){
            try{
                alert(data.responseJSON.ModelState['']);
            }catch(err){
                alert("An error has occurred processing your request.");
            }

        }).always(ajaxAlways);
       
		}else{
		  alert('All fields are required');	
		}
		 e.preventDefault();
        return false;
    });
		
 }); // pageshow

    $('.close-popup').off('click').on("click", function(e) {
        window.history.back();
        e.preventDefault();
        return false;
    });
});
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

$.urlParam = function(shows)
{ var results = new RegExp('[\\?&]' + shows+ '=([^&#]*)').exec(window.location.href);
    if (!results)   {          return '';      }     return results[1] || '';
}



