<?php
// ---------------------------------------------------- //
//														//
//		Compania.php										//
//														//
//		Versión:				1.1						//
//		Autor:					Ricardo Galicia Huerta	//
//		Sistema:				T-Kaizen				//
//		Última actualización:	24, Marzo, 2009			//
//														//
// ---------------------------------------------------- //

	require_once("../Login/Autorizacion.php");
	include("../ModulosPHP/consultas.php");
	
	if(isset($_POST['oculto'])){	//Verificar si hay peticiones
		if($_POST['oculto'] == 'search'){
			return enviaInformacion(armaXML("", getCriterios(NULL), ""));
		}
		enviaInformacion(armaHTML("", "No se especifico la peticion", ""));
	}
	enviaInformacion(armaHTML("", "Error de peticion", ""));
?>