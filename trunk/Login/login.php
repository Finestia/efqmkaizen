<?php
// ---------------------------------------------------- //
//														//
//		LOGIN2.PHP										//
//														//
//		Version previa:			1.0						//
//		Autor:					Jose Luis M Gomex		//
//														//
//		Versión:				1.1						//
//		Autor:					Ricardo Galicia Huerta	//
//		Sistema:				T-Kaizen				//
//		Última actualización:	24, Marzo, 2009			//
//														//
// ---------------------------------------------------- //

//Perfil
//0 - Evaluador
//1 - Administrador de Area
//2 - Director
//3 - Administrador

	//Inicia la sesión
	session_start();

	//Archivo de consultas
	include("../ModulosPHP/consultas.php");

	//Arreglo para guardar los errores de validación
	$errmsg_arr = array();

	//Bandera de error de validación
	$errflag = false;

	//Verifica los valores recibidos
	if(!isset($_POST['nombre']) || !isset($_POST['pass'])){
		errorUsuario("<div class=error>Debe proporcionar el nombre de usuario y contrasena</div>");
	}

	//Limpia los valores POST
	$login = clean(NULL, $_POST['nombre']);
	$password = clean(NULL, $_POST['pass']);

	//Validación del input
	if($login == '') {
		$errmsg_arr[] = '<div class=error>Falta su nombre de usuario</div>';
		$errflag = true;
	}
	if($password == '') {
		$errmsg_arr[] = '<div class=error>Falta la contraseña</div>';
		$errflag = true;
	}

	//Si hay problemas de validación, muestra un mensaje de error
	if($errflag) {
		$_SESSION['ERRMSG_ARR'] = $errmsg_arr;
		session_write_close();
		session_destroy();
		errorUsuario("<div class=error>Error de validacion de usuario o contrasena</div>");
	}

	/*******Datos de sesión del usuario********/
	//Verificar si la consulta fue exitosa
	if(($member = getIDUsuario(NULL, $login, $password)) < 0){
		session_destroy();
		errorBD("<div class=error>Fallo la consulta</div>");
	}

	/*******Datos del usuario********/
	//Verifica si la consulta fue exitosa
	if(!($datos = getDatosUser(NULL, $member))){
		session_destroy();
		errorUsuario("<div class=error>Fallo la consulta</div>");
	}

	//Inicio de sesión exitoso
	session_regenerate_id();

	//Asigna las variables de sesión
	$_SESSION['SESS_USER_ID'] = $datos['id_usuario'];
	$_SESSION['SESS_USER_NAME'] = $datos['nombre_usuario'];
	$_SESSION['SESS_USER_DATOS_NAME'] = $datos['nombre'];
	$_SESSION['SESS_USER_DATOS_LAST'] = $datos['apellidos'];
	$_SESSION['SESS_USER_DATOS_PERFIL'] = $datos['perfil'];
	$_SESSION['SESS_USER_DATOS_AREA'] = $datos['area'];
	$_SESSION['SESS_USER_DATOS_EMAIL'] = $datos['e_mail'];
	$_SESSION['SESS_USER_DATOS_TEL'] = $datos['telefono'];
	$_SESSION['SESS_USER_DATOS_IDEMPRESA'] = $datos['id_empresa'];
	$_SESSION['SESS_USER_DATOS_EMPRESA'] = $datos['nempresa'];

	session_write_close();

	if($_SESSION['SESS_USER_DATOS_PERFIL'] == "3"){
		$mensaje = "Bienvenido ".$_SESSION['SESS_USER_DATOS_NAME']." ".$_SESSION['SESS_USER_DATOS_LAST']."<br><br>Estas registrado como Administrador del sistema ".$_SESSION['SESS_USER_DATOS_EMPRESA']."<br><span id='seccionBuscar'></span><span id='seccionDatos'></span>";
		enviaInformacion(armaHTML(getMenuAdmin(), $mensaje, ""));
/*		errorUsuario("<div id='menuVistaTop'></div><div id='menuVistaCenter'><ul class='listaVista'><li onMouseOver='subMenu(0)'>Companias<div id='menuCompania'></div></li><li onMouseOver='subMenu(1)'>Usuarios<div id='menuUsuario'></div></li><li onMouseOver='subMenu(2)'>Criterio<div id='menuCriterio'></div></li></ul></div><div id='menuVistaBottom'></div>");*/
	}
	else if($_SESSION['SESS_USER_DATOS_PERFIL'] == "2"){
		$mensaje = "Bienvenido ".$_SESSION['SESS_USER_DATOS_NAME']." ".$_SESSION['SESS_USER_DATOS_LAST']."<br><br>Estas registrado como Director de la Empresa ".$_SESSION['SESS_USER_DATOS_EMPRESA']."<br><span id='seccionBuscar'></span><span id='seccionDatos'></span>";
		enviaInformacion(armaHTML(getMenuDirec(), $mensaje, ""));
	}
	else{
        header("Content-Type: text/xml");
		die(armaHTML("", "es", ""));
	}
?>