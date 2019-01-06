
//var user = "";


var loginVar = localStorage.getItem('loginVar');
//alert("oi");
//localStorage.setItem('loginVar',0);



$(document).ready(function () {
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
			localStorage.setItem('loginVar',1);
			window.location.href='mainPage.html';
		},

		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$("#validationMessage").text("invalid login/ password");
		}
	});
};

function loginSuccess(data) {
	localStorage.setItem('firstName', data.firstName);
	alert(localStorage.getItem('firstName'));
	localStorage.setItem('loginVar',1);
	welcomeUser = "Welcome, " + localStorage.getItem('firstName');

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

function ajaxPost() {
	// PREPARE FORM DATA
	var formData = {
		firstName: $("#firstName").val(),
		lastName: $("#lastName").val(),
		country: $("#country").val(),
		city: $("#city").val(),
		email: $("#email").val(),
		password: $("#password").val(),
		confirmPassword: $("#confirmPassword").val()
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
			//localStorage.setItem('loginVar', 1);
			window.location.href = 'mainPage.html';
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('userRegistry error: ' + textStatus + jqXHR.status);
		}
	});

}

function logout() {
	localStorage.setItem('loginVar', 0);
	window.location.reload(true);
};

