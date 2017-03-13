<?php

if (empty($key))
    exit;

$dbh = mysqli_connect('localhost', 'onlinez1_zaim', 'http://online-zaim.kz/');

if ($dbh) {
    mysqli_select_db($dbh,"onlinez1_onlinezaim");
    $query2 = "SELECT * from zayavki where key='$key'";
    $result = mysqli_query($dbh, $query2);

    if (empty($result))
        exit;

    $from =  "free.credit@online-zaim.kz";


    if ($step == 2) {
        $email_template1 = "../emails/vaghnoe_pismo44.html";
        $subject1 = "Важные дальнейшие инструкции по кредиту от инвестора (Важное письмо №4)";
        $file = fopen($email_template1, "r"); 
        $text1 = fread($file, filesize($email_template1)); 
        fclose($file); 

        $email_template2 = "../emails/vaghnoe_pismo55.html";
        $subject2 = "Дальнейшие инструкции по кредиту от инвестора (Важное письмо №5)";
        $file = fopen($email_template2, "r"); 
        $text2 = fread($file, filesize($email_template2)); 
        fclose($file); 
    } else {
        $email_template1 = "../emails/vaghnoe_pismo22.html";
        $subject1 = "Положительное решение по заявке на кредит от частного инвестора (Важное письмо №2)";
        $file = fopen($email_template1, "r"); 
        $text1 = fread($file, filesize($email_template1)); 
        fclose($file); 

        $email_template2 = "../emails/anticol_pomosh.html";
        $subject2 = "Антиколлекторская помощь всем нашим заёмщикам";
        $file = fopen($email_template2, "r"); 
        $text2 = fread($file, filesize($email_template2)); 
        fclose($file); 
    }    

    while($row = $result->fetch_array()) {
        print_r($result);die;
    $email2send = $row['email'];
    $name = $row['name'];

    
    if ($name) {
        $name_array = explode(" ", $name);
        $io = $name_array[1]." ".$name_array[2];
    } 
    $body1 = str_replace("{NAME}", $io, $text1);
    $body1 = str_replace("{KEY}", $key, $text1);

    $headers = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: $from\r\n"; 
        
    if ($body1)
             mail($email2send, $subject1, $body1, $headers); 
             
        

         
     }
     
        $body2 = str_replace("{NAME}", $io, $text2);

        $headers = "Content-type: text/html; charset=utf-8 \r\n";
        $headers .= "From: $from\r\n"; 
        
        if ($body2)
             mail($email2send, $subject2, $body2, $headers); 

         
         
         
     }
     mysqli_close($dbh);
     exit;
     }
     

 
   
}   



?>