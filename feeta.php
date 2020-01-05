<html>
<body>
<?php
$con = mysql_connect("localhost","root","1234");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
mysql_select_db("dbasex", $con);
$sql="CREATE TABLE feedback
(
Name varchar(20),
Address varchar(20),
Q1 varchar(50),
Q2 varchar(50),
Q3 varchar(50)
)";
mysql_query($sql,$con);
mysql_close($con);
?>
</body>
</html>