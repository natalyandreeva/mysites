<?php
 /* Здесь проверяется существование переменных */
if (isset($_POST['comments'])) {$comments= $_POST['comments'];}  
if (isset($_POST['phone'])) {$phone = $_POST['phone'];}
if (isset($_POST['email'])) {$email= $_POST['email'];}
if (isset($_POST['ppri'])) {$ppri= $_POST['ppri'];}
if (isset($_POST['address'])) {$address= $_POST['address'];}
 

/* Сюда впишите свою эл. почту */
 //$address = "free.creditor52@mail.ru";
$address = "nataly.andreeva@gmail.com";

/* А здесь прописывается текст сообщения, \n - перенос строки */
 $mes = "Служба техподдержки creditor52!\nСообщение от клиента: $comments\nПричина обращения: $ppri\nТелефон: $phone\nE-mail: $email";

/* А эта функция как раз занимается отправкой письма на указанный вами email */
$sub='Заказ'; //сабж
$email='Заказ <45646>'; // от кого
 $send = mail ($address,$sub,$mes,"Content-type:text/plain; charset = utf-8\r\nFrom:$email");

ini_set('short_open_tag', 'On');
header('Refresh: 3; URL=index.html');
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
setTimeout('location.replace("/index.html")', 3000);
/*Изменить текущий адрес страницы через 3 секунды (3000 миллисекунд)*/
</script> 
</head>
</body>
</html>