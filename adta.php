<html>
<body>
<?php

   mysql_connect('localhost','root','1234');
	mysql_select_db("dbasex");
    $category=$_POST['cf'];
	$message=$_POST['txtdescribe'];
	$city=$_POST['city'];
	$phone=$_POST['phone'];
    $image=$_POST['pic'];

	
	$query="INSERT INTO adver VALUES('$category','$message','$city','$phone','$image')";
	$result=mysql_query($query);
	if($result) 
	{
        
		header('Location:index.html');
		
    }
	
	else echo "<b> ERROR:unable to submit the details.</b>";
	?>
	
	</body>
	</html>
	