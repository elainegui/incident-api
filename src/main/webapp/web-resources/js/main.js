$(document).ready(function () {

    if (localStorage.getItem("firstName")) {
        $("#welcome").text('Welcome, ' + localStorage.getItem("firstName"));
    } else {
        $("#welcome").text('Welcome');
    }

    //TODO verify how loginVar is being set and what it does
    var loginVar = localStorage.getItem('loginVar');

    if (loginVar == 0) {
        $('#loginButton').show();
        $('#logoutButton').hide();
        $('#registerButton').show();
    } else if (loginVar == 1) {
        $('#loginButton').hide();
        $('#logoutButton').show();
        $('#registerButton').hide();
    } else {
        $('#loginButton').show();
        $('#logoutButton').hide();
        $('#registerButton').show();
    }

});

//TODO verify how loginVar is being set and what it does
var loginVar = localStorage.getItem('loginVar');

function login() {
    window.location.href = 'login.html';
    validateLogin();
};

var validateLogin = function () {
    var userId = $('#userid').val();
    var password = $('#password').val();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/user?email=' + userId + '&password=' + password,
        dataType: "json",
        async: false,
        success: function (data) {
            loginSuccess(data);
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#validationMessage").text("invalid login/ password");
        }
    });
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

    }
    // DO POST
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "http://localhost:8080/register",
        data: JSON.stringify(formData),
        dataType: 'text',

        success: function (data, textStatus, jqXHR) {
            alert('User registered successfully');
            window.location.href = 'mainPage.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('userRegistry error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
        }
    });
}

function loginSuccess(data) {
    localStorage.setItem('firstName', data.firstName);
    localStorage.setItem('userId', data.id);
    window.location.href = 'mainPage.html';
};

function register() {
    window.location.href = 'register.html';
};

var userRegister = function () {
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    registerUserAjaxPost();
};

function logout() {

    localStorage.setItem('firstName', "");

    $("#welcome").val("");
    window.location.reload(true);
};

function reportIncident() {
    window.location.href = 'reportIncident.html';
};

function saveIncident() {
    event.preventDefault();
    var place = autocomplete.getPlace();

    var formData = {
        date: new Date(),
        userId: localStorage.getItem('userId'),
        typeId: $("#incidentType").val(),
        verified: false,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        image: $("#photo").val(),
        message: $("#message").val()
    }

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "http://localhost:8080/incident",
        data: JSON.stringify(formData),
        dataType: 'json',

        success: function (data, textStatus, jqXHR) {
            alert('Incident reported successfully' + jqXHR.status);
            window.location.href = 'mainPage.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Incident report error: ' + textStatus + jqXHR.status);
        }
    });

};






