<?php

	//Inicia la sesi�n
	session_start();
	//Verifica si la variable de sesi�n esta presente
	if(!isset($_SESSION['SESS_USER_ID']) || trim($_SESSION['SESS_USER_ID']) == ''){
		session_destroy();
        require_once("../ModulosPHP/funciones.php");
		errorUsuario("La sesi�n ha sido cerrada");
	}
?>