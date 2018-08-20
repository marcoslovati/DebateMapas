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

function carregarPagina(pagina){
    $("#corpo").load(pagina);
  }

function salvarDebate(debate, sucessoDebate){
	ajaxRequest("http://localhost:3000/v1/debates", "post", debate, sucessoDebate, {"x-access-token": localStorage.getItem("token")});
}

function processarNiveisDebateInicial(idDebate){
	var sucessoProcessar = function(){
		exibeMensagem("Debate processado em níveis com sucesso");	
	};

	ajaxRequest("http://localhost:3000/v1/debates/processLevelsInitial/debate/" + idDebate, "post", undefined, sucessoProcessar, {"x-access-token": localStorage.getItem("token")});
}

function processarClustersDebateInicial(idDebate){
	var sucessoProcessar = function(){
		exibeMensagem("Debate processado em clusters com sucesso");
	};

	ajaxRequest("http://localhost:3000/v1/debates/processClustersInitial/debate/" + idDebate, "post", undefined, sucessoProcessar, {"x-access-token": localStorage.getItem("token")});
}

function processarDebateFinal(idDebate){
	var sucessoProcessar = function(){
		exibeMensagem("Resultado do debate processado com sucesso");
	};

	ajaxRequest("http://localhost:3000/v1/debates/processFinal/debate/" + idDebate, "post", undefined, sucessoProcessar, {"x-access-token": localStorage.getItem("token")});
}

function salvarDebateUnities(debateUnities, sucessoDebateUnities){
	ajaxRequest("http://localhost:3000/v1/debateUnities", "post", debateUnities, sucessoDebateUnities, {"x-access-token": localStorage.getItem("token")});
}

function atualizarDebateUnity(debateUnityQuestions, sucessoDebateUnity){
	ajaxRequest("http://localhost:3000/v1/debateUnities/questions", "post", debateUnityQuestions, sucessoDebateUnity, {"x-access-token": localStorage.getItem("token")});
}

function buscarDebates(sucessoDebates){
	ajaxRequest("http://localhost:3000/v1/debates/creator", "get", undefined, sucessoDebates, {"x-access-token": localStorage.getItem("token")});
}

function buscarDebatesPerguntar(sucessoDebateUnities){
	ajaxRequest("http://localhost:3000/v1/debateUnities/questioner", "get", undefined, sucessoDebateUnities, {"x-access-token": localStorage.getItem("token")});
}

function buscarDebatesResponder(sucessoDebateUnities){
	ajaxRequest("http://localhost:3000/v1/debateUnities/author", "get", undefined, sucessoDebateUnities, {"x-access-token": localStorage.getItem("token")});
}

function buscarUnidadesDebate(idDebate, sucessoDebateUnities){
	ajaxRequest("http://localhost:3000/v1/debateUnities/debate/" + idDebate, "get", undefined, sucessoDebateUnities, {"x-access-token": localStorage.getItem("token")});
}

function buscarMapContent(mapContentId, sucessoMapContent){
	ajaxRequest("http://localhost:3000/v1/mapContents/" + mapContentId, "get", undefined, sucessoMapContent, {"x-access-token": localStorage.getItem("token")});
}

function buscarGruposPorAdmin(adminId, sucessoGrupos){
	ajaxRequest("http://localhost:3000/v1/groups/admin/" + adminId, "get", undefined, sucessoGrupos, {"x-access-token": localStorage.getItem("token")});
};

function salvarMapa(titulo, sucessoMapa){
	var dadosMap = {
		"title": titulo
	};

	ajaxRequest("http://localhost:3000/v1/maps", "post", dadosMap, sucessoMapa, {"x-access-token": localStorage.getItem("token")});
}

function salvarGrupo(nome, descricao, publico, admin){
	var dadosGrupo = {
		"name": nome,
		"description": descricao,
		"public": publico,
		"admin": admin
	};

	var sucessoGrupo = function (){
		exibeMensagem("Grupo salvo com sucesso");
	};

	ajaxRequest("http://localhost:3000/v1/groups", "post", dadosGrupo, sucessoGrupo, {"x-access-token": localStorage.getItem("token")});
}

function salvarUsuariosGrupo(idGrupo, listaIdsUsuarios, sucessoGrupo){
	ajaxRequest("http://localhost:3000/v1/groups/" + idGrupo + "/include", "put", listaIdsUsuarios, sucessoGrupo, {"x-access-token": localStorage.getItem("token")});
}

function removerUsuariosGrupo(idGrupo, listaIdsUsuarios, sucessoGrupo){
	ajaxRequest("http://localhost:3000/v1/groups/" + idGrupo + "/remove", "put", listaIdsUsuarios, sucessoGrupo, {"x-access-token": localStorage.getItem("token")});
}

function salvarMapaFinal(mapId, conteudo, debateUnity){
	var sucessoMapContent = function(response){
		var mapContentId = response._id;

		debateUnity.finalMapContent = {
			_id: mapContentId
		};

		var sucessoDebateUnities = function(){
			carregarPagina("paginas/listaDebatesResponder.html");
		};

		ajaxRequest("http://localhost:3000/v1/debateUnities", "put", debateUnity, sucessoDebateUnities, {"x-access-token": localStorage.getItem("token")});
	};

	var dadosMapContent = {
		"content": conteudo
	};

	salvarConteudoMapa(mapId, dadosMapContent,sucessoMapContent);
}

function salvarConteudoMapa(mapId, dadosMapContent,sucessoMapContent){
	console.log(dadosMapContent);
	ajaxRequest("http://localhost:3000/v1/maps/" + mapId + "/content", "post", dadosMapContent, sucessoMapContent, {"x-access-token": localStorage.getItem("token")});
}

function buscarMapasPorGrupoEData(data, idsUsuarios, sucessoCarregaLista){
	ajaxRequest("http://localhost:3000/v1/maps/date/" + data, "post", idsUsuarios, sucessoCarregaLista, {"x-access-token": localStorage.getItem("token")});
}

function buscarMapasPorAutor(sucessoCarregaLista){
	ajaxRequest("http://localhost:3000/v1/maps/author", "get", undefined, sucessoCarregaLista, {"x-access-token": localStorage.getItem("token")});
}

function buscarUsuariosPorNome(nome, sucessoCarregaLista){
	ajaxRequest("http://localhost:3000/v1/users/name/" + nome, "get", undefined, sucessoCarregaLista, {"x-access-token": localStorage.getItem("token")});
}

function buscarUsuarios(sucessoCarregaLista){
	ajaxRequest("http://localhost:3000/v1/users", "get", undefined, sucessoCarregaLista, {"x-access-token": localStorage.getItem("token")});
}

function verificaUsuarioGrupoAdmin(userId, sucesso){
	ajaxRequest("http://localhost:3000/v1/users/" + userId + "/isOfAdministratorsGroup", "get", undefined, sucesso, {"x-access-token": localStorage.getItem("token")});
}

function objectifyForm(formArray) {//serialize data function
	var unindexed_array = formArray.serializeArray();
	var indexed_array = {};

	$.map(unindexed_array, function(n, i){
		indexed_array[n['name']] = n['value'];
	});

	return indexed_array;
}

function submitForm(form, successCallback, headers, errorCallback){
	var post_url = form.attr("action"); //get form action url
	var request_method = form.attr("method"); //get form GET/POST method
	var form_data = objectifyForm(form); //Encode form elements for submission

	ajaxRequest(post_url, request_method, form_data, successCallback, headers, errorCallback);
}

function ajaxRequest(action, method, data, successCallback, headers, errorCallback){   
		$.ajax({
			url : action,
			type: method,
			data : JSON.stringify(data),
			contentType: "application/json",
			dataType: "json",
			headers: headers,
			success:function(response, textStatus, request){
				successCallback(response, textStatus, request);
			},
			error: function(response){
				if(response.status === 401){
					window.location = "login.html";
				}
				else if(errorCallback){
					errorCallback(response);
				}				
			}
		});
}