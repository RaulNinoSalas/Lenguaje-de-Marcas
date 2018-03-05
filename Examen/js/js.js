var menuAct = "info";
var menuAnt;

//al cargar la página
window.onload = function () {

	//Seleccion de pestañas
	document.getElementById("info").onclick = function () {
		borrarTodo();
		mostrarInfo();
	}
	document.getElementById("test").onclick = function () {
		borrarTodo();
		mostrarUbi();
	}
	document.getElementById("cont").onclick = function () {
		borrarTodo();
		mostrarExam();
	}

}

// Para navegar por el menú superior

function mostrarInfo() {
	document.getElementById("info").style.textDecoration = "underline";
	document.getElementById("infoD").style.display = "block";
}

function mostrarUbi() {
	document.getElementById("test").style.textDecoration = "underline";
	document.getElementById("testD").style.display = "block";
}

function mostrarExam() {
	document.getElementById("cont").style.textDecoration = "underline";
	document.getElementById("contD").style.display = "block";
}

function borrarTodo() {
	document.getElementById("info").style.textDecoration = "none";
	document.getElementById("test").style.textDecoration = "none";
	document.getElementById("cont").style.textDecoration = "none";
	document.getElementById("infoD").style.display = "none";
	document.getElementById("testD").style.display = "none";
	document.getElementById("contD").style.display = "none";
}