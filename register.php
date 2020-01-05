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
       <link rel="stylesheet" type="text/css" href="ph.css"/>


	   <script language="javascript" type="text/javascript">

function formvalidation()
{
var username=document.forms["Registration"]["username"].value;
if (username=="")
  {
  alert("Please, enter username details");
  return false;
  }
var email=document.forms["Registration"]["email"].value;
if (email=="")
  {
  alert("Please, enter email address details");
  return false;
  }
  
 var phone=Registration.phone.value;
if(phone=="")
 {
  alert("Please, enter phone number details");
  return false;
  }
else
if(phone.length < 8)
{
returnvalue=false;
alert("Your phone number should be = 8 number , please try again.");
Registration.phone.value="";
return returnvalue;
}
else
if(phone.length > 8)
{
returnvalue=false;
alert("Your phone number should be = 8 number , please try again.");
Registration.phone.value="";
return returnvalue;
}
var location=document.forms["Registration"]["location"].value;
if (location=="")
  {
  alert("Please, enter city details");
  return false;
  }
var pass=Registration.pass.value;
if(pass=="")
 {
  alert("Please, enter password details");
  return false;
  }
else
if(pass.length < 6)
{
returnvalue=false;
alert("Your password should be = 6 character , please try again.");
Registration.pass.value="";
return returnvalue;
}

else
if(pass.length > 6)
{
returnvalue=false;
alert("Your password should be = 6 character , please try again.");
Registration.pass.value="";
return returnvalue;
}
else 
if (Registration.pass.value!=Registration.password.value)
{
alert ("Password and confirm password does not match");
Registration.password.focus();
return (false);
}
  
else
return true;
}

</script> 
	   
	   <link rel="stylesheet" type="text/css" href="ph.css"></link>

	


<br>
<font size="3">
<br>
<center><font face="serif" size="10px"> 
<b><script>
var text="REGISTRATION" // YOUR TEXT
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
<center>
<form name="Registration" method="post" action="registrationcode.php" onSubmit="return formvalidation();">

<table align="right" height="400" width="650"><tr><td><fieldset><legend align="top"> Registration details </legend>
<table>
<tr><td> Username:</td>
<td><input type="text" size="15" name="username" maxlength="20"/></td></tr>
<tr><td> Email address:</td>
<td><input type="text" name="email" size="15" maxlength="30"/></td></tr>
<tr><td> Phone number:</td>
<td> <input type="text" size="15" name="phone" maxlength="33" value="(+968)"/></td></tr>
<tr><td> Customer City:</td>
<td> <input type="text" size="15" name="location" maxlength="33"/></td></tr>
<tr>
<td>Gender:</td>
<td> <input type="radio" name="gndr" value="M" >Male<input type="radio" name="gndr" value="F">Female
</td>
</tr>
		
		<tr>
 <td width="25%"> Date of Birth</td>
        <td height="2" colspan="2">
          <select name=birth_month>
            <option selected value=1>January
            <option value=2> February
            <option value=3>March
            <option value=4>April
            <option value=5>May
            <option value=6>June
            <option value=7>July
            <option value=8>August
            <option value=9>September
            <option value=10>October
            <option value=11>November
            <option value=12>December
      </select>
      <select name=birth_day>
            <option selected value=1>01
            <option value=2>02
            <option value=3>03
            <option value=4>04
            <option value=5>05
            <option value=6>06
            <option value=7>07
            <option value=8>08
            <option value=9>09
            <option value=10>10
            <option value=11>11
            <option value=12>12
            <option value=13>13
            <option value=14>14
            <option value=15>15
            <option value=16>16
            <option value=17>17
            <option value=18>18
            <option value=19>19
            <option value=20>20
            <option value=21>21
            <option value=22>22
            <option value=23>23
            <option value=24>24
            <option value=25>25
            <option value=26>26
            <option value=27>27
            <option value=28>28
            <option value=29>29
            <option value=30>30
            <option value=31>31</option>
          </select>
          <input maxlength=4 name=birth_year size=4>
             (Year)</td>
      </tr>
 <tr><td> Password:</td>
<td><input type="password" name="pass" size="15" maxlength="15"/></td></tr>
<tr><td> Confirm Password:</td>
<td> <input type="password" name="password"  size="15" maxlength="15"/></td></tr>
<br/>
</tr></form></table></td></fieldset></center>
  
<tr><td align="center"><input type="submit" value="Submit" onClick="return formvalidation();"/>    
<input type="reset" value="cancel"/></td></tr>
</table>
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
</form>
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
