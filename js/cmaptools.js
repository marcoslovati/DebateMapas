function getConceptId(data, id){
    for(var i = 0; i < data.length; i++){
      if(data[i].getAttribute("id") == id)
      {
        return i;
      }
    }
  }
  
  var inputElement = document.getElementById("cmapFile");
  inputElement.addEventListener("change", importToCmpaas, false);
  
  function importToCmpaas (evt) {
      var files = evt.target.files;
      var file = files[0];
      var reader = new FileReader();
      reader.onload = function() {
          var text = this.result;
          var parser, xmlDoc;
          parser = new DOMParser();
          xmlDoc = parser.parseFromString(text, "text/xml");
  
          var mapData = {};
          var nodeDataArray = [];
          mapData.nodeDataArray = nodeDataArray;
  
          var linkDataArray = [];
          mapData.linkDataArray = linkDataArray;
  
          var concepts = xmlDoc.getElementsByTagName("concept");
          var linkingPhrases = xmlDoc.getElementsByTagName("linking-phrase");
          var connections = xmlDoc.getElementsByTagName("connection");
          var concept_appearance = xmlDoc.getElementsByTagName("concept-appearance");
          var linkingPhrases_appearance = xmlDoc.getElementsByTagName("linking-phrase-appearance");

          console.log(connections);
          for(var i = 0; i < concepts.length; i++){
              var element = concepts[i];
              var loc = concept_appearance.namedItem(element.id);
              var conceito = {
                "key": element.id,
                "text": element.attributes["label"].value,
                "category": "concept",
                "loc": loc.attributes["x"].value + " " + loc.attributes["y"].value
              };

              mapData.nodeDataArray.push(conceito);
          }

          for(var i = 0; i < linkingPhrases.length; i++){
              var element = linkingPhrases[i];
              var loc = linkingPhrases_appearance.namedItem(element.id);
              var relacao = {
                "key": element.id,
                "text": element.attributes["label"].value,
                "category": "relation",
                "loc": loc.attributes["x"].value + " " + loc.attributes["y"].value
              };

              mapData.nodeDataArray.push(relacao);
          }

          for(var i = 0; i < connections.length; i++){
              var element = connections[i];
            //   var loc = connections.namedItem(element.id);
              var link = {
                "from": element.attributes["from-id"].value,
                "to": element.attributes["to-id"].value,
                "category": "normal"
              }
              
              mapData.linkDataArray.push(link);
          }          
  
          myDiagram.model = go.Model.fromJson("{}");
          myDiagram.model = go.Model.fromJson(mapData);
  
      }
      reader.readAsText(file);
  }

  function formataData(data){
    var dataFormatada = data.getFullYear() + "-" + ((data.getMonth() + 1).toString().padStart(2, '0')) + "-" + data.getDate().toString().padStart(2, '0')
    + "T" + data.getHours().toString().padStart(2, '0') + ":" + data.getMinutes().toString().padStart(2, '0') + ":" + data.getSeconds().toString().padStart(2, '0') + ""
    + "-03:00";

    return dataFormatada;
  }
  
  function exportToCMap() {
      var titulo = $("#titulo").val();
      var data = new Date();
      var dataFormatada =  formataData(data);

      var xmltext = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
      xmltext += "\t<cmap xmlns:dcterms=\"http://purl.org/dc/terms/\" xmlns=\"http://cmap.ihmc.us/xml/cmap/\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:vcard=\"http://www.w3.org/2001/vcard-rdf/3.0#\">\n";
      xmltext += "\t\t<res-meta>\n";
      xmltext += "\t\t\t<dc:title>" + (titulo ? titulo : "mapa") + "</dc:title>\n";
      xmltext += "\t\t\t<dc:creator>\n";  

      xmltext += "\t\t\t\t<vcard:FN>" + localStorage.getItem("userName") + "</vcard:FN>\n";
      xmltext += "\t\t\t\t<vcard:EMAIL>cmpaas@gmail.com</vcard:EMAIL>\n";  

      xmltext += "\t\t\t</dc:creator>\n";
  
      xmltext += "\t\t\t<dc:contributor>\n";

      xmltext += "\t\t\t\t<vcard:FN>" + localStorage.getItem("userName") + "</vcard:FN>\n";
      xmltext += "\t\t\t\t<vcard:EMAIL>cmpaas@gmail.com</vcard:EMAIL>\n";

      xmltext += "\t\t\t</dc:contributor>\n";
  
      xmltext += "\t\t\t<dcterms:rightsHolder>\n";

      xmltext += "\t\t\t\t<vcard:FN>" + localStorage.getItem("userName") + "</vcard:FN>\n";
      xmltext += "\t\t\t\t<vcard:EMAIL>cmpaas@gmail.com</vcard:EMAIL>\n";

      xmltext += "\t\t\t</dcterms:rightsHolder>\n";
  
      xmltext += "\t\t\t<dcterms:created>" + dataFormatada + "</dcterms:created>\n";
      xmltext += "\t\t\t<dc:language>pt</dc:language>\n";
      xmltext += "\t\t\t<dc:format>x-cmap/x-storable</dc:format>\n";
      xmltext += "\t\t</res-meta>\n";
  
      xmltext += "\t\t<map>\n";

      var conceptList = "\t\t\t<concept-list>\n";
      var conceptAppearanceList = "\t\t\t<concept-appearance-list>\n";
      var linkingPhraseList = "\t\t\t<linking-phrase-list>\n";
      var linkingPhraseAppearanceList = "\t\t\t<linking-phrase-appearance-list>\n";
  
      var mapJSON = myDiagram.model.toJson();
      mapJSON = JSON.parse(mapJSON);

      var x = 0, y = 0, xMenor = 0, yMenor = 0, ajusteX = 50, ajusteY = 30;
      var arrXy = [];
  
      for(var i = 0; i < mapJSON.nodeDataArray.length; i++){
          arrXy = mapJSON.nodeDataArray[i].loc.split(" ");
          x = parseInt(arrXy[0]);
          y = parseInt(arrXy[1]);
          if (xMenor > x)
              xMenor = x
  
          if (yMenor > y)
              yMenor = y
      }

      for(var i = 0; i < mapJSON.nodeDataArray.length; i++){

        arrXy = mapJSON.nodeDataArray[i].loc.split(" ");
        var newX = (parseInt(arrXy[0]) + ajusteX + xMenor * (-1));
        var newY = (parseInt(arrXy[1]) + ajusteY + yMenor * (-1));

        if(mapJSON.nodeDataArray[i].category === "concept"){
            conceptList += "\t\t\t\t<concept id=\"" + mapJSON.nodeDataArray[i].key + "\" label=\""+ mapJSON.nodeDataArray[i].text +"\"/>\n";
            conceptAppearanceList += "\t\t\t\t<concept-appearance id=\"" + mapJSON.nodeDataArray[i].key + "\" x=\""+ newX + "\" y=\""+ newY +"\"/>\n";
        }
        else{
            linkingPhraseList += "\t\t\t\t<linking-phrase id=\"" + mapJSON.nodeDataArray[i].key + "\" label=\""+ mapJSON.nodeDataArray[i].text +"\"/>\n";
            linkingPhraseAppearanceList += "\t\t\t\t<linking-phrase-appearance id=\"" + mapJSON.nodeDataArray[i].key + "\" x=\""+ newX + "\" y=\""+ newY +"\"/>\n";
        }
      }

      conceptList += "\t\t\t</concept-list>\n";
      conceptAppearanceList += "\t\t\t</concept-appearance-list>\n";
      linkingPhraseList += "\t\t\t</linking-phrase-list>\n";
      linkingPhraseAppearanceList += "\t\t\t</linking-phrase-appearance-list>\n";

      var connectionList = "\t\t\t<connection-list>\n";
      var connectionAppearanceList = "\t\t\t<connection-appearance-list>\n";  
      
      for(var i = 0; i < mapJSON.linkDataArray.length; i++){
        connectionList += "\t\t\t\t<connection id=\"" + i + "\" from-id=\""+ mapJSON.linkDataArray[i].from +"\" to-id=\""+ mapJSON.linkDataArray[i].to +"\"/>\n";
        connectionAppearanceList += "\t\t\t<connection-appearance id=\"" + i + "\" from-pos=\"center\" to-pos=\"center\" arrowhead=\"if-to-concept\"/>\n";
      }
  
      connectionList += "\t\t\t</connection-list>\n";
      connectionAppearanceList += "\t\t\t</connection-appearance-list>\n";

      xmltext += conceptList + linkingPhraseList + connectionList + conceptAppearanceList + linkingPhraseAppearanceList + connectionAppearanceList;
  
      xmltext += "\t\t\t<style-sheet-list>\n";
      xmltext += "\t\t\t\t<style-sheet id=\"_Default_\">\n";
      xmltext += "\t\t\t\t\t<map-style background-color=\"255,255,255,0\"/>\n";
      xmltext += "\t\t\t\t\t<concept-style font-name=\"Verdana\" font-size=\"12\" font-style=\"plain\" font-color=\"0,0,0,255\" text-margin=\"4\" background-color=\"237,244,246,255\" background-image-style=\"full\" border-color=\"0,0,0,255\" border-style=\"solid\" border-thickness=\"1\" border-shape=\"rounded-rectangle\" border-shape-rrarc=\"15.0\" text-alignment=\"center\" shadow-color=\"none\" min-width=\"-1\" min-height=\"-1\" max-width=\"-1.0\"/>\n";
      xmltext += "\t\t\t\t\t<linking-phrase-style font-name=\"Verdana\" font-size=\"12\" font-style=\"plain\" font-color=\"0,0,0,255\" text-margin=\"1\" background-color=\"0,0,255,0\" background-image-style=\"full\" border-color=\"0,0,0,0\" border-style=\"solid\" border-thickness=\"1\" border-shape=\"rectangle\" border-shape-rrarc=\"15.0\" text-alignment=\"center\" shadow-color=\"none\"/>\n";
      xmltext += "\t\t\t\t\t<connection-style color=\"0,0,0,255\" style=\"solid\" thickness=\"1\" type=\"straight\" arrowhead=\"if-to-concept-and-slopes-up\"/>\n";
      xmltext += "\t\t\t\t\t<resource-style font-name=\"SanSerif\" font-size=\"12\" font-style=\"plain\" font-color=\"0,0,0,255\" background-color=\"192,192,192,255\"/>\n";
      xmltext += "\t\t\t\t</style-sheet>\n";
      xmltext += "\t\t\t\t<style-sheet id=\"_LatestChanges_\">\n";
      xmltext += "\t\t\t\t\t<connection-style arrowhead=\"yes\"/>\n";
      xmltext += "\t\t\t\t</style-sheet>\n";
      xmltext += "\t\t\t</style-sheet-list>\n";
      xmltext += "\t\t\t<extra-graphical-properties-list>\n";
      xmltext += "\t\t\t\t<properties-list id=\"1Q41DT8ZP-1HWYM8X-6G\">\n";
      xmltext += "\t\t\t\t\t<property key=\"StyleSheetGroup_0\" value=\"//*@!#$%%^&amp;*()() No Grouped StyleSheets @\"/>\n";
      xmltext += "\t\t\t\t</properties-list>\n";
      xmltext += "\t\t\t</extra-graphical-properties-list>\n";
      xmltext += "\t\t</map>\n";
      xmltext += "\t</cmap>\n";
  
      var pom = document.createElement('a');
  
      var filename = titulo ? titulo + '.cxl' : "mapa.cxl";
      var pom = document.createElement('a');
      var bb = new Blob([xmltext], {type: 'text/plain'});
  
      pom.setAttribute('href', window.URL.createObjectURL(bb));
      pom.setAttribute('download', filename);
  
      pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
      pom.draggable = true;
      pom.classList.add('dragout');
  
      pom.click();
  }