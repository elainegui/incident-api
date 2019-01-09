$(document).ready(function(){

$("#welcome").text('Welcome, ' + localStorage.getItem("firstName"));

//alert ("test1");
var loginVar = localStorage.getItem('loginVar');
//alert("test2");

//alert(loginVar);

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

var loginVar = localStorage.getItem('loginVar');
//alert("oi");
//localStorage.setItem('loginVar',0);


var welcomeUser;

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


// SUBMIT FORM
var userRegister = function () {
	//  $.getJSON(jsonLtdLng, function (data) {
	//  	alert("getJson");
	//  	console.log(data.results[0].geometry.location.lat);
	//    });


	//alert("oi1");
	//alert("lat "+latitude);  ok
	// Prevent the form from submitting via the browser.
	event.preventDefault();
	ajaxPost();
};

function ajaxPost() {
	//added
	var latitude = place.geometry.location.lat();
	//alert("lat "+latitude);

	//added
//	geolocate();
//	alert("lat "+latitude);

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
		dataType: 'json',

		success: function (data, textStatus, jqXHR) {
			alert('User registered successfully' + jqXHR.status);
			window.location.href = 'mainPage.html';
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('userRegistry error: ' + textStatus + jqXHR.status);
		}
	});

}

function loginSuccess(data){
	localStorage.setItem('firstName', data.firstName);
	alert(localStorage.getItem('firstName'));
	welcomeUser= "Welcome, " + localStorage.getItem('firstName');

	window.location.href = 'mainPage.html';
};

function register() {
	window.location.href = 'register.html';
	userRegister();
};

var userRegister = function () {
	// Prevent the form from submitting via the browser.
	event.preventDefault();
	ajaxPost();
};

function logout(){

	localStorage.setItem('firstName', "");
	
	$("#welcome").val("");
	window.location.reload(true);
};

function reportIncident() {
	window.location.href = 'reportIncident.html';
	
};