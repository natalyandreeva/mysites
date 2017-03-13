<?php

if (empty($_POST)) die;

 /* Здесь проверяется существование переменных */
if (isset($_POST['country'])) {$country= $_POST['country'];}
if (isset($_POST['region_kz'])) {$region_kz= $_POST['region_kz'];}
if (isset($_POST['sum_kz'])) {$sum_kz= $_POST['sum_kz'];}  
if (isset($_POST['name'])) {$name = $_POST['name'];}
if (isset($_POST['mobilePhone'])) {$mobilePhone = $_POST['mobilePhone'];}
if (isset($_POST['email'])) {$email = $_POST['email'];}
if (isset($_POST['iin'])) {$iin= $_POST['iin'];}
if (isset($_POST['birthDay'])) {$birthDay= $_POST['birthDay'];}
if (isset($_POST['birthMonth'])) {$birthMonth= $_POST['birthMonth'];}
if (isset($_POST['birthYear'])) {$birthYear= $_POST['birthYear'];}
if (isset($_POST['sum_ru'])) {$sum_ru= $_POST['sum_ru'];}
if (isset($_POST['region_ru'])) {$region_ru= $_POST['region_ru'];}
if (isset($_POST['region'])) {$region= $_POST['region'];}
if (isset($_FILES['fileId']['name'])) {$fileId= $_FILES['fileId']['name'];}


/* moe */

/*end */

$countryArray = array('1' =>'Казахстан');
 

/* Сюда впишите свою эл. почту */
$address = "free.credit@online-zaim.kz";
$to = $email;


if ($country == 'kz') {
  $country="Казахстан";
} else {
  $country = "Россия";
}

$sum=$sum_kz." тенге" ;
if ($sum_ru) {
   $sum=$sum_ru." рублей";
 
}


/* А здесь прописывается текст сообщения, \n - перенос строки */
 $mes = "Тема: Заказ обратного звонка!\nСтрана: $country\nРегион: $region \nСумма: $sum \nИмя: $name\nТелефон: $mobilePhone\nE-mail:  $email\nДата рождения: $birthDay число \ $birthMonth месяц \ $birthYear год \n Ссылка фото для удостоверения личности: http://online-zaim.kz/files/$fileId \n 
 ";

/* А эта функция как раз занимается отправкой письма на указанный вами email */
$sub='Заказ'; //сабж
$email='Заказ <podbor.ru>'; // от кого
$send = mail ($address,$sub,$mes,"Content-type:text/plain; charset = utf-8\r\nFrom:$email"); 

//$send1 = mail ($address,$sub,$mes,"Content-type:text/plain; charset = utf-8\r\nFrom:$email");


 $uploaddir = '../files/'; // Relative path under webroot

 $uploadfile = $uploaddir . basename($_FILES['fileId']['name']);

 if (move_uploaded_file($_FILES['fileId']['tmp_name'], $uploadfile)) {
   
 } else {
   
 }

$io = '';
if ($name) {
    $name_array = explode(" ", $name);
    $io = $name_array[1]." ".$name_array[2];
} 

require "../libs/phpMailer/PHPMailerAutoload.php";
     
$mail1 = new PHPMailer;
$mail2 = new PHPMailer;

$email_template = "../emails/vaghnoe_pismo1.html";

$mail1->Subject = "Ваша заявка на кредит ПРИНЯТА в работу (Важное письмо №1)";
$body = file_get_contents($email_template); 

$body = str_replace("{NAME}", $io, $body);
$body = str_replace("{REGION}", $region, $body);

$mail1->setFrom($address, 'Андрей Владимирович');
$mail1->addAddress($to, $io);
$mail1->CharSet = 'utf-8';

$mail1->msgHTML($body, dirname(__FILE__));
$mail1->send();


$dbh = mysqli_connect('localhost', 'onlinez1_zaim', 'http://online-zaim.kz/');
$key = md5($to.time());

if ($dbh) {
    mysqli_select_db($dbh,"onlinez1_onlinezaim");
    $query1 = "INSERT INTO zayavki (email, date, name, skey, send_info) VALUES ('$to', '".time()."','$name', '$key', 0)";
    $result = mysqli_query($dbh, $query1);
    mysqli_close($dbh);
}
  
    
/*$email_template2 = "../emails/credit_information2.html";
$mail2->Subject = "Краткая подборка информации по нашей кредитной программе";

$body2 = file_get_contents($email_template2); 

$body2 = str_replace("{NAME}", $io, $body2);
$body2 = str_replace("{KEY}", $key, $body2);

$mail2->setFrom($address, 'Андрей Владимирович');
$mail2->addAddress($to, $io);
$mail2->CharSet = 'utf-8';

    $mail2->msgHTML($body2, dirname(__FILE__));
    
    $mail2->send();*/
 $n = array("response" => "ok");  
    echo json_encode($n);

 ?>   