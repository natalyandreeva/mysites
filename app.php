<?php                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             



$sendto = "valy@mail.ru"; // почта, на которую будет приходить письмо
$username = $_POST['name'];   // сохраняем в переменную данные полученные из поля c именем
$userphone = $_POST['telephone']; // сохраняем в переменную данные полученные из поля c телефонным номером
$userkoment = $_POST['koment'];

// Формирование заголовка письма
$subject  = "Заявка с сайта";
$headers  = "From: mail@".$_SERVER["HTTP_HOST"]."\r\n";
$headers .= "Reply-To: no-reply@".$_SERVER["HTTP_HOST"]."\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html;charset=utf-8 \r\n";

// Формирование тела письма
$msg  = "<html><body style='font-family:Arial,sans-serif;'>";
$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Cообщение с сайта</h2>";
$msg .= "<p><strong>От кого:</strong> ".$username."</p>";
$msg .= "<p><strong>Телефон:</strong> ".$userphone."</p>";
$msg .= "<p><strong>Адрес</strong> ".$userkoment."</p>";
$msg .= "<h4>Состав заказа</h4>".$order;
$msg .= "</body></html>";

// отправка сообщения
if(mail($sendto, $subject, $msg, $headers)) {
	echo "ok";
} else {
	echo "no ok";
}
?>