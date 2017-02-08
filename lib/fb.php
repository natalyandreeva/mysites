<?php

 /* Здесь проверяется существование переменных */
if (isset($_POST['comments'])) {$comments= $_POST['comments'];}  
if (isset($_POST['mobilePhone'])) {$phone = $_POST['mobilePhone'];}
if (isset($_POST['email'])) {$email= $_POST['email'];}
if (isset($_POST['subject'])) {$ppri= $_POST['subject'];}
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

    $n = array("response" => "ok");  
    echo json_encode($n);
    
?>
