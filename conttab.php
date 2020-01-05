<html>
<body>
<?php

   mysql_connect('localhost','root','1234');
	mysql_select_db("dbasex");
    $name=$_POST['name'];
	$email=$_POST['email'];
	$message=$_POST['message'];
	
	$query="INSERT INTO contact VALUES('$name','$email','$message')";
	$result=mysql_query($query);
	if($result) 
	{
echo '<script type="text/javascript">';
echo ' alert("Thank you for contact with us");';
echo 'window.location.href = "index.php";';
echo '</script>';		
    }
	
	else echo "<b> ERROR:unable to submit the details.</b>";
	?>
	
	</body>
	</html>
	