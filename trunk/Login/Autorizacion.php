<?php

	//Inicia la sesión
	session_start();
	//Verifica si la variable de sesión esta presente
	if(!isset($_SESSION['SESS_USER_ID']) || trim($_SESSION['SESS_USER_ID']) == ''){
		session_destroy();
        require_once("../ModulosPHP/funciones.php");
		errorUsuario("La sesión ha sido cerrada");
	}
?>