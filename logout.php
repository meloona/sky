<?php session_start(); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><!-- InstanceBegin template="/Templates/tmp.dwt" codeOutsideHTMLIsLocked="false" -->
<head>
<!-- InstanceBeginEditable name="doctitle" -->
<title>Home page</title>
<!-- InstanceEndEditable -->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="style.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="stylesheet/styles.css" />
<script language="javascript" type="text/javascript">
function clearText(field) {
    if (field.defaultValue == field.value) field.value = '';
    else if (field.value == '') field.value = field.defaultValue;
}
</script>
<script language="javascript" type="text/javascript" src="scripts/mootools-1.2.1-core.js"></script>
<script language="javascript" type="text/javascript" src="scripts/mootools-1.2-more.js"></script>
<script language="javascript" type="text/javascript" src="scripts/slideitmoo-1.1.js"></script>
<script language="javascript" type="text/javascript">
window.addEvents({
    'domready': function () { /* thumbnails example , div containers */
        new SlideItMoo({
            overallContainer: 'SlideItMoo_outer',
            elementScrolled: 'SlideItMoo_inner',
            thumbsContainer: 'SlideItMoo_items',
            itemsVisible: 5,
            elemsSlide: 3,
            duration: 200,
            itemsSelector: '.SlideItMoo_element',
            itemWidth: 140,
            showControls: 1
        });
    },

});
</script>
<!-- InstanceBeginEditable name="head" -->
<!-- InstanceEndEditable -->
</head>
<body>
<?php
include('conn.php');
   if(isset($_SESSION['UserName'])){
   $CartQ = 0;
   $UserID = $_SESSION['UserID'];
   //echo $UserID;
			$tbl_name="tblcart"; // Table name 
		    mysql_connect("$host", "$username", "$password")or die("cannot connect"); 
		    mysql_select_db("$db_name")or die("cannot select DB");
		    $conM = mysql_connect("$host", "$username", "$password");
		    if(isset($_SESSION['ProID'])){
            $ProID = $_SESSION['ProID'];
            }else{
            $ProID = 0;
            }
            //echo $_SESSION['ProID'];
			$sqlM="SELECT * FROM $tbl_name WHERE UserID = '$UserID'";
            //echo $sqlM;
		    $resultM=mysql_query($sqlM,$conM);
			$countM=mysql_num_rows($resultM);
            $rowM = mysql_fetch_array($resultM);
            if ($countM!=0){
            $CartQ = $countM;
            }
            }else{
            $CartQ = 0;
            }
           
?>
<div id="wrapper">
  <div id="menu">
    <ul>
      
    </ul>
  </div>
  <!-- end of menu -->
  <div id="header_bar">
  <div class="right"></div>
    <div id="header">
      
    <img src="images/self.jpg" alt=""width="200" height="90" /> 
    </div>
		
    <div align="right">
    <br />
     
         <img src="images/asd.png" alt=""width="100" height="90" /> <span class="cartQuy"><a href="details.php"><?php echo $CartQ; ?></span>
</a>
		
		
    </div>
  </div>
  <!-- end of header_bar -->
  <div class="cleaner"></div>
  <div id="sidebar">
    <div class="sidebar_top"></div>
    <div class="sidebar_bottom"></div>
    <div class="sidebar_section">
    <?php if(!isset($_SESSION['UserName'])){?>
    <!--<div id="loginformdiv">-->
      <h2>Members login:</h2>
	  <p><b>Please login to visit offers page:</b></p>
      <form action="logincodeN.php" method="post">
        <label>Username</label>
        <input type="text" value="" name="user" size="10" class="input_field" required />
        <label>Password</label>
        <input type="password" value="" name="pass" class="input_field" required />
        <a href="register.php">Register</a>
        <input type="submit" name="login" value="Login" alt="Login" id="submit_btn" />
      </form>
      <!--</div>-->
      <?php }else{ 
      
      ?>
      <h2>Welcome </h2>
	  <p><b><?php echo $_SESSION['UserName']." "; ?><br />
      <a href="logout.php">LogOut</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="details.php">
      <img src="images/Cart1.png" width='60' height='50' /><span class="cartQuy"><?php echo $CartQ; ?></span></a></b></p>
      <?php } ?>
      
      <div class="cleaner"></div>
    </div>
    <div class="sidebar_section">
      <h2>Categories</h2>
      <ul class="categories_list">
      <li class="current"><a href="abaia.php">Abaya</a></li>
        <li class="current"><a href="clothes.php">clothes</a></li>
         <li class="current"><a href="hena.php">Hena</a></li>
        <li class="current"><a href="jwm.php">jewellery for man</a></li>
		<li class="current"><a href="jww.php">jewellery for woman</a></li>
        <li class="current"><a href="parties.php">Parties</a></li>
       </ul>
    </div>
    <div class="sidebar_section">
      <h2>Discounts</h2>
      <div class="image_wrapper"><img src="images/h7.jpg" alt="" width="200" height="150"/></div>
      <div class="discount"><span>25% off</span> | <a href="index.php" onclick="myFunction()">Read more</a></div>
    </div>
  </div>
  <!-- end of sidebar -->
  <div id="content">
    <div id="latest_product_gallery">
      <h2>Feature Products</h2>
      <div id="SlideItMoo_outer">
        <div id="SlideItMoo_inner">
        <marquee behavior="alternate" direction="left" >
         <div id="SlideItMoo_items">
           <div class="SlideItMoo_element"> <a href="#"> <img src="images/2.jpg" alt="" width="100" height="100"/></a> </div>
            <div class="SlideItMoo_element"> <a href="#"> <img src="images/as.jpg" alt="" width="100" height="100"/></a> </div>
            <div class="SlideItMoo_element"> <a href="#"> <img src="images/b1.jpg" alt="" width="100" height="100"/></a> </div>
            <div class="SlideItMoo_element"> <a href="#"> <img src="images/b6.jpg" alt="" width="100" height="100"/></a> </div>
            <div class="SlideItMoo_element"> <a href="#"> <img src="images/f2.jpg" alt="" width="100" height="100"/></a> </div>
            <div class="SlideItMoo_element"> <a href="#"> <img src="images/sq1.jpg" alt="" width="100" height="100"/></a> </div>
            <div class="SlideItMoo_element"> <a href="#"> <img src="images/x.jpg" alt="" width="100" height="100"/></a> </div>
            <div class="SlideItMoo_element"> <a href="#"> <img src="images/a.jpg" alt="" width="100" height="100"/></a> </div>
          </div>
          </marquee>
        </div>
      </div>
    </div>
    <!-- end of latest_content_gallery -->
    <div class="content_section">
    <!-- InstanceBeginEditable name="EditRegion1" -->
<?php
  ob_start();
   unset($_SESSION["UserName"]);
   //header('Location:index.php');
   echo "<meta http-equiv='Refresh' content='0; url=index.php'>";
   ob_end_flush();
?>
	<!-- InstanceEndEditable -->

 <script>
function myFunction() {
alert("offers page is a special page for user who register in our website. It is include the product with discount");
}
</script>
 </font>
    </div>
	<br>
	<br>
    <br>
	<br>
	<br>
	<br>
	<br>
	<br>
	<br>
    <br>
	<br>
	<br>
    <br>
	<br>
  </div>
  <!-- end of content -->
</div>
<!-- end of wrapper -->
<div id="footer_wrapper">
  <div id="footer">
    <ul class="footer_menu">
      <li class="current"><a href="index.php">Home</a></li>
       <li class="current"><a href="feedback.php">feedback</a></li>
      <li class="current"><a href="contact.php">Contact</a></li>
    </ul>
   AL Musanna, Oman, IT Advance Diploma students
@2016  Oman sky 4 e-marketing.com &copy
</div>
  <!-- end of footer -->
  <!-- ===========================
    SOCIAL ICONS
    =========================== -->
    <div class="sticky-container">
		<ul class="sticky">
			<li>
				<a href="https://www.facebook.com/omansky">
                    <img title="" alt="" src="img/facebook.svg" />
                    <p>Facebook</p>
				</a>
			</li>
			
			<li>
				<a href="https://twitter.com/omansky123">
                    <img title="" alt="" src="img/twitter.svg" />
                    <p>Twitter</p>
				</a>
			</li>
			
		
			
			<li>
			    <a href="https://www.instagram.com/oman.sky123">
                    <img title="" alt="" src="img/instagram.svg" />
                    <p>Instagram</p>
				</a>
			</li>

		</ul>
	</div>
    <!-- ===========================
    NECESSARY SCRIPTS
    =========================== --> 
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
    <script src="js/evenfly.js"></script>
    
    <script src="js/jquery.nicescroll.min.js"></script>
    <script src="js/wow.min.js"></script>
    <script src="js/snowstorm-min.js"></script>
    <script>new WOW().init();</script>    
</div>
<!-- end of footer_wrapper -->

</body>
<!-- InstanceEnd --></html>
