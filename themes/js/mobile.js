var db;
var dbCreated = false;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {


    db = window.openDatabase("Radioson", "1.0", "PhoneGap Demo", 200000);

    var firstrun = window.localStorage.getItem("runned");

    //  firstrun = null;
     alert(firstrun);
    if (firstrun == null) {
        setTimeout(function () {
            $('.lnklogin').click();
        }, 2000);
        populateDB();
    }
    else {
        setTimeout(function () {
            $('#lnklanding').click();
        }, 2000);
        alert('Getting user details');
        GetUserDetails();
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    var watchID = navigator.geolocation.watchPosition(onSuccess2, onError2, {timeout: 30000});

} //onDeviceReady

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
function onSuccess(position) {
    $('#HFLatitude').val(position.coords.latitude);
    $('#HFLongitude').val(position.coords.longitude);
    RemoveLocationNotification();
};

// onError Callback receives a PositionError object
//
function onError(error) {

    setTimeout(function () {
       // alert('Please Enable Location Access for better service.');
        SetLocationNotification();
    }, 4000);

}

// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function onSuccess2(position) {

    // alert('Latitude: '  + position.coords.latitude);
    $('#HFLatitude').val(position.coords.latitude);
    $('#HFLongitude').val(position.coords.longitude);
    RemoveLocationNotification();
}

// onError Callback receives a PositionError object
//
function onError2(error) {
    SetLocationNotification();
}
// Options: throw an error if no update is received every 30 seconds.
//	


function populateDB(data) {

 alert('populateDB');
//Create Table
    db.transaction(
        function (tx) {

//Create user table

            var sql = "DROP TABLE IF EXISTS fd_users";
            tx.executeSql(sql);
            sql = " CREATE TABLE IF NOT EXISTS fd_users ( " +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "UserName VARCHAR(200), " +
                "AccountType VARCHAR(200), " +
                "UserId INTEGER(20))";
            tx.executeSql(sql);
       alert('Table created');

        },
        function (error) {
            console.log(error);
            alert('An error has occured.'+error);
        }
    );


}


function GetUserDetails() {
    db.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM fd_users", [],
            function (tx, result) { // On Success
                var len = result.rows.length;
                for (var i = 0; i < len; i++) {
                    var row = result.rows.item(i);
                    $('#USERID').val(row.UserId);
                    setTimeout(function () {
                        startChat();

                    }, 1000);

                    //	alert(row.subscriber_id);

                }// End for
            },
            function (error) { // On error

            });

    });	//transaction

} // GetUserDetails

function transaction_error(tx, error) {
    console.log('Error Message');
    console.log(error);
    alert("Database Error: " + error);
}

function SaveUserDetails(data, accountType) {

    var sql = "insert into fd_users(UserName,UserId,AccountType) values('user','" + data + "'," + accountType + ")";
    db.transaction(
        function (tx) {
            tx.executeSql(sql);
            window.localStorage.setItem("runned", "1");

        },
        function (error) {
            console.log(error);
            var err=JSON.stringify(error, null, 4);
            alert(err + 'An error has occured. Please try again and check your internet connection');
        }
    );
}


function notification(title, msg) {
    var now = new Date().getTime();
    _3seconds_from_now = new Date(now + 1 * 100);
    _1seconds_from_now = new Date(now + 1 * 100);
    cordova.plugins.notification.local.schedule({
        id: 10,
        title: title,
        text: msg,
        at: _1seconds_from_now,
        smallIcon: 'res://icon',
        data: { meetingId:"#123FG8" }
    });
    // Join BBM Meeting when user has clicked on the notification
    cordova.plugins.notification.local.on("click", function (notification) {
        // joinMeeting(notification.data.meetingId);
        $.mobile.changePage('#patient-queries', {
            type: "get",
            transition: "flip"
        });
    });
} //Close notification

function notificationAppointment(title, msg) {
    var now = new Date().getTime();
    _1seconds_from_now = new Date(now + 1 * 100);
    cordova.plugins.notification.local.schedule({
        id: 10,
        title: title,
        text: msg,
        at: _1seconds_from_now,
        smallIcon: 'res://icon',
        data: { meetingId:"#123FG8" }
    });
    cordova.plugins.notification.local.on("click", function (notification) {
        $.mobile.changePage('#my-appointments', {
            type: "get",
            transition: "flip"
        });
    });
} //Close notification



function SetLocationNotification() {
    if ($('#HFLatitude').val() === "") {
        $('body').find('.bottom-notification').remove();
        $('.ui-footer').each(function () {
            $(this).append('<div class="bottom-notification warning">Please enable Location Access for better service.</div>');
            $('.ui-footer').show();
        });
        // $('.ui-footer').append('<div class="bottom-notification warning">Please enable Location Access for better service.</div>');
    }
}
function RemoveLocationNotification() {
    // $('.bottom-notification').remove();
    $('body').find('.bottom-notification').remove();
    $('.ui-footer').hide();
}

