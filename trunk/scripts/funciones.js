/*
// ---------------------------------------------------- //
//														//
//		funciones.js									//
//														//
//		Versión:				1.1						//
//		Autor:					Ricardo Galicia Huerta	//
//		Sistema:				T-Kaizen				//
//		Última actualización:	26, Agosto, 2009		//
//														//
// ---------------------------------------------------- //
*/

/*********************************Funciones para cargar los elementos de la pagina*******************************************/
/*
	Pagina principal
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
|	|									|	|
|	|			Parte superior(LOGO)	|	|
|	|_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|	|
|											|
|	_ _ _ _ _ _ _	 _ _ _ _ _ _ _ _ _ _ 	|
|	|			|	| Menu de Usuario	|	|
|	|	(MENU)	|	|_ (UMENU) _ _ _ _ _|	|
|	|	Menu	|	 _ _ _ _ _ _ _ _ _ _	|
|	|	General	|	|					|	|
|	|			|	|	(VISTA)			|	|
|	|			|	|	Contenido		|	|
|	|			|	|					|	|
|	|_ _ _ _ _ _|	|					|	|
|	 _ _ _ _ _ _	|					|	|
|	|			|	|					|	|
|	|	(AVISO)	|	|					|	|
|	|_ _ _ _ _ _|	|_ _ _ _ _ _ _ _ _ _|	|
|	 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _	|
|	|									|	|
|	|			(PIE)					|	|
|	|_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|	|
|_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|
*/

//Carga toda la pagina
function carga(){
	cargaLogo();
	cargaInicio();
	cargaMenu();
}


//Carga la "Parte Superior" de la pagina
function cargaInicio(){
	var contenedor = document.createElement("div");
	
	contenedor.innerHTML = "<div class=\"infoTexto\"><div class=\"tit\">¿Qu&eacute; es T-Kaizen?</div><span class=\"sobresale\">T-Kaizen</span> es un sistema web que permite a las compañ&iacute;as el hacer una evaluaci&oacute;n interna de los 9 atributos que comprende el modelo EFQM de mejora. Permiti&eacute;ndoles no s&oacute;lo evaluarse internamente, sino tambi&eacute;n el compararse con los resultados de otras compañ&iacute;as es que &eacute;ste sistema promueve la excelencia entre sus usuarios y compañ&iacute;as.<br><br><span class=\"sobresale\">El Modelo EFQM de Excelencia</span> se introdujo como el marco fundamental para evaluar y mejorar las organizaciones de tal modo que pudieran alcanzar esta excelencia sostenida.</div>";
	
	document.getElementById("vista").innerHTML = "";
	document.getElementById("vista").appendChild(contenedor);
}

//Carga "Menu General"
function cargaMenu(){
	var contenedor1 = document.createElement("div");
	contenedor1.setAttribute("id", "menuTop");
	
	var contenedor2 = document.createElement("div");
	contenedor2.setAttribute("id", "menuCenter");
	
	contenedor2.innerHTML = "<ul class=\"lista\"><li id=\"M1\" onMouseOver='colorM(this)' onMouseOut='colorMOut(this)' onClick=\"cargaInicio()\">Inicio</li><li id=\"M2\" onMouseOver='colorM(this)' onMouseOut='colorMOut(this)'>Modelo EFQM</li><li id=\"M3\" onMouseOver='colorM(this)' onMouseOut='colorMOut(this)'>Compañias</li><li id=\"M4\" onMouseOver='colorM(this)' onMouseOut='colorMOut(this)'>Informaci&oacute;n</li><li id=\"M5\" onMouseOver='colorM(this)' onMouseOut='colorMOut(this)' onClick=\"caseLogin()\">Login</li></ul>";
	
	var contenedor3 = document.createElement("div");
	contenedor3.setAttribute("id", "menuBottom");
	
	document.getElementById("menu").innerHTML = "";
	document.getElementById("menu").appendChild(contenedor1);
	document.getElementById("menu").appendChild(contenedor2);
	document.getElementById("menu").appendChild(contenedor3);
	
}

//Carga el logo de la pagina
function cargaLogo(){
	var contenedor = document.createElement("div");
	contenedor.innerHTML = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='480' height='80' id='logo1'> <param name='allowScriptAccess' value='sameDomain' /> <param name='MOVIE' value='images/logo1.swf' /> <param name='PLAY' value='true' /> <param name='LOOP' value='false' /> <param name='quality' value='high' /><embed src='images/logo1.swf' quality='high' play='true' loop='false' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' width='480' height='80' name='logo1' allowScriptAccess='sameDomain' /> </object>";
	document.getElementById("logo").appendChild(contenedor);
}

//Escribe en el contenedor "cont" el contenido "cadena"
function escribeCont(cont, cadena){
	document.getElementById(cont).innerHTML = cadena;
}

/****************************Funciones para el Login****************************/
//Verifica si se abre o cierra sesión
function caseLogin(){
	var menu = document.getElementById("M5");
	if(menu.innerHTML == "Login")
		cargaLogin();
	else
		cierraSession();
}

//Contenido a mostrar para login
function cargaLogin(){
	var contenedor = document.createElement("div");
	contenedor.setAttribute("id", "login");
	contenedor.setAttribute("class", "forma");

	var forma = document.createElement("div");
	forma.setAttribute("id", "formaLogin");
	forma.setAttribute("name", "formaLogin");
	/*forma.setAttribute("method", "POST");
	forma.setAttribute("action", "Login/login.php");*/
	forma.innerHTML = "<table><tr><th><div class=\"subtitulo\">Bienvenido</div><br><br></th></tr><tr><td><div class=\"infoImportante\">Para ingresar debes<br>estar registrado.</div><br><br></td></tr><tr><td><span class=\"infoNormal\">Nombre de Usuario:</span></td><td><input type=\"text\" id=\"nombre\" name=\"nombre\" maxsize=\"20\" maxlength=\"20\"></td></tr><tr><td><span class=\"infoNormal\">Contraseña:</span></td><td><input type=\"password\" id=\"pass\" name=\"pass\" maxsize=\"20\" maxlength=\"20\"></td></tr><tr><td></td><td align=\"center\"><br><input type=\"submit\" name=\"enviar\" onClick=\"enviaLogin()\" value=\"Ingresar\" class=\"boton\"></td></tr></table>";

	contenedor.appendChild(forma);
	contenedor.scrollIntoView(true);

	document.getElementById("vista").innerHTML = "";
	document.getElementById("vista").appendChild(contenedor);
}

/************************************************************Colores del menu*************************************/
//Color para el menu general
function colorM(valor){
	valor.style.background = "#ffffff";
	valor.style.color = "#000000";
}

function colorMOut(valor){
	valor.style.background = "#393839";
	valor.style.color = "#ceddce";
}

//Color para links del menu de usuario
function colorMenu(valor){
	valor.style.background = "#555555";
	valor.style.color = "#ffffff";
}

function colorMenuOut(valor){
	valor.style.background = "#fffdb9";
	valor.style.color = "#000000";
}

//Color para links del submenu de usuario
function colorSubMenu(valor){
	valor.style.background = "#ffffff";
	valor.style.color = "#000000";
}

function colorSubMenuOut(valor){
	valor.style.background = "#ffff00";
	valor.style.color = "#000000";
}