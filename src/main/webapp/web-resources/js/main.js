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


//******************* Login ******************************

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

//******************* Register ******************************

var userRegister = function () {
    // Prevent the form from submitting via the browser.
    event.preventDefault();

    if (validateUserRegister()) {
        registerUserAjaxPost();
        $("#registrationForm")[0].reset();
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

function validateUserRegister() {
    //var emailExists = checkEmailExists();
   // console.log("emailexists: "+emailExists);
    //if(emailExists===false){
    $("#validationMessage").text('');
    return checkBlankFieldsInUserRegister() && checkPasswordConfirmationInUserRegister() &&
        checkAddressWasChosenInUserRegister();
   // }
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


/* function checkEmailExists(){
    var userEmail = $("#email").val();
    if(userEmail!==""){
        $.ajax({
            type: 'GET',
            url: hostUsed + "/user?email=" + userEmail,
            dataType: "json",
            async: false,
            success: function () {
                $("#validationMessage").text("This e mail already exists");
                emailExists = true;

            //function (data) {
                //loginSuccess(data);
               // return true
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //$("#validationMessage").text("invalid login/ password");
                emailExists = false;
            }
        });
    }
  return emailExists 
} */

//tab nav bar
function register() {
    window.location.href = 'register.html';
}

//******************* Logout ******************************

function logout() {

    localStorage.removeItem('firstName');
    localStorage.removeItem('userId');
    window.location.reload(true);
}

//**************************** */

function convertCoordinatesToAddress(latitude, longitude) {
    var fallbackResult = "unspecified";
    $.ajax({
        type: "GET",
        async: false,
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCuy8n1cKEwpSJ2uYmi8xIw7GV8u94Tciw&result_type=country|administrative_area_level_1|locality`,
        success: function (data, textStatus, jqXHR) {
            /*console.log(`${latitude},${longitude}`);
            console.log(data);*/
            var country, state, city;
            // special case for UK
            if (resolveAddressComponentFromGeocodeResult(data.results[2]) === 'United Kingdom') {
                country = resolveAddressComponentFromGeocodeResult_UK(data.results[0], 3);
                state = resolveAddressComponentFromGeocodeResult_UK(data.results[0], 2);
                city = resolveAddressComponentFromGeocodeResult_UK(data.results[0], 0);
            } else {
                if (data.results.length === 2) {
                    // if there is no city, use fallbackResult for it
                    country = resolveAddressComponentFromGeocodeResult(data.results[1]);
                    state = resolveAddressComponentFromGeocodeResult(data.results[0]);
                    city = fallbackResult;
                } else {
                    // normal case
                    country = resolveAddressComponentFromGeocodeResult(data.results[2]);
                    state = resolveAddressComponentFromGeocodeResult(data.results[1]);
                    city = resolveAddressComponentFromGeocodeResult(data.results[0]);
                }
            }
            persistIncident(latitude, longitude, country, state, city);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            persistIncident(latitude, longitude, fallbackResult, fallbackResult, fallbackResult);
        }
    });
}

function resolveAddressComponentFromGeocodeResult(result) {
    try {
        return result.address_components[0].long_name;
    } catch(err) {
        return "unspecified";
    }
}

function resolveAddressComponentFromGeocodeResult_UK(result, index) {
    try {
        return result.address_components[index].long_name;
    } catch(err) {
        return "unspecified";
    }
}

function saveIncident(latitude, longitude) {
    //console.log("localStorage.getItem('firstName') "+localStorage.getItem('firstName'));
    if (!localStorage.getItem('firstName')) {
        alert("Please login to report an incident");
    } else {
        convertCoordinatesToAddress(latitude, longitude);
    }
}

function persistIncident(latitude, longitude, country, state, city) {
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
        message: $("#message").val(),
        country: country,
        state: state,
        city: city
    };

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: hostUsed + "/incident",
        data: JSON.stringify(incidentData),
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            window.location.href = 'mainPage.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Incident report error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
        }
    });
}

var loadIncidents = function (latitude, longitude, radius) {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: hostUsed + `/incident-local?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
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

function removeMsDropDownNatureFromSelects(selectObjetsIds) {
    for (var index = 0; index < selectObjetsIds.length; index++) {
        var select = $("#" + selectObjetsIds[index]).msDropdown().data("dd");
        select.destroy();
    }
}

function viewTrendsPage(){
    $(".containerBody").css("display", "none");
     $(".chart-container").css("display", "block");
    removeMsDropDownNatureFromSelects(['countries', 'states', 'cities']);
    loadCountries();
}

function loadValuesToSelectElement(selectName, values) {
    //get reference to the select object
    var select = document.querySelector("#" + selectName);
    for (var index = 0; index < values.length; index++) {
        country = toProperCase(values[index]);
        var option = document.createElement('option');
        option.value = country;
        option.text = country;
        select.add(option, null);
    }
}

function removeValuesFromSelectElement(selectName) {
    //get reference to the select object
    var select = document.querySelector("#" + selectName);
    var itemsToRemove = select.length;
    for (var index = 0; index < itemsToRemove; index++) {
        select.remove(0);
    }
}

function loadCountries() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: hostUsed + "/incident/country",
        success: function (countriesList, textStatus, jqXHR) {
            if (countriesList.length > 0) {
                removeValuesFromSelectElement("countries");
                loadValuesToSelectElement("countries", countriesList);
                callLoadStates();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('load countries error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
        }
    });
}

function loadStates(country) {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: hostUsed + `/incident/country/${country}/state`,
        success: function (statesList, textStatus, jqXHR) {
            removeValuesFromSelectElement("states");
            loadValuesToSelectElement("states", statesList);
            callLoadCities();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('load states error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
        }
    });
}

function loadCities(country, state) {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: hostUsed + `/incident/country/${country}/state/${state}/city`,
        success: function (citiesList, textStatus, jqXHR) {
            removeValuesFromSelectElement("cities");
            loadValuesToSelectElement("cities", citiesList);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('load cities error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
        }
    });
}

function callLoadStates() {
    var country = document.querySelector("#countries").value;
    if (country !== 'Choose the country') {
        loadStates(country);
    }
}

function callLoadCities() {
    var country = document.querySelector("#countries").value;
    var state = document.querySelector("#states").value;
    if (state !== 'Choose the state') {
        loadCities(country, state);
    }
}

function toProperCase(value) {
    return value.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}


var loadIncidentsToTrendsPage = function () {
    var country = document.querySelector("#countries").value;
    var state = document.querySelector("#states").value;
    var city = document.querySelector("#cities").value;
    if (city !== 'Choose the city') {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: hostUsed + `/trend?country=${country}&state=${state}&city=${city}`,
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
    }
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
