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
		if($_POST['oculto'] == 'new' && (isAdmin() || isDirec())){
            if(!isset($_POST['empresa']) && isDirec())
                $_POST['empresa'] = $_SESSION['SESS_USER_DATOS_IDEMPRESA'];
            if(!isset($_POST['nuser']) || !isset($_POST['pass']) || !isset($_POST['repass']) || !isset($_POST['nombre']) || !isset($_POST['apellidos']) || !isset($_POST['empresa']) || !isset($_POST['perfil']) || !isset($_POST['area']) || !isset($_POST['email']) || !isset($_POST['tel']))
                enviaInformacion(armaXML("", "Debe enviar todos los parametros", ""));
			$arr = array();
			$i = 1;
			while(isset($_POST['crt'.$i])){
				$arr[$i - 1] = $_POST['crt'.$i];
				$i++;
			}
			if(insertaUsuario(NULL, $_POST['nuser'], $_POST['pass'], $_POST['repass'], $_POST['nombre'], $_POST['apellidos'], $_POST['empresa'], $_POST['perfil'], $_POST['area'], $_POST['email'], $_POST['tel'], $arr, count($arr)))
				enviaInformacion(armaXML("", "Se agrego el usuario ".$_POST['nombre']." ".$_POST['apellidos'], ""));
			else
				enviaInformacion(armaXML("", "No se agrego el usuario ".$_POST['nombre']." ".$_POST['apellidos']." ".count($arr), ""));
		}
		else if($_POST['oculto'] == 'search' && (isAdmin() || isDirec())){
            if(!isset($_POST['inicio']) || !isset($_POST['fin']))
                enviaInformacion(armaXML("", "Debe especificar todos los parametros", ""));
            $id = "";
            $nuser = "";
            $nombre = "";
            $apellidos = "";
            $empresa = "";
            $perfil = "";
            $area = "";

            if(isset($_POST['id']))
                $id = $_POST['id'];
            if(isset($_POST['nuser']))
                $nuser = $_POST['nuser'];
            if(isset($_POST['nombre']))
                $nombre = $_POST['nombre'];
            if(isset($_POST['apellidos']))
                $apellidos = $_POST['apellidos'];
            if(isset($_POST['empresa']))
                $empresa = $_POST['empresa'];
            else if(isDirec())
                $empresa = $_SESSION['SESS_USER_DATOS_IDEMPRESA'];
            if(isset($_POST['perfil']))
                $perfil = $_POST['perfil'];
            if(isset($_POST['area']))
                $area = $_POST['area'];
			$arr = array();
			$i = 1;
			while(isset($_POST['crt'.$i])){
				$arr[$i - 1] = $_POST['crt'.$i];
				$i++;
			}
			$ordenar = "";
			$i = 1;
			while(isset($_POST['ordenarU'.$i])){
				$ordenar .= $_POST['ordenarU'.$i].", ";
				$i++;
			}
			if(!($res = buscaUsuario(NULL, $id, $nuser, $nombre, $apellidos, $empresa, $perfil, $area, $_POST['inicio'], $_POST['fin'], $arr, count($arr), $ordenar)))
				enviaInformacion(armaXML("", "No se encontro alguna coincidencia", ""));
			else
				enviaInformacion(armaXML("", $res, ""));
		}
		else if($_POST['oculto'] == 'update' && (isAdmin() || isDirec())){
            if(!isset($_POST['empresa']) && isDirec())
                $_POST['empresa'] = $_SESSION['SESS_USER_DATOS_IDEMPRESA'];
            if(!isset($_POST['id']) || !isset($_POST['nuser']) || !isset($_POST['pass']) || !isset($_POST['repass']) || !isset($_POST['nombre']) || !isset($_POST['apellidos']) || !isset($_POST['empresa']) || !isset($_POST['perfil']) || !isset($_POST['area']) || !isset($_POST['email']) || !isset($_POST['tel']))
                enviaInformacion(armaXML("", "Debe enviar todos los parametros", ""));
			$arr = array();
			$i = 1;
			while(isset($_POST['crt'.$i])){
				$arr[$i - 1] = $_POST['crt'.$i];
				$i++;
			}

			if(actualizaUsuario(NULL, $_POST['id'], $_POST['nuser'], $_POST['pass'], $_POST['repass'], $_POST['nombre'], $_POST['apellidos'], $_POST['empresa'], $_POST['perfil'], $_POST['area'], $_POST['email'], $_POST['tel'], $arr, count($arr)))
				enviaInformacion(armaXML("", "Se actualizaron datos del usuario ", ""));
			else
				enviaInformacion(armaXML("", "No se actualizaron datos del usuario ", ""));
		}
		else if($_POST['oculto'] == 'remove' && (isDirec() || isAdmin())){
            if(!isset($_POST['id']))
                enviaInformacion(armaXML("", "Debe enviar todos los parametros", ""));
			if(eliminaUsuario(NULL, $_POST['id']))
				enviaInformacion(armaHTML("", "Se elimino el Usuario correctamente", ""));
			else
				enviaInformacion(armaHTML("", "No se elimino el Usuario", ""));
		}
		enviaInformacion(armaHTML("", "No se especifico la peticion", ""));
	}
	enviaInformacion(armaHTML("", "Error de peticion", ""));
?>
