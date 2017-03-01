<?php


/*Удалить файлы, загруженные , больше суток назад */
$dir = "../files/";
$ignored = array('.', '..', '.htaccess');

$expire_time = 86400; // 24 часа в секундах

if (is_dir($dir)) {

    if ($dh = scandir($dir)) {
    	
        foreach ($dh as $key => $file) {
        	if (in_array($file, $ignored)) continue; 

        	            
        	$now=time();
            $time_file=filemtime($dir . $file);

            $time=$now-$time_file;

            if ($time>$expire_time){
                 $file_path = realpath($dir)."/".$file;
                 $m = unlink($file_path); 
                 echo "Файл удален: ".$file_path;   
               
           }
        }
    }       

    closedir($dh);
}

$dblocation="localhost"; 
$dbuser="root"; 
$dbpasswd="pass"; 
$dbcnx=@mysqli_connect($dblocation, $dbuser, $dbpasswd); 
if (!$dbcnx) { 
	exit("<p>В настоящий момент сервер базы данных недоступен, поэтому корректное отображение страницы невозможно </p>"); 
} else { 
	echo("<p> Соединение установлено</p>"); 
} 



?>