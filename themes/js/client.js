 //var app = angular.module("clientApp", ["ngSanitize"]);
var app = angular.module("clientApp", ["AxelSoft","ngSanitize"]).filter('htmlToPlaintext', function() {
    return function(text) {
        if(text===null || text==='null' || text==='')
            return '';

        return String(text).replace(/<[^>]+>/gm, '');
    }
}).filter('httpWebsite', function() {
    return function(text) {
        return 'http://'+String(text).replace('http://', '');
    }
}).filter('Distance', function() {
    return function(lat1,lon1) {

        var d='';
        if($('#HFLatitude').val()!=='0' && typeof lat1!=='undefined' && lat1!==null) {
            var lat2 = $('#HFLatitude').val();
            var lon2 = $('#HFLongitude').val();
            var R = 6371; // km (change this constant to get miles)
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            d = R * c;
            d = 'Aprox '+ d.toFixed(2)+' km';
        }
        return d;
    }
});

app.controller('clientCtrl',['$scope','$http', function (scope,http){
    var rootUrl = $('#RootUrl').val();
    scope.SiteUrl=$('#SiteUrl').val();
    scope.UploadsRoot = $('#SiteUrl').val()+'Content/uploads/images';

    var ajaxError = function (object) {
        alert("An error has occured processing your request. Please check your internet connection and try again.");
        hideLoader();
    };
    var ajaxAlways = function (object) {
        hideLoader();
    };


    scope.initApp=function(){
        var url = $('#RootUrl').val() + 'Client/Init/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {

            scope.featuredProducts = data['featuredProducts'];
            scope.user = data['user'];
            scope.hospitals = data['hospitals'];
            scope.specialities = data['specialities'];
            scope.counties = data['counties'];
            scope.locations = data['locations'];

            hideLoader();
            setTimeout(function(){
                $(".owl-carousel").owlCarousel({margin:5,nav:false,dots:true,autoplay:true,autoplayTimeout:2000,loop:true});
            },1000)

        });
    };
    scope.myQuestions=function(){
        var url = $('#RootUrl').val() + 'Client/Queries/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
//           scope.countries = data;
            scope.queries = data;
            $.mobile.changePage( '#patient-queries', {type: "get", transition: "slide"});
            hideLoader();
        });
    };
    scope.askQuiz=function(id,branchId){
        var url =rootUrl+'PatientQueries/Init/'+$('#UserId').val();
        $('#selectedHospitalId').val()
        if(typeof id!=='undefined') {
            url = rootUrl+'PatientQueries/Init/'+$('#UserId').val()+'/'+id+'/';
            scope.quizHId=id;
            scope.selectedQuizHospital=id;
            scope.selectedQuizBranch=branchId;

        }else{
            scope.selectedQuizHospital=0;
            scope.selectedQuizBranch=0;
        }
        showLoader();
        http.get(url).success(function(data) {
            scope.user = data['user'];
            scope.hospitals = data['hospitals'];
            scope.specialities = data['specialities'];
            scope.branches=data['branches'];
            scope.selectedBranch=0;
            scope.quizHId=id;


            $.mobile.changePage( '#ask-quiz', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
scope.searchHospitals=function(){
    $.mobile.changePage( '#hospitals-search', {type: "get", transition: "slide"});
    /*var url = rootUrl+'Mobile/Counties';
    showLoader();
    http.get(url).success(function(data) {
        scope.counties = data['Counties'];
        scope.locations = data['Locations'];
        $.mobile.changePage( '#hospitals-search', {type: "get", transition: "slide"});
        hideLoader();
    });*/
};
scope.getHospitalSearchResults=function(){
    var city=scope.dirCity;
    if(typeof city==='undefined'||city===''){
        city=0;
    }
    var location=scope.dirLocation;
    if(typeof location==='undefined'||location===''){
        location=0;
    }
    var search='any';
    if($('#searchTerm').val()!==''){
        search=$('#searchTerm').val();
    }
    var url = rootUrl+'Hospitals/'+search+'/'+city+'/'+location+'/';
    showLoader();
    http.get(url).success(function(data) {
        scope.hospitals = data;
        $.mobile.changePage( '#hospitals-list', {type: "get", transition: "slide"});
        hideLoader();
    });
};// End Function

scope.getHospitalDetails=function(id,hasBranches){
    if(hasBranches===true){
        var city=scope.dirCity;
        if(typeof city==='undefined'||city===''){
            city=0;
        }
        var location=scope.dirLocation;
        if(typeof location==='undefined'||location===''){
            location=0;
        }
        var search='any';
        if($('#searchTerm').val()!==''){
            search=$('#searchTerm').val();
        }
        var url = rootUrl+'Hospitals/GetBranchesByHospital/'+id+'/'+search+'/'+city+'/'+location+'/';
        showLoader();
        http.get(url).success(function(data) {
            scope.hospitalBranches = data;

            $.mobile.changePage( '#branches-list', {type: "get", transition: "slide"});
            hideLoader();
        });
    }else{
        var url = rootUrl+'Hospitals/Details/'+id;
        showLoader();
        http.get(url).success(function(data) {
            scope.hospital = data.hospital;
            scope.clinics = data.clinics;
			scope.insurancesAccepted = data.insuranceAccepted;
            $.mobile.changePage( '#hospitals-details', {type: "get", transition: "slide"});
            hideLoader();
        });
    }
};// End Function
scope.getBranchDetails=function(hospitalId,branchId){

        var url = rootUrl+'Hospitals/Branch/Details/'+hospitalId+'/'+branchId+'/';
        showLoader();
        http.get(url).success(function(data) {
            scope.hospital = data.hospital;
            scope.branch = data.branch;
			scope.insurancesAccepted = data.insuranceAccepted;
            scope.galleryImages = data.galleryImages;
            $.mobile.changePage( '#branch-details', {type: "get", transition: "slide"});
            hideLoader();
        });
};// End Function

scope.getChatList=function(id){
    var url = rootUrl+'Client/Queries/'+id+'/Details/';
    showLoader();
    http.get(url).success(function(data) {
        $('.sendsignalr').attr('rel',data[0].Id);
        scope.chatList = data[0].ChatMessages;

        if(data[0].PaymentStatusId !==2){
            $('.send-btn').hide();
            $('.btnPayConsultationNow').show();
            $('#chatmessage').hide();
        }else{
            $('.send-btn').show();
            $('.btnPayConsultationNow').hide();
            $('#chatmessage').show();
        }
        if(data[0].StatusId ===5){

            $('#chatStatus').show();
            $('#chatStatus').html('<p>Consultation closed.</p>');
            $('#chatStatus').show();
            $('.btnPayConsultationNow,.send-btn,#chatmessage').hide();
        }else{
            $('#chatStatus').hide();
        }



        console.log( scope.chatList);
        $.mobile.changePage( '#chatList', {type: "get", transition: "slide"});
        hideLoader();
    });
};// End Function
scope.register=function(){
    var url =rootUrl+'Mobile/Specialities';
    showLoader();
    http.get(url).success(function(data) {
        scope.specialities =data;
        hideLoader();
    });
}; // End Function
scope.getBranches=function(){
    var url =rootUrl+'Hospitals/Branches/'+scope.selectedHospital;
    showLoader();
    http.get(url).success(function(data) {
        if(data.length===0){
            $('#bookAppointmentBranch,#ask-quiz-branch').slideUp();
            scope.selectedBranch=0;
        }else{
            $('#bookAppointmentBranch,#ask-quiz-branch').slideDown();
        }
        scope.branches = data;
        hideLoader();
    });
}; // End Function

scope.bookAppointment=function(id,branchId){
    var url;

    if(typeof id==='undefined') {
         url = rootUrl + 'Appointments/Init/' + $('#UserId').val();
        scope.selectedBookBranch=0;
        scope.selectedHospital=0;
    }else{
        scope.selectedBookBranch=branchId;
        scope.selectedHospital=id;
         url = rootUrl + 'Appointments/Init/' + $('#UserId').val()+'/'+id+'/';
    }

    showLoader();
    http.get(url).success(function(data) {
        console.log(data);
        scope.user = data['user'];
        scope.hospitals = data['hospitals'];
        scope.specialities = data['specialities'];
        scope.paymentModes = data['PaymentModes'];
        scope.availableSlots = data['availableSlots'];
        scope.insuranceCompanies = data['InsuranceCompanies'];
        scope.selectedSpeciality=0;
        scope.TimeBooked=0;
        scope.selectedPaymentMode=1;
        scope.branches=data['branches'];

        $.mobile.changePage( '#bookAppointment', {type: "get", transition: "slide"});
        hideLoader();
    });
}; // End Function
scope.getMyAppointments=function(id){

    var url =rootUrl+'Appointments/List/'+$('#UserId').val();
    showLoader();
    http.get(url).success(function(data) {
        scope.appointments = data;
        $.mobile.changePage( '#my-appointments', {type: "get", transition: "slide"});
        hideLoader();
    });
}; // End Function
scope.getAppointmentDetails=function(id){

    var url = rootUrl+'Client/Appointment/'+id;
    showLoader();
    http.get(url).success(function(data) {
        scope.appointment = data['appointment'];
        scope.hospitals = data['hospitals'];
        scope.specialities = data['specialities'];
        scope.paymentModes = data['PaymentModes'];
        scope.branches = data['branches'];
        scope.insuranceCompanies = data['InsuranceCompanies'];

        $.mobile.changePage( '#appointmentDetails', {type: "get", transition: "slide"});
        $('input:radio[name="GenderId"]').filter('[value="'+data['appointment'].GenderId+'"]').parent().find("label[for].ui-btn").click();


        scope.show=false;
        scope.cancel=false;
        hideLoader();
    }).error(ajaxError);
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
    var url =rootUrl+'Mobile/User/'+$('#UserId').val();
    showLoader();
    http.get(url).success(function(data) {
        scope.user = data;
        $.mobile.changePage( '#profile', {type: "get", transition: "slide"});
        // $('input:radio[name="GenderId"]').filter('[value="1"]').prop('checked', true);
        // $('input:radio[name="GenderId"]').filter('[value="1"]').next().click();
        $('input:radio[name="GenderId"]').filter('[value="'+data.GenderId+'"]').parent().find("label[for].ui-btn").click();
        hideLoader();
    });
}; // End Function
scope.getDoctors=function(){
    var url =rootUrl+'Client/Doctors/'+scope.selectedBranch+'/'+scope.selectedSpeciality;
    showLoader();
    http.get(url).success(function(data) {
       if(typeof data[0] !=='undefined') {

           scope.doctors = data[0];
       }
        hideLoader();
    }).error(ajaxError);
}; // End Function
scope.getDoctorsBooking=function(){
    var url =rootUrl+'Client/Doctors/Booking/'+scope.selectedBranch+'/'+scope.selectedSpeciality;
    showLoader();
    http.get(url).success(function(data) {
        if(typeof data !=='undefined') {
            scope.bookDoctors = data;
        }
        hideLoader();
    }).error(ajaxError);
}; // End Function
scope.getSlots = function () {
    var dateBooked=$('#DateBooked').val();
    var doctorId=$('#ddBookDoctorId').val();


    var url = rootUrl + 'Client/AvailableSlots/' + scope.selectedBranch + '/' + scope.selectedSpeciality + '/' + doctorId + '/' + dateBooked + '/';
    showLoader();
    http.get(url).success(function (data) {
        if (typeof data !== 'undefined') {
            scope.availableSlots = data;
        }
        hideLoader();
    }).error(ajaxError);
}; // End Function
scope.getProductDetails=function(id){

    var url = rootUrl+'Products/'+id+'/';
    showLoader();
    http.get(url).success(function(data) {
        scope.product = data;
        $.mobile.changePage( '#product-details', {type: "get", transition: "slide"});
        hideLoader();
    });
};// End Function

}]);


$(window).load(function(e) {
    $('#customPreloader').remove();
});
$(function(){
   // startChat();
    var rootUrl = $('#RootUrl').val();


    var ajaxError = function (object) {
        alert("Error: An error has occured processing your request. Please check your internet connection and try again.");
        $('.ui-mobile .ui-footer').show();
        var err=JSON.stringify(object, null, 4);
        console.log(object);
        $('#output').text(err);
    };
    var  ajaxAlways = function (object) {
        hideLoader();
    };
    var showResponse = function (object) {
        $('.ui-mobile .ui-footer').show();
        $('#output').text(JSON.stringify(object, null, 4));
    };

$('#ddBookDoctorId').on('change',function(){
    $('#availability').html('');
    var avail = $("#ddBookDoctorId option:selected").attr("data-availability");
    if(typeof avail !='undefined')
     $('#availability').html('<strong>Availability</strong><br>'+avail);
});
    $(document).on("pageshow", function () {
        $('input:radio[name="GenderId"]').filter('[checked="checked"]').parent().find("label[for].ui-btn").click();
    });
    $(document).on("pageshow","#bookAppointment", function () {

        var scope = angular.element(document.querySelector('body')).scope();
        $('[ng-controller="clientCtrl"]').scope.selectedPaymentMode=1;

        $('#HospitalId').val(scope.selectedHospital);
        $('#ddAppointmentBranches').val(scope.selectedBookBranch);


        $('#ddAppointmentPaymentMode,#AppointmentTimeSlotId,#HospitalId,#ddAppointmentBranches').selectmenu(); // initialize
        $('#ddAppointmentPaymentMode,#AppointmentTimeSlotId,#HospitalId,#ddAppointmentBranches').selectmenu('refresh');

        $('#appointmentPaymentMode').on("change", function(e) {

            if($(this).val()=='1')
            {
                $('.bookinsurance').slideUp();
            }else{
                $('.bookinsurance').slideDown();
            }

        });
    });

    $(document).on("pageshow","#ask-quiz", function () {

        var scope = angular.element(document.querySelector('body')).scope();
        $('#QuizHospitalId').val(scope.selectedQuizHospital);
        $('#ddQBranches').val(scope.selectedQuizBranch);

        $('#QuizHospitalId,#ddQBranches').selectmenu(); // initialize
        $('#QuizHospitalId,#ddQBranches').selectmenu('refresh');


    });

    $(document).on("pageshow", "#register", function () {

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
                        var dArray=rdata.split(",");
                        $("#UserId").val(dArray[0]);
                        // $('.span-success').show();
                        //Save Data
                        try {
                            SaveUserDetails(rdata, '2');
                        }catch (err){}
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
    $(document).on("pageshow", "#profile", function (){

    });
    $(document).on("pageshow", "#appointmentDetails", function (){


        // alert(scope.appointment.HospitalId);
       // $('#appointmentHospitalId option[value="3"]').prop('selected', true);
        $('#appointmentHospitalId,#appointmentSpecialityId,#appointmentPaymentMode').selectmenu(); // initialize
        $('#appointmentHospitalId,#appointmentSpecialityId,#appointmentPaymentMode').selectmenu('refresh');

        $('#appointmentInsuranceCompanyId,#appointmentBranchId').selectmenu(); // initialize
        $('#appointmentInsuranceCompanyId,#appointmentBranchId').selectmenu('refresh');

        $("#chkEdit").attr("checked",false).checkboxradio("refresh");
        $("#chkCancel").attr("checked",false).checkboxradio("refresh");

       // $('#chkEdit').removeProp('checked');
      //  $('.chkEditCont .ui-btn').removeClass('ui-checkbox-on');
      //  $('.chkEditCont .ui-btn').addClass('ui-checkbox-off');
      //  $('#chkEdit').attr('data-cacheval','true');

        $('#appointmentPaymentMode').on("change", function(e) {

            if($(this).val()=='1')
            {
                $('.edit-insurance').slideUp();
            }else{
                $('.edit-insurance').slideDown();
            }

        });

    });

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
        }).fail(ajaxError);
    });
    $('#ddAppointmentPaymentMode').on("change", function(e) {
        if($(this).val()=='1')
        {
            $('.bookinsurance').slideUp();
        }else{
            $('.bookinsurance').slideDown();
        }

    });
    $('#btnBookAppointment').on('click',function(){
        var allFilled = true;
        if($('#ddAppointmentPaymentMode').val()=='1')
        {
            $('#membershipno').val('0');

        }
        $('#frmbook :input:not(:button)').each(function(index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
        });
        if($('#ddAppointmentPaymentMode').val()=='1')
        {
            $('#membershipno').val('');
        }

        if (allFilled) {
            var $form = $('#fmBookAppointment');
            var options = {
                url: rootUrl + 'Appointments',
                type: 'Post',
                data: $form.serialize()
            };
            showLoader();
            $.ajax(options).done(function (data) {
                $('#lnkPaymentsAppointment').attr('href',data.trim());
                hideLoader();
                $('#book-popup').popup('open');
            }).fail(ajaxError);
        }
    });
    $('#btn-ask').on('click',function(){
        allFilled = true;
        $('#frmaskquiz :input:not(:button)').each(function(index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
        });
        if (allFilled) {
            var $form = $('#frmaskquiz');
            var options = {
                url: rootUrl + 'PatientQueries',
                type: 'Post',
                data: $form.serialize()
            };
            showLoader();
            $.ajax(options).done(function (data) {
                hideLoader();
                $('#lnkPayments').attr('href',data.trim());
                // $('#lnk-book-popup').trigger('click');
                $('#payments-popup').popup('open');
            }).fail(ajaxError);
        }else{
            alert('All fields are required.');
        }
    });	 //$('#btn-ask')
    $('#btnUpdateAppointment').on('click',function(){

       var status=$('#AppointmentStatusId').val();
        alert(status);
        if(status==='true'){
            $('#AppointmentStatusId').val('3');
        }else{
            $('#AppointmentStatusId').val('4');
        }
        var $form = $('#fmUpdateAppointment');
        var options = {
            url: rootUrl+'Appointments/'+$('#appointmentId').val(),
            type:'Put',
            data: $form.serialize()
        };
        showLoader();
        $.ajax(options).done(function (data) {
            hideLoader();
            $('#lnk-edit-appointment-popup').trigger('click');
        }).fail(ajaxError);
    });
// $('#main-panel').on('submit', 'form[data-rev-ajax="true"]', ajaxFormSubmit);
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


 function linker(obby, nextDatebox) {
     // Access the returned date
     var setDate = obby.date;
    $('#getSlots').trigger('click');
 }

