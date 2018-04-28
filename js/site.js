$(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
});

function objectifyForm(formArray) {//serialize data function
	var unindexed_array = formArray.serializeArray();
	var indexed_array = {};

	$.map(unindexed_array, function(n, i){
		indexed_array[n['name']] = n['value'];
	});

	return indexed_array;
}

function ajaxFormRequest(form, successCallback){		
	var post_url = form.attr("action"); //get form action url
	var request_method = form.attr("method"); //get form GET/POST method
	var form_data = objectifyForm(form); //Encode form elements for submission
   
		$.ajax({
			url : post_url,
			type: request_method,
			data : JSON.stringify(form_data),
			contentType: "application/json",
			dataType: "json",
		}).success(function(response, textStatus, request){ //
			successCallback(response, textStatus, request);
		});
}