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
  
          //Carregamento dos conceitos
          var newConcept;
          for (var cont = 0; cont < concepts.length; cont++){
              newConcept = {
                  "key" : cont,
                  "text": concepts[cont].getAttribute("label"),
                  "loc": concept_appearance[cont].getAttribute("x") + " " + concept_appearance[cont].getAttribute("y")
              };
              mapData.nodeDataArray.push(newConcept);
          }
  
          // Carregar as connections de cada link
          var linkId, linkLabel;
          var listFromConcepts = [];
          var listToConcepts = [];
  
          for(var i = 0; i < linkingPhrases.length; i++){
              listFromConcepts = [];
              listToConcepts = [];
  
              linkId = linkingPhrases[i].getAttribute("id");
              linkLabel = linkingPhrases[i].getAttribute("label");
  
              //Todos os conceitos que o linkID é TO
              for(var j = 0; j < connections.length; j++){
                  if(connections[j].getAttribute("to-id") == linkId){
                      listFromConcepts.push(connections[j].getAttribute("from-id"));
                  }
              }
  
              //Todos os conceitos que o linkID é FROM
              for(var j = 0; j < connections.length; j++){
                  if(connections[j].getAttribute("from-id") == linkId){
                  listToConcepts.push(connections[j].getAttribute("to-id"));
                  }
              }
  
              var fromConcept, toConcept, newLink, x, y;
              for(x = 0; x < listFromConcepts.length; x++){
                  fromConcept = listFromConcepts[x];
                  for(y = 0; y < listToConcepts.length; y++){
                      toConcept = listToConcepts[y];
                      newLink = {
                          "from" : getConceptId(concepts, fromConcept),
                          "to": getConceptId(concepts, toConcept),
                          "text": linkLabel
                      };
                      mapData.linkDataArray.push(newLink);
                  }
              }
          }
  
          myDiagram.model = go.Model.fromJson("{}");
          myDiagram.model = go.Model.fromJson(mapData);
  
      }
      reader.readAsText(file);
  }
  
  function exportToCMap() {
      var xmltext = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
      xmltext += "\t<cmap xmlns:dcterms=\"http://purl.org/dc/terms/\" xmlns=\"http://cmap.ihmc.us/xml/cmap/\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:vcard=\"http://www.w3.org/2001/vcard-rdf/3.0#\">\n";
      xmltext += "\t\t<res-meta>\n";
      xmltext += "\t\t\t<dc:title>" + 'mapa' + "</dc:title>\n";
      xmltext += "\t\t\t<dc:description>" + 'questao' + "</dc:description>\n";
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
  
      xmltext += "\t\t\t<dcterms:created>"+Date()+"</dcterms:created>\n";
      xmltext += "\t\t\t<dc:language>pt</dc:language>\n";
      xmltext += "\t\t\t<dc:format>x-cmap/x-storable</dc:format>\n";
      xmltext += "\t\t</res-meta>\n";
  
      xmltext += "\t\t<map>\n";
      xmltext += "\t\t\t<concept-list>\n";
  
      var mapJSON = myDiagram.model.toJson();
      mapJSON = JSON.parse(mapJSON);
      var cont = 0;
      for(var i = 0; i < mapJSON.nodeDataArray.length; i++){
          var oldKey = mapJSON.nodeDataArray[i].key;
          mapJSON.nodeDataArray[i].key = i + 10000;
  
          for(var i2 = 0; i2 < mapJSON.linkDataArray.length; i2++){
              if(mapJSON.linkDataArray[i2].from === oldKey)
                  mapJSON.linkDataArray[i2].from = i + 10000;
  
              if(mapJSON.linkDataArray[i2].to === oldKey)
                  mapJSON.linkDataArray[i2].to = i + 10000;
          }
  
          xmltext += "\t\t\t\t<concept id=\"" + (i + 10000) + "\" label=\""+ mapJSON.nodeDataArray[i].text +"\"/>\n";
          cont++;
      }
  
      xmltext += "\t\t\t</concept-list>\n";
  
      xmltext += "\t\t\t<linking-phrase-list>\n";
  
      for(var i = 0; i < mapJSON.linkDataArray.length; i++){
          mapJSON.linkDataArray[i].id = cont;
          xmltext += "\t\t\t\t<linking-phrase id=\"" + cont + "\" label=\""+ mapJSON.linkDataArray[i].text +"\"/>\n";
          cont++;
      }
  
      xmltext += "\t\t\t</linking-phrase-list>\n";
  
      xmltext += "\t\t\t<connection-list>\n";
  
      var linkId;
      for(var i = 0; i < mapJSON.linkDataArray.length; i++){
          linkId = mapJSON.linkDataArray[i].id;
          xmltext += "\t\t\t\t<connection id=\"" + cont + "\" from-id=\""+ mapJSON.linkDataArray[i].from +"\" to-id=\""+ linkId +"\"/>\n";
          cont++;
          xmltext += "\t\t\t\t<connection id=\"" + cont + "\" from-id=\""+ linkId +"\" to-id=\""+ mapJSON.linkDataArray[i].to +"\"/>\n";
          cont++;
      }
  
      xmltext += "\t\t\t</connection-list>\n";
  
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
  
      xmltext += "\t\t\t<concept-appearance-list>\n";
  
      for(var i = 0; i < mapJSON.nodeDataArray.length; i++){
          arrXy = mapJSON.nodeDataArray[i].loc.split(" ");
          var newX = (parseInt(arrXy[0]) + ajusteX + xMenor * (-1));
          var newY = (parseInt(arrXy[1]) + ajusteY + yMenor * (-1));
          xmltext += "\t\t\t\t<concept-appearance id=\"" + mapJSON.nodeDataArray[i].key + "\" x=\""+ newX + "\" y=\""+ newY +"\"/>\n";
          mapJSON.nodeDataArray[i].loc = newX + " " + newY;
      }
  
      xmltext += "\t\t\t</concept-appearance-list>\n";
  
      xmltext += "\t\t\t<linking-phrase-appearance-list>\n";
  
      for(var i = 0; i < mapJSON.linkDataArray.length; i++){
          var x1 = 0;
          var y1 = 0;
          var x2 = 0;
          var y2 = 0;
  
          var conc1 = mapJSON.linkDataArray[i].from;
          var conc2 = mapJSON.linkDataArray[i].to;
  
          var i2 = 0;
          while((x1 === 0 || x2 === 0) && i2 < mapJSON.linkDataArray.length){
              if(conc1 === mapJSON.nodeDataArray[i2].key){
                  var arrXy = mapJSON.nodeDataArray[i2].loc.split(" ");
                  x1 = parseInt(arrXy[0]);
                  y1 = parseInt(arrXy[1]);
              }
  
              if(conc2 === mapJSON.nodeDataArray[i2].key){
                  var arrXy = mapJSON.nodeDataArray[i2].loc.split(" ");
                  x2 = parseInt(arrXy[0]);
                  y2 = parseInt(arrXy[1]);
              }
              i2++;
          }
  
          var menorX = x1;
          if(x1 > x2)
              menorX = x2;
  
          var menorY = y1;
          if(y1 > y2)
              menorY = y2;
  
          var x = Math.round(Math.abs((x1 - x2)/2) + menorX, 0);
          var y = Math.round(Math.abs((y1 - y2)/2) + menorY, 0);;
  
          xmltext += "\t\t\t\t<linking-phrase-appearance id=\"" + mapJSON.linkDataArray[i].id + "\" x=\""+ x + "\" y=\""+ y +"\"/>\n";
      }
  
      xmltext += "\t\t\t</linking-phrase-appearance-list>\n";
  
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
  
      var filename = "file.cxl";
      var pom = document.createElement('a');
      var bb = new Blob([xmltext], {type: 'text/plain'});
  
      pom.setAttribute('href', window.URL.createObjectURL(bb));
      pom.setAttribute('download', filename);
  
      pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
      pom.draggable = true;
      pom.classList.add('dragout');
  
      pom.click();
  }