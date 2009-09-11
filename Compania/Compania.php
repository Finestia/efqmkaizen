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
		if($_POST['oculto'] == 'new' && isAdmin()){	//Compara si la peticion es para ingresar nueva compañia
            if(!isset($_POST['nombre']) || !isset($_POST['desc']) || !isset($_POST['giro']) || !isset($_POST['tamano']) || !isset($_POST['tel']))
                enviaInformacion(armaHTML("", "Debe enviar todos los parametros", ""));
			if(insertaEmpresa(NULL, $_POST['nombre'], $_POST['desc'], $_POST['giro'], $_POST['tamano'], $_POST['tel']))
				enviaInformacion(armaHTML("", "Se inserto la empresa ".$_POST['nombre'], ""));
			else
				enviaInformacion(armaHTML("", "Error al insertar la empresa ".$_POST['nombre'], ""));
		}
        else if($_POST['oculto'] == 'search'){
            if(!isset($_POST['inicio']) || !isset($_POST['fin']))
                enviaInformacion(armaHTML("", "Debe enviar todos los parametros", ""));
            $nombre = "";
            $giro = "";
            $tam = "";
            if(isset($_POST['nombre']))
                $nombre = $_POST['nombre'];
            if(isset($_POST['giro']))
                $giro = $_POST['giro'];
            if(isset($_POST['tamano']))
                $tam = $_POST['tamano'];
            $id = "";
            if(isset($_POST['id']))
                $id = $_POST['id'];
            if(!($res = buscaEmpresa(NULL, $id, $nombre, $giro, $tam, $_POST['inicio'], $_POST['fin'])))
                enviaInformacion(armaHTML("", "No se encontro alguna coincidencia", ""));
            else
                enviaInformacion(armaXML("", $res, ""));
        }
		else if($_POST['oculto'] == 'update' && (isAdmin() || isDirec())){
            if(!isset($_POST['nombre']) || !isset($_POST['desc']) || !isset($_POST['giro']) || !isset($_POST['tamano']) || !isset($_POST['tel']))
                enviaInformacion(armaHTML("", "Debe enviar todos los parametros", ""));
            if(!isset($_POST['id']))
                enviaInformacion(armaHTML("", "No se especifico la empresa", ""));
			if(actualizaEmpresa(NULL, $_POST['id'], $_POST['nombre'], $_POST['desc'], $_POST['giro'], $_POST['tamano'], $_POST['tel']))
				enviaInformacion(armaHTML("", "Se actualizaron datos de la Empresa", ""));
			else
				enviaInformacion(armaHTML("", "No se actualizaron los datos de la Empresa", ""));
		}
		else if($_POST['oculto'] == 'remove' && isAdmin()){
            if(!isset($_POST['id']))
                enviaInformacion(armaHTML("", "No se especifico la empresa", ""));
			if(eliminaEmpresa(NULL, $_POST['id']))
				enviaInformacion(armaHTML("", "Se elimino la Empresa correctamente", ""));
			else
				enviaInformacion(armaHTML("", "No se elimino la Empresa", ""));
		}
		enviaInformacion(armaHTML("", "No se especifico la peticion", ""));
	}
	enviaInformacion(armaHTML("", "Error de peticion", ""));
?>