<?php

if (isset($_POST['country'])) {$country= $_POST['country'];}
if (isset($_POST['sum'])) {$sum= $_POST['sum'];}  
if (isset($_POST['income'])) {$income_ru= $_POST['income'];}
if (isset($_POST['marja'])) {$marja= $_POST['marja'];}
if (isset($_POST['srok'])) {$srok= $_POST['srok'];}


if ($country == 'kz') {
	$currency = " тенге";
	$rate = 0.12;
} else {
	$currency = " рублей";
	$rate = 0.15;
}

$don = $sum*$marja + $sum;


$month_rate = ($rate/12);

$k = ($month_rate * pow((1 + $month_rate), $srok)) / ( pow((1 + $month_rate), $srok) - 1  );
$plat = round($k * $don, 0);

$plat3 = $plat * 3;

$itogo = $plat*$srok;

if ($country == 'kz') {
	$currency = " тенге";
} else {
	$currency = " рублей";
}
$sum = $sum.$currency;
$marja = $marja*100;
$srok2 = $srok - 2;

$months_array = array(2,3,4);

if (in_array($srok, $months_array)) {
    $srok = $srok." месяца";
} else {
	$srok = $srok." месяцев";
}

if (in_array($srok2, $months_array)) {
    $srok2 = $srok2." месяца";
} else {
    $srok2 = $srok2." месяцев";
}    
$sum2 = $plat3*2;
$sum3=$sum-$sum2;
$k = ($month_rate * pow((1 + $month_rate), $srok2)) / ( pow((1 + $month_rate), $srok2) - 1  );
$plat_new = round($k * $sum3, 0);
$itogo_new=$sum2 + $plat_new * $srok2;

$day_rate = $rate/360;
$k = ($day_rate * pow((1 + $day_rate), $srok*30)) / ( pow((1 + $day_rate), $srok*30) - 1  );
$plat_oneday = round($k * $don, 0);
$plat_oneday2 = $don / ($srok*30);
$oneday = round($plat_oneday - $plat_oneday2);

$res = array (
	'sum' => $sum.$currency,
	'marja' => $marja."%",
	'srok' => $srok,
	'don' => $don.$currency,
	'plat' => $plat.$currency,
	'itogo' => $itogo.$currency,
	'plat3' => $plat3.$currency,
	'srok2' => $srok2,
	'plat_new' => $plat_new.$currency,
	'itogo_new' => $itogo_new.$currency,
    'oneday' => $oneday.$currency,
	);

echo json_encode($res);
?>