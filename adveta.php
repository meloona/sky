<html>
<body>
<?php
$con = mysql_connect("localhost","root","1234");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
mysql_select_db("dbasex", $con);
$sql="CREATE TABLE adver
(
Category varchar(20),
message varchar(20),
city varchar(20),
phone int,
image Blob
)";
mysql_query($sql,$con);
mysql_close($con);
?>
</body>
</html>