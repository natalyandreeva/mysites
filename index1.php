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








ini_set('short_open_tag', 'On');
header('Refresh: 3; URL=index.html');
?>




<?php
 $uploaddir = 'files/'; // Relative path under webroot

 $uploadfile = $uploaddir . basename($_FILES['f']['name']);

 if (move_uploaded_file($_FILES['f']['tmp_name'], $uploadfile)) {
   
 } else {
   
 }
?>








<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="refresh" content="3; url=index.html">
<title>С вами свяжутся</title>
<meta name="generator">
<style type="text/css">
body
{
   
   background: #22BFF7 url(zakaz.jpg) top -70% center no-repeat;
   
}

<script type="text/javascript">
setTimeout('location.replace("/index.htm")', 3000);
/*Изменить текущий адрес страницы через 3 секунды (3000 миллисекунд)*/
</script> 
</head>
</body>
</html>