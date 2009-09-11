/****************************Funciones para enviar y recibir peticiones*********************/
//Funciòn para obtener el objeto de conexión
function getAjaxObj(){
	var xmlHttp=null;
	try{
		 // Firefox, Opera 8.0+, Safari
		 xmlHttp=new XMLHttpRequest();
 	}catch (e){
 		//Internet Explorer
		try{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}catch (f){
			try{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}catch(g){
				alert("AJAX no soportado");
			}
		}
	}
	return xmlHttp;
}

//Función para enviar y establecer variables de envio y recibo de una petición
function ajax(url, vars, callBackFunction){
	var xhr = null;
	xhr = getAjaxObj();
	if(xhr == null)
		return;
	xhr.open("POST", url + "?" + vars, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			var xml = xhr.responseXML;
			if(xml != null){
				callBackFunction(xml, 1);
				return;
			}
			callBackFunction(xml, 0);
		}
		else if(xhr.readyState == 4 && xhr.status > 610){
			var xml = xhr.responseText;
			if(xml != null){
				callBackFunction(xml, 0);
				return;
			}
		}
	}
	xhr.send(vars);
}