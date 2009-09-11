<?php
// ---------------------------------------------------- //
//														//
//		Compania.php										//
//  													//
//		Versión:				1.1						//
//		Autor:					Ricardo Galicia Huerta	//
//		Sistema:				T-Kaizen				//
//		Última actualización:	24, Marzo, 2009			//
//														//
// ---------------------------------------------------- //

	require_once("../Login/Autorizacion.php");
	include("../ModulosPHP/consultas.php");

    if(isset($_POST['oculto'])){	//Verificar si hay peticiones
        if($_POST['oculto'] == 'show'){	//Compara si la peticion es para saber que criterios evalua un usuario
			if(($res = getCriteriosUsuarioXML(NULL, $_SESSION['SESS_USER_ID'])))
				enviaInformacion(armaXML("", $res, ""));
			else
				enviaInformacion(armaHTML("", "No hay datos", ""));
		}
        else if($_POST['oculto'] == 'showpregunta'){	//Compara si la peticion es para obtener las preguntas por criterio
			if(!isset($_POST['id']))
				enviaInformacion(armaXML("", "Debe enviar todos los parametros", ""));
			if(($res = getPreguntas(NULL, $_POST['id'], $_SESSION['SESS_USER_DATOS_IDEMPRESA'], $_SESSION['SESS_USER_ID'])))
				enviaInformacion(armaXML("", $res, ""));
			else
				enviaInformacion(armaHTML("", "No hay datos", ""));
		}
		else if($_POST['oculto'] == 'eval'){	//Compara si la peticion es para evaluar las preguntas por criterio
			if(!isset($_POST['numPregunta']) || !isset($_POST['calif']))
				enviaInformacion(armaXML("", "Debe enviar todos los parametros", ""));
			$tevi = "";
			if(isset($_POST['tevi']))
				$tevi = $_POST['tevi'];
			$aevi = "";
			if(is_uploaded_file($_FILES['aevi']['tmp_name'])){
				$direc = "archivos/".$_SESSION['SESS_USER_DATOS_EMPRESA']."/".$_SESSION['SESS_USER_NAME'];
				if($_FILES['aevi']['size'] < 5000000){
					if(!is_dir($direc)){
						if(!is_dir('archivos')){
							if(!mkdir('archivos', 0777))
								enviaInformacion(armaHTML("", "No es posible crear el directorio para evidencias", ""));
						}
						if(!is_dir("archivos/".$_SESSION['SESS_USER_DATOS_EMPRESA'])){
							if(!mkdir("archivos/".$_SESSION['SESS_USER_DATOS_EMPRESA'], 0777))
								enviaInformacion(armaHTML("", "No es posible crear el directorio para evidencias", ""));
						}
					    if(!mkdir($direc, 0777))
							enviaInformacion(armaHTML("", "No es posible crear el directorio para evidencias", ""));
					}
					$rNum = existeAEvidencia(NULL, $direc."/".$_FILES['aevi']['name'], $_SESSION['SESS_USER_ID'], $_SESSION['SESS_USER_DATOS_IDEMPRESA']);
					if($rNum < 0)
						enviaInformacion(armaHTML("", "Ocurrio un error en la consulta", ""));
					if($rNum > 0)
						enviaInformacion(armaHTML("", "El nombre de archivo ya existe. Cambie el nombre y vuelva a intentarlo", ""));
					if(copy($_FILES['aevi']['tmp_name'], $direc."/".$_FILES['aevi']['name']))
						$aevi = $direc."/".$_FILES['aevi']['name'];
					else
						enviaInformacion(armaXML("", "No es posible subir el archivo de evidencia ".$_FILES['aevi']['name'], ""));
				}
				else
					enviaInformacion(armaXML("", "El tamano de archivo excede los 5MB permitidos", ""));
			}
			if(evaluaPregunta(NULL, $_POST['numPregunta'], $_SESSION['SESS_USER_DATOS_IDEMPRESA'], $_SESSION['SESS_USER_ID'], $_POST['calif'], $aevi, $tevi, NULL)){
				enviaInformacion(armaXML("", "La evaluacion ha sido registrada", ""));
			}
			else{
				if(!isNullEmpty($aevi))
					unlink($aevi);
				enviaInformacion(armaXML("", "Error al evaluar la pregunta", ""));
			}
		}
        enviaInformacion(armaHTML("", "No se especifico la peticion", ""));
    }
    enviaInformacion(armaHTML("", "Error de peticion", ""));
?>