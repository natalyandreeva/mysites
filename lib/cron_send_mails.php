<?php

/*Удалить файлы, загруженные , больше суток назад */
$dir = "../files/";
$ignored = array('.', '..', '.htaccess');

$expire_time = 86400; // 24 часа в секундах

echo "Крон запущен <br />";

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
                 echo "Файл удален: ".$file_path."<br/>";   
               
           }
        }
    }       

}

/* Отправка писем */

$dbh = mysqli_connect('localhost', 'onlinez1_zaim', 'http://online-zaim.kz/');

if ($dbh) {
    mysqli_select_db($dbh,"onlinez1_onlinezaim");
    $query1 = "SELECT * from zayavki where send_info=0";
    $result = mysqli_query($dbh, $query1);

    $from =  "free.credit@online-zaim.kz";

    $time = 900; //15 min

    require "../libs/phpMailer/PHPMailerAutoload.php";
    while($row = $result->fetch_array()) {
        $email2send = $row['email'];
        $name = $row['name'];
        $key=$row['skey'];
        if (!empty($email2send) && (time()-$time)>$row['date']) {

            $email_template = "../emails/credit_information2.html";
            $mail = new PHPMailer;

            $mail->Subject = "Краткая подборка информации по нашей кредитной программе";

            $body = file_get_contents($email_template); 

            $io = '';
            if ($name) {
                $name_array = explode(" ", $name);
                $io = $name_array[1]." ".$name_array[2];
            } 
            $body = str_replace("{NAME}", $io, $body);
            $body = str_replace("{KEY}", $key, $body);

            $mail->setFrom($from, 'Андрей Владимирович');
            $mail->addAddress($email2send, $io);
            $mail->CharSet = 'utf-8';
            
            $mail->msgHTML($body, dirname(__FILE__));
            $mail->send();
   
   
             
            $query2 = "UPDATE zayavki SET send_info=1 WHERE skey='$key'";
            mysqli_query($dbh, $query2);

         }
     }
     
    $query3 = "SELECT * from zayavki where send_email1=1";
    $result = mysqli_query($dbh, $query3);

  
    $email_template1 = "../emails/vaghnoe_pismo22.html";
    $body1 = file_get_contents($email_template1); 

    $email_template2 = "../emails/anticol_pomosh2.html";
    $body2 = file_get_contents($email_template2); 
        
        
          

    while($row = $result->fetch_array()) {
        $email2send = $row['email'];
        $name = $row['name'];
        $key=$row['skey'];
        if (!empty($email2send) && (time()-$time)>$row['send_date1']) {
            $mail1 = new PHPMailer;
            $mail2 = new PHPMailer;


            $mail1->Subject = 'Положительное решение по заявке на кредит от частного инвестора (Важное письмо №2)';

    
            $mail2->Subject = 'Антиколлекторская помощь всем нашим заёмщикам';
               
           
            
            $io = '';
            if ($name) {
                $name_array = explode(" ", $name);
                $io = $name_array[1]." ".$name_array[2];
            } 
            $body1 = str_replace("{NAME}", $io, $body1);
            $body1 = str_replace("{KEY}", $key, $body1);

            $mail1->setFrom($from, 'Андрей Владимирович');
            $mail1->addAddress($email2send, $io);
            $mail1->CharSet = 'utf-8';

            $mail1->msgHTML($body1, dirname(__FILE__));
            
            $mail1->send();
                        
            $body2 = str_replace("{NAME}", $io, $body2);
            $body2 = str_replace("{KEY}", $key, $body2);

            $mail2->setFrom($from, 'Андрей Владимирович');
            $mail2->addAddress($email2send, $io);
            $mail2->CharSet = 'utf-8';

            $mail2->msgHTML($body2, dirname(__FILE__));
            
            $mail2->send();
            
            $query4 = "UPDATE zayavki SET send_email1 = '0' where skey='$key'";
            mysqli_query($dbh, $query4);
       

         }
     }
     
  
    $query5 = "SELECT * from zayavki where send_email2=1";
    $result = mysqli_query($dbh, $query5);

  
    $email_template3 = "../emails/ispravit_creditnuyu_istoriyu.html";
    $body3 = file_get_contents($email_template3); 

    $email_template4 = "../emails/vaghnoe_pismo55.html";
    $body4 = file_get_contents($email_template4); 
        
        
          

    while($row = $result->fetch_array()) {
        $email2send = $row['email'];
        $name = $row['name'];
        $key=$row['skey'];
        if (!empty($email2send) && (time()-$time)>$row['send_date2']) {
            $mail3 = new PHPMailer;
            $mail4 = new PHPMailer;

            $mail3->Subject = 'Ну что, кажется уже пора исправить Вашу кредитную историю?';

            $mail4->Subject = 'Дальнейшие инструкции по кредиту от инвестора';
               
           
            
            $io = '';
            if ($name) {
                $name_array = explode(" ", $name);
                $io = $name_array[1]." ".$name_array[2];
            } 
            $body3 = str_replace("{NAME}", $io, $body3);
            $body3 = str_replace("{KEY}", $key, $body3);

            $mail3->setFrom($from, 'Андрей Владимирович');
            $mail3->addAddress($email2send, $io);
            $mail3->CharSet = 'utf-8';

            $mail3->msgHTML($body3, dirname(__FILE__));
            
            $mail3->send();
                        
            $body4 = str_replace("{NAME}", $io, $body4);
            $body4 = str_replace("{KEY}", $key, $body4);

            $mail4->setFrom($from, 'Андрей Владимирович');
            $mail4->addAddress($email2send, $io);
            $mail4->CharSet = 'utf-8';

            $mail4->msgHTML($body4, dirname(__FILE__));
              $mail4->addAttachment("../docs/list.jpg", "list.jpg");
             $mail4->addAttachment("../docs/ru_centralniy_kurskaya_zubkov.zip", "ru_centralniy_kurskaya_zubkov.zip");   
             $mail4->addAttachment("../docs/договора.zip", "договора.zip");
            
            $mail4->send();
            
            $query6 = "UPDATE zayavki SET send_email2 = '0' where skey='$key'";
            mysqli_query($dbh, $query6);
       

         }
     }

     mysqli_close($dbh);
 
   
}	

?>