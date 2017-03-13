<?php

 /* Здесь проверяется существование переменных */
/*if (isset($_POST['comments'])) {$comments= $_POST['comments'];}  
if (isset($_POST['mobilePhone'])) {$phone = $_POST['mobilePhone'];}
if (isset($_POST['email'])) {$email= $_POST['email'];}
if (isset($_POST['subject'])) {$ppri= $_POST['subject'];}
if (isset($_POST['address'])) {$address= $_POST['address'];}
 
*/
/* Сюда впишите свою эл. почту */
 //$address = "free.creditor52@mail.ru";
$address = "nataly.andreeva@gmail.com";

/* А здесь прописывается текст сообщения, \n - перенос строки */
// $mes = "Служба техподдержки creditor52!\nСообщение от клиента: $comments\nПричина обращения: $ppri\nТелефон: $phone\nE-mail: $email";

/* А эта функция как раз занимается отправкой письма на указанный вами email */
$sub='Заказ'; //сабж
//$email='Заказ <45646>'; // от кого
//$send = mail ($address,$sub,$mes,"Content-type:text/plain; charset = utf-8\r\nFrom:$email");
$email = "anakonda1210@gmail.com";
$from="nataly.andreevaa@gmail.com";
if ($email) {
$to = $email;
$email_template = "../emails/support.html";
$headers = "From: $from\nReply-To: $from\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"";
$boundary = "------------".strtoupper(md5(uniqid(rand())));
$body = $boundary . "\n";
$body .= "Content-type: text/html; charset='utf-8'\n";
    $body .= "Content-Transfer-Encoding: quoted-printablenn";
    $body .= "--$boundary\n";
    $file = fopen($email_template, "r"); //Открываем файл
    $text = fread($file, filesize($email_template)); //Считываем весь файл
    fclose($file); //Закрываем файл
   
    $body .= chunk_split(base64_encode($text))."\n";
    $body .= "--".$boundary ."--\n";
    echo mail($to, $subject, $body, $headers); //Отправляем письмо
   
}

 /*   $n = array("response" => "ok");  
    echo json_encode($n);*/
    
?>
