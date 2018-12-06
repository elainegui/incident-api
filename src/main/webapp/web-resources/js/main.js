var validateLogin = function() {
	var userId = $('#userid').val();
	var password = $('#password').val();

	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/user?email='+userId +'&password='+password,
		dataType: "json",
		async: false,
		success: function (data) {
			window.location.href = 'mainPage.html';
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$("#validationMessage").text("invalid login/ password");
		}
	});
};


var validateRegistry = function() {
	var password1 = $('#password1').val();
	var password2 = $('#password2').val();
	if(password1!=password2){
		$("#validationMessage").text("passwords don't match");
	}
}