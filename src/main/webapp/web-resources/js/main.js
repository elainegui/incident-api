var hostUsed = `http://localhost:8080`;
//var hostUsed = `https://www.ottero.me`;

$(document).ready(function () {
    var username = localStorage.getItem("firstName");
    if (username === null) {
        $('#loginTab').show();
        $('#logoutTab').text('Log out');
        $('#logoutTab').hide();
        $('#registerTab').show();
        $('#myIncidentsTab').hide();
    } else {
        $('#loginTab').hide();
        $('#logoutTab').text(localStorage.getItem("firstName") + ' | Log out');
        $('#logoutTab').show();
        $('#registerTab').hide();
        $('#myIncidentsTab').show();
    }

    //navbar functions calling
    $('#loginTab').on('click', function(e) {
        e.preventDefault();   
        login(); 
        });

    $('#registerTab').on('click', function(e) {
        e.preventDefault();   
        register(); 
    });

    $('#logoutTab').on('click', function(e) {
        e.preventDefault();   
        logout(); 
    });

});


function login() {
    window.location.href = 'login.html';
}

//validate button
var validateLogin = function () {
    var userId = $('#userid').val();
    var password = $('#password').val();

    if(userId!==""||password!==""){
        $.ajax({
            type: 'GET',
            url: hostUsed + "/user?email=" + userId + '&password=' + password,
			//url: 'http://localhost:8080/user?email=' + userId + '&password=' + password,
            dataType: "json",
            async: false,
            success: function (data) {
                loginSuccess(data);
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("#validationMessage").text("invalid login/ password");
            }
        });
    }else{
        $("#validationMessage").text("Please fill in the fields");
    }
};

function registerUserAjaxPost() {
    //added
    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();

    // PREPARE FORM DATA
    var formData = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        //added
        number: $("#street_number").val(),
        street: $("#route").val(),
        //city: $("#city").val(),
        city: $("#locality").val(),
        county: $("#administrative_area_level_1").val(),
        zipCode: $("#postal_code").val(),
        country: $("#country").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        confirmPassword: $("#confirmPassword").val(),
        userLatitude: latitude,
        userLongitude: longitude

    };
var passw = $("#password").val();
var uName = $("#email").val();
    // DO POST
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: hostUsed + "/register",
		//url: "http://localhost:8080/register",
        data: JSON.stringify(formData),
        dataType: 'text',

        success: function (data, textStatus, jqXHR) {
            alert('User registered successfully');
            //added
            var dataFromForm = JSON.stringify(formData);

            redirectUserLoggedToMainPage(dataFromForm, passw, uName);
            //console.log("formData "+JSON.stringify(formData));
            //window.location.href = 'mainPage.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('userRegistry error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
        }
    });
}

function loginSuccess(data) {
    localStorage.setItem('firstName', data.firstName);
    localStorage.setItem('userId', data.id);
    $("#loginForm")[0].reset();
    window.location.href = 'mainPage.html';
}

//automatically login when user registers successfully
function loginSuccessFromRegistration(data){
    localStorage.setItem('firstName', data.firstName);
    localStorage.setItem('userId', data.id);
    window.location.href = 'mainPage.html';
}

//tab nav bar
function register() {
    window.location.href = 'register.html';
}

function validateUserRegister() {
    $("#validationMessage").text('');
    return checkBlankFieldsInUserRegister() && checkPasswordConfirmationInUserRegister() &&
        checkAddressWasChosenInUserRegister();
}

function checkAddressWasChosenInUserRegister() {
    if ($("#country").val() === '') {
        $("#validationMessage").text('Please start typing the address then choose the best option suggested.');
        return false;
    }
    return true;
}

function checkPasswordConfirmationInUserRegister() {
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();
    if (password !== confirmPassword) {
        $("#validationMessage").text('Passwords must match!');
        return false;
    }
    return true;
}


function checkBlankFieldsInUserRegister() {

    var invalidFields = [];

    if ($("#firstName").val() === '') {
        invalidFields.push('First Name');
    }

    if ($("#lastName").val() === '') {
        invalidFields.push('Last Name');
    }

    if ($("#autocomplete").val() === '') {
        invalidFields.push('Address');
    }

    if ($("#email").val() === '') {
        invalidFields.push('E-mail address');
    }

    if ($("#password").val() === '') {
        invalidFields.push('Password');
    }

    if ($("#confirmPassword").val() === '') {
        invalidFields.push('Confirm Password');
    }

    if (invalidFields.length > 0) {
        var errorMessage = 'Please provide information for the following fields: ';
        var fields = '';
        $.each(invalidFields, function (index, value) {
            fields += ", " + value;
        });
        fields = fields.substr(2);
        errorMessage += fields;
        $("#validationMessage").text(errorMessage);
        return false;
    }

    return true;
}

var userRegister = function () {
    // Prevent the form from submitting via the browser.
    event.preventDefault();

    if (validateUserRegister()) {
        registerUserAjaxPost();
        $("#registrationForm")[0].reset();
    }
};

function logout() {

    localStorage.removeItem('firstName');
    localStorage.removeItem('userId');
    window.location.reload(true);
}

function saveIncident(latitude, longitude) {
    console.log("localStorage.getItem('firstName') "+localStorage.getItem('firstName'));
    if (!localStorage.getItem('firstName')) {
        alert("Please login to report an incident");
    } else {

        event.preventDefault();
        var typeData = {
            id: $("#incidentType").val(),
            description: $("#incidentType option:selected").text()
        };

        var incidentData = {
            date: new Date(),
            userId: localStorage.getItem('userId'),
            type: typeData,
            verified: false,
            latitude: latitude,
            longitude: longitude,
            image: $("#photoBase64").val(),
            message: $("#message").val()
        };

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: hostUsed + "/incident",
            //url: "http://localhost:8080/incident",
            data: JSON.stringify(incidentData),
            dataType: 'json',

            success: function (data, textStatus, jqXHR) {
                /*plotGroupOfIncidents([incidentData]);
                $("#incidentType").val('');
                $("#photoBase64").val('');
                $("#message").val('')*/
                window.location.href = 'mainPage.html';

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Incident report error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
            }
        });
    }
}

var loadIncidents = function (latitude, longitude, radius) {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: hostUsed + `/incident-local?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
		//url: `http://localhost:8080/incident-local?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
        success: function (data, textStatus, jqXHR) {
            plotIncidents(data);
           //convertTimestampToDate(data);
           loadIncidentsToChart(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('incidents load error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
        }
    });
};

var formatDate = function(someDate) {
  var tempDate = new Date(someDate);
  return tempDate.getFullYear() + "-" + tempDate.getMonth()+1 + "-" + tempDate.getDate() + " " + tempDate.getHours() + ":" + tempDate.getMinutes() + ":" + tempDate.getSeconds();
};


function loadIncidentsToChart(incidents){
    key = "";
var incidentsDictionary = {};
    $.each(incidents, function (index, incident) {
        var key = incident.type;
        if(!key in incidentsDictionary ){
            incidentsDictionary[key].push(incident);
        }
    })
}

function redirectUserLoggedToMainPage(dataFromForm, passw, uName){
    console.log("password "+passw);
 
         $.ajax({
             type: 'GET',
             url: hostUsed + "/user?email=" + uName + '&password=' + passw,
		 	//url: 'http://localhost:8080/user?email=' + userId + '&password=' + password,
             dataType: "json",
             async: false,
             success: function (data) {
                 loginSuccessFromRegistration(data);
             },

             error: function (XMLHttpRequest, textStatus, errorThrown) {
                 $("#validationMessage").text("invalid login/ password");
             }
         });
}

function viewTrendsPage(){
//     $.get("incidentTrends.html").success( function(result){
//     $('body').html(result);
// }).error(function(result){
//     alert("Error!");
// });
    $(".containerBody").css("display", "none");
     $(".chart-container").css("display", "block");
     loadIncidentsToTrendsPage();
}

var loadIncidentsToTrendsPage = function () {

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://localhost:8080/trend",
        success: function (trends, textStatus, jqXHR) {
            //trends json format:
            //a list of dictionaries of dictionaries, as seen below:
            // [
            //     {
            //         "incidentTypeDescription":"Car Crash",
            //         "totalPerMonth":{
            //             "03-2018":34, "04-2018":36, "05-2018":39, "06-2018":40, "07-2018":50, "08-2018":42,
            //             "09-2018":39, "10-2018":31, "11-2018":36, "12-2018":21, "01-2019":21, "02-2019":2 }
            //     },
            //     {
            //         "incidentTypeDescription":"Faulty Traffic Light",
            //         "totalPerMonth":{
            //             "03-2018":40, "04-2018":35, "05-2018":36, "06-2018":41, "07-2018":49, "08-2018":43,
            //             "09-2018":30, "10-2018":27, "11-2018":41, "12-2018":39, "01-2019":6, "02-2019":1 }
            //     },
            // ...
            //]
            plotTrendsChart(trends);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('incidents load chart error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
        }
    });
};



var availableColors = [
    "rgba(0,0,0,255)", "rgba(255,0,0,255)", "rgba(0,0,255,255)",
    "rgba(0,255,0,255)", "rgba(255,255,0,255)", "rgba(0,255,255,255)"
];

function addLabels(targetDictionary, trendsData) {
    targetDictionary['labels'] = Object.keys(trendsData[0]["totalPerMonth"]);
}

function addIncidents(chartData, trendsData) {
    var numberOfIncidentTypes = trendsData.length;
    var datasets = [];
    for (var index = 0; index < numberOfIncidentTypes; index++) {
        var incidentTypeChartData = {};
        incidentTypeChartData["label"] = trendsData[index]["incidentTypeDescription"];
        incidentTypeChartData["backgroundColor"] = "rgba(0,0,0,0)";
        incidentTypeChartData["borderColor"] = availableColors[index];
        incidentTypeChartData["borderWidth"] = "2";
        incidentTypeChartData["hoverBackgroundColor"] = "rgba(255,99,132,0.4)";
        incidentTypeChartData["hoverBorderColor"] = "rgba(255,99,132,1)";
        incidentTypeChartData["data"] = Object.values(trendsData[index]["totalPerMonth"]);
        incidentTypeChartData["type"] = "line";
        datasets.push(incidentTypeChartData);
    }
    chartData["datasets"] = datasets;
}

function plotTrendsChart(trendsData) {
    //defining background color
    var ctx = document.getElementById("chart");
    ctx.style.backgroundColor = 'rgba(255,255,255,255)';

    var chartData = {};
    addLabels(chartData, trendsData);
    addIncidents(chartData, trendsData);

    var chartOptions = {
        title: {
        display: true,
        text: 'Incidents Trend'
        },
        responsive: 'true',
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                gridLines: {
                    display: true,
                    color: "rgba(255,99,132,0.2)"
                }
            }],
            xAxes: [{
                gridLines: {
                    display: true,
                    color: "rgba(255,99,132,0.2)"
                }
            }]
        },
        layout: {
        padding: {
            left: 50,
            right: 50,
            top: 50,
            bottom:50
        }

    }
    };

    Chart.Bar('chart', {
        options: chartOptions,
        data: chartData
    });
}

/* 
 key = latitude + "|" + longitude
//        var dict = {};
//        $.each(incidents, function (index, incident) {
//            var key = incident.latitude + "|" + incident.longitude;
//            if (!(key in dict)) {
//                dict[key] = new Array();
//            }
//            dict[key].push(incident);
//        });
//        return dict;
*/



//function convertTimestampToDate(incidents){
// 1. buid a dictionary(hash map) by picking up the incident.type as the key and incident.date as value
// 2. order values (dates) in the dictionary 
//  2.1 For that, maybe the dates should be converted to Date objects 
 






/*      var incidentsByDateArray = new Array();
     $.each(incidents, function (index, incident) {
         var dateStr = incident.date;
          // console.log(dateStr);
         var dateObject = new Date(dateStr);
         incidentsByDateArray.push(dateObject);

}) */


// var date_sort_desc = function (date1, date2) {
//     // This is a comparison function that will result in dates being sorted in
//     // DESCENDING order.
//     if (date1 > date2) return -1;
//     if (date1 < date2) return 1;
//     return 0;
//   };

//  var arraySorted =  incidentsByDateArray.sort(date_sort_desc);
// console.log("array sorted"+arraySorted);
//  return arraySorted;
// }




        // var newIncidents = _.sortBy(incidents, function(dateObject) {
          
        //     //return new Date(dateObject.date);
        //   });

        //   console.log(newIncidents.date);
          
          
   

      
       
      // var key= incident.date





      
    // timestamp "2019-01-25T10:14:46.000+0000"

   // var date = new Date(incident.date);
   //var date = new Date(); 
   
   //var dateMonth = date.getMonth();

    // console.log(dateMonth);
    // console.log(date);

    //var json = JSON.stringify(date);
    //console.log(json);








//        function groupIncidentsByLatLng(incidents) {
//         key = latitude + "|" + longitude
//        var dict = {};
//        $.each(incidents, function (index, incident) {
//            var key = incident.latitude + "|" + incident.longitude;
//            if (!(key in dict)) {
//                dict[key] = new Array();
//            }
//            dict[key].push(incident);
//        });
//        return dict;
//    }




    // var incidents = JSON.parse(jsonResult);
    // var firstIncidentDate = incidents.date[0];
    // console.log("firstIncidentDate"+firstIncidentDate);
