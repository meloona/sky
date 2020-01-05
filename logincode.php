
<html>
	<body>
		<?php
		
		include('conn.php');
		$tbl_name="tblUsers"; // Table name 

		// Connect to server and select databse.
		mysql_connect("$host", "$username", "$password")or die("cannot connect"); 
		mysql_select_db("$db_name")or die("cannot select DB");
		$con = mysql_connect("$host", "$username", "$password");
		// username and password sent from form 
		$myusername=$_POST['user'];
		$mypassword=$_POST['pass']; 
		//echo " user name is ".$myusername."<br>"."Password is ".$mypassword."<br>";
		 

		// To protect MySQL injection (more detail about MySQL injection)
		/*$myusername = stripslashes($myusername);
        $mypassword = stripslashes($mypassword);
        $myusername = mysql_real_escape_string($myusername);
        $mypassword = mysql_real_escape_string($mypassword);*/
		$sql="SELECT * FROM $tbl_name WHERE username='$myusername' and  password='$mypassword'";
		 $result=mysql_query($sql,$con);
		//print $result;

		// Mysql_num_row is counting table row
		$count=mysql_num_rows($result);
		//echo "Number of rows returned is ".$count."<br>"."<br>";

		


// If result matched $myusername and $mypassword, table row must be 1 row
if($count!=0){

// Register $myusername, $mypassword and redirect to file "login_success.php"
$_SESSION["UserName"] = $myusername;
header("location:Offer.php");
}
else {

echo '<script type="text/javascript">';
echo ' alert("Wrong username or password press OK to Re_login");';
echo 'window.location.href = "index.php";';
echo '</script>';

}
		?>
</body>
</html>