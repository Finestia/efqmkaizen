<?php

	include("../ModulosPHP/conexion.php");
	include("../ModulosPHP/funciones.php");
	
	define("ADMIN", "3");
	define("DIRECTOR", "2");
	define("EVALUADOR", "1");

	//Consultas a la base de datos
/********************************************TABLA USUARIO_DATOS***********************************/
	
	//Función para obtener el id_usuario dado un nombre de usuario y contraseña
	function getIDUsuario($con, $nuser, $pass){
		$nuser = clean($con, $nuser);
        $pass = clean($con, $pass);
		if(isNullEmpty($nuser) || isNullEmpty($pass))
			return -1;
		$consulta = "select id_usuario from usuario_datos where nombre_usuario = '".$nuser."' and contrasena = encode('".$pass."', '".$nuser."')";
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		$num = -1;
		if($result && getTotalR($result) > 0)
			$num = getCol(0, 1, $result);
		cierraCon($band, $con);
		return $num;
	}

    //Función para obtener el id_usuario dado un nombre de usuario
	function getIDU($con, $nuser){
		$nuser = clean($con, $nuser);
		if(isNullEmpty($nuser))
			return -1;
		$consulta = "select id_usuario from usuario_datos where nombre_usuario = '".$nuser."'";
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		$num = -1;
		if($result && getTotalR($result) > 0)
			$num = getCol(0, 1, $result);
		cierraCon($band, $con);
		return $num;
	}

    //Función para obtener datos de un usuario
	function getDatosUser($con, $id){
		$id = clean($con, $id);
		if(isNullEmpty($id))
			return false;
		$band = $con;
		$con = nuevaCon($con);
		$consulta = "select A.id_usuario, A.nombre_usuario, A.nombre, A.apellidos, A.perfil, A.area, A.e_mail, A.telefono, empresa.id_empresa, empresa.nombre as nempresa from empresa inner join (select id_usuario, empresa_id_empresa, nombre_usuario, nombre, apellidos, perfil, area, e_mail, telefono from usuario_datos where id_usuario = ".$id.") as A on A.empresa_id_empresa = empresa.id_empresa";
		$result = mysql_query($consulta, $con);
		$member = false;
		//Verifica si el usuario existe y no hay usuarios duplicados
		if(!oneElement($result) || !($member = getNextRow(1, $result))){
			cierraCon($band, $con);
			session_destroy();
			errorUsuario("<div class=error>Inicio de sesion fallido<br>Por favor revise su nombre de usuario y contrasena</div>");
		}
		cierraCon($band, $con);
		return $member;
	}

	//Función para agregar un usuario
	//Tabla USUARIO
	//Tabla USUARIO_DATOS
	//Tabla USUARIO_DATOS_HAS_CRITERIOS
	function insertaUsuario($con, $nuser, $pass, $repass, $nombre, $apellidos, $empresa, $perfil, $area, $email, $tel, $arrcriterio, $i){
		if(!isAdmin() && !isDirec())
			return false;
		$nuser = clean($con, $nuser);
		$pass = clean($con, $pass);
		$repass = clean($con, $repass);
		$nombre = clean($con, $nombre);
		$apellidos = clean($con, $apellidos);
		$empresa = clean($con, $empresa);
		$perfil = clean($con, $perfil);
		$area = clean($con, $area);
		$email = clean($con, $email);
		$tel = clean($con, $tel);

        if(isDirec())
			$empresa = $_SESSION['SESS_USER_DATOS_IDEMPRESA'];

		if(isNullEmpty($nuser) || isNullEmpty($pass) || isNullEmpty($repass) || isNullEmpty($nombre) || isNullEmpty($apellidos) || isNullEmpty($empresa) || isNullEmpty($perfil) || isNullEmpty($area) || $i == 0 || strcmp($pass, $repass) != 0)
			return false;

		$consulta1 = "start transaction";
		$consulta2 = "commit";
		$consulta3 = "rollback";
		$consulta = "";
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta1, $con);
		if($result){
			if(getIDU($con, $nuser) < 0){
			    $consulta = "insert into usuario_datos (nombre_usuario, contrasena, empresa_id_empresa, nombre, apellidos, perfil, area, e_mail, telefono) values('".$nuser."', encode('".$pass."', '".$nuser."') , ".$empresa.", '".$nombre."', '".$apellidos."', ".$perfil.", '".$area."', '".$email."', '".$tel."')";
				$result = mysql_query($consulta, $con);
				if($result && ($newID = getIDUsuario($con, $nuser, $pass)) >= 0){
					for($j = 0;$j < $i; $j++){
						$consulta = "insert into usuario_datos_has_criterios (usuario_datos_id_usuario, criterios_id_criterios) values (".$newID.", ".$arrcriterio[$j].")";
						$result = mysql_query($consulta, $con);
						if(!$result){
							mysql_query($consulta3, $con);
							cierraCon($band, $con);
							return false;
						}
					}
					$result = mysql_query($consulta2, $con);
					if(!$result){
						mysql_query($consulta3, $con);
						cierraCon($band, $con);
						return false;
					}
					else{
						cierraCon($band, $con);
						return true;
					}
				}
			}
		}
		mysql_query($consulta3, $con);
		cierraCon($band, $con);
		return false;
	}
	
	//Función para obtener datos de algun(os) usuarios. Limite $fin
    function buscaUsuario($con, $id, $nuser, $nombre, $apellidos, $empresa, $perfil, $area, $inicio, $fin, $arrcriterio, $i, $ordenar){
		if(!isAdmin() && !isDirec())
			return "No tiene permisos para esta accion";
		$id = clean($con, $id);
		$nuser = llenaPorcentaje(clean($con, $nuser));
        $nombre = llenaPorcentaje(clean($con, $nombre));
        $apellidos = llenaPorcentaje(clean($con, $apellidos));
        $empresa = clean($con, $empresa);
		$perfil = clean($con, $perfil);
		$area = llenaPorcentaje(clean($con, $area));
        $inicio = clean($con, $inicio);
        $fin = clean($con, $fin);
		$ordenar = clean($con, $ordenar);
        $agregado = "";
		$agregado2 = "";
		if(isNullEmpty($inicio) || isNullEmpty($fin))
   	        return false;
		if(isNullEmpty($id)){
			$agregado = " where nombre_usuario like '".$nuser."' and unombre like '".$nombre."' and apellidos like '".$apellidos."' and area like '".$area."'";
	        if(!isNullEmpty($empresa) && $empresa != '-')
    	        $agregado .= " and id_empresa = ".$empresa;
	        if(!isNullEmpty($perfil) && $perfil != '-')
    	        $agregado .= " and perfil = ".$perfil;
			if($i > 0){
				for($j = 0; $j < $i; $j++){
					if($j == 0)
						$agregado2 .= " where ( id_criterios = ".$arrcriterio[$j];
					else
						$agregado2 .= " or id_criterios = ".$arrcriterio[$j];
				}
				$agregado2 .= " ) ";
			}
		}
		else{
			$agregado = " where id_usuario = ".$id;
		}
		$agreg = "";
		if(isDirec())
			$agreg = " where empresa_id_empresa = ".$_SESSION['SESS_USER_DATOS_IDEMPRESA'];
		$ordenar = " order by ".$ordenar." id_usuario ";
		$cons1 = "select D.id_usuario, D.nombre_usuario, D.unombre, D.apellidos, D.perfil, D.area, D.e_mail, D.telefono, D.id_empresa, D.enombre, criterios.id_criterios, criterios.nombre as cnombre from criterios inner join (";
		$cons2 = "select C.id_usuario, C.nombre_usuario, C.unombre, C.apellidos, C.perfil, C.area, C.e_mail, C.telefono, C.id_empresa, C.enombre, usuario_datos_has_criterios.criterios_id_criterios from usuario_datos_has_criterios inner join (";
		$cons3 = "select B.id_usuario, B.nombre_usuario, B.unombre, B.apellidos, B.perfil, B.area, B.e_mail, B.telefono, empresa.id_empresa, empresa.nombre as enombre from empresa inner join (select id_usuario, nombre_usuario, empresa_id_empresa, nombre as unombre, apellidos, perfil, area, e_mail, telefono from usuario_datos ".$agreg.") as B on B.empresa_id_empresa = empresa.id_empresa ";
		$cons4 = " limit ".$inicio.", ".$fin;
		$cons5 = ") as C on C.id_usuario = usuario_datos_has_criterios.usuario_datos_id_usuario";
		$cons6 = ") as D on D.criterios_id_criterios = criterios.id_criterios ";

        $consulta = $cons1." ".$cons2." ".$cons1." ".$cons2." ".$cons3." ".$agregado." ".$ordenar." ".$cons5." ".$cons6." ".$agregado2." group by id_usuario ".$cons4." ".$cons5." ".$cons6." ".$ordenar. ", id_criterios";
		$band = $con;
		$con = nuevaCon($con);
        $result = mysql_query($consulta, $con);
		$filas = getTotalR($result);
        $texto = "No se encontro alguna coincidencia";
		$n = getTotalRows($con, $cons1." ".$cons2." ".$cons3." ".$agregado." ".$cons5." ".$cons6." ".$agregado2." group by id_usuario ");
        if(hasElements($result))
            $texto = lista($filas, $result)."<inicio>".$inicio."</inicio><totalRows>".$n."</totalRows>";
		cierraCon($band, $con);
        return $texto;
    }
	
	//Función para actualizar datos de un usuario
	//Tabla USUARIO
	//Tabla USUARIO_DATOS
	//Tabla USUARIO_DATOS_HAS_CRITERIOS
	function actualizaUsuario($con, $id, $nuser, $pass, $repass, $nombre, $apellidos, $empresa, $perfil, $area, $email, $tel, $arrcriterio, $i){
		if(!isAdmin() && !isDirec())
			return false;
		$id = clean($con, $id);
		$nuser = clean($con, $nuser);
		$pass = clean($con, $pass);
		$repass = clean($con, $repass);
		$nombre = clean($con, $nombre);
		$apellidos = clean($con, $apellidos);
		$empresa = clean($con, $empresa);
		$perfil = clean($con, $perfil);
		$area = clean($con, $area);
		$email = clean($con, $email);
		$tel = clean($con, $tel);

        $agregado = "";
		if(isDirec()){
			$empresa = $_SESSION['SESS_USER_DATOS_IDEMPRESA'];
			$agregado = " and empresa_id_empresa = ".$_SESSION['SESS_USER_DATOS_IDEMPRESA'];
		}

		if(isNullEmpty($id) || isNullEmpty($nuser) || isNullEmpty($nombre) || isNullEmpty($apellidos) || isNullEmpty($empresa) || isNullEmpty($perfil) || isNullEmpty($area) || $i == 0 || ((!isNullEmpty($pass) || !isNullEmpty($repass)) && strcmp($pass, $repass) != 0))
			return false;

		$contrasena = "";
		if(!isNullEmpty($pass) || !isNullEmpty($repass))
			$contrasena = ", contrasena = encode('".$pass."', '".$nuser."')";
		$consulta1 = "start transaction";
		$consulta2 = "commit";
		$consulta3 = "rollback";
		$consulta = "";
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta1, $con);
		if($result){
			$consulta = "update usuario_datos set nombre_usuario = '".$nuser."'".$contrasena.", empresa_id_empresa = ".$empresa.", nombre = '".$nombre."', apellidos = '".$apellidos."', perfil = ".$perfil.", area = '".$area."', e_mail = '".$email."', telefono = '".$tel."' where id_usuario = ".$id." ".$agregado;
			$result = mysql_query($consulta, $con);
			if($result){
			    $result = getCriteriosUsuario($con, $id);
				$numFilas = getTotalR($result);
				$consultas = array();
				$k = 0;
				for($j = 0;$j < $numFilas; $j++){
					$crit = mysql_fetch_array($result);
					if(($fila = existeE($arrcriterio, $crit[0])) >= 0){
						$arrcriterio[$fila] = -1;
					}
					else{
						$consultas[$k] = "delete from usuario_datos_has_criterios where usuario_datos_id_usuario = ".$id." and criterios_id_criterios = ".$crit[0];
						$k++;
					}
				}
				if($k > 0){
					for($j = 0; $j < $k; $j++){
						$result = mysql_query($consultas[$j], $con);
						if(!$result){
							mysql_query($consulta3, $con);
							cierraCon($band, $con);
							return false;
						}
					}
				}
				$consultas = array();
				$k = 0;
				for($j = 0; $j < $i; $j++){
					if($arrcriterio[$j] >= 0){
						$consultas[$k] = "insert into usuario_datos_has_criterios (usuario_datos_id_usuario, criterios_id_criterios) values (".$id.", ".$arrcriterio[$j].")";
						$k++;
					}
				}
				if($k > 0){
					for($j = 0; $j < $k; $j++){
						$result = mysql_query($consultas[$j], $con);
						if(!$result){
							mysql_query($consulta3, $con);
							cierraCon($band, $con);
							return false;
						}
					}
				}
				$result = mysql_query($consulta2, $con);
				if(!$result){
					mysql_query($consulta3, $con);
					cierraCon($band, $con);
					return false;
				}
				else{
					cierraCon($band, $con);
					return true;
				}
			}
		}
		mysql_query($consulta3, $con);
		cierraCon($band, $con);
		return false;
	}

	//Función para eliminar un usuario
	function eliminaUsuario($con, $id){
		if(!isAdmin() && !isDirec())
			return false;
		$id = clean($con, $id);
		if(isNullEmpty($id)){
			return false;
		}
		$agregado = "";
		if(isDirec())
			$agregado = " and empresa_id_empresa = ".$_SESSION['SESS_USER_DATOS_IDEMPRESA'];
		$consulta = "delete from usuario_datos where id_usuario = ".$id." ".$agregado;
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		cierraCon($band, $con);
		return $result;
	}

/********************************************TABLA CRITERIOS***********************************/
	//Función para obtener los criterios existentes
	function getCriterios($con){
		$band = $con;
		$con = nuevaCon($con);
		$consulta = "select id_criterios, nombre, descripcion from criterios";
		$txt = "No hay datos";
		$result = mysql_query($consulta, $con);
		if(hasElements($result)){
			$txt = getNextRows(getTotalR($result), $result);
		}
		cierraCon($band, $con);
		return $txt;
	}
	
/********************************************TABLA PREGUNTAS***********************************/
    //Función para obtener las preguntas de un criterio
	//Tabla EVALUACION
	//Tabla USUARIO_DATOS_HAS_PREGUNTAS
    function getPreguntas($con, $idc, $idempresa, $idusuario){
        $idc = clean($con, $idc);
        $idempresa = clean($con, $idempresa);
        $idusuario = clean($con, $idusuario);
        if(isNullEmpty($idc) || isNullEmpty($idempresa) || isNullEmpty($idusuario))
            return false;
		$consulta = "select id_evaluacion, empresa_id_empresa, fecha_creacion, Activa from evaluacion where empresa_id_empresa = ".$idempresa." and (curdate() - fecha_creacion) >= 0 and Activa = 1 order by fecha_creacion desc limit 1";
		$txt = "No hay datos";
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		if(!$result || getTotalR($result) == 0){
			$txt = "No hay evaluaciones en curso";
			cierraCon($band, $con);
	        return $txt;
		}
        $consulta = "select B.id_evaluacion, B.empresa_id_empresa, B.fecha_creacion, B.Activa, B.pip, preguntas.id_preguntas, preguntas.numero, preguntas.descripcion, preguntas.criterios_id_criterios from preguntas left join (select A.id_evaluacion, A.empresa_id_empresa, A.fecha_creacion, A.Activa, usuario_datos_has_preguntas.preguntas_id_preguntas as pip from usuario_datos_has_preguntas right join (select id_evaluacion, empresa_id_empresa, fecha_creacion, Activa from evaluacion where empresa_id_empresa = ".$idempresa." and (curdate() - fecha_creacion) >= 0 and Activa = 1 order by fecha_creacion desc limit 1) as A on A.id_evaluacion = usuario_datos_has_preguntas.evaluacion_id_evaluacion where usuario_datos_has_preguntas.usuario_datos_id_usuario = ".$idusuario." and usuario_datos_has_preguntas.preguntas_criterios_id_criterios = ".$idc.") as B on B.pip = preguntas.id_preguntas where preguntas.criterios_id_criterios = ".$idc." order by preguntas.numero";
        $result = mysql_query($consulta, $con);
        if($result)
            $txt = getNextRows(getTotalR($result), $result);
		cierraCon($band, $con);
        return $txt;
    }

/********************************************TABLA USUARIO_DATOS_HAS_CRITERIOS***********************************/
	//Función que devuelve los criterios que un usuario puede evaluar
	function getCriteriosUsuario($con, $id){
		$id = clean($con, $id);
		if(isNullEmpty($id))
			return false;
		$band = $con;
		$con = nuevaCon($con);
		$consulta = "select criterios.id_criterios, criterios.nombre, A.usuario_datos_id_usuario from criterios inner join (select criterios_id_criterios, usuario_datos_id_usuario from usuario_datos_has_criterios where usuario_datos_id_usuario = ".$id.") as A on A.criterios_id_criterios = criterios.id_criterios";
		$result = mysql_query($consulta, $con);
		if(hasElements($result))
			return $result;
		return false;
	}
	
	//Función que envia los criterios con formato xml
	function getCriteriosUsuarioXML($con, $id){
		$texto = "No se encontro alguna coincidencia";
		$result = getCriteriosUsuario($con, $id);
		if(hasElements($result))
			$texto = getNextRows(getTotalR($result), $result);
		return $texto;
	}

/********************************************TABLA USUARIO_DATOS_HAS_PREGUNTAS***********************************/
	//Función para registrar una calificación de alguna pregunta
	//Tabla EVALUACION
	//Tabla USUARIO_DATOS_HAS_CRITERIOS
	//Tabla PREGUNTAS
	function evaluaPregunta($con, $numPregunta, $idempresa, $idusuario, $calif, $aevi, $tevi, $fecha){
		$numPregunta = clean($con, $numPregunta);
		$idempresa = clean($con, $idempresa);
		$idusuario = clean($con, $idusuario);
		$calif = clean($con, $calif);
		$aevi = clean($con, $aevi);
		$tevi = clean($con, $tevi);
		$fech = "now()";
		if($fecha != NULL && count($fecha) == 6)
			$fech = "'".$fecha[0]."-".$fecha[1]."-".$fecha[2]." ".$fecha[3].":".$fecha[4].":".$fecha[5]."'";
		if(isNullEmpty($numPregunta) || isNullEmpty($idempresa) || isNullEmpty($idusuario) || isNullEmpty($calif))
			return false;
		$consulta = "insert into usuario_datos_has_preguntas (preguntas_id_preguntas, usuario_datos_id_usuario, preguntas_criterios_id_criterios, evaluacion_id_evaluacion, evaluacion_empresa_id_empresa, calificacion, aevidencia, tevidencia, fecha) select preguntas.id_preguntas, ".$idusuario.", C.criterios_id_criterios, C.id_evaluacion, C.empresa_id_empresa, ".$calif.", '".$aevi."', '".$tevi."', ".$fech." from preguntas inner join (select A.id_evaluacion, A.empresa_id_empresa, A.fecha_creacion, A.Activa, B.criterios_id_criterios from (select id_evaluacion, empresa_id_empresa, fecha_creacion, Activa from evaluacion where empresa_id_empresa = ".$idempresa." and (curdate() - fecha_creacion) >= 0 and Activa = 1 order by fecha_creacion desc limit 1) as A, (select criterios_id_criterios from usuario_datos_has_criterios where usuario_datos_id_usuario = ".$idusuario.") as B) as C on C.criterios_id_criterios = preguntas.criterios_id_criterios where preguntas.numero = '".$numPregunta."'";
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		cierraCon($band, $con);
		return $result;
	}
//select C.id_evaluacion, C.empresa_id_empresa, C.fecha_creacion, C.Activa, C.criterios_id_criterios, preguntas.id_preguntas, preguntas.numero, preguntas.descripcion from preguntas inner join (select A.id_evaluacion, A.empresa_id_empresa, A.fecha_creacion, A.Activa, B.criterios_id_criterios from (select id_evaluacion, empresa_id_empresa, fecha_creacion, Activa from evaluacion where empresa_id_empresa = ".$idempresa." and (curdate() - fecha_creacion) >= 0 and Activa = 1 order by fecha_creacion desc limit 1) as A, (select criterios_id_criterios from usuario_datos_has_criterios where usuario_datos_usuario_id_usuario = ".$idusuario.") as B) as C on C.criterios_id_criterios = preguntas.criterios_id_criterios where preguntas.numero = '".$numPregunta."'"

	//Función para buscar atributo Aevidencia de la tabla usuario_datos_has_pregunas
	function existeAEvidencia($con, $nombre, $idusuario, $idempresa){
		$nombre = clean($con, $nombre);
		$idusuario = clean($con, $idusuario);
		$idempresa = clean($con, $idempresa);
		if(isNullEmpty($nombre) || isNullEmpty($idusuario) || isNullEmpty($idempresa))
			return -1;
		$consulta = "select aevidencia from usuario_datos_has_preguntas where aevidencia = '".$nombre."' and usuario_datos_id_usuario = ".$idusuario." and evaluacion_empresa_id_empresa = ".$idempresa;
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		$num = -1;
		if($result)
			$num = getTotalR($result);
		cierraCon($band, $con);
		return $num;
	}

/********************************************TABLA EMPRESA***********************************/
	//Funcion para insertar nueva empresa
	function insertaEmpresa($con, $nombre, $desc, $giro, $tam, $tel){
		if(!isAdmin())
			return false;
		$nombre = clean($con, $nombre);
		$desc = clean($con, $desc);
		$giro = clean($con, $giro);
		$tam = clean($con, $tam);
		$tel = clean($con, $tel);

		if(isNullEmpty($nombre) || isNullEmpty($desc) || isNullEmpty($giro) || isNullEmpty($tam)){
			return false;
		}
		$consulta = "insert into empresa (nombre, descripcion, giro, tamano, telefono) values ('".$nombre."', '".$desc."', ".$giro.", ".$tam.", '".$tel."')";
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		cierraCon($band, $con);
		return $result;
	}

    //Función para obtener datos de alguna(s) empresas. Limite $fin
    function buscaEmpresa($con, $id, $nombre, $giro, $tamano, $inicio, $fin){
		$id = clean($con, $id);
        $nombre = llenaPorcentaje(clean($con, $nombre));
        $giro = clean($con, $giro);
        $tamano = clean($con, $tamano);
        $inicio = clean($con, $inicio);
        $fin = clean($con, $fin);
        $agregado = "";
		if(isNullEmpty($inicio) || isNullEmpty($fin))
   	        return false;
		if(isNullEmpty($id)){
			$agregado = "where nombre like '".$nombre."'";
	        if(!isNullEmpty($giro) && $giro != '-')
    	        $agregado .= " and giro = ".$giro;
	        if(!isNullEmpty($tamano) && $tamano != '-')
    	        $agregado .= " and tamano = ".$tamano;
		}
		else{
			$agregado = "where id_empresa = ".$id;
		}
        $consulta = "select id_empresa, nombre, descripcion, giro, tamano, telefono from empresa ".$agregado." order by nombre limit ".$inicio.", ".$fin;
		$band = $con;
		$con = nuevaCon($con);
        $result = mysql_query($consulta, $con);
        $texto = "No se encontro alguna coincidencia";
		$n = getTotalRows($con, "select id_empresa from empresa ".$agregado." order by nombre");
        if(hasElements($result))
            $texto = lista($n, $result)."<inicio>".$inicio."</inicio><totalRows>".$n."</totalRows>";
		cierraCon($band, $con);
        return $texto;
    }

    //Obtener lista de resultados con formato XML
    function lista($n, $result){
        $txt = "<tabla>";
        $max = mysql_num_rows($result);
        for($i = 0; $i < $n && $i < $max; $i++){
            $arreglo = mysql_fetch_array($result);
            $maxcols = mysql_num_fields($result);
            $txt .= "<fila>";
            for($j = 0; $j < $maxcols; $j++){
                $txt .= "<col>".$arreglo[$j]."</col>";
            }
            $txt .= "</fila>";
        }
        $txt .= "</tabla><numFila>".$max."</numFila><perfil>".$_SESSION['SESS_USER_DATOS_PERFIL']."</perfil>";
        return $txt;
    }
	
	//Funcion para actualizar datos de alguna empresa
	function actualizaEmpresa($con, $id, $nombre, $desc, $giro, $tam, $tel){
		if(!isAdmin() && !isDirec())
			return false;
		$id = clean($con, $id);
		$nombre = clean($con, $nombre);
		$desc = clean($con, $desc);
		$giro = clean($con, $giro);
		$tam = clean($con, $tam);
		$tel = clean($con, $tel);

        if(isDirec())
			$id = $_SESSION['SESS_USER_DATOS_IDEMPRESA'];

		if(isNullEmpty($id) || isNullEmpty($nombre) || isNullEmpty($desc) || isNullEmpty($giro) || isNullEmpty($tam)){
			return false;
		}

		$consulta = "update empresa set nombre = '".$nombre."', descripcion = '".$desc."', giro = ".$giro.", tamano = ".$tam.", telefono = '".$tel."' where id_empresa = ".$id;
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		cierraCon($band, $con);
		return $result;
	}
	
	//Función para eliminar alguna empresa
	function eliminaEmpresa($con, $id){
		if(!isAdmin())
			return false;
		$id = clean($con, $id);
		if(isNullEmpty($id)){
			return false;
		}
		$consulta = "delete from empresa where id_empresa = ".$id;
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		cierraCon($band, $con);
		return $result;
	}

/*************************************************************************************************/
	/******Saber si la consulta devuelve algo*****/
	function hasElements($result){
		if($result && mysql_num_rows($result) > 0){
			return true;
		}
		return false;
	}
	
	/******Obtener le total de filas de una consulta*****/
	function getTotalR($result){
		if($result)
			return mysql_num_rows($result);
		return 0;
	}
	
	/******Saber si la consulta devuelve una sola fila*****/
	function oneElement($result){
		if($result && mysql_num_rows($result) == 1){
			return true;
		}
		return false;
	}
	
	//Obtener la fila n del conjunto de resultados
	function getNextRow($n, $result){
		if(mysql_num_rows($result) >= $n){
			$res = NULL;
			for($i = 1; $i <= $n; $i++)
				$res = mysql_fetch_assoc($result);
			return $res;
		}
		return false;
	}

	//Función para obtener la columna n de la fila m de una consulta
	function getCol($n, $m, $result){
		if(mysql_num_rows($result) >= $m){
			$res = NULL;
			for($i = 1; $i <= $m; $i++)
				$res = mysql_fetch_array($result);
			if($res != NULL){
				return $res[$n];
			}
			return $res;
		}
		return NULL;
	}
	
    //Obtener las n filas del conjunto de resultados con formato para enviar
    function getNextRows($n, $result){
        $txt = "<tabla>";
        $max = mysql_num_rows($result);
        for($i = 0; $i < $n && $i < $max; $i++){
            $arreglo = mysql_fetch_array($result);
            $maxcols = mysql_num_fields($result);
            $txt .= "<fila>";
            for($j = 0; $j < $maxcols; $j++){
                $txt .= "<col>".$arreglo[$j]."</col>";
            }
            $txt .= "</fila>";
        }
        $txt .= "</tabla>";
        return $txt;
    }
	
	//Función para obtener el numero total de filas de una consulta
	function getTotalRows($con, $consulta){
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		if(!$result){
			cierraCon($band, $con);
			return 0;
		}
		$num = mysql_num_rows($result);
		cierraCon($band, $con);
		return $num;
	}
	
	//Función para obtener la columna n de la fila m de la consulta
	function getRowCol($con, $consulta, $n, $m){
		$band = $con;
		$con = nuevaCon($con);
		$result = mysql_query($consulta, $con);
		$id = getCol($n, $m, $result);
		cierraCon($band, $con);
		return $id;
	}
	
/***********************************PERFILES***********************************/
	//Funciones para saber el perfil del usuario registrado
	//Administrador
	function isAdmin(){
		if($_SESSION['SESS_USER_DATOS_PERFIL'] == ADMIN)
			return true;
		return false;
	}
	
	//Director
	function isDirec(){
		if($_SESSION['SESS_USER_DATOS_PERFIL'] == DIRECTOR)
			return true;
		return false;
	}
	
	//Evaluador
	function isEval(){
		if($_SESSION['SESS_USER_DATOS_PERFIL'] == EVALUADOR)
			return true;
		return false;
	}
?>