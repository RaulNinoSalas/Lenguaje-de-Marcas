var menuAct="info";
var menuAnt;

//al cargar por completo la página
window.onload = function(){

	//Seleccion del menu
	document.getElementById("info").onclick = function(){
		borrarTodo();
		mostrarInfo();
	}
	document.getElementById("test").onclick = function(){
		borrarTodo();
		mostrarTest();
	}
	document.getElementById("cont").onclick = function(){
		borrarTodo();
		mostrarCont();
	}

}

// Navegar por el menú superior

function mostrarInfo(){
	document.getElementById("info").style.textDecoration="underline";
	document.getElementById("infoD").style.display="block";
}

function mostrarCont(){
	document.getElementById("test").style.textDecoration="underline";
	document.getElementById("testD").style.display="block";
}

function mostrarTest(){
	document.getElementById("cont").style.textDecoration="underline";
	document.getElementById("contD").style.display="block";
}

function borrarTodo(){
	document.getElementById("info").style.textDecoration="none";
	document.getElementById("test").style.textDecoration="none";
	document.getElementById("cont").style.textDecoration="none";
	document.getElementById("infoD").style.display="none";
	document.getElementById("testD").style.display="none";
	document.getElementById("contD").style.display="none";