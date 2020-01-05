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
	
	<SCRIPT LANGUAGE="JavaScript"> 



<!-- Begin 
function initArray() { 
for (var i = 0; i < initArray.arguments.length; i++) { 
this[i] = initArray.arguments[i]; 
} 
this.length = initArray.arguments.length; 
} 
var colors = new initArray( 
"red", 
"blue", 
"green", 
"purple", 
"black", 
"tan", 
"red"); 
delay = .5; // seconds 
link = 0; 
vlink = 2; 
function linkDance() { 
link = (link+1)%colors.length; 
vlink = (vlink+1)%colors.length; 
document.linkColor = colors[link]; 
document.vlinkColor = colors[vlink]; 
setTimeout("linkDance()",delay*1000); 
} 
linkDance(); 
// End --> 
</script>


<font size="3">
<br>
<center><font face="serif" size="10px"> 
<b><script>
var text="FEEDBACK" // YOUR TEXT
var speed=80 // SPEED OF FADE

// ********** LEAVE THE NEXT BIT ALONE!


if (document.all||document.getElementById){
document.write('<span id="highlight">' + text + '</span>')
var storetext=document.getElementById? document.getElementById("highlight") : document.all.highlight
}
else
document.write(text)
var hex=new Array("00","14","28","3C","50","64","78","8C","A0","B4","C8","DC","F0")
var r=1
var g=1
var b=1
var seq=1
function changetext(){
rainbow="#"+hex[r]+hex[g]+hex[b]
storetext.style.color=rainbow
}
function change(){
if (seq==6){
b--
if (b==0)
seq=1
}
if (seq==5){
r++
if (r==12)
seq=6
}
if (seq==4){
g--
if (g==0)
seq=5
}
if (seq==3){
b++
if (b==12)
seq=4
}
if (seq==2){
r--
if (r==0)
seq=3
}
if (seq==1){
g++
if (g==12)
seq=2
}
changetext()
}
function starteffect(){
if (document.all||document.getElementById)
flash=setInterval("change()",speed)
}
starteffect()
</script></div></div><h1>
</font>

<br>
<form name="feedback" method="post" action="feda.php" onSubmit="return formvalidation();">

<table align="right" height="400" width="650"><tr><td><fieldset><legend align="top"> Feedback details </legend>
<table>
<tr><td> 1.Name:</td></tr>
<tr>
<td><input type="text" size="25" name="name" maxlength="20"/></td></tr>
<tr><td> 2.Email address:</td></tr>
<tr>
<td colspan="2" valign="top"><label>
          <input size="25" name="Email" type="text" id="Email" />
         
        </td></tr>
		<tr><td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp </td></tr>
<tr><td> 3.how well does our website meet your needs?</td></tr>
<tr><td><input type="radio" name="gender" value=" Extremely well"> Extremely well
<input type="radio" name="gender" value=" very well"> very well
<input type="radio" name="gender" value="  Somewhat well">  Somewhat well
<input type="radio" name="gender" value=" Not so well"> Not so well</td></tr>
<tr><td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp </td></tr>
<tr><td>4.How easy was it to find what you were looking for on our website?</td></tr>
<tr>
<td><input type="radio" name="gend" value=" Extremely easy"> Extremely easy
<input type="radio" name="gend" value=" very easy"> very easy
<input type="radio" name="gend" value="  Somewhat easy">  Somewhat easy
<input type="radio" name="gend" value=" Not so easy"> Not so easy</td></tr>
<tr><td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp </td></tr>
<tr><td>5.Did it take you more or less time than you expected to find what you were looking for on our website?</td></tr>
<tr>
<td><input type="radio" name="gen" value="A lot less time">A lot less time
<input type="radio" name="gen" value=" A little less time"> A little less time<br>
<input type="radio" name="gen" value="About what I expected">About what I expected
<input type="radio" name="gen" value="  A little more time">  A little more time</td><tr>


        
            


        </div>

    
    

        

       
    </div>

 </td></tr>
<br/>
</table>
</fieldset></td></tr>
  <input type="hidden" name="bb" value=<? echo $word ?>>
<tr><td align="center"><input type="submit" value="Submit" name="Submit" />    
<input type="reset" value="cancel"/></td></tr>
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
 </table>

<br>
<br>
</form>
<br>
<br>
<br>
<br>
 
<p style="text-align:right; float:right;cursor:pointer;margin-right:20px;">

<a name="ToDown"></a>
</p>


</font>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
	
	
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
