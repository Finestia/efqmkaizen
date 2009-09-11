<?php
	
	//Función para limpiar cadenas y evitar sqlinyection
	function clean($con, $cadena){
		if($cadena == NULL)
			return '';
        require_once("../ModulosPHP/conexion.php");
		$band = $con;
		$con = nuevaCon($con);
		$cadena = trim($cadena);
		if(get_magic_quotes_gpc()){
			$cadena = stripslashes($cadena);
		}
		$cadena = mysql_real_escape_string($cadena);
		cierraCon($band, $con);
        return $cadena;
	}

	//Si una cadena es nula o vacia
	function isNullEmpty($cad){
		if($cad == NULL || !isset($cad) || strlen($cad) == 0)
			return true;
		return false;
	}

    //Función para llenar la variable $cad con '%'
    function llenaPorcentaje($cad){
        if(!isset($cad) || is_null($cad))
            return "%%";
        return "%".$cad."%";
    }

	//Funciones para enviar errores con mensaje
	function errorUsuario($messError){
		header("HTTP/1.1 611 Error de usuario");
		die($messError);
	}

	function errorBD($messError){
		header("HTTP/1.1 612 Error de BD");
		die($messError);
	}

    function enviaInformacion($mensaje){
        header("Content-Type: text/xml");
        die($mensaje);
    }
	
	//Función para buscar un elemento en un arreglo
	function existeE($arr, $valor){
		if($arr == NULL)
			return -1;
		$max = count($arr);
		for($i = 0; $i < $max; $i++){
			if($arr[$i] == $valor)
				return $i;
		}
		return -1;
	}
	
/***********************************FORMATO_XML*****************************/
	//Formato de respuesta HTML
	function armaHTML($menu, $cuerpo, $messError){
		return "<data><menu>".convCadena($menu)."</menu><cuerpo>".convCadena($cuerpo)."</cuerpo><messError>".convCadena($messError)."</messError></data>";
	}

    //Formato de respuesta XML
	function armaXML($menu, $cuerpo, $messError){
		return "<data><menu>".$menu."</menu><cuerpo>".$cuerpo."</cuerpo><messError>".$messError."</messError></data>";
	}
	
	//Función para dar formato a los delimitadores y enviar texto en el archivo xml
	function convCadena($texto){
		$max = strlen($texto);
		$txt = "";
		for($i = 0; $i < $max; $i++){
			if($texto[$i] == '<')
				$txt .= '+';
			else if($texto[$i] == '>')
				$txt .= '_';
			else
				$txt .= $texto[$i];
		}
		return $txt;
	}
	
/**********************************MENUS************************************/
	//Menu del administrador
	function getMenuAdmin(){
		return "<div><ul class='listaUMenu'><li onMouseOver='subMenu(this, 9999, ".$_SESSION['SESS_USER_DATOS_PERFIL'].")' onMouseOut='colorMenuOut(this)' onClick='cargaUsuario(".$_SESSION['SESS_USER_ID'].", ".$_SESSION['SESS_USER_DATOS_PERFIL'].")'>Datos<div id='menuDatos' class='submenu'></div></li><li onMouseOver='subMenu(this, 1, ".$_SESSION['SESS_USER_DATOS_PERFIL'].")' onMouseOut='colorMenuOut(this)'>Companias<div id='menuCompania' class='submenu'></div></li><li onMouseOver='subMenu(this, 2, ".$_SESSION['SESS_USER_DATOS_PERFIL'].")' onMouseOut='colorMenuOut(this)'>Usuarios<div id='menuUsuario' class='submenu'></div></li><li onMouseOver='subMenu(this, 9999, ".$_SESSION['SESS_USER_DATOS_PERFIL'].")' onMouseOut='colorMenuOut(this)' onClick='evaluar()'>Evaluar<div id='menuEvaluar' class='submenu'></div></li></ul></div>";
	}

	//Menu del Director
	function getMenuDirec(){
		return "<div><ul class='listaUMenu'><li onMouseOver='subMenu(this, 9999, ".$_SESSION['SESS_USER_DATOS_PERFIL'].")' onMouseOut='colorMenuOut(this)' onClick='cargaUsuario(".$_SESSION['SESS_USER_ID'].", ".$_SESSION['SESS_USER_DATOS_PERFIL'].")'>Datos<div id='menuDatos' class='submenu'></div></li><li onMouseOver='subMenu(this, 1, ".$_SESSION['SESS_USER_DATOS_PERFIL'].")' onMouseOut='colorMenuOut(this)'>Companias<div id='menuCompania' class='submenu'></div></li><li onMouseOver='subMenu(this, 2, ".$_SESSION['SESS_USER_DATOS_PERFIL'].")' onMouseOut='colorMenuOut(this)'>Usuarios<div id='menuUsuario' class='submenu'></div></li><li onMouseOver='subMenu(this, 9999, ".$_SESSION['SESS_USER_DATOS_PERFIL'].")' onMouseOut='colorMenuOut(this)' onClick='evaluar()'>Evaluar<div id='menuEvaluar' class='submenu'></div></li></ul></div>";
	}
	
/*	<div id='menuVistaCenter'><ul class='listaVista'><li onMouseOver='subMenu(0)'>Companias<div id='menuCompania'></div></li><li onMouseOver='subMenu(1)'>Usuarios<div id='menuUsuario'></div></li><li onMouseOver='subMenu(2)'>Criterio<div id='menuCriterio'></div></li></ul></div>*/
?>