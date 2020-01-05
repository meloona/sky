<?php
$con = mysql_connect("localhost","root","1234");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

// Create database
if (mysql_query("CREATE DATABASE dbasex",$con))
  {
  echo "Database created";
  }
else
  {
  echo "Error creating database: " . mysql_error();
  }

// Create table
mysql_select_db("dbasex", $con);
$sql="CREATE TABLE login
(
username varchar(15),
email varchar(30),
phone varchar(8),
location varchar(30),
Gender char(1),
DateOfBirth date,
password varchar(30)
)";

mysql_query($sql,$con);
mysql_close($con);
?> 
