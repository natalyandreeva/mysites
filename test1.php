<?php
$dbh = mysqli_connect('localhost', 'extrasho_k2', '1+2+3+4+5+6');

	mysqli_select_db($dbh,"extrasho_k2");
	$query = "SELECT * from kisya_virtuemart_products_ru_ru where product_name=''";

$result = mysqli_query($dbh, $query);
while($row = $result->fetch_array()) {
	print_r($row);
        $id =  $row["virtuemart_product_id"];
       /* $query1 = "DELETE FROM kisya_virtuemart_products_ru_ru where virtuemart_product_id='$id'";
        $result = mysqli_query($dbh, $query1);*/
        echo ($id);
        echo ("<br />");
        $query2 = "DELETE FROM kisya_virtuemart_products where virtuemart_product_id='$id'";
        $result2 = mysqli_query($dbh, $query2);

        $query3 = "DELETE FROM kisya_virtuemart_products_en_gb where virtuemart_product_id='$id'";
        $result3 = mysqli_query($dbh, $query3);

        $query4 = "DELETE FROM kisya_virtuemart_product_categories where virtuemart_product_id='$id'";
        $result4 = mysqli_query($dbh, $query4);

        $query5 = "DELETE FROM kisya_virtuemart_product_customfields where virtuemart_product_id='$id'";
        $result5 = mysqli_query($dbh, $query5);
        $query6 = "DELETE FROM kisya_virtuemart_product_manufacturers where virtuemart_product_id='$id'";
        $result6 = mysqli_query($dbh, $query6);
        $query7 = "DELETE FROM kisya_virtuemart_product_medias where virtuemart_product_id='$id'";
        $result7 = mysqli_query($dbh, $query7);

        $query8 = "DELETE FROM kisya_virtuemart_product_prices where virtuemart_product_id='$id'";
        $result8 = mysqli_query($dbh, $query8);
        $query9 = "DELETE FROM kisya_virtuemart_product_relations where virtuemart_product_id='$id'";
        $result9 = mysqli_query($dbh, $query9);
         $query10 = "DELETE FROM kisya_virtuemart_product_shoppergroups where virtuemart_product_id='$id'";
        $result10 = mysqli_query($dbh, $query10);
        
       $query11 = "DELETE FROM kisya_virtuemart_products_ru_ru where virtuemart_product_id='$id'";
        $result1 = mysqli_query($dbh, $query11);
 

    }


?>