<?php

 /* Здесь проверяется существование переменных */
if (isset($_POST['comments'])) {$comments= $_POST['comments'];}  
if (isset($_POST['mobilePhone'])) {$phone = $_POST['mobilePhone'];}
if (isset($_POST['email'])) {$email= $_POST['email'];}
if (isset($_POST['subject'])) {$ppri= $_POST['subject'];}
if (isset($_POST['address'])) {$address= $_POST['address'];}
 

/* Сюда впишите свою эл. почту */
$address = "free.credit@online-zaim.kz";
$to = $email;


/* А здесь прописывается текст сообщения, \n - перенос строки */
$mes = "Служба техподдержки creditor52!\nСообщение от клиента: $comments\nПричина обращения: $ppri\nТелефон: $phone\nE-mail: $email";

/* А эта функция как раз занимается отправкой письма на указанный вами email */
$sub='Заказ'; //сабж
$email='Заказ <45646>'; // от кого
$send = mail ($address,$sub,$mes,"Content-type:text/plain; charset = utf-8\r\nFrom:$email");

$from=$address;
$email_template = "../emails/podderjka.html";
$headers = "Content-type: text/html; charset=utf-8 \r\n";
$headers .= "From: $from"; 
$subject = "Ваше обращение в службу поддержки принято";
$file = fopen($email_template, "r"); //Открываем файл
if ($file) {
    $body = fread($file, filesize($email_template)); //Считываем весь файл
    fclose($file); //Закрываем файл
} else {
    $body = "Ваше обращение в службу поддержки принято!<br>Ни одно обращение не остаётся без ответа, а потому дублировать их НЕ нужно!<br>Ответ будет ОБЯЗАТЕЛЬНО дан до конца дня.<br>Любые вопросы и уведомления мы рекомендуем слать именно через обращения в службу поддержки (а не прямыми ответами на одно из наших писем) ибо только так Вы гарантировано получите ответ в максимально сжатые сроки от одного из доступных в момент обращения консультантов.<br>---<br><br><br>Спасибо, что обратились к нам!<br>- - -<br>С уважением, Андрей Владимирович<br>Руководитель службы поддержки<br>online-zaim.kz";
}

$send3 = mail($to, $subject, $body, $headers);

    $n = array("response" => "ok");  
    echo json_encode($n);
    
?>
