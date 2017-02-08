<?php





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
if (isset($_POST['f'])) {$f= $_POST['f'];}


/* moe */

/*end */



$countryArray = array('1' =>'Казахстан');
 

/* Сюда впишите свою эл. почту */
 //$address = "free.creditor52@mail.ru";
$address = "nataly.andreevaa@gmail.com";
 

/* А здесь прописывается текст сообщения, \n - перенос строки */
 $mes = "Тема: Заказ обратного звонка!\nСтрана: $country\nРегион: $region_kz | $region_ru \nСумма: $sum_ru рублей | $sum_kz тенге \nИмя: $name\nТелефон: $mobilePhone\nE-mail:  $email\nДата рождения: $birthDay число \ $birthMonth месяц \ $birthYear год \n Ссылка фото для удостоверения личности: http://online-zaim.kz/files/$f \n 
 ";

/* А эта функция как раз занимается отправкой письма на указанный вами email */
$sub='Заказ'; //сабж
$email='Заказ <podbor.ru>'; // от кого
/* $send = mail ($address,$sub,$mes,"Content-type:text/plain; charset = utf-8\r\nFrom:$email");  */

 $send = mail ($address,$sub,$mes,"Content-type:text/plain; charset = utf-8\r\nFrom:$email");

    $n = array("response" => "ok");  
    echo json_encode($n);
 ?>   