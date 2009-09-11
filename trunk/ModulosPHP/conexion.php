<?php
// ---------------------------------------------------- //
//														//
//		CONEXION.PHP									//
//														//
//		Versión:				1.0						//
//		Autor:					Jorge Luis M Gómez		//
//														//
//		Versión:				1.1						//
//		Autor:					Ricardo Galicia Huerta	//
//		Sistema:				T-Kaizen				//
//		Última actualización:	17, Febrero, 2009		//
//														//
// ---------------------------------------------------- //

	//Define la información de acceso a la base de datos como constantes
	define("MYSQL_SERVER", "127.0.0.1");
	define("MYSQL_USER", "root");
	define("MYSQL_PWD", "");
	define("MYSQL_DBNAME", "db_tkaizen");
	
	//Función que crea la conexión a la Base de datos
	function DBConnect() {
		global $errorMsg;
		$conectar = mysql_connect( MYSQL_SERVER , MYSQL_USER, MYSQL_PWD) or die("No es posible conectarse al servidor");
		if(!mysql_select_db( MYSQL_DBNAME, $conectar)){
            require_once("../ModulosPHP/funciones.php");
			errorBD("Fallo la conexión a la Base de Datos");
		}
		return $conectar;
	}
	
	//Función que cierra la conexión a la Base de datos
	function DBClose($connection) {
		mysql_close($connection);
	}
	
	//Función que crea nueva conexion si recibe NULL
	function nuevaCon($con){
		if($con == NULL)
			return DBConnect();
		return $con;
	}
	
	//Función que cierra conexión si no recibe NULL
	function cierraCon($con, $newcon){
		if($con == NULL)
			DBClose($newcon);
	}
?>