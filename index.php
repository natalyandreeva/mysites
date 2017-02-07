<?php
 /* Здесь проверяется существование переменных */
if (isset($_POST['subject'])) {$subject= $_POST['subject'];}
if (isset($_POST['phone'])) {$phone= $_POST['phone'];}
if (isset($_POST['email'])) {$email= $_POST['email'];}  
if (isset($_POST['name'])) {$name = $_POST['name'];}
if (isset($_POST['comments'])) {$comments= $_POST['comments'];}


/* Сюда впишите свою эл. почту */
 $address = "info.2002info@mail.ru";

/* А здесь прописывается текст сообщения, \n - перенос строки */
 $mes = "Тема: Заказ обратного звонка!\nПричина обращения: $subject\nТелефон: $phone\nE-mail: $email\nИмя: $name\\nСообщение клиента: $comments";

/* А эта функция как раз занимается отправкой письма на указанный вами email */
$sub='Заказ'; //сабж
$email='Заказ <podbor.ru>'; // от кого
 $send = mail ($address,$sub,$mes,"Content-type:text/plain; charset = utf-8\r\nFrom:$email");

ini_set('short_open_tag', 'On');
header('Refresh: 3; URL=index.htm');
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="refresh" content="3; url=index.htm">
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