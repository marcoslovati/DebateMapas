function exibeMensagem(mensagem, tipo, callback){
	$("#mensagem").html(mensagem).css("display", "block");

	if(tipo === 2){
		$("#mensagem").css("color", "red");
	}
	else{
		$("#mensagem").css("color", "blue");
	}
	function prim() {
		return new Promise(function(resolve, reject) {
			setTimeout(function(){
				$("#mensagem").html("").css("display", "none");
				resolve();
			}, 3000);
		});
	}

	prim().then(function(){
		console.log('chegou');
		if(callback)
			callback();
	});
}

var apiRoot = window.location.hostname === "localhost" ? "http://localhost:3000" : "http://cmpaas.inf.ufes.br:3000";

function enviarEmail(email, sucesso, erro){
	ajaxRequest(apiRoot + "/v1/users/email/" + email, "post", undefined, sucesso, {"x-access-token": localStorage.getItem("token")}, erro);
}

function salvarDebate(debate, sucessoDebate){
	ajaxRequest(apiRoot + "/v1/debates", "post", debate, sucessoDebate, {"x-access-token": localStorage.getItem("token")});
}

function desAtivarDebate(idDebate, sucessoDebate){
	ajaxRequest(apiRoot + "/v1/debates/changeStatus/" + idDebate, "put", undefined, sucessoDebate, {"x-access-token": localStorage.getItem("token")});
}

function alterarAnonimatoDebate(idDebate, sucessoDebate){
	ajaxRequest(apiRoot + "/v1/debates/changeAnonymous/" + idDebate, "put", undefined, sucessoDebate, {"x-access-token": localStorage.getItem("token")});
}

function processarNiveisDebateInicial(idDebate, sucessoProcessar){
	ajaxRequest(apiRoot + "/v1/debates/processLevelsInitial/debate/" + idDebate, "post", undefined, sucessoProcessar, {"x-access-token": localStorage.getItem("token")});
}

function processarClustersDebateInicial(idDebate, sucessoProcessar){
	ajaxRequest(apiRoot + "/v1/debates/processClustersInitial/debate/" + idDebate, "post", undefined, sucessoProcessar, {"x-access-token": localStorage.getItem("token")});
}

function processarDebateFinal(idDebate){
	var sucessoProcessar = function(){
		exibeMensagem("Resultado do debate processado com sucesso");
	};

	ajaxRequest(apiRoot + "/v1/debates/processFinal/debate/" + idDebate, "post", undefined, sucessoProcessar, {"x-access-token": localStorage.getItem("token")});
}

function salvarDebateUnities(debateUnities, sucessoDebateUnities){
	ajaxRequest(apiRoot + "/v1/debateUnities", "post", debateUnities, sucessoDebateUnities, {"x-access-token": localStorage.getItem("token")});
}

function atualizarDebateUnity(debateUnityQuestions, sucessoDebateUnity){
	ajaxRequest(apiRoot + "/v1/debateUnities/questions", "post", debateUnityQuestions, sucessoDebateUnity, {"x-access-token": localStorage.getItem("token")});
}

function buscarDebates(sucessoDebates){
	ajaxRequest(apiRoot + "/v1/debates/creator", "get", undefined, sucessoDebates, {"x-access-token": localStorage.getItem("token")});
}

function buscarDebatesPerguntar(sucessoDebateUnities){
	ajaxRequest(apiRoot + "/v1/debateUnities/questioner", "get", undefined, sucessoDebateUnities, {"x-access-token": localStorage.getItem("token")});
}

function buscarDebatesResponder(sucessoDebateUnities){
	ajaxRequest(apiRoot + "/v1/debateUnities/author", "get", undefined, sucessoDebateUnities, {"x-access-token": localStorage.getItem("token")});
}

function buscarUnidadesDebate(idDebate, sucessoDebateUnities){
	ajaxRequest(apiRoot + "/v1/debateUnities/debate/" + idDebate, "get", undefined, sucessoDebateUnities, {"x-access-token": localStorage.getItem("token")});
}

function buscarMapContent(mapContentId, sucessoMapContent){
	ajaxRequest(apiRoot + "/v1/mapContents/" + mapContentId, "get", undefined, sucessoMapContent, {"x-access-token": localStorage.getItem("token")});
}

function buscarGruposPorAdmin(adminId, sucessoGrupos){
	ajaxRequest(apiRoot + "/v1/groups/admin/" + adminId, "get", undefined, sucessoGrupos, {"x-access-token": localStorage.getItem("token")});
};

function salvarMapa(titulo, sucessoMapa){
	var dadosMap = {
		"title": titulo
	};

	ajaxRequest(apiRoot + "/v1/maps", "post", dadosMap, sucessoMapa, {"x-access-token": localStorage.getItem("token")});
}

function criarGrupo(dadosGrupo, sucessoGrupo){
	ajaxRequest(apiRoot + "/v1/groups", "post", dadosGrupo, sucessoGrupo, {"x-access-token": localStorage.getItem("token")});
}

function alterarGrupo(dadosGrupo, sucessoGrupo){
	ajaxRequest(apiRoot + "/v1/groups/" + dadosGrupo._id, "put", dadosGrupo, sucessoGrupo, {"x-access-token": localStorage.getItem("token")});
}

function salvarUsuariosGrupo(idGrupo, listaIdsUsuarios, sucessoGrupo){
	ajaxRequest(apiRoot + "/v1/groups/" + idGrupo + "/include", "put", listaIdsUsuarios, sucessoGrupo, {"x-access-token": localStorage.getItem("token")});
}

function removerUsuariosGrupo(idGrupo, listaIdsUsuarios, sucessoGrupo){
	ajaxRequest(apiRoot + "/v1/groups/" + idGrupo + "/remove", "put", listaIdsUsuarios, sucessoGrupo, {"x-access-token": localStorage.getItem("token")});
}

function salvarMapaFinal(mapId, conteudo, debateUnity, sucessoDebateUnities){
	var sucessoMapContent = function(response){
		var mapContentId = response._id;

		debateUnity.finalMapContent = {
			_id: mapContentId
		};

		ajaxRequest(apiRoot + "/v1/debateUnities", "put", debateUnity, sucessoDebateUnities, {"x-access-token": localStorage.getItem("token")});
	};

	var dadosMapContent = {
		"content": conteudo
	};

	salvarConteudoMapa(mapId, dadosMapContent,sucessoMapContent);
}

function salvarConteudoMapa(mapId, dadosMapContent,sucessoMapContent){
	// console.log(dadosMapContent);
	ajaxRequest(apiRoot + "/v1/maps/" + mapId + "/content", "post", dadosMapContent, sucessoMapContent, {"x-access-token": localStorage.getItem("token")});
}

function buscarMapasPorGrupoEData(data, idsUsuarios, sucessoCarregaLista){
	ajaxRequest(apiRoot + "/v1/maps/date/" + data, "post", idsUsuarios, sucessoCarregaLista, {"x-access-token": localStorage.getItem("token")});
}

function buscarMapasPorAutor(userId, sucessoCarregaLista){
	ajaxRequest(apiRoot + "/v1/maps/author/" + userId, "get", undefined, sucessoCarregaLista, {"x-access-token": localStorage.getItem("token")});
}

function buscarMapaPorId(idMapa, sucessoCarregaMapa){
	ajaxRequest(apiRoot + "/v1/maps/" + idMapa, "get", undefined, sucessoCarregaMapa, {"x-access-token": localStorage.getItem("token")});
}

function buscarUsuariosPorFiltro(strFiltro, sucessoCarregaLista){
	ajaxRequest(apiRoot + "/v1/users/filter/" + strFiltro, "get", undefined, sucessoCarregaLista, {"x-access-token": localStorage.getItem("token")});
}

function buscarUsuariosPorGrupo(idGrupo, sucessoCarregaLista){
	ajaxRequest(apiRoot + "/v1/users/group/" + idGrupo, "get", undefined, sucessoCarregaLista, {"x-access-token": localStorage.getItem("token")});
}

function buscarUsuarios(sucessoCarregaLista){
	ajaxRequest(apiRoot + "/v1/users", "get", undefined, sucessoCarregaLista, {"x-access-token": localStorage.getItem("token")});
}

function buscarUsuarioPorId(idUsuario, sucesso){
	ajaxRequest(apiRoot + "/v1/users/" + idUsuario, "get", undefined, sucesso, {"x-access-token": localStorage.getItem("token")});
}

function verificaUsuarioGrupoAdmin(userId, sucesso){
	ajaxRequest(apiRoot + "/v1/users/" + userId + "/isOfAdministratorsGroup", "get", undefined, sucesso, {"x-access-token": localStorage.getItem("token")});
}

function alterarUsuario(usuario, sucesso){
	ajaxRequest(apiRoot + "/v1/users/" + usuario._id , "put", usuario, sucesso, {"x-access-token": localStorage.getItem("token")});
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