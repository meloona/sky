<html>
<body>
<?php

   mysql_connect('localhost','root','1234');
	mysql_select_db("dbasex");
    $name=$_POST['name'];
	$address=$_POST['Email'];
	$q1=$_POST['gender'];
	$q2=$_POST['gend'];
    $q3=$_POST['gen'];

	
	$query="INSERT INTO feedback VALUES('$name','$address','$q1','$q2','$q3')";
	$result=mysql_query($query);
	if($result) 
	{
        
echo '<script type="text/javascript">';
echo ' alert("Thank you for your Feedback");';
echo 'window.location.href = "index.php";';
echo '</script>';		
    }
	
	else
{
	echo "<b> ERROR:unable to submit the details.</b>";
	}
	?>
	
	</body>
	</html>
	