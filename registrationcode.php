<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>

<body>
<?php

	mysql_connect('ftp.gear.host','skystore\$skystore','K5RgAC5lrxX1z3EXbJSfPn7ioWd5drcvmbjwp9izCqEgNxzmGENuBF4sQFDm');
	mysql_select_db("dbsky","Uo6fzhg-t3D_");
	$username=$_POST['username'];
	$email=$_POST['email'];
	$phone=$_POST['phone'];
	$location=$_POST['location'];
	$Gender=$_POST['gndr'];
	$dob=$_POST['birth_month'].$_POST['birth_day'].$_POST['birth_year'];
	$password=$_POST['pass'];
	
	$query="INSERT INTO tblusers VALUES(UserID,'$username','$email','$phone','$location','$Gender','$dob','$password')";
	
	$result=mysql_query($query);
	if($result) 
	{
		echo '<script type="text/javascript">';
echo ' alert("Thank you for your Register in our websit");';
echo 'window.location.href = "index.php";';
echo '</script>';	
		
    }
	
	else echo "<b> ERROR:unable to submit the details.</b>";
   
	?>   
</body>
</html>
