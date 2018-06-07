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

var token = localStorage.getItem("token");
var headers = {
	"x-access-token": token
};

function carregarPagina(pagina){
    $("#corpo").load(pagina);
  }

function salvarDebate(debate, sucessoDebate){
	ajaxRequest("http://localhost:3000/v1/debates", "post", debate, sucessoDebate, headers);
}

function processarDebate(idDebate){
	ajaxRequest("http://localhost:3000/v1/debates/process/debate/" + idDebate, "post", undefined, function(){}, headers);
}

function salvarDebateUnities(debateUnities, sucessoDebateUnities){
	ajaxRequest("http://localhost:3000/v1/debateUnities", "post", debateUnities, sucessoDebateUnities, headers);
}

function buscarDebates(sucessoDebates){
	ajaxRequest("http://localhost:3000/v1/debates/creator", "get", undefined, sucessoDebates, headers);
}

function buscarDebatesPerguntar(sucessoDebateUnities){
	ajaxRequest("http://localhost:3000/v1/debateUnities/questioner", "get", undefined, sucessoDebateUnities, headers);
}

function buscarMapContent(mapContentId, sucessoMapContent){
	ajaxRequest("http://localhost:3000/v1/mapContents/" + mapContentId, "get", undefined, sucessoMapContent, headers);
}

function salvarMapa(titulo, conteudo){
	var dadosMap = {
		"title": titulo
	};

	var sucessoMapContent = function (){
		carregarPagina("paginas/home.html");
	};

	var dadosMapContent = {
		"content": conteudo
	};

	var sucessoMap = function (response){
		var mapId = response.map._id;

		ajaxRequest("http://localhost:3000/v1/maps/" + mapId + "/content", "post", dadosMapContent, sucessoMapContent, headers);
	};

	ajaxRequest("http://localhost:3000/v1/maps", "post", dadosMap, sucessoMap, headers);
}

function buscarMapasPorData(data, sucessoCarregaLista){
	ajaxRequest("http://localhost:3000/v1/maps/date/" + data, "get", undefined, sucessoCarregaLista, headers);
}

function buscarMapasPorAutor(sucessoCarregaLista){
	ajaxRequest("http://localhost:3000/v1/maps/author", "get", undefined, sucessoCarregaLista, headers);
}

function objectifyForm(formArray) {//serialize data function
	var unindexed_array = formArray.serializeArray();
	var indexed_array = {};

	$.map(unindexed_array, function(n, i){
		indexed_array[n['name']] = n['value'];
	});

	return indexed_array;
}

function submitForm(form, successCallback, headers){
	var post_url = form.attr("action"); //get form action url
	var request_method = form.attr("method"); //get form GET/POST method
	var form_data = objectifyForm(form); //Encode form elements for submission

	ajaxRequest(post_url, request_method, form_data, successCallback, headers);
}

function ajaxRequest(action, method, data, successCallback, headers){   
		$.ajax({
			url : action,
			type: method,
			data : JSON.stringify(data),
			contentType: "application/json",
			dataType: "json",
			headers: headers
		}).success(function(response, textStatus, request){ //
			successCallback(response, textStatus, request);
		});
}