var db;
var dbCreated = false;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    db = window.openDatabase("Radioson", "1.0", "PhoneGap Demo", 200000);
    var firstrun = window.localStorage.getItem("runned");


    if (firstrun === null || firstrun === 'null' ) {
        setTimeout(function(){hideLoader(); }, 2000);
        $('#landing').fadeIn();
    }
    else {
        GetUserDetails();
    }

} //onDeviceReady


function GetUserDetails(){

    db.transaction(function(transaction) {
        transaction.executeSql("select * from fd_users", [],
            function(tx, result) { // On Success
                var len = result.rows.length;
                    var row = result.rows.item(0);
                    if(row.AccountType==1){
                       window.location="doctor.html";
                    }else{
                        window.location="client.html";
                }// End for
            },
            function(error){ // On error

            });

    });	//transaction

} // GetUserDetails

function transaction_error(tx, error) {
    console.log('Error Message');
    console.log(error);
  //  alert("Database Error: " + error);
}
$(document).ready(function(){
    $('a').on('click',function(){
        showLoader();

    })
});