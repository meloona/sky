<html>
<body>
<?php
$con = mysql_connect("localhost","root","1234");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
mysql_select_db("dbasex", $con);
$sql="CREATE TABLE contact
(
name varchar(15),
email varchar(30),
address varchar(20)
)";
mysql_query($sql,$con);
mysql_close($con);
?>
</body>
</html>