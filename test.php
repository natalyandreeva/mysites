<?php
$dbh = mysqli_connect('localhost', 'root', 'pass');

if ($dbh) {
	mysqli_select_db($dbh,"online_zaim");

$email='nataly.andreevaa@gmail.com';
$query1 = "INSERT INTO send_email (email, date, send_email1, send_email2, name) VALUES ('$email', '".time()."', 0, 0, 'Андреева Наталья Владимировна')";


$result = mysqli_query($dbh, $query1);
	$query2 = "SELECT * from send_email where 1";
	$result = mysqli_query($dbh, $query2);

$from =  "free.creditor52@mail.ru";

/*$time1 = 7200; //2 hours
$time2 = 18000; // 5 hours*/
$time1 = 60;
$time2=60;

$email_template1 = "../emails/credit_information.html";
$subject1 = "Краткая подборка информации по нашей кредитной программе";
$file = fopen($email_template1, "r"); //Открываем файл
$text1 = fread($file, filesize($email_template1)); //Считываем весь файл
fclose($file); 

$email_template2 = "../emails/vaghnoe_pismo2.html";
$subject2 = "Инфо по Вашей заявке на кредит (Важное письмо №2)";
$file = fopen($email_template2, "r"); //Открываем файл
$text2 = fread($file, filesize($email_template2)); //Считываем весь файл
fclose($file); 



while($row = $result->fetch_array()) {
	$email2send = $row['email'];
	$name = $row['name'];
	$io = "Клиент";
	if ($name) {
        $name_array = explode(" ", $name);
        $io = $name_array[1]." ".$name_array[2];
    }  
  
	if (!empty($email2send) && (time()-$time1)>$row['date'] && $row['send_email1'] != 1) {
		$body1 = str_replace("{NAME}", $io, $text1);

        $headers = "Content-type: text/html; charset=utf-8 \r\n";
        $headers .= "From: $from\r\n"; 
        
        if ($body1)
             echo mail($email2send, $subject1, $body1, $headers); //Отправляем письмо

        $query2 = "UPDATE send_email SET send_email1=1";
        mysqli_query($dbh, $query2);

        echo "Письмо 1 отправлено";
   
    }
    if (!empty($email2send) && (time()-$time2)>$row['date'] && $row['send_email2'] != 1) {
		$body2 = str_replace("{NAME}", $io, $text2);

        $headers = "Content-type: text/html; charset=utf-8 \r\n";
        $headers .= "From: $from\r\n"; 
        
        if ($body2)
             mail($email2send, $subject2, $body2, $headers); //Отправляем письмо

        $query3 = "DELETE FROM send_email WHERE email='$email2send'";
        mysqli_query($dbh, $query3);
        echo "Письмо 2 отправлено";
   
    }
    

	
}

mysqli_close($dbh);
}


?>