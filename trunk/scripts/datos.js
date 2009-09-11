var temporizador = 0;	//Variable de setTimeout
var perfAdmin = 3;
var perfDirec = 2;
var perfEval = 1;

//Funciones para manejar los eventos de peticiones y respuestas
/************************************LOGIN DE USUARIO***********************************************************************/
/************************************LOGIN DE USUARIO***********************************************************************/
/************************************LOGIN DE USUARIO***********************************************************************/
//Función que maneja el evento "Abrir sesión de usuario"
function enviaLogin(){
	escribeCont("umenu", "");
	try{
		ajax("Login/login.php", armaURLSession(), function(dataXML, valor){
			var menu = document.getElementById("M5");
			if(valor == 0){
				escribeCont("umenu", "*ERROR:" + dataXML);
				menu.innerHTML = "Login";
				cargaLogin();
				return;
			}
			menu.innerHTML = "Logout";
			escribeCont("umenu", convDatos(getMenuXML(dataXML)));
			escribeCont("vista", convDatos(getCuerpoXML(dataXML)));
		});
	}catch(e){
		escribeCont("umenu", "*Error de comunicacion");
	}
}

//Función que maneja el evento "Cerrar sesión de usuario"
function cierraSession(){
	escribeCont("umenu", "");
	try{
		ajax("Login/logout.php", "", function(dataXML, valor){
			var menu = document.getElementById("M5");
			if(valor == 0){
				escribeCont("umenu", "*ERROR:" + dataXML);
				menu.innerHTML = "Logout";
				return;
			}
			escribeCont("umenu", "<div class=error>*Sesión Cerrada</div>");
			menu.innerHTML = "Login";
			cargaLogin();
		});
	}catch(e){
		escribeCont("umenu", "*Error de comunicacion");
	}
}

//Función para armar la petición enviada al servidor del evento "Abrir sesión de usuario";
function armaURLSession(){
	var arreglo = new Array("nombre", "pass");
	return armaURI(arreglo, arreglo);
}

/****************************************************Métodos para manejar el contenido xml de respuesta**************************/
/****************************************************Métodos para manejar el contenido xml de respuesta**************************/
/****************************************************Métodos para manejar el contenido xml de respuesta**************************/

//Función para obtener el menu enviado como respuesta dentro del XML
function getMenuXML(dataXML){
	var datos = dataXML.documentElement.getElementsByTagName("menu");
	if(datos != null && datos.length > 0){
		return noNullTagXML(datos[0]);
	}
	return "<div class=error>No se cargaron los datos</div>";
}

//Función para obtener el cuerpo enviado como respuesta dentro del XML
function getCuerpoXML(dataXML){
	var datos = dataXML.documentElement.getElementsByTagName("cuerpo");
	if(datos != null && datos.length > 0){
		return noNullTagXML(datos[0]);
	}
	return "<div class=error>No se cargaron los datos</div>";
}

//Función para quitar formato de las respuestas enviadas por el servidor
function convDatos(texto){
	var longitud = texto.length;
	var txt = "";
	for(var i = 0; i < longitud; i++){
		switch(texto.charAt(i)){
			case '+':txt += '<';
			break;
			case '_':txt += '>';
			break;
			default:txt += texto.charAt(i);
			break;
		}
	}
	return txt;
}

//Función para evitar valores null en los tags XML
function noNullTagXML(valor){
	if(valor == null || valor.firstChild == null)
		return "";
	return valor.firstChild.nodeValue;
}

//Método para armar los parametros enviados en la petición
//arreglo contine los nombres, arr contiene los id de las etiquetas
function armaURI(arreglo, arr){
	if(arreglo.length != arr.length)
		return "";
	var maxtam = arreglo.length;
	var uri = "";
	for(var i = 0; i < maxtam; i++){
		if(i > 0)
			uri += "&";
		var v = document.getElementById("" + arr[i]);
		if(v != null && v.value != null && v.value.length > 0)
			uri += "" + arreglo[i] + "=" + encodeURIComponent(v.value);
		else
			uri += "" + arreglo[i] + "=" + encodeURIComponent(" ");
	}
	return uri;
}

//Función que regresa las celdas de las tablas de consulta
function getContenidoCelda(val){
	var texto = "";
	try{
		texto = val;
		if(texto.length == 0)
			return "--";
		return texto;
	}catch(f){
		return "--";
	}
}

//Función de busqueda
function hasElement(arr, valor){
	if(arr == null)
		return false;
	for(var i = 0; i < arr.length; i++){
		if(arr[i] == valor)
			return true;
	}
	return false;
}

/**************************FUNCIONES PARA ESTABLECER LIMITES DE BUSQEUDA***************************/
//Función para obtener las ultimas filas de la consulta
function modulo(totalRows, fin){
	try{
		var m = totalRows % fin;
		return totalRows - m;
	}catch(e){
		return 0;
	}
}

//Funcion para inicializar el id inicio y enviar la consulta de busqueda
function inicializaInicio(val, idinicio){
	try{
		document.getElementById(idinicio).value = val;
	}catch(e){
		;
	}
}

//Función para incrementar o decrementar el inicio de las filas a mostrar de la lista de compañias
function increDecre(val, inicio, fin, maximo, idinicio){
	try{
		//incrementa
		inicio = inicio - 0;
		fin = fin - 0;
		if(val == 1 && (inicio + fin) < maximo)
			document.getElementById(idinicio).value = inicio + fin;
		if(val == 0 && (inicio - fin) >= 0)
			document.getElementById(idinicio).value = inicio - fin;
	}catch(e){
		;
	}
}

/***************************************************ADMINISTRADOR*****************************************************************/
/***************************************************ADMINISTRADOR*****************************************************************/
/***************************************************ADMINISTRADOR*****************************************************************/

/*Menu de Administrador*/
function deshabilitaMenu(){
    var menu = document.getElementById("menuCompania");
    if(menu != null){
		menu.innerHTML = "";
	}
    menu = document.getElementById("menuUsuario");
    if(menu != null)
        menu.innerHTML = "";
}

function subMenu(componente, valor, perfil){
	deshabilitaMenu();
    var menu = null;
    var cadena = "";
	colorMenu(componente);
    switch(valor){
        case 1:menu = document.getElementById("menuCompania");
            if(menu != null){
				var txt = "<ul>";
				if(perfil == perfAdmin)
					txt += "<li onMouseDown=\"agregarCompania('vista')\" onMouseOver=\"colorSubMenu(this)\" onMouseOut=\"colorSubMenuOut(this)\">Agregar</li>";
				txt += "<li onMouseDown=\"buscarCompania('vista')\" onMouseOver=\"colorSubMenu(this)\" onMouseOut=\"colorSubMenuOut(this)\">Buscar</li></ul>";
				menu.innerHTML = txt;
            }
        break;
        case 2:menu = document.getElementById("menuUsuario");
            if(menu != null){
				var txt = "<ul><li onMouseDown=\"agregarUsuario('vista', " + perfil + ")\">Agregar</li><li onMouseDown=\"buscarUsuario('vista', " + perfil + ")\">Buscar</li></ul>";
				menu.innerHTML = txt;
            }
        break;
        default:return;
    }
}


/***************************************************COMPAÑIAS**********************************************************************/
/***************************************************COMPAÑIAS**********************************************************************/
/***************************************************COMPAÑIAS**********************************************************************/
//Función para mostrar el contenido en el contenedor "vista" para el evento "agregar Compañia"
function agregarCompania(cont){
    var contenedor = document.createElement("div");
    contenedor.innerHTML = "<div><table class=\"tabla\" align=\"center\"><tr><th><div id='forma'>Agregar Compania</div></th><th></th><th><div id='closeC'></div></th></tr><tr><td>Nombre</td><td><input type=\"text\" id=\"nombrea\" name=\"nombrea\" maxlength=\"100\" size=\"50\"></td></tr><tr><td>Descripci&oacute;n</td><td><textarea id=\"desca\" name=\"desca\" rows=\"6\" cols=\"50\" maxlength=\"255\"></textarea></td></tr><tr><td>Giro</td><td><select id=\"giroa\" name=\"giroa\">" + getComboGiro(0) + "</select></td></tr><tr><td>Tamano</td><td><select id=\"tamanoa\" name=\"tamanoa\">" + getComboTamano() + "</select></td></tr><tr><td>Tel&eacute;fono</td><td><input type=\"text\" id=\"tela\" name=\"tela\" size=\"20\" maxlength=\"40\"></td></tr><tr><td></td><td align=center><input type=\"hidden\" id=\"ocultoa\" name=\"ocultoa\" value=\"new\"><input type='hidden' id='idC' name='idC' value=''><input type=\"submit\" id=\"enviarC\" name=\"enviarC\" value=\"Aceptar\" onClick=\"enviaCompania('" + cont + "')\"></td></tr></table></div>";

    document.getElementById(cont).innerHTML = "";
    document.getElementById(cont).appendChild(contenedor);
}

//Función para mostrar el contenido en el contenedor "vista" para el evento "buscar Compañia"
function buscarCompania(cont){
    var contenedor = document.createElement("div");
    contenedor.innerHTML = "<div><table class=\"tabla\" align=\"center\"><tr><th>Buscar Compania</th><th></th><th><div id='closeB'></div></th></tr><tr><td>Nombre Empresa</td><td><input type=\"text\" id=\"nombre\" name=\"nombre\" maxlength=\"100\" size=\"50\"></td></tr><tr><td>Giro</td><td><select id=\"giro\" name=\"giro\">" + getComboGiro() + "</select></td></tr><tr><td>Tamano</td><td><select id=\"tamano\" name=\"tamano\">" + getComboTamano() + "</select></td></tr><tr><td></td><td align=\"center\"><input type=\"hidden\" id=\"oculto\" name=\"oculto\" value=\"search\"><input type=\"hidden\" id=\"inicio\" name=\"inicio\" value=\"0\"><input type=\"hidden\" id=\"fin\" name=\"fin\" value=\"5\"><input type=\"submit\" id=\"buscarC\" name=\"buscarC\" onClick=\"buscaSigEmpresa(0, 'inicio')\" value=\"Buscar\"></td></tr></table><br></div><span id='seccionBuscar'></span><span id='seccionDatos'></span>";

    document.getElementById(cont).innerHTML = "";
    document.getElementById(cont).appendChild(contenedor);
}

//Método para enviar petición de insertar compañia y mostrar el resultado
function enviaCompania(cont){
	var arreglo = new Array("nombre", "desc", "giro", "tamano", "tel", "oculto");
	var arr = new Array("nombrea", "desca", "giroa", "tamanoa", "tela", "ocultoa");
	var uri = armaURI(arreglo, arr);
	escribeCont(cont, "");
	try{
		ajax("Compania/Compania.php", uri, function(dataXML, valor){
			if(valor == 0){
				escribeCont(cont, "*ERROR:" + dataXML);
				return;
			}
        	escribeCont(cont, convDatos(getCuerpoXML(dataXML)));
		});
	}catch(e){
		escribeCont(cont, "*Error de comunicacion");
	}
}

//Función para enviar datos de la compañia a buscar y recibir el resultado
function buscaCompania(){
    var arreglo = new Array("nombre", "giro", "tamano", "oculto", "inicio", "fin");
    var uri = armaURI(arreglo, arreglo);
	try{
	    ajax("Compania/Compania.php", uri, function(dataXML, valor){
    	    if(valor == 0){
        	    escribeCont("vista", "*ERROR:" + dataXML);
	            return;
    	    }
			document.getElementById("seccionBuscar").innerHTML = armaTablaEmpresas(dataXML);
	    });
	}catch(e){
		escribeCont("vista", "*Error de comunicacion");
	}
}

//Función para armar la tabla y visualizar lista de empresas
function armaTablaEmpresas(datos){
    try{
        var cuerpo = datos.documentElement.getElementsByTagName("cuerpo")[0];
        var tab = cuerpo.getElementsByTagName("tabla")[0];
        var numFila = noNullTagXML(cuerpo.getElementsByTagName("numFila")[0]);
        var perfil = noNullTagXML(cuerpo.getElementsByTagName("perfil")[0]);
        var inicio = Number(noNullTagXML(cuerpo.getElementsByTagName("inicio")[0]));
        var totalRows = Number(noNullTagXML(cuerpo.getElementsByTagName("totalRows")[0]));
        var filas = tab.getElementsByTagName("fila");
        var texto = "<table class='tabla' align='center'><tr><th>Empresa</th><th>Descripcion</th><th>Giro</th><th>Tamano</th><th>Telefono</th>";
        if(perfil == perfAdmin)
            texto += "<th>Actualizar</th><th>Eliminar</th>";
        texto += "</tr>";
        for(var i = 0; i < filas.length; i++){
            var cols = filas[i].getElementsByTagName("col");
            texto += "<tr>";
            for(var j = 1; j < cols.length; j++){
				texto += "<td>" + getContenidoCelda(noNullTagXML(cols[j])) + "</td>";
            }
            if(perfil == perfAdmin)
                texto += "<td><div class='actualiza' onClick='cargaCompania(" + noNullTagXML(cols[0]) + ")'>Act</div></td><td><div class='elimina' onClick='eliminaRegistroCompania(" + noNullTagXML(cols[0]) + ", \"Compania/Compania.php\", \"la Empresa " + noNullTagXML(cols[1]) + "\")'>Eli</div></td>";
            texto += "</tr>";
        }
        texto += "</table>";
		texto += "<table class='tabla' align='center'><tr>";
		var fin = Number(document.getElementById("fin").value);
		if(inicio > 0)
			texto += "<th><div style='cursor:pointer' onClick=\"buscaSigEmpresa(0, 'inicio')\">Primero</div></th><th><div style='cursor:pointer' onClick=\"buscaAntEmpresa(0, " + inicio + ", " + fin + ", " + totalRows + ", 'inicio')\">Anterior</div></th>";
		var intervalo = inicio + fin;
		if(intervalo < totalRows){
			texto += "<th><div style='cursor:pointer' onClick=\"buscaAntEmpresa(1, " + inicio + ", " + fin + ", " + totalRows + ", 'inicio')\">Siguiente</div></th>";
			if(modulo(totalRows, fin) == totalRows)
				texto += "<th><div style='cursor:pointer' onClick=\"buscaSigEmpresa(" + (modulo(totalRows, fin) - fin) + ", 'inicio')\">Ultimo</div></th>";
			else
				texto += "<th><div style='cursor:pointer' onClick=\"buscaSigEmpresa(" + modulo(totalRows, fin) + ", 'inicio')\">Ultimo</div></th>";
		}
        texto += "<tr><td colspan='4'>Registro " + (inicio + 1) + " a ";
        if(intervalo > totalRows)
            texto += "" + totalRows;
        else
            texto += "" + (inicio + fin);
        texto += " de " + totalRows + "</td></tr>"
		texto += "</tr></table>";
        return texto;
    }catch(e){
        return noNullTagXML(datos.documentElement.getElementsByTagName("cuerpo")[0]);
    }
}

//Función para obtener los siguientes registros de busqueda de empresas
function buscaSigEmpresa(val, idinicio){
	inicializaInicio(val, idinicio);
	buscaCompania();
}

//Función para obtener los anteriores registros de busqueda de empresas
function buscaAntEmpresa(val, inicio, fin, maximo, idinicio){
	increDecre(val, inicio, fin, maximo, idinicio);
	buscaCompania();
}

//Función para cargar datos de compañia
function cargaCompania(valor){
    try{
		abrirForma("seccionDatos");
		escribeCont("seccionDatos", "");
		agregarCompania("seccionDatos");
		ajax("Compania/Compania.php", "id=" + encodeURIComponent(valor) + "&oculto=search&inicio=0&fin=1", function(dataXML, valor){
			if(valor == 0){
				escribeCont("seccionDatos", "*ERROR:" + dataXML);
				return;
			}
			
			var cuerpo = dataXML.documentElement.getElementsByTagName("cuerpo")[0];
	        var tab = cuerpo.getElementsByTagName("tabla")[0];
	        var filas = tab.getElementsByTagName("fila")[0];
			var cols = filas.getElementsByTagName("col");

			document.getElementById("forma").innerHTML = "Compania <br>" + noNullTagXML(cols[1]);
			document.getElementById("nombrea").value = noNullTagXML(cols[1]);
			document.getElementById("desca").value = noNullTagXML(cols[2]);
			document.getElementById("giroa").value = noNullTagXML(cols[3]);
			document.getElementById("tamanoa").value = noNullTagXML(cols[4]);
			document.getElementById("tela").value = noNullTagXML(cols[5]);
			document.getElementById("ocultoa").value = "update";		//Cambia el valor para modificar
			document.getElementById("idC").value = noNullTagXML(cols[0]);		//Cambia el valor del id
			document.getElementById("enviarC").onclick = actCompania;
			document.getElementById("closeC").innerHTML = getCerrarForma();
		});
	}catch(e){
		escribeCont("seccionDatos", "*Error de comunicacion");
	}
}

//Función para enviar peticion de actualizar compañia
function actCompania(){
	var arreglo = new Array("id", "nombre", "desc", "giro", "tamano", "tel", "oculto");
	var arr = new Array("idC", "nombrea", "desca", "giroa", "tamanoa", "tela", "ocultoa");
	var uri = armaURI(arreglo, arr);
	escribeCont("forma", "");
	try{
		ajax("Compania/Compania.php", uri, function(dataXML, valor){
			if(valor == 0){
				escribeCont("forma", "*ERROR:" + dataXML);
				return;
			}
	        escribeCont("forma", convDatos(getCuerpoXML(dataXML)));
			try{
				buscaSigEmpresa(document.getElementById("inicio").value, 'inicio');
			}catch(f){
				buscaSigEmpresa(0, 'inicio');
			}
		});
	}catch(e){
		escribeCont("forma", "*Error de comunicacion");
	}
}

//Función para eliminar una compañia
function eliminaRegistroCompania(valor, servicio, cadena){
    if(!confirm("¿Seguro desea eliminar " + cadena + "?"))
		return;
	try{
		ajax(servicio, "id=" + encodeURIComponent(valor) + "&oculto=remove", function(dataXML, valor){
			if(valor == 0){
				alert("*ERROR:" + dataXML);
				return;
			}
	        alert(convDatos(getCuerpoXML(dataXML)));
			try{
				buscaSigEmpresa(document.getElementById("inicio").value, 'inicio');
			}catch(f){
				buscaSigEmpresa(0, 'inicio');
			}
			cerrarForma("seccionDatos");
		});
	}catch(e){
		alert("*Error de comunicacion");
	}
}


/***************************************************USUARIOS***********************************************************************/
/***************************************************USUARIOS***********************************************************************/
/***************************************************USUARIOS***********************************************************************/
//Función para agregar un usuario
function agregarUsuario(cont, perfil){
    var contenedor = document.createElement("div");
    var txt = "<div><table class=\"tabla\" align=\"center\"><tr><th><div id='forma'>Agregar Usuario</div></th><th></th><th><div id='closeUA'></div></th></tr><tr><td>Nombre de<br> Usuario</td><td><input type=\"text\" id=\"nusera\" name=\"nusera\" maxlength=\"20\" size=\"20\"></td></tr><tr><td>Contrasena</td><td><input type=\"password\" id=\"passa\" name=\"passa\" maxlength=\"20\" size=\"20\"></td></tr><tr><td>Re-Contrasena</td><td><input type=\"password\" id=\"repassa\" name=\"repassa\"></td></tr><tr><td>Nombre(s)</td><td><input type=\"text\" id=\"unombrea\" name=\"unombrea\" size=\"20\" maxlength=\"40\"></td></tr><tr><td>Apellidos</td><td><input type=\"text\" id=\"uapellidosa\" name=\"uapellidosa\" size=\"40\" maxlength=\"100\"></td></tr>";
	if(perfil == perfAdmin)
		txt += "<tr><td>Empresa</td><td><div id='getuempa'></div><div onClick=\"otraEmp()\">Otra</div></td></tr>";
	txt += "<tr><td>Perfil</td><td><select id=\"uperfila\" name=\"uperfila\">" + getComboPerfil(perfil) + "</select></td></tr><tr><td>&Aacute;rea</td><td><input type=\"text\" id=\"uareaa\" name=\"uareaa\" size=\"20\" maxlength=\"30\"></td></tr><tr><td>E-mail</td><td><input type=\"text\" id=\"uemaila\" name=\"uemaila\" size=\"20\" maxlength=\"40\"></td></tr><tr><td>Tel&eacute;fono</td><td><input type=\"text\" id=\"utela\" name=\"utela\" size=\"20\" maxlength=\"20\"></td></tr><tr><td>Criterios</td><td><div id='getucrta' align='left'></div></td></tr><tr><td></td><td align=center><input type='hidden' id='idU' name='idU' value=''><input type=\"hidden\" id=\"uocultoa\" name=\"uocultoa\" value=\"new\"><input type=\"submit\" id=\"enviarU\" name=\"enviarU\" onClick=\"enviaUsuario('vista')\" value=\"Aceptar\"></td></tr></table></div><span id='seccionBuscar'></span><span id='seccionDatos'></span>";
	
	contenedor.innerHTML = txt;

    document.getElementById(cont).innerHTML = "";
    document.getElementById(cont).appendChild(contenedor);
	getCheck("getucrta", "Criterio/Criterio.php", "oculto=search", "ucrta", false);
    if(perfil == perfAdmin)
    	getCombo("getuempa", "Compania/Compania.php", "oculto=search&inicio=0&fin=999999", "uempa");
}

//Función para mostrar la forma de agregar nueva empresa
function otraEmp(){
	try{
		agregarCompania("seccionDatos");
		document.getElementById("closeC").innerHTML = getCerrarForma();
		document.getElementById("enviarC").onclick = agregaC;
	}catch(e){
		;
	}
}

//Función para agregar nueva compania y refrescar el combo de empresas
function agregaC(){
	enviaCompania("seccionDatos");
	temporizador = setTimeout("getCombo(\"getuempa\", \"Compania/Compania.php\", \"oculto=search&inicio=0&fin=999999\", \"uempa\")", 1000);
}

//Método para enviar petición de insertar usuario y mostrar el resultado
function enviaUsuario(cont){
	var arreglo = new Array("nuser", "pass", "repass", "nombre", "apellidos", "empresa", "perfil", "area", "email", "tel", "oculto");
	var arr = new Array("nusera", "passa", "repassa", "unombrea", "uapellidosa", "uempa", "uperfila", "uareaa", "uemaila", "utela", "uocultoa");
	var uri = armaURI(arreglo, arr) + "&" + getValues("crt", "input", "ucrta");
	escribeCont(cont, "");
	try{
		ajax("Usuario/Usuario.php", uri, function(dataXML, valor){
			if(valor == 0){
				escribeCont(cont, "*ERROR:" + dataXML);
				return;
			}
        	escribeCont(cont, convDatos(getCuerpoXML(dataXML)));
		});
	}catch(e){
		escribeCont(cont, "*Error de comunicacion");
	}
}

//Función para armar uri de un parametro con varios valores (tipo checkbox)
function getValues(idcad, nombre, valor){
	try{
		var cad = document.getElementsByTagName(nombre);
		var txt = "";
		var j = 1;
		for(var i = 0; i < cad.length; i++){
			if(cad[i].getAttribute("name") == valor){
				if(cad[i].getAttribute("checked")){
					if(j > 1)
						txt += "&";
					txt += idcad + "" + j + "=" + cad[i].getAttribute("value");
					j++;
				}
			}
		}
		return txt;
	}catch(e){
		return "1=1";
	}
}

//Función para mostrar la forma de "buscar usuarios"
function buscarUsuario(cont, perfil){
    var contenedor = document.createElement("div");
    var txt = "<div><table class=\"tabla\" align=\"center\"><tr><th>Buscar Usuario</th><th></th><th><div id='closeUB'></div></th></tr><tr><td>Nombre de<br> Usuario</td><td><input type=\"text\" id=\"nuser\" name=\"nuser\" maxlength=\"20\" size=\"20\"></td></tr><tr><td>Nombre(s)</td><td><input type=\"text\" id=\"unombre\" name=\"unombre\" size=\"20\" maxlength=\"40\"></td></tr><tr><td>Apellidos</td><td><input type=\"text\" id=\"uapellidos\" name=\"uapellidos\" size=\"40\" maxlength=\"100\"></td></tr>";
	if(perfil == perfAdmin)
		txt += "<tr><td>Empresa</td><td><div id='getuemp'></div></td></tr>";
	txt += "<tr><td>Perfil</td><td><select id=\"uperfil\" name=\"uperfil\">" + getComboPerfil(perfil) + "</select></td></tr><tr><td>&Aacute;rea</td><td><input type=\"text\" id=\"uarea\" name=\"uarea\" size=\"20\" maxlength=\"30\"></td></tr><tr><td>Criterios</td><td><div id='getucrt' align='left'></div></td></tr><tr><td>Ordenar por</td><td><div align='left'>" + getCheckOrdenarUsuario() + "</div></td></tr><tr><td></td><td align=center><input type=\"hidden\" id=\"uoculto\" name=\"uoculto\" value=\"search\"><input type=\"hidden\" id=\"uinicio\" name=\"uinicio\" value=\"0\"><input type=\"hidden\" id=\"ufin\" name=\"ufin\" value=\"5\"><input type=\"submit\" id=\"buscarU\" name=\"buscarU\" value=\"Aceptar\" onClick=\"buscaSigUsuario(0, 'uinicio')\"></td></tr></table></div><span id='seccionBuscar'></span><span id='seccionDatos'></span>";

	contenedor.innerHTML = txt;
	
    document.getElementById(cont).innerHTML = "";
    document.getElementById(cont).appendChild(contenedor);
	getCheck("getucrt", "Criterio/Criterio.php", "oculto=search", "ucrt", true);
    if(perfil == perfAdmin)
    	getCombo("getuemp", "Compania/Compania.php", "oculto=search&inicio=0&fin=999999", "uemp");
}

//Función para enviar datos del usuario a buscar y recibir el resultado
function buscaUsuario(){
	var arreglo = new Array("nuser", "nombre", "apellidos", "empresa", "perfil", "area", "oculto", "inicio", "fin");
	var arr = new Array("nuser", "unombre", "uapellidos", "uemp", "uperfil", "uarea", "uoculto", "uinicio", "ufin");
    var uri = armaURI(arreglo, arr) + "&" + getValues("crt", "input", "ucrt") + "&" + getValues("ordenarU", "input", "ordenarU");
	try{
	    ajax("Usuario/Usuario.php", uri, function(dataXML, valor){
    	    if(valor == 0){
        	    escribeCont("vista", "*ERROR:" + dataXML);
            	return;
	        }
			document.getElementById("seccionBuscar").innerHTML = armaTablaUsuarios(dataXML);
    	});
	}catch(e){
		escribeCont("vista", "*Error de comunicacion");
	}
}

//Función para armar la tabla y visualizar lista de usuarios
function armaTablaUsuarios(datos){
    try{
        var cuerpo = datos.documentElement.getElementsByTagName("cuerpo")[0];
        var tab = cuerpo.getElementsByTagName("tabla")[0];
        var numFila = noNullTagXML(cuerpo.getElementsByTagName("numFila")[0]);
        var perfil = noNullTagXML(cuerpo.getElementsByTagName("perfil")[0]);
        var inicio = Number(noNullTagXML(cuerpo.getElementsByTagName("inicio")[0]));
        var totalRows = Number(noNullTagXML(cuerpo.getElementsByTagName("totalRows")[0]));
        var filas = tab.getElementsByTagName("fila");
        var texto = "<table class='tabla' align='center'><tr><th>Nombre de Usuario</th><th>Nombre</th><th>Perfil</th><th>Area</th><th>Empresa</th><th>E-mail</th><th>Telefono</th><th>Criterios</th>";
        if(perfil == perfAdmin || perfil == perfDirec)
            texto += "<th>Actualizar</th><th>Eliminar</th>";
        texto += "</tr><tr><td><div><ul>";
		var idU = -1;
		var nom = "";
        for(var i = 0; i < filas.length; i++){
            var cols = filas[i].getElementsByTagName("col");
			if(!isNaN(noNullTagXML(cols[0])) && idU!= noNullTagXML(cols[0])){
				texto += "</ul></div></td>";
				if(i > 0){
					if(perfil == perfAdmin || perfil == perfDirec)
		                texto += "<td><div class='actualiza' onClick='cargaUsuario(" + idU + ", " + perfil + ")'>Act</div></td><td><div class='elimina' onClick='eliminaRegistroUsuario(" + idU + ", \"Usuario/Usuario.php\", \"el Usuario " + nom + "\")'>Eli</div></td>";
				}
				idU = noNullTagXML(cols[0]);
				nom = noNullTagXML(cols[1]);

				texto += "</tr><tr>";
    	        texto += "<td>" + getContenidoCelda(noNullTagXML(cols[1])) + "</td>";
				texto += "<td>" + getContenidoCelda(noNullTagXML(cols[3])) + " " + getContenidoCelda(noNullTagXML(cols[2])) + "</td>";
				texto += "<td>" + getContenidoCelda(noNullTagXML(cols[4])) + "</td>";
				texto += "<td>" + getContenidoCelda(noNullTagXML(cols[5])) + "</td>";
				texto += "<td>" + getContenidoCelda(noNullTagXML(cols[9])) + "</td>";
				texto += "<td>" + getContenidoCelda(noNullTagXML(cols[6])) + "</td>";
				texto += "<td>" + getContenidoCelda(noNullTagXML(cols[7])) + "</td>";
				texto += "<td><div align='left'><ul><li>" + getContenidoCelda(noNullTagXML(cols[11])) + "</li>";
			}
			else
				texto += "<li>" + getContenidoCelda(noNullTagXML(cols[11])) + "</li>";
        }
        texto += "</ul></div></td>";
		if(i > 0){
			if(perfil == perfAdmin || perfil == perfDirec)
				texto += "<td><div class='actualiza' onClick='cargaUsuario(" + idU + ", " + perfil + ")'>Act</div></td><td><div class='elimina' onClick='eliminaRegistroUsuario(" + idU + ", \"Usuario/Usuario.php\", \"el Usuario " + nom + "\")'>Eli</div></td>";
		}
		texto += "</tr></table>";
		texto += "<table class='tabla' align='center'><tr>";
		var fin = Number(document.getElementById("ufin").value);
		if(inicio > 0)
			texto += "<th><div style='cursor:pointer' onClick=\"buscaSigUsuario(0, 'uinicio')\">Primero</div></th><th><div style='cursor:pointer' onClick=\"buscaAntUsuario(0, " + inicio + ", " + fin + ", " + totalRows + ", 'uinicio')\">Anterior</div></th>";
		var intervalo = inicio + fin;
		if(intervalo < totalRows){
			texto += "<th><div style='cursor:pointer' onClick=\"buscaAntUsuario(1, " + inicio + ", " + fin + ", " + totalRows + ", 'uinicio')\">Siguiente</div></th>";
			if(modulo(totalRows, fin) == totalRows)
				texto += "<th><div style='cursor:pointer' onClick=\"buscaSigUsuario(" + (modulo(totalRows, fin) - fin) + ", 'uinicio')\">Ultimo</div></th>";
			else
				texto += "<th><div style='cursor:pointer' onClick=\"buscaSigUsuario(" + modulo(totalRows, fin) + ", 'uinicio')\">Ultimo</div></th>";
		}
        texto += "<tr><td colspan='4'>Registro " + (inicio + 1) + " a ";
        if(intervalo > totalRows)
            texto += "" + totalRows;
        else
            texto += "" + (inicio + fin);
        texto += " de " + totalRows + "</td></tr>";
		texto += "</tr></table>";
        return texto;
    }catch(e){
        return noNullTagXML(datos.documentElement.getElementsByTagName("cuerpo")[0]);
    }
}

//Función para obtener los siguientes registros de busqueda de usuarios
function buscaSigUsuario(val, idinicio){
	inicializaInicio(val, idinicio);
	buscaUsuario();
}

//Función para obtener los anteriores registros de busqueda de usuarios
function buscaAntUsuario(val, inicio, fin, maximo, idinicio){
	increDecre(val, inicio, fin, maximo, idinicio);
	buscaUsuario();
}

//Función para cargar datos de compañia
function cargaUsuario(valor, perfil){
    try{
		abrirForma("seccionDatos");
		escribeCont("seccionDatos", "");
		agregarUsuario("seccionDatos", perfil);
        setTimeout("loadUsuario(" + valor + ")", 1000);
    }catch(e){
        ;
    }
}

function loadUsuario(valor){
    try{
		ajax("Usuario/Usuario.php", "id=" + encodeURIComponent(valor) + "&oculto=search&inicio=0&fin=1", function(dataXML, valor){
			if(valor == 0){
				escribeCont("seccionDatos", "*ERROR:" + dataXML);
				return;
			}

			var cuerpo = dataXML.documentElement.getElementsByTagName("cuerpo")[0];
	        var tab = cuerpo.getElementsByTagName("tabla")[0];
	        var filas = tab.getElementsByTagName("fila");
			var cols = filas[0].getElementsByTagName("col");
			document.getElementById("forma").innerHTML = "Usuario <br>" + noNullTagXML(cols[2]) + " " + noNullTagXML(cols[3]);
			document.getElementById("nusera").value = noNullTagXML(cols[1]);
			document.getElementById("unombrea").value = noNullTagXML(cols[2]);
			document.getElementById("uapellidosa").value = noNullTagXML(cols[3]);
            if(document.getElementById("uempa") != null)
    			document.getElementById("uempa").value = noNullTagXML(cols[8]);
			document.getElementById("uperfila").value = noNullTagXML(cols[4]);
			document.getElementById("uareaa").value = noNullTagXML(cols[5]);
			document.getElementById("uemaila").value = noNullTagXML(cols[6]);
			document.getElementById("utela").value = noNullTagXML(cols[7]);
			document.getElementById("uocultoa").value = "update";		//Cambia el valor para modifica
			document.getElementById("idU").value = noNullTagXML(cols[0]);		//Cambia el valor del id
			document.getElementById("enviarU").onclick = actUsuario;
			document.getElementById("closeUA").innerHTML = getCerrarForma();
			var arr = new Array();

			for(var i = 0; i < filas.length; i++){
				var col = filas[i].getElementsByTagName("col");
				arr[i] = noNullTagXML(col[10]);
			}
			var criterios = document.getElementsByTagName("input");
			for(var i = 0; i < criterios.length; i++){
				if(criterios[i].getAttribute("name") == "ucrta" && hasElement(arr, criterios[i].getAttribute("value")))
					criterios[i].setAttribute("checked", "true");
			}
		});
	}catch(e){
		escribeCont("seccionDatos", "*Error de comunicacion");
	}
}

//Función para cargar datos de un usuario
function actUsuario(){
	var arreglo = new Array("id", "nuser", "pass", "repass", "nombre", "apellidos", "empresa", "perfil", "area", "email", "tel", "oculto");
	var arr = new Array("idU", "nusera", "passa", "repassa", "unombrea", "uapellidosa", "uempa", "uperfila", "uareaa", "uemaila", "utela", "uocultoa");
	var uri = armaURI(arreglo, arr) + "&" + getValues("crt", "input", "ucrta");
	escribeCont("forma", "");
	try{
		ajax("Usuario/Usuario.php", uri, function(dataXML, valor){
			if(valor == 0){
				escribeCont("forma", "*ERROR:" + dataXML);
				return;
			}
        	escribeCont("forma", convDatos(getCuerpoXML(dataXML)));
			try{
				buscaSigUsuario(document.getElementById("uinicio").value, 'uinicio');
			}catch(f){
				buscaSigUsuario(0, 'uinicio');
			}
		});
	}catch(e){
		escribeCont(cont, "*Error de comunicacion");
	}
}

//Función para eliminar un usuario
function eliminaRegistroUsuario(valor, servicio, cadena){
    if(!confirm("¿Seguro desea eliminar " + cadena + "?"))
		return;
	try{
		ajax(servicio, "id=" + encodeURIComponent(valor) + "&oculto=remove", function(dataXML, valor){
			if(valor == 0){
				alert("*ERROR:" + dataXML);
				return;
			}
	        alert(convDatos(getCuerpoXML(dataXML)));
			try{
				buscaSigUsuario(document.getElementById("inicio").value, 'inicio');
			}catch(f){
				buscaSigUsuario(0, 'inicio');
			}
			cerrarForma("seccionDatos");
		});
	}catch(e){
		alert("*Error de comunicacion");
	}
}


/***************************************************EVALUAR***********************************************************************/
/***************************************************EVALUAR***********************************************************************/
/***************************************************EVALUAR***********************************************************************/
/***************************EVALUACION*****************************************/

//Metodo para mostrar evaluacion de usuarios
function evaluar(){
    try{
        document.getElementById("vista").innerHTML = "<div id='seccionMostrar'></div><div id='seccionBuscar'></div><div id='seccionDatos'></div>";
        ajax("Evaluar/Evaluar.php", "oculto=show", function(dataXML, valor){
            if(valor == 0){
                escribeCont("vista", "*ERROR:" + dataXML);
                return;
            }
		    document.getElementById("seccionMostrar").innerHTML = armaModeloEvaluar(dataXML);
        });
    }catch(e){
        document.getElementById("vista").innerHTML = "Error al mostrar los datos";
    }
}

//Funcón para armar el modelo a mostrar en la evaluación
function armaModeloEvaluar(datos){
    try{
        var txt = "";
        var cuerpo = datos.getElementsByTagName("cuerpo")[0];
        var tab = cuerpo.getElementsByTagName("tabla")[0];
        var filas = tab.getElementsByTagName("fila");
        txt = "<table class='tabla' align='center'>";
        txt += "<tr><th colspan='3'>---------Agentes Facilitadores--------></th><th colspan='2'>---------Resultados--------></th></tr>";
        var criterio = new Array();
		//9 criterios
        criterio[1] = "<img src='images/cc1.jpg'>";
        criterio[2] = "<img src='images/cc2.jpg'>";
        criterio[3] = "<img src='images/cc3.jpg'>";
        criterio[4] = "<img src='images/cc4.jpg'>";
        criterio[5] = "<img src='images/cc5.jpg'>";
        criterio[6] = "<img src='images/cc6.jpg'>";
        criterio[7] = "<img src='images/cc7.jpg'>";
        criterio[8] = "<img src='images/cc8.jpg'>";
        criterio[9] = "<img src='images/cc9.jpg'>";
        for(var i = 0; i < filas.length; i++){
            var cols = filas[i].getElementsByTagName("col");
            switch(noNullTagXML(cols[1])){
                case "LIDERAZGO":criterio[1] = "<img style='cursor:pointer' onClick='preguntasUsuario(" + noNullTagXML(cols[0]) + ")' src='images/c1.jpg'>";
                break;
                case "POLITICA Y ESTRATEGIAS":criterio[2] = "<img style='cursor:pointer' onClick='preguntasUsuario(" + noNullTagXML(cols[0]) + ")' src='images/c2.jpg'>";
                break;
                case "PERSONAS":criterio[3] = "<img style='cursor:pointer' onClick='preguntasUsuario(" + noNullTagXML(cols[0]) + ")' src='images/c3.jpg'>";
                break;
                case "ALIANZAS Y RECURSOS":criterio[4] = "<img style='cursor:pointer' onClick='preguntasUsuario(" + noNullTagXML(cols[0]) + ")' src='images/c4.jpg'>";
                break;
                case "PROCESOS":criterio[5] = "<img style='cursor:pointer' onClick='preguntasUsuario(" + noNullTagXML(cols[0]) + ")' src='images/c5.jpg'>";
                break;
                case "RESULTADOS EN CLIENTES":criterio[6] = "<img style='cursor:pointer' onClick='preguntasUsuario(" + noNullTagXML(cols[0]) + ")' src='images/c6.jpg'>";
                break;
                case "RESULTADOS EN PERSONAS":criterio[7] = "<img style='cursor:pointer' onClick='preguntasUsuario(" + noNullTagXML(cols[0]) + ")' src='images/c7.jpg'>";
                break;
                case "RESULTADOS EN SOCIEDAD":criterio[8] = "<img style='cursor:pointer' onClick='preguntasUsuario(" + noNullTagXML(cols[0]) + ")' src='images/c8.jpg'>";
                break;
                case "RESULTADOS CLAVE":criterio[9] = "<img style='cursor:pointer' onClick='preguntasUsuario(" + noNullTagXML(cols[0]) + ")' src='images/c9.jpg'>";
                break;
                default:
                break;
            }
        }
        txt += "<tr><td rowspan='3'>" + criterio[1] + "</td><td>" + criterio[3] + "</td><td rowspan='3'>" + criterio[5] + "</td><td>" + criterio[7] + "</td><td rowspan='3'>" + criterio[9] + "</td></tr>";
        txt += "<tr><td>" + criterio[2] + "</td><td>" + criterio[6] + "</td></tr>";
        txt += "<tr><td>" + criterio[4] + "</td><td>" + criterio[8] + "</td></tr>";
        txt += "<tr><th colspan='5'><----------------------Inovacion y Aprendizaje-----------------------</th></tr>";
        txt += "</table>";
        return txt;
    }catch(e){
        return "No hay datos";
    }
}

//Mètodo para mostrar las prguntas de un criterio
function preguntasUsuario(val){
    try{
		if(val < 0)
			return;
        ajax("Evaluar/Evaluar.php", "oculto=showpregunta&id=" + encodeURIComponent(val), function(dataXML, valor){
            if(valor == 0){
                escribeCont("vista", "*ERROR:" + dataXML);
                return;
            }
		    document.getElementById("seccionDatos").innerHTML = armaPreguntaEvaluar(dataXML);
        });
    }catch(e){
        document.getElementById("vista").innerHTML = "Error al mostrar los datos";
    }
}

//Funcón para armar el modelo a mostrar en la evaluación
function armaPreguntaEvaluar(datos){
    try{
        var txt = "";
        var cuerpo = datos.getElementsByTagName("cuerpo")[0];
        var tab = cuerpo.getElementsByTagName("tabla")[0];
        var filas = tab.getElementsByTagName("fila");
        txt = "<table class='tabla' align='center'>";
		var noEv = "<tr><th>Preguntas NO Evaluadas</th></tr><tr><td></td><td><div align='left'><ul>";
		var siEv = "<tr><th>Preguntas Evaluadas</th></tr><tr><td></td><td><div align='left'><ul>";
		var sE = 0;
		var nE = 0;
        for(var i = 0; i < filas.length; i++){
            var cols = filas[i].getElementsByTagName("col");
            if(noNullTagXML(cols[0]).length == 0){//Pregunta no evaluada
				noEv += "<li style='cursor:pointer' onClick=\"muestraPregunta(" + noNullTagXML(cols[8]) + ",'" + noNullTagXML(cols[6]) + "')\">" + noNullTagXML(cols[6]) + ":" + noNullTagXML(cols[7]) + "</li>";
				nE ++;
			}
			else{//Pregunta evaluada
				siEv += "<li>" + noNullTagXML(cols[6]) + ":" + noNullTagXML(cols[7]) + "</li>";
				sE ++;
			}
        }
		noEv += "</ul></div></td></tr>";
		siEv += "</ul></div></td></tr>";
		if(nE > 0)
			txt += noEv;
		if(sE > 0)
			txt += siEv;
		txt += "<tr><td colspan='2'>-----------------------------------------------</td></tr>";
        txt += "</table>";
        return txt;
    }catch(e){
        return "" + noNullTagXML(datos.getElementsByTagName("cuerpo")[0]);
    }
}

//Funcion de mostrar informacion de preguntas se encuentra en scripts/informacion.js































function agregarCriterio(){
    var contenedor = document.createElement("div");
    contenedor.innerHTML = "<div><table class=\"tabla\" align=\"center\"><tr><th>Agregar Criterio</th><th></th><th>" + getCerrarForma() + "</th></tr><tr><td>Nombre de<br> Criterio</td><td><input type=\"text\" name=\"nombre\" maxlength=\"100\" size=\"30\"></td></tr><tr><td>Descripci&oacute;n</td><td><textarea name=\"desc\" maxlength=\"255\" rows=\"5\" cols=\"60\"></textarea></td></tr><tr><td></td><td align=center><input type=\"submit\" name=\"enviar\" value=\"Aceptar\"></td></tr></table></div>";

    document.getElementById("vista").innerHTML = "";
    document.getElementById("vista").appendChild(contenedor);
}

function buscarCriterio(){
    var contenedor = document.createElement("div");
    contenedor.innerHTML = "<div><table class=\"tabla\" align=\"center\"><tr><th>Buscar Criterio</th><th></th><th>" + getCerrarForma() + "</th></tr><tr><td>Nombre de<br> Criterio</td><td><input type=\"text\" name=\"nombre\" maxlength=\"100\" size=\"30\"></td></tr><tr><td></td><td align=center><input type=\"submit\" name=\"enviar\" value=\"Aceptar\"></td></tr></table></div>";

    document.getElementById("vista").innerHTML = "";
    document.getElementById("vista").appendChild(contenedor);
}


/****************************Funciones de codigo html**************************************/
function getComboGiro(valor){
    var cadena = "";
    cadena += "<option value='-'>--</option>";
    cadena += "<option value=0>Agencias de Viaje</option>";
    cadena += "<option value=1>Agricultura</option>";
    cadena += "<option value=2>Alimentos y Bebidas</option>";
    cadena += "<option value=3>Comercio</option>";
    cadena += "<option value=4>Construcción e Inmobiliaria</option>";
    cadena += "<option value=5>Cultura</option>";
    cadena += "<option value=6>Deportes</option>";
    cadena += "<option value=7>Electrónica</option>";
    cadena += "<option value=8>Hostelería, Restauración y Cátering</option>";
    cadena += "<option value=9>Industria</option>";
    cadena += "<option value=10>Informática</option>";
    cadena += "<option value=11>Medios de Comunicación</option>";
    cadena += "<option value=12>Metalurgía y Minería</option>";
    cadena += "<option value=13>Mobliario y Material de Oficina</option>";
    cadena += "<option value=14>Ocio</option>";
    cadena += "<option value=15>Otros</option>";
    cadena += "<option value=16>Publicidad y Artes gráficas</option>";
    cadena += "<option value=17>Química</option>";
    cadena += "<option value=18>Salud y Belleza</option>";
    cadena += "<option value=19>Servicios para Empresas</option>";
    cadena += "<option value=20>Textil y Calzado</option>";
    cadena += "<option value=21>Transportes</option>";
    return cadena;
}

function getComboTamano(){
    var cadena = "";
    cadena += "<option value='-'>--</option>";
    cadena += "<option value=0>Micro Empresa</option>";
    cadena += "<option value=1>Pequeña Empresa</option>";
    cadena += "<option value=2>Mediana Empresa</option>";
    cadena += "<option value=3>Grande Empresa</option>";
    cadena += "<option value=4>Multinacional</option>";
    return cadena;
}

//Función para agregar el boton de cerrar Forma
function getCerrarForma(){
    return "<div class=\"cerrarForma\" onClick=\"cerrarForma('seccionDatos')\">[x]</div>";
}

//Función para agregar la forma "seccionDatos"
function abrirForma(forma){
	//document.getElementById(forma).setAttribute("class", "seccionDatoss");
	//document.getElementById("seccionBuscar").style = "background-color:red";	
	/*document.getElementById("seccionBuscar").setAttribute("style", "visibility:hidden");
	document.getElementById(forma).setAttribute("style", "visibility:visible");
	document.getElementById("seccionBuscar").setAttribute("class", "oculto");
	document.getElementById(forma).setAttribute("class", "visto");*/
}

//Función para quitar el div "seccionDatos"
function cerrarForma(forma){
	document.getElementById(forma).innerHTML = "";
}

function getComboPerfil(perfil){
    var cadena = "";
    cadena += "<option value='-'>--</option>";
    if(perfil == perfAdmin)
        cadena += "<option value='" + perfAdmin + "'>Administrador</option>";
    if(perfil == perfAdmin || perfil == perfDirec)
        cadena += "<option value='" + perfDirec + "'>Director</option>";
    cadena += "<option value='" + perfEval + "'>Evaluador</option>";
    return cadena;
}

//Función para mostrar contenido en un checkbox
function getCheck(componente, servicio, uri, id, check){
	try{
		ajax(servicio, uri, function(dataXML, valor){
			if(valor == 0){
				document.getElementById(componente).innerHTML = "*ERROR:" + dataXML;
				return;
			}
			var c = "";
			if(check)
				c = "checked";
			var cad = "";
			var datos = dataXML.documentElement.getElementsByTagName("cuerpo")[0];
			var tab = datos.getElementsByTagName("tabla")[0];
			var filas = tab.getElementsByTagName("fila");
            document.getElementById(componente).innerHTML = "";
			for(var i = 0; i < filas.length; i++){
				var cols = filas[i].getElementsByTagName("col");
                /*var inp = document.createElement("input");
                inp.setAttribute("type", "checkbox");
                inp.setAttribute("name", "" + id);
                inp.setAttribute("id", "" + id);
                inp.setAttribute("value", "" + noNullTagXML(cols[0]));
                inp.setAttribute("checked", check);
                inp.innerHTML = "" + noNullTagXML(cols[1]);
                document.getElementById(componente).appendChild(inp);*/
				cad += "<input type='checkbox' name='" + id + "' value='" + noNullTagXML(cols[0]) + "' " + c + ">" + noNullTagXML(cols[1]) + "<br>";
			}
			document.getElementById(componente).innerHTML = cad;
		});
	}catch(e){
		document.getElementById(componente).innerHTML = "No hay datos";
	}
}
// 1. Liderazgo  6. Resultados en Clientes 
// 2. Política y Estrategias  7. Resultados en Personas
// 3. Personas  8. Resultados en Sociedad 
// 4. Alianzas y Recursos  9. Resultados Clave 
// 5. Procesos 

//Función para mostrar contenido en un combo
function getCombo(componente, servicio, uri, id){
	try{
		ajax(servicio, uri, function(dataXML, valor){
			if(valor == 0){
				document.getElementById(componente).innerHTML = "*ERROR:" + dataXML;
				return;
			}
			var cad = "";
			var datos = dataXML.documentElement.getElementsByTagName("cuerpo")[0];
			var tab = datos.getElementsByTagName("tabla")[0];
			var filas = tab.getElementsByTagName("fila");
            /*var select = document.getElementById("" + id);
            select.innerHTML = ""; */
			cad = "<select id='" + id + "' name='" + id + "'><option value='-'>--</option>";
            /*var opt = document.createElement("option");
            opt.setAttribute("value", "-");
            opt.innerHTML = "--";*/
            /*if(val < 0)
                opt.setAttribute("selected", "true");*/
            /*select.appendChild(opt);*/
			for(var i = 0; i < filas.length; i++){
				var cols = filas[i].getElementsByTagName("col");
                /*var opt = document.createElement("option");
                opt.setAttribute("value", "" + noNullTagXML(cols[0]));
                opt.innerHTML = noNullTagXML(cols[1]);*/
                /*if(noNullTagXML(cols[0]) == val){
                    opt.setAttribute("selected", "true");
                    select.value =noNullTagXML(cols[0]);
                } */
                /*select.appendChild(opt);*/
				cad += "<option value='" + noNullTagXML(cols[0]) + "'>" + noNullTagXML(cols[1]) + "</option>";
			}
            cad += "</select>";
            /*select.innerHTML = cad;  */
			document.getElementById(componente).innerHTML = "" + cad;
			/*document.getElementById(componente).appendChild(select);*/
		});
	}catch(e){
		document.getElementById(componente).innerHTML = "No hay datos";
	}
}

//Función para mostrar el checkbox de ordenar por
function getCheckOrdenarUsuario(){
	var cad = "";
	cad += "<input type='checkbox' name='ordenarU' value='nombre_usuario'>Nombre de Usuario<br>";
	cad += "<input type='checkbox' name='ordenarU' value='unombre'>Nombre<br>";
	cad += "<input type='checkbox' checked name='ordenarU' value='apellidos'>Apellidos<br>";
	cad += "<input type='checkbox' name='ordenarU' value='enombre'>Empresa<br>";
	cad += "<input type='checkbox' name='ordenarU' value='perfil'>Perfil<br>";
	cad += "<input type='checkbox' name='ordenarU' value='area'>Area<br>";
	return cad;
	
}