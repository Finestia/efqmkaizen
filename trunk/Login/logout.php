<?php
	//Inicia la sesi�n
	session_start();
	
	//Unset las variables guardadas en la sesi�n
	/*unset($_SESSION['SESS_MEMBER_ID']);
	unset($_SESSION['SESS_FIRST_NAME']);
	unset($_SESSION['SESS_LAST_NAME']);*/
	session_destroy();
?>