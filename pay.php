<html>
<body>
<?php

include('conn.php');
$tbl_name="pay"; // Table name 
 mysql_connect("$host", "$username", "$password")or die("cannot connect"); 
		    mysql_select_db("$db_name")or die("cannot select DB");
		    $conM = mysql_connect("$host", "$username", "$password");

			$card=$_POST['cardno'];
	        $date=$_POST['cardexpirymonth'].$_POST['cardexpiryyear'];
	        $code=$_POST['cardsecurecode'];
			
$query="INSERT INTO $tbl_name VALUES('$card','$date','$code')";
	$result=mysql_query($query);
	if($result) 
	{
        
		echo '<script type="text/javascript">';
        echo ' alert("Your product will deliver to you after 24 hours from now");';
        echo 'window.location.href = "index.php";';
        echo '</script>';		
		
    }
	
	else 
	{
	echo '<script type="text/javascript">';
        echo ' alert("ERROR:unable to submit the details.");';
        echo '</script>';
	}

	?>
	</body>
	</html>