var formElement = null;
var respuestaSelect = [];
var respuestasMultiple = [];
var respuestaText = [];
var respuestaRadio = [];
var respuestasCheckbox = [];
var nota = 0; //nota de la prueba sobre 10

var min=10;
var seg=0;
var alerta=false;

//**************************************************************************************************** 
//Después de cargar la página (onload) se definen los eventos sobre los elementos entre otras acciones.
window.onload = function() {

    //CORREGIR al apretar el botón
    formElement = document.getElementById('myform');
    formElement.onsubmit = function() {
        inicializar();
        if (comprobar()){
            if (confirm("¿Quieres corregir el examen?")){
                corregirSelect();
                corregirMultiple();
                corregirText();
                corregirRadio();
                corregirCheckbox();
                presentarNota();
                alerta=true;
                window.location.hash = '#notaFinal';
                
            }     
        }
        
        return false;
    }

    //LEER XML de xml/preguntas.xml
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            gestionarXml(this);
        }
    };
    xhttp.open("GET", "xml/preguntas.xml", true); //cambiar URL al subir al github!!!
    xhttp.send();
    
    setInterval(actualizarTime,1000);
    
    
}

//****************************************************************************************************
// Recuperamos los datos del fichero XML xml/preguntas.xml
// xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml) {
    var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc  

    //SELECT
    //Recuperamos el título y las opciones, guardamos la respuesta correcta
    for (numPregunta=0; numPregunta<2; numPregunta++) {
        var tituloSelect = xmlDoc.getElementsByTagName("title")[numPregunta].innerHTML;
        var opcionesSelect = [];
        var nopt = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option').length;
        for (i = 0; i < nopt; i++) {
            opcionesSelect[i] = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option')[i].innerHTML;
        }
        ponerDatosSelectHtml(tituloSelect, opcionesSelect, numPregunta);
        respuestaSelect[numPregunta] = parseInt(xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName("answer")[0].innerHTML);
    }
    
    //SELECT MULTIPLE
    //Recuperamos el título y las opciones, guardamos las respuestas correctas
    for (numPregunta=2; numPregunta<4; numPregunta++){
        var tituloMultiple = xmlDoc.getElementsByTagName("title")[numPregunta].innerHTML;
        var opcionesMultiple = [];
        var nopt = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option').length;
        for (i = 0; i < nopt; i++) {
            opcionesMultiple[i] = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option')[i].innerHTML;
        }
        ponerDatosMultipleHtml(tituloMultiple, opcionesMultiple, numPregunta);
        var nres = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('answer').length;
        respuestasMultiple[numPregunta]=[];
        for (i = 0; i < nres; i++) {
            respuestasMultiple[numPregunta][i] = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName("answer")[i].innerHTML;
        }
    }

    //TEXT
    //Recuperamos el título y la respuesta correcta del input text
    for (numPregunta=4; numPregunta<6; numPregunta++) {
        var tituloInput = xmlDoc.getElementsByTagName("title")[numPregunta].innerHTML;
        ponerDatosInputHtml(tituloInput,numPregunta);
        respuestaText[numPregunta] = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName("answer")[0].innerHTML;
    }

    //RADIO
    //Recuperamos el título y las opciones, guardamos la respuesta correcta
    for (numPregunta=6 ; numPregunta<8;numPregunta++) {
        var tituloRadio = xmlDoc.getElementsByTagName("title")[numPregunta].innerHTML;
        var opcionesRadio = [];
        var nopt = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option').length;
        for (i = 0; i < nopt; i++) {
            opcionesRadio[i] = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option')[i].innerHTML;
        }
        ponerDatosRadioHtml(tituloRadio, opcionesRadio, numPregunta);
        respuestaRadio[numPregunta] = parseInt(xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName("answer")[0].innerHTML);
    }

    //CHECKBOX
    //Recuperamos el título y las opciones, guardamos las respuestas correctas
    for (numPregunta=8; numPregunta<10; numPregunta++){
        var tituloCheckbox = xmlDoc.getElementsByTagName("title")[numPregunta].innerHTML;
        var opcionesCheckbox = [];
        var nopt = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option').length;
        for (i = 0; i < nopt; i++) {
            opcionesCheckbox[i] = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('option')[i].innerHTML;
        }
        ponerDatosCheckboxHtml(tituloCheckbox, opcionesCheckbox, numPregunta);
        var nres = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName('answer').length;
        respuestasCheckbox[numPregunta]=[];
        for (i = 0; i < nres; i++) {
            respuestasCheckbox[numPregunta][i] = xmlDoc.getElementsByTagName("question")[numPregunta].getElementsByTagName("answer")[i].innerHTML;
        }
    }
}

//****************************************************************************************************
// Implementación de la corrección

//Corrección de los dos Select
function corregirSelect(){
    for(n=0;n<2;n++){
        var sel = formElement.elements[n];  
         if ((sel.selectedIndex-1)==respuestaSelect[n]) {
            darRespuestaHtml("- Pregunta "+(n+1)+": Correcta");
            nota +=1;
            }
        else {
            darRespuestaHtml("- Pregunta "+(n+1)+": Incorrecta");
            if(n==0){
                darExplicacion("Respuesta correcta: c");
                darExplicacion("Si un avión explota no podrás salir de él, como mucho saldrás por las noticias.");
            } else {
                darExplicacion("Respuesta correcta: c");
                darExplicacion("En un incendio, las llamas siempre tienen la culpa.");
            }
        }       
    }       
}

//Corrección de los Select MULTIPLE
function corregirMultiple(){
    for(n=2;n<4;n++){
        var sel = formElement.elements[n];
        var escorrecta=[];
        var mal=false;
        for(i=1;i<(sel.length);i++){
            var opt=sel.options[i];
            if(opt.selected){
                escorrecta[i]=false; 
                for (j = 0; j < respuestasMultiple[n].length; j++) {
                    if ((i-1)==respuestasMultiple[n][j]) escorrecta[i]=true;
                }
                //si es correcta sumamos y ponemos mensaje, si no es correcta restamos y ponemos mensaje.
                if (escorrecta[i]) {
                    nota +=1.0/respuestasMultiple[n].length;  //dividido por el número de respuestas correctas   
                    darRespuestaHtml("- Pregunta "+(n+1)+": Opción "+i+" Correcta");    
                } else {
                    nota -=1.0/respuestasMultiple[n].length;  //dividido por el número de respuestas correctas   
                    darRespuestaHtml("- Pregunta "+(n+1)+": Opción"+i+" Incorrecta");
                    mal=true;
                }
            }
        } 
        if(n==2 && mal==true){
                darExplicacion("Respuestas correcta: a, b, d");
            } else if (n==3 && mal==true) {
                darExplicacion("Respuestas correcta: a, d");
            }
        
    }
}

//Corrección de los text
function corregirText() {
    for(n=4;n<6;n++){
        var txt = formElement.elements[n].value;  
         if (txt.toLowerCase()==respuestaText[n]) {
            darRespuestaHtml("- Pregunta "+(n+1)+": Correcta");
            nota +=1;
        } else {
            darRespuestaHtml("- Pregunta "+(n+1)+": Incorrecta");
            if(n==4){
                darExplicacion("Respuesta correcta: tela");
                darExplicacion("'Tela' digo y no la entiendes; 'tela' vuelvo a repetir");
            } else {
                darExplicacion("Respuesta correcta: silencio");
            }
        }
     
    }
}

//Corrección de los radio
function corregirRadio(){
    var f=formElement;
    for(n=6;n<8;n++){
        var nombreRadio;
        if (n==6){
            nombreRadio=f.seis;
        } else {
            nombreRadio=f.siete;
        }
        if (nombreRadio.value==respuestaRadio[n]) {
            darRespuestaHtml("- Pregunta "+(n+1)+": Correcta");
            nota +=1;
            }
        else {
            darRespuestaHtml("- Pregunta "+(n+1)+": Incorrecta");
             if(n==4){
                darExplicacion("Respuesta correcta: c");
            } else {
                darExplicacion("Respuesta correcta: d");
                darExplicacion("Lo más rápido en la sabana siempre será el vehículo.");
            }
        } 
    }        
}

//Corrección de los checkbox
function corregirCheckbox(){
  //Para cada opción mira si está checkeada, si está checkeada mira si es correcta y lo guarda en un array escorrecta[]
  var f=formElement;
  var escorrecta = [];
  for (n=8;n<10;n++){
    var nombre;
    var mal=false;
    if (n==8){
        nombre=f.ocho;
    } else {
        nombre=f.nueve;
    }

    for (i = 0; i < nombre.length; i++) {  
        if (nombre[i].checked) {
            escorrecta[i]=false;     
            for (j = 0; j < respuestasCheckbox[n].length; j++) {
                if (i==respuestasCheckbox[n][j]) escorrecta[i]=true;
            }
            //si es correcta sumamos y ponemos mensaje, si no es correcta restamos y ponemos mensaje.
            if (escorrecta[i]) {
                nota +=1.0/respuestasCheckbox[n].length;  //dividido por el número de respuestas correctas   
                darRespuestaHtml("- Pregunta "+(n+1)+": Opción "+(i+1)+" Correcta");    
            } else {
                nota -=1.0/respuestasCheckbox[n].length;  //dividido por el número de respuestas correctas   
                darRespuestaHtml("- Pregunta "+(n+1)+": Opción "+(i+1)+" Incorrecta");
                mal=true;
            }   
        } 
    }
    if(n==8 && mal==true){
                darExplicacion("Respuestas correcta: b, c, d, e, f");
            } else if (n==9 && mal==true) {
                darExplicacion("Respuestas correcta: a, b");
            }
  }
  
}

//****************************************************************************************************
// Poner los datos recibios en el HTML


function ponerDatosSelectHtml(t, opt, numPregunta) {
    document.getElementsByTagName("h3")[numPregunta].innerHTML = t;
    var select = document.getElementsByTagName("select")[numPregunta];
    for (i = 0; i < opt.length; i++) {
        var option = document.createElement("option");
        option.text = opt[i];
        option.value = i;
        select.options.add(option);
    }
}

function ponerDatosMultipleHtml(t, opt, numPregunta) {
    document.getElementsByTagName("h3")[numPregunta].innerHTML = t;
    var select = document.getElementsByTagName("select")[numPregunta];
    for (i = 0; i < opt.length; i++) {
        var option = document.createElement("option");
        option.text = opt[i];
        option.value = i;
        select.options.add(option);
    }
}

function ponerDatosInputHtml(t, numPregunta) {
    document.getElementsByTagName("h3")[numPregunta].innerHTML = t;
}


function ponerDatosRadioHtml(t, opt, numPregunta) {
    document.getElementsByTagName("h3")[numPregunta].innerHTML = t;
    var radioCont = document.getElementsByClassName('radioDiv')[numPregunta-6];
    var radioAsignado;
    if (numPregunta==6){
     radioAsignado="seis";
    }
    else {
     radioAsignado="siete";
    }
    for (i = 0; i < opt.length; i++) { 
        var input = document.createElement("input");
        var label = document.createElement("label");
        label.innerHTML=opt[i];
        input.type="radio";
        input.name=radioAsignado;
        input.value=i;    
        radioCont.appendChild(input);
        radioCont.appendChild(label);
        radioCont.appendChild(document.createElement("br"));
    } 
}

function ponerDatosCheckboxHtml(t,opt, numPregunta){
 var checkboxContainer=document.getElementsByClassName('checkboxDiv')[numPregunta-8];
 document.getElementsByTagName("h3")[numPregunta].innerHTML = t;
 var nombreAsignado;
 if (numPregunta==8){
     nombreAsignado="ocho";
 }
 else {
     nombreAsignado="nueve";
 }
 for (i = 0; i < opt.length; i++) { 
    var input = document.createElement("input");
    var label = document.createElement("label");
    label.innerHTML=opt[i];
    label.setAttribute("for", nombreAsignado+"_"+i);
    input.type="checkbox";
    input.name=nombreAsignado;
    input.id=nombreAsignado+"_"+i;;    
    checkboxContainer.appendChild(input);
    checkboxContainer.appendChild(label);
    checkboxContainer.appendChild(document.createElement("br"));
 }  
}

//****************************************************************************************************
//Gestionar la presentación de las respuestas
function darRespuestaHtml(r) {
    var p = document.createElement("p");
    var node = document.createTextNode(r);
    p.appendChild(node);
    document.getElementById('resultadosDiv').appendChild(p);
}

function darExplicacion(e) {
    var p = document.createElement("p");
    var node = document.createTextNode(e);
    p.appendChild(node);
    document.getElementById('resultadosDiv').appendChild(p);
}

function presentarNota() {
    document.getElementById('notaFinal').style.display="block";
    document.getElementById("notaza").innerHTML="Nota: " + nota.toFixed(2) + " puntos sobre 10";
}

function inicializar() {
    document.getElementById('resultadosDiv').innerHTML = "";
    nota = 0.0;
}

//Comprobar que se han introducido datos en el formulario
function comprobar(){
   var f=formElement;

   // Comprobación del select normal
   for(numPreg=0;numPreg<2;numPreg++){
    if (f.elements[numPreg].selectedIndex==0) {
    f.elements[numPreg].focus();
    alert("Por favor, selecciona una opcion en la pregunta "+(numPreg+1));
    return false;
    }
   }
   // Comprobación del select multiple
   for(numPreg=2;numPreg<4;numPreg++){
       var multRespondido=false;
        for(i=1;i<(f.elements[numPreg].length);i++){
            var opt=f.elements[numPreg].options[i];
            if(opt.selected){
                multRespondido=true;
            }
        }
        if (!multRespondido) {
        f.elements[numPreg].focus();
        alert("Por favor, selecciona al menos una opcion en la pregunta "+(numPreg+1));
        return false;
        }
   }
   // Comprobación del text
   for(numPreg=4;numPreg<6;numPreg++){
    if (f.elements[numPreg].value=="") {
    f.elements[numPreg].focus();
    alert("Por favor, responde la pregunta "+(numPreg+1));
    return false;
    }
   }
   // Comprobación del radio
   for(numPreg=6;numPreg<8;numPreg++){
       var nombreRadio;
        if (numPreg==6){
            nombreRadio=f.seis;
        } else {
            nombreRadio=f.siete;
        }
        if (nombreRadio.value=="") {
            nombreRadio[0].focus();
            alert("Por favor, responde la pregunta "+(numPreg+1));
            return false;
        }   
    }
   // Comprobación del checkbox
   for(numPreg=8;numPreg<10;numPreg++){
        var checked=false;
        var nombre;
        if (numPreg==8){
            nombre=f.ocho;
        } else {
        nombre=f.nueve;
        }
        for (i = 0; i < nombre.length; i++) {  
            if (nombre[i].checked) {
            checked=true;
             }
        }
        if (!checked) {
        nombre[0].focus();
        alert("Por favor, selecciona al menos una opcion en la pregunta "+(numPreg+1));
        return false;
        }
   }
  return true;
}

//****************************************************************************************************
//Funciones del tiempo

function actualizarTime(){
    var segTimer;

    if((min>=0) && (seg>=0)){   
        if(seg<10){
            segTimer="0"+seg;
        }else{
            segTimer=seg;
        }
        document.getElementById("timer").innerHTML=min+" : "+segTimer;
        seg--; 
        if(seg<0){
            min--;
            seg=59;
        }  
    }else{
        document.getElementById("timer").innerHTML="0 : 00";        
        if (!alerta){
            alert("Se acabó el tiempo. Date prisa en enviar tus respuestas.");
            alerta=true;
    }
        
    }
         
    
}
