var db;
var dbCreated = false;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    alert('ready');
    db = window.openDatabase("Radioson", "1.0", "PhoneGap Demo", 200000);
    var firstrun = window.localStorage.getItem("runned");
    //  firstrun = null;
    alert(firstrun);
    if (firstrun == null ) {
        setTimeout(function(){hideLoader(); }, 2000);
        $('#landing').fadeIn();
        populateDB();
    }
    else {
        GetUserDetails();
    }



} //onDeviceReady



function populateDB(data){

 alert('populateDB');
//Create Table
    db.transaction(
        function(tx) {

//Create user table

            var sql = "DROP TABLE IF EXISTS fd_users";
            tx.executeSql(sql);
            sql = " CREATE TABLE IF NOT EXISTS fd_users ( "+
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "UserName VARCHAR(200), " +
                "AccountType VARCHAR(200), " +
                "UserId INTEGER(20))";
            tx.executeSql(sql);


        },
        function(error){console.log(error); alert('An error has occured. Please try again and check your internet connection');}
    );

}

function GetUserDetails(){
    alert('getting user details');
    db.transaction(function(transaction) {
        transaction.executeSql("select * from fd_users", [],
            function(tx, result) { // On Success
                var len = result.rows.length;
                for (var i=0; i<len; i++) {
                    alert(row.AccountType);
                    var row = result.rows.item(i);
                    if(row.AccountType==1){
                       window.location="doctor.html";
                    }else{
                        window.location="client.html";
                    }


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