var Culture="English";
var Language = "English";

// -------------------------------- Date picker Functions ------------------------------


var datePickerDivID = "datepicker";
var iFrameDivID = "datepickeriframe";

var dayArrayShort = new Array('Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa');
var dayArrayMed = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
var dayArrayLong = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
var monthArrayShort = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
var monthArrayMed = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec');
var monthArrayLong = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
 
var defaultDateSeparator = "/";        // common values would be "/" or "."
var defaultDateFormat = "dmy"    // valid values are "mdy", "dmy", and "ymd"
var dateSeparator = defaultDateSeparator;
var dateFormat = defaultDateFormat;

function displayDatePicker(dateFieldName, displayBelowThisObject, dtFormat, dtSep)
{
//debugger;
//alert('under display datepicker'+dateFieldName);
  //var targetDateField = document.getElementsByName (dateFieldName).item(0);--Not supported in Mozilla/Safari
  var targetDateField = document.getElementById (dateFieldName);
  
  // if we weren't told what node to display the datepicker beneath, just display it
  // beneath the date field we're updating
  if (!displayBelowThisObject)
    displayBelowThisObject = targetDateField;
 
  // if a date separator character was given, update the dateSeparator variable
  if (dtSep)
    dateSeparator = dtSep;
  else
    dateSeparator = defaultDateSeparator;
 
  // if a date format was given, update the dateFormat variable
  if (dtFormat)
    dateFormat = dtFormat;
  else
    dateFormat = defaultDateFormat;
 
  var x = displayBelowThisObject.offsetLeft;
  var y = displayBelowThisObject.offsetTop + displayBelowThisObject.offsetHeight ;
 
  // deal with elements inside tables and such
  var parent = displayBelowThisObject;
  while (parent.offsetParent) {
    parent = parent.offsetParent;
    x += parent.offsetLeft;
    y += parent.offsetTop ;
  }
 
  drawDatePicker(targetDateField, x, y);
}


/**
Draw the datepicker object (which is just a table with calendar elements) at the
specified x and y coordinates, using the targetDateField object as the input tag
that will ultimately be populated with a date.

This function will normally be called by the displayDatePicker function.
*/
function drawDatePicker(targetDateField, x, y)
{
  var dt = getFieldDate(targetDateField.value );
 
  // the datepicker table will be drawn inside of a <div> with an ID defined by the
  // global datePickerDivID variable. If such a div doesn't yet exist on the HTML
  // document we're working with, add one.
  if (!document.getElementById(datePickerDivID)) {
    
    var newNode = document.createElement("div");
    newNode.setAttribute("id", datePickerDivID);
    newNode.setAttribute("class", "dpDiv");
    newNode.setAttribute("style", "visibility: hidden;");
    document.body.appendChild(newNode);
  }
 
  // move the datepicker div to the proper x,y coordinate and toggle the visiblity
  var pickerDiv = document.getElementById(datePickerDivID);
  pickerDiv.style.position = "absolute";
  pickerDiv.style.left = x + "px";
  pickerDiv.style.top = y + "px";
  pickerDiv.style.visibility = (pickerDiv.style.visibility == "visible" ? "hidden" : "visible");
  pickerDiv.style.display = (pickerDiv.style.display == "block" ? "none" : "block");
  pickerDiv.style.zIndex = 10000;
 
  // draw the datepicker table
  refreshDatePicker(targetDateField.id, dt.getFullYear(), dt.getMonth(), dt.getDate());
}


/**
This is the function that actually draws the datepicker calendar.
*/
function refreshDatePicker(dateFieldName, year, month, day)
{
  // if no arguments are passed, use today's date; otherwise, month and year
  // are required (if a day is passed, it will be highlighted later)
  var thisDay = new Date();
 
  if ((month >= 0) && (year > 0)) {
    thisDay = new Date(year, month, 1);
  } else {
    day = thisDay.getDate();
    thisDay.setDate(1);
  }
 
  // the calendar will be drawn as a table
  // you can customize the table elements with a global CSS style sheet,
  // or by hardcoding style and formatting elements below
  var crlf = "\r\n";
  var TABLE = "<table cols=7 class='dpTable'>" + crlf;
  var xTABLE = "</table>" + crlf;
  var TR = "<tr class='dpTR'>";
  var TR_title = "<tr class='dpTitleTR'>";
  var TR_days = "<tr class='dpDayTR'>";
  var TR_todaybutton = "<tr class='dpTodayButtonTR'>";
  var xTR = "</tr>" + crlf;
  var TD = "<td class='dpTD' onMouseOut='this.className=\"dpTD\";' onMouseOver=' this.className=\"dpTDHover\";' ";    // leave this tag open, because we'll be adding an onClick event
  var TD_title = "<td colspan=5 class='dpTitleTD'>";
  var TD_buttons = "<td class='dpButtonTD'>";
  var TD_todaybutton = "<td colspan=7 class='dpTodayButtonTD'>";
  var TD_days = "<td class='dpDayTD'>";
  var TD_selected = "<td class='dpDayHighlightTD' onMouseOut='this.className=\"dpDayHighlightTD\";' onMouseOver='this.className=\"dpTDHover\";' ";    // leave this tag open, because we'll be adding an onClick event
  var xTD = "</td>" + crlf;
  var DIV_title = "<div class='dpTitleText'>";
  var DIV_selected = "<div class='dpDayHighlight'>";
  var xDIV = "</div>";
 
  // start generating the code for the calendar table
  var html = TABLE;
 
  // this is the title bar, which displays the month and the buttons to
  // go back to a previous month or forward to the next month
  html += TR_title;
  html += TD_buttons + getButtonCode(dateFieldName, thisDay, -1, "&lt;") + xTD;
  html += TD_title + DIV_title + monthArrayLong[ thisDay.getMonth()] + " " + thisDay.getFullYear() + xDIV + xTD;
  html += TD_buttons + getButtonCode(dateFieldName, thisDay, 1, "&gt;") + xTD;
  html += xTR;
 
  // this is the row that indicates which day of the week we're on
  html += TR_days;
  for(i = 0; i < dayArrayShort.length; i++)
    html += TD_days + dayArrayShort[i] + xTD;
  html += xTR;
 
  // now we'll start populating the table with days of the month
  html += TR;
 
  // first, the leading blanks
  for (i = 0; i < thisDay.getDay(); i++)
    html += TD + "&nbsp;" + xTD;
 
  // now, the days of the month
  do {
    dayNum = thisDay.getDate();
    TD_onclick = " onclick=\"updateDateField('" + dateFieldName + "', '" + getDateString(thisDay) + "');\">";
    
    if (dayNum == day)
      html += TD_selected + TD_onclick + DIV_selected + dayNum + xDIV + xTD;
    else
      html += TD + TD_onclick + dayNum + xTD;
    
    // if this is a Saturday, start a new row
    if (thisDay.getDay() == 6)
      html += xTR + TR;
    
    // increment the day
    thisDay.setDate(thisDay.getDate() + 1);
  } while (thisDay.getDate() > 1)
 
  // fill in any trailing blanks
  if (thisDay.getDay() > 0) {
    for (i = 6; i > thisDay.getDay(); i--)
      html += TD + "&nbsp;" + xTD;
  }
  html += xTR;
 
  // add a button to allow the user to easily return to today, or close the calendar
  var today = new Date();
  var todayString = "Today is " + dayArrayMed[today.getDay()] + ", " + monthArrayMed[ today.getMonth()] + " " + today.getDate();
  html += TR_todaybutton + TD_todaybutton;
//  html += "<button class='dpTodayButton' onClick='refreshDatePicker(\"" + dateFieldName + "\");'>this month</button> ";
  html += "<button class='dpTodayButton' onClick='updateDateField(\"" + dateFieldName + "\");'>close</button>";
  html += xTD + xTR;
 
  // and finally, close the table
  html += xTABLE;
 
  document.getElementById(datePickerDivID).innerHTML = html;
  // add an "iFrame shim" to allow the datepicker to display above selection lists
  adjustiFrame();
}


/**
Convenience function for writing the code for the buttons that bring us back or forward
a month.
*/

// Function Confirm Mobile Account Delete

function ConfirmMobileDelete(ClientId)
{
   // var rowCount = ClientId.parentElement.parentElement.parentElement.children.length;
  
    var answer;
    var strClientId=ClientId.id;
    var endIndex=strClientId.indexOf("_GVMobileAccountList");
   
    var parentId=strClientId.substring(0,parseInt(endIndex));
    var cultureElement=document.getElementById(parentId+"_InputCultureName");
    
    if(cultureElement.value=="English")
    {
         
                answer=confirm("Are you sure you want to delete this Account number?");            
           
            return answer;
    }
    else if(cultureElement.value=="Arabic")
    {
          
                answer=confirm("هل انت متأكد من طلب إلغاء رقم العقد");
        
            return answer;            
    }
}



function getButtonCode(dateFieldName, dateVal, adjust, label)
{
  var newMonth = (dateVal.getMonth () + adjust) % 12;
  var newYear = dateVal.getFullYear() + parseInt((dateVal.getMonth() + adjust) / 12);
  if (newMonth < 0) {
    newMonth += 12;
    newYear += -1;
  }
 
  return "<button class='dpButton' onClick='refreshDatePicker(\"" + dateFieldName + "\", " + newYear + ", " + newMonth + ");'>" + label + "</button>";
}


/**
Convert a JavaScript Date object to a string, based on the dateFormat and dateSeparator
variables at the beginning of this script library.
*/
function getDateString(dateVal)
{
  var dayString = "00" + dateVal.getDate();
  var monthString = "00" + (dateVal.getMonth()+1);
  dayString = dayString.substring(dayString.length - 2);
  monthString = monthString.substring(monthString.length - 2);
 
  switch (dateFormat) {
    case "dmy" :
      return dayString + dateSeparator + monthString + dateSeparator + dateVal.getFullYear();
    case "ymd" :
      return dateVal.getFullYear() + dateSeparator + monthString + dateSeparator + dayString;
    case "mdy" :
    default :
      return monthString + dateSeparator + dayString + dateSeparator + dateVal.getFullYear();
  }
}


/**
Convert a string to a JavaScript Date object.
*/
function getFieldDate(dateString)
{
  var dateVal;
  var dArray;
  var d, m, y;
 
  try {
    dArray = splitDateString(dateString);
    if (dArray) {
      switch (dateFormat) {
        case "dmy" :
          d = parseInt(dArray[0], 10);
          m = parseInt(dArray[1], 10) - 1;
          y = parseInt(dArray[2], 10);
          break;
        case "ymd" :
          d = parseInt(dArray[2], 10);
          m = parseInt(dArray[1], 10) - 1;
          y = parseInt(dArray[0], 10);
          break;
        case "mdy" :
        default :
          d = parseInt(dArray[1], 10);
          m = parseInt(dArray[0], 10) - 1;
          y = parseInt(dArray[2], 10);
          break;
      }
      dateVal = new Date(y, m, d);
    } else if (dateString) {
      dateVal = new Date(dateString);
    } else {
      dateVal = new Date();
    }
  } catch(e) {
    dateVal = new Date();
  }
 
  return dateVal;
}


/**
Try to split a date string into an array of elements, using common date separators.
If the date is split, an array is returned; otherwise, we just return false.
*/
function splitDateString(dateString)
{
  var dArray;
  if (dateString.indexOf("/") >= 0)
    dArray = dateString.split("/");
  else if (dateString.indexOf(".") >= 0)
    dArray = dateString.split(".");
  else if (dateString.indexOf("-") >= 0)
    dArray = dateString.split("-");
  else if (dateString.indexOf("\\") >= 0)
    dArray = dateString.split("\\");
  else
    dArray = false;
 
  return dArray;
}

/**
Update the field with the given dateFieldName with the dateString that has been passed,
and hide the datepicker. If no dateString is passed, just close the datepicker without
changing the field value.


*/
function updateDateField(dateFieldName, dateString)
{
  //var targetDateField = document.getElementsByName (dateFieldName).item(0);--Not supported in safari/mozilla 
  var targetDateField = document.getElementById (dateFieldName);

  if (dateString)
    targetDateField.value = dateString;
 
  var pickerDiv = document.getElementById(datePickerDivID);
  pickerDiv.style.visibility = "hidden";
  pickerDiv.style.display = "none";
 
  adjustiFrame();
  targetDateField.focus();
 
  // after the datepicker has closed, optionally run a user-defined function called
  // datePickerClosed, passing the field that was just updated as a parameter
  // (note that this will only run if the user actually selected a date from the datepicker)
  if ((dateString) && (typeof(datePickerClosed) == "function"))
    datePickerClosed(targetDateField);
}



function adjustiFrame(pickerDiv, iFrameDiv)
{
 
  var is_opera = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
  if (is_opera)
    return;
  
  // put a try/catch block around the whole thing, just in case
  try {
    if (!document.getElementById(iFrameDivID)) {
      // don't use innerHTML to update the body, because it can cause global variables
      // that are currently pointing to objects on the page to have bad references
      //document.body.innerHTML += "<iframe id='" + iFrameDivID + "' src='javascript:false;' scrolling='no' frameborder='0'>";
      var newNode = document.createElement("iFrame");
      newNode.setAttribute("id", iFrameDivID);
      newNode.setAttribute("src", "javascript:false;");
      newNode.setAttribute("scrolling", "no");
      newNode.setAttribute ("frameborder", "0");
      document.body.appendChild(newNode);
    }
    
    if (!pickerDiv)
      pickerDiv = document.getElementById(datePickerDivID);
    if (!iFrameDiv)
      iFrameDiv = document.getElementById(iFrameDivID);
    
    try {
      iFrameDiv.style.position = "absolute";
      iFrameDiv.style.width = pickerDiv.offsetWidth;
      iFrameDiv.style.height = pickerDiv.offsetHeight ;
      iFrameDiv.style.top = pickerDiv.style.top;
      iFrameDiv.style.left = pickerDiv.style.left;
      iFrameDiv.style.zIndex = pickerDiv.style.zIndex - 1;
      iFrameDiv.style.visibility = pickerDiv.style.visibility ;
      iFrameDiv.style.display = pickerDiv.style.display;
    } catch(e) {
    }
 
  } catch (ee) {
  }
 
}

/* WRITTEN ON 23-JUNE-2008.COMPATIABLE WITH IE/MOZILLA/SAFARI */

function CompareDates(RecievedDate)
{
            var Now = new Date();
           //var Todaysdate=FormatDate(Now,"dd/M/yyyy");
             var Todaysdate=FormatDate(Now,"M/dd/yyyy");
             
            var SplittedDate = RecievedDate.split("/");
            
            var NewDate = SplittedDate[1]+"/"+SplittedDate[0]+"/"+SplittedDate[2];  
            
            if(RecievedDate.length >0)
            {     
                  if(DateDiff(Todaysdate,NewDate) > 0)
                  {
                      return false;
                  }
                  
                  return true; 
            } 
            else
            {
              return false;
            }           
}

function DateDiff(StartDate, EndDate) 
{

    var date1, date2;
    var month1, month2;
    var year1, year2;

date1 = StartDate.substring (0, StartDate.indexOf ("/"));
month1 = StartDate.substring (StartDate.indexOf ("/")+1, StartDate.lastIndexOf ("/"));
year1 = StartDate.substring (StartDate.lastIndexOf ("/")+1, StartDate.length);


date2 = EndDate.substring (0, EndDate.indexOf ("/"));
month2 = EndDate.substring (EndDate.indexOf ("/")+1, EndDate.lastIndexOf ("/"));
year2 = EndDate.substring (EndDate.lastIndexOf ("/")+1, EndDate.length);

if(year1>=year2)
{

    if(month1>=month2)
    {
        if(date1>date2)
            return -1;
         else
            return 1;
    }
    else
        return 2;
        
}
else 
return 3;
     
      
}

function DateCompare(StartDate, EndDate) 
{
    if(EndDate==null)
    {
        var Now = new Date();
        EndDate=FormatDate(Now,"M/dd/yyyy");
        month2 = parseInt(EndDate.substring (0, EndDate.indexOf ("/")),10);
        date2 = parseInt(EndDate.substring (EndDate.indexOf ("/")+1, EndDate.lastIndexOf ("/")),10);
        year2 = EndDate.substring (EndDate.lastIndexOf ("/")+1, EndDate.length);
      
    }
    else
    {
        date2 = parseInt(EndDate.substring (0, EndDate.indexOf ("/")),10);
        month2 = parseInt(EndDate.substring (EndDate.indexOf ("/")+1, EndDate.lastIndexOf ("/")),10);
        year2 = EndDate.substring (EndDate.lastIndexOf ("/")+1, EndDate.length);
        
    }
    var date1, date2;
    var month1, month2;
    var year1, year2;

    date1   = parseInt(StartDate.substring (0, StartDate.indexOf ("/")),10);
    month1 = parseInt(StartDate.substring (StartDate.indexOf ("/")+1, StartDate.lastIndexOf ("/")),10);
    year1 = StartDate.substring (StartDate.lastIndexOf ("/")+1, StartDate.length);
   
    if(year1>year2)
    {
        return 1;
    }
    else if(year2>year1)
    {
        return 2;
    }
    else
    {
        if(month1>month2)
        {
            return 1;
        }
        else if(month2>month1)
        {
            return 2;
        }
        else
        {        
        
            if(date1>date2)
            {
                return 1;
            }
            else if (date2>date1)
            {
                return 2;
            }
            else
            {
                return 0;
            }
        }
    }
}






function CompareGivenDates(FromDate,ToDate)
{            
    if(FromDate.length >0)
    {
        if(ToDate.length >0)      
        {  
            if(DateDiff(ToDate,FromDate) >0)
            {
               return false;
            }                 
            return true; 
        }
        return true;
    }           
}

function backButtonDestroyer()
         {         
            //window.focus();
	
            window.history.go(1);
          
        }


function FormatDate(Date,Format)
{
            Format=Format+"";
            var result="";
            var i_format=0;
            var c="";
            var token="";
            var y=Date.getYear()+"";
            var M=Date.getMonth()+1;
            var d=Date.getDate();
            var E=Date.getDay();
            var H=Date.getHours();
            var m=Date.getMinutes();
            var s=Date.getSeconds();
            var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
            // Convert real date parts into formatted versions
            var value=new Object();
            if (y.length < 4) {y=""+(y-0+1900);}
            value["y"]=""+y;
            value["yyyy"]=y;
            value["yy"]=y.substring(2,4);
            value["M"]=M;
            value["MM"]=LZ(M);
            value["MMM"]=MONTH_NAMES[M-1];
            value["NNN"]=MONTH_NAMES[M+11];
            value["d"]=d;
            value["dd"]=LZ(d);
            value["E"]=DAY_NAMES[E+7];
            value["EE"]=DAY_NAMES[E];
            value["H"]=H;
            value["HH"]=LZ(H);
            if (H==0){value["h"]=12;}
            else if (H>12){value["h"]=H-12;}
            else {value["h"]=H;}
            value["hh"]=LZ(value["h"]);
            if (H>11){value["K"]=H-12;} else {value["K"]=H;}
            value["k"]=H+1;
            value["KK"]=LZ(value["K"]);
            value["kk"]=LZ(value["k"]);
            if (H > 11) { value["a"]="PM"; }
            else { value["a"]="AM"; }
            value["m"]=m;
            value["mm"]=LZ(m);
            value["s"]=s;
            value["ss"]=LZ(s);
            while (i_format < Format.length)
             {
                            c=Format.charAt(i_format);
                            token="";
                            while ((Format.charAt(i_format)==c)&& (i_format < Format.length)) 
                            {
                                   token += Format.charAt(i_format++);
                              }
                            if (value[token] != null) { result=result + value[token]; }
                            else { result=result + token; }
                       }
            return result;
}
                
                      
var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');
function LZ(x) 
{
      return(x<0||x>9?"":"0")+x;    
}

//-------------------------------- End Date Picker Functions ---------------------------





function ConfirmISPDelete(ClientId)
{
   // var rowCount = ClientId.parentElement.parentElement.parentElement.children.length;
  
    var answer;
    var strClientId=ClientId.id;
    var endIndex=strClientId.indexOf("_GVISPAccountList");
   
    var parentId=strClientId.substring(0,parseInt(endIndex));
    var cultureElement=document.getElementById(parentId+"_InputCultureName");
    
    if(cultureElement.value=="English")
    {
         
                answer=confirm("Are you sure you want to delete this Account number?");            
           
            return answer;
    }
    else if(cultureElement.value=="Arabic")
    {
          
                answer=confirm("هل انت متأكد من طلب إلغاء رقم العقد");
        
            return answer;            
    }
}



// function ValidateCallHistory(ClientId,Culture)
// {
// 
//    if(Culture=="English")
//    {
////        var e = document.getElementById(ClientId+"_DdlGSMNumber");        
////        alert(e.options[e.selectedIndex].value);
//           if(document.getElementById(ClientId+"_DdlFixedLineNums").selectedIndex==0)
//           {
//               alert('Please select a Fixed Line Number');
//               return false;
//           }
//    }
//    else if(Culture=="Arabic")
//    {
////           if(document.getElementById(ClientId+"_DdlFixedLineNums").selectedIndex==0)
////           {
////               alert('الرجاء اختيار رقم هاتف ثابت');
////               return false;
////           }
//    }
//    return true;   
//  }
  
  
  
//function ValidateAddAccountForISP(ClientId,Culture)
//{
//    
//    var Exp1 =/^[a-zA-Z0-9]+$/
//    var ExpAlpha =/^[a-zA-Z ]+$/
//    var ExpSpace=/^[ ][a-zA-Z ]+$/
//    var ExpNumeric =/^[0-9]+$/
//    var SpecialChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";
//    var SpecialCharsComplete="!@#$%^&*()+=-[]\\\'._;,/{}|\":<>?"
//    var Exp5=/^[+91]*[0-9]+$/
//    var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+[.][a-zA-Z]+$/
//    
//    AId=document.getElementById(ClientId+"_TbISPAccountID");
//    
//    
//    if(Culture=="English")
//    {
//                     
//            if(AId.value=="")
//            {
//            alert("Please enter Account number");
//            return false;
//            }
//            if(!AId.value.match(ExpNumeric))
//            {
//            alert("Account number must be numeric");
//            return false;
//            }
//            
//            MNo=document.getElementById(ClientId+"_TbISPUserName");
//            
//            if(MNo.value=="")
//            {
//            alert("Please enter UserName");
//            return false;
//            }            
//           
//    }
//   else if(Culture="Arabic")
//   {
//         
//            if(AId.value=="")
//            {
//            alert("الرجاء إدخال رقم العقد");
//            return false;
//            }
//            if(!AId.value.match(ExpNumeric))
//            {
//            alert("رقم الهاتف النقال يجب ان يكون رقمياً");
//            return false;
//            }
//            
//            MNo=document.getElementById(ClientId+"_TbISPUserName");
//            
//            if(MNo.value=="")
//            {
//            alert("الرجاء ادخال اسم المستخدم");
//            return false;
//            }
//   }
//}



//Search functionality
function cleartxtbox(b)
{
	b.value = "";
}



//End Search




//------------------------------ Change Password ----------------------------------------

function ValidateConfirm(ClientID,Culture)
{

    if(document.getElementById(ClientID+"_txtNewPassword")!=null)
    {
        var OldPassword = document.getElementById(ClientID+"_txtOldPassword").value;
        var  newpassword =  document.getElementById(ClientID+"_txtNewPassword").value;
        var ConfirmPassword = document.getElementById(ClientID+"_txtConfirmPassword").value;
      
        if(Culture=="English")
        {
                if(OldPassword=="")
                {
                   
                    alert('Enter Old Password');
                    document.getElementById(ClientID+"_txtOldPassword").focus();
                    return false;
                }
                if(newpassword=="")
                {
                
                    alert('Enter New Password');
                    document.getElementById(ClientID+"_txtNewPassword").focus();
                    return false;
                }
                else if(ConfirmPassword=="")
                 {
                    alert('Enter Confirm Password');
                    document.getElementById(ClientID+"_txtConfirmPassword").focus();
                    return false;
                }
                else if(OldPassword== newpassword)
                {
                    alert('Old Password and New Password cannot be the same');
                    return false;
                }
                
                else if (newpassword.length < 8 || newpassword.length>16)
                {
                    alert('The length of password should be between 8 to 16 characters');
                    return false;
                }
                else if(newpassword!= ConfirmPassword)
                {
                    alert('Password not matching');
                    document.getElementById(ClientID+"_txtNewPassword").focus();
                    document.getElementById(ClientID+"_txtNewPassword").value="";
                    document.getElementById(ClientID+"_txtConfirmPassword").value="";
                    return false;
                }
                
                    return true;
          }
          else if(Culture=="Arabic")
          {
                  if(OldPassword=="")
                {
                    alert("أدخل كلمة المرور القديمة");
                    document.getElementById(ClientID+"_txtOldPassword").focus();
                    return false;
                }
                if(newpassword=="")
                {
                    alert('ادخال كلمة مرور جديدة');
                    document.getElementById(ClientID+"_txtNewPassword").focus();
                    return false;
                }
                else if(ConfirmPassword=="")
                 {
                    alert('ادخل تأكيد كلمة المرور الجديدة');
                    document.getElementById(ClientID+"_txtConfirmPassword").focus();
                    return false;
                }
                else if(OldPassword== newpassword)
                {
                    alert("كلمة المرور القديمة وكلمة المرور الجديدة لا يمكن ان تكون مماثلة");
                    return false;
                }
                
                else if (newpassword.length < 8 || newpassword.length>16)
                {
                    alert("طول كلمة المرور ينبغي ان تكون بين 8 الى 16 حرفا");
                    return false;
                }
                else if(newpassword!= ConfirmPassword)
                {
                    alert('كلمة المرور ليست مطابقه');
                    document.getElementById(ClientID+"_txtNewPassword").focus();
                    document.getElementById(ClientID+"_txtNewPassword").value="";
                    document.getElementById(ClientID+"_txtConfirmPassword").value="";
                    return false;
                }
                
                return true;
                
          }
    }
 } 


// -------------------------------- Change Password End ----------------
// -------------------------------- Add Account --------------------- ----------------


function ConnectionTypeChange(ClientId)
{
    var DropDownId=ClientId+"_DdlAccType";
    var PhoneNoLbl=ClientId+"_LblPhoneNo";
    
    if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].text=='LL')
    {
        document.getElementById(PhoneNoLbl).innerHTML='Leased Circuit Number'    
    }
    if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].text=='VSAT')
    {  
        document.getElementById(PhoneNoLbl).innerHTML='VSAT ID'
    }
    else
    {
        document.getElementById(PhoneNoLbl).innerHTML='Fixed Line Number'
    }
}

function ValidateAddAccount(ClientId,Culture)
{
    var Exp1 =/^[a-zA-Z0-9]+$/
    var ExpAlpha =/^[a-zA-Z ]+$/
    var ExpSpace=/^[ ][a-zA-Z ]+$/
    var ExpNumeric =/^[0-9]+$/
    var SpecialChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";
    var SpecialCharsComplete="!@#$%^&*()+=-[]\\\'._;,/{}|\":<>?"
    var Exp5=/^[+91]*[0-9]+$/
    var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+[.][a-zA-Z]+$/
    var AccountTypeDdl = document.getElementById(ClientId+"_DdlAccType");
   
    
    AId = document.getElementById(ClientId+"_TbAccountID");
    if(Culture=="English")
    {                
        if(AccountTypeDdl.selectedIndex == 0)
        {
            alert("Please select the Account Type.");
            return false;
        }
        if(AccountTypeDdl.options[AccountTypeDdl.selectedIndex].value!="Hayyak")
        { 
            if(AId.value=="")
            {
                alert("Please enter Account number");
                return false;
            }
            if(!AId.value.match(ExpNumeric))
            {
                alert("Account number must be numeric");
                return false;
            }
        }
        MNo = document.getElementById(ClientId+"_TbMobileNumber");
        if(MNo.value=="")
        {
            if(AccountTypeDdl.selectedIndex == 1)
                alert("Please enter Fixed Line number.");
            else if (AccountTypeDdl.selectedIndex == 2)
                alert("Please enter Login Name.");
            else if (AccountTypeDdl.selectedIndex == 3 || AccountTypeDdl.selectedIndex == 4)
                alert("Please enter GSM Number.");
            return false;
        }
        if(!MNo.value.match(ExpNumeric))
        {
             if(AccountTypeDdl.selectedIndex == 1)
             {
                alert("Fixed Line number should be numeric");
                return false;
            }
            if(AccountTypeDdl.selectedIndex == 3 || AccountTypeDdl.selectedIndex == 4)
            {
                alert("GSM number should be numeric");
                return false;
            }
        }
        if(MNo.value.length!=8)
        {
//            if(AccountTypeDdl.selectedIndex == 1)
//            {            
//                alert("The length of Fixed Line number should be 8 digits");
//                return false;
//            } 
//            else  if(AccountTypeDdl.selectedIndex == 3 || AccountTypeDdl.selectedIndex == 4)
//            {            
//                alert("The length of GSM number should be 8 digits");
//                return false;
//            } 
            if(AccountTypeDdl.selectedIndex == 3 || AccountTypeDdl.selectedIndex == 4)
            {            
                alert("The length of GSM number should be 8 digits");
                return false;
            }               
        }
        if(AccountTypeDdl.selectedIndex == 3 || AccountTypeDdl.selectedIndex == 4)
        {
            if(MNo.value.charAt(0)!='9')
            {
            alert("GSM Number should start with \'9\'");
                return false;
            }
        }         
    }
    else if(Culture="Arabic")
    {
        if(AccountTypeDdl.selectedIndex == 0)
        {
            alert("الرجاء اختيار نوع الحساب");
            return false;
        }
        if(AccountTypeDdl.options[AccountTypeDdl.selectedIndex].value!="Hayyak")
        {
            if(AId.value=="")
            {
                alert("الرجاء إدخال رقم العقد");
                return false;
            }
            if(!AId.value.match(ExpNumeric))
            {
                alert("رقم الهاتف النقال يجب ان يكون رقمياً");
                return false;
            }
         }
        MNo = document.getElementById(ClientId+"_TbMobileNumber");
        if(MNo.value=="")
        {
            if(AccountTypeDdl.selectedIndex == 1)
                alert("الرجاء إدخال رقم الهاتف النقال");
            else if (AccountTypeDdl.selectedIndex == 2)
                 alert("الرجاء إدخال اسم الدخول");
            else if (AccountTypeDdl.selectedIndex == 3 || AccountTypeDdl.selectedIndex == 3)
                alert("الرجاء إدخال رقم الهاتف النقال");           
            return false;
        }
        if(!MNo.value.match(ExpNumeric))
        {
            if(AccountTypeDdl.selectedIndex == 1 && MNo.value.length<7)
         {
                  alert("رقم الهاتف النقال يجب ان يكون رقمياً");
            return false;
            }
            if(AccountTypeDdl.selectedIndex == 3 || AccountTypeDdl.selectedIndex == 4)
         {
            alert("رقم الهاتف النقال يجب ان يكون رقمياً");
            return false;
            }
        }
        if(MNo.value.length!=8)
        {
//            if(AccountTypeDdl.selectedIndex == 1)
//            {            
//            alert("رقم الهاتف الثابت يجب ان يتكون من 8 أرقام");
//            return false;
//            }         
//            
//          else  if(AccountTypeDdl.selectedIndex == 3 || AccountTypeDdl.selectedIndex == 4)
//          {            
//            alert("يجب ان يكون الرقم مكون من 8 أرقام");
//            return false;
//            }
        if(AccountTypeDdl.selectedIndex == 3 || AccountTypeDdl.selectedIndex == 4)
          {            
            alert("يجب ان يكون الرقم مكون من 8 أرقام");
            return false;
            }    
        }
        
        if(AccountTypeDdl.selectedIndex == 3 || AccountTypeDdl.selectedIndex == 4)
        {
            if(MNo.value.charAt(0)!='9')
            {
             alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
                return false;
            }
        }
    }
}


function ValidatePincode(ClientID,Culture)
{
    var ExpNumeric =/^[0-9]+$/
    if(Culture=="English")
    {
            pincode=document.getElementById(ClientID+"_TbPinCode");
            if(pincode.value=="")
            {
                  alert("Please enter the 6 digit Security code");
                 return false;
            }
            if(!pincode.value.match(ExpNumeric))
            {
                alert("Pincode should be numeric");
                return false;
            }
            if(pincode.value.length!=6)
            {
                alert("Please enter the 6 digit Security code");
                return false;
            }
    }
    else if(Culture=="Arabic")
    {
            pincode=document.getElementById(ClientID+"_TbPinCode");
            if(pincode.value=="")
            {
            alert("الرجاء إدخال الرقم السري المكون من 6 أرقام");
            return false;
            }
            if(!pincode.value.match(ExpNumeric))
            {
                alert("الرقم السري يجب أن يكون بالأرقام");
                return false;
            }
             if(pincode.value.length!=6)
            {
                alert("الرجاء إدخال الرقم السري المكون من 6 أرقام");
                return false;
            }
    
    }
}



function changeMakePaymentImage1(ClientId,Culture)
{
   
    
    var image=document.getElementById(ClientId+"_StepImage");
        
    if(Culture == "Arabic")
    {
        image.src="wpresources/images/ar/twostepimage11.png";
    }
    else
    {
        image.src="wpresources/images/en/twostepimage11.png";
    }
    
}

function changeMakePaymentImage2(ClientId,Culture)
{
   
    
    var image=document.getElementById(ClientId+"_StepImage");
        
    if(Culture == "Arabic")
    {
        image.src="wpresources/images/ar/twostepimage21.png";
    }
    else
    {
        image.src="wpresources/images/en/twostepimage21.png";
    }
    
}
// -------------------------------------- Add Account End ----------------------------------
// -------------------------------------- Call History ----------------------------------

 function ValidateCallHistoryAccount(ClientId,Culture)
  {
        if(Culture=="English")
        {
               if(document.getElementById(ClientId+"_DlSelectAccount").selectedIndex==0)
               {
                   alert('Select the Account Number');
                   return false;
               }
        }
        else if(Culture=="Arabic")
        {
           if(document.getElementById(ClientId+"_DlSelectAccount").selectedIndex==0)
           {
               alert('إختر رقم الحساب');
                return false;
           }
        }
        return true;
 }
 
 
 function ValidateCallHistory(ClientId,Culture)
 {
 
    if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_DdlFixedLineNums").selectedIndex==0)
           {
               alert('Please select a Fixed Line Number');
               return false;
           }
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_DdlFixedLineNums").selectedIndex==0)
           {
               alert('الرجاء اختيار رقم هاتف ثابت');
               return false;
           }
    }
    return true;   
  }
  
   function ValidateCallHistoryMobile(ClientId,Culture)
 {
 
    if(Culture=="English")
    {
    
           if(document.getElementById(ClientId+"_ddlCallType") !=null && document.getElementById(ClientId+"_ddlCallType").selectedIndex==0)
           {
               alert('Please select Call type');
               return false;
           }
           
           if(document.getElementById(ClientId+"_DdlGSMNumber").selectedIndex==0)
           {
               alert('Please select a GSM Number');
               return false;
           }
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_ddlCallType") !=null && document.getElementById(ClientId+"_ddlCallType").selectedIndex==0)
           {
               alert('الرجاء اختيار نوع المكالمة');
               return false;
           }
    
           if(document.getElementById(ClientId+"_DdlGSMNumber").selectedIndex==0)
           {
               alert('الرجاء اختيار رقم هاتف متنقل');
               return false;
           }
    }
    return true;   
  }
  
  function ShowMonth(ID)
{
  
  if(document.all(ID+ '_DlSelectYear').selectedIndex == 0)
  {
      document.all(ID+ '_DlSelectMonth').style.display = "none";
      document.all(ID+'_DlSelectCurrMonth').selectedIndex=(document.all(ID+'_DlSelectCurrMonth').length)-1;
      document.all(ID+ '_DlSelectCurrMonth').style.display = "block";
  }
  else if(document.all(ID+ '_DlSelectYear').selectedIndex == 1)
  {
      document.all(ID+ '_DlSelectMonth').selectedIndex=0;
      document.all(ID+ '_DlSelectMonth').style.display = "block";
      document.all(ID+ '_DlSelectCurrMonth').style.display = "none";
  }
}

// ------------------------------------ Call History End ---------------------------

// ----------------------------------- Delete Account ------------------------------

function ConfirmDelete(ClientId)
{
   
  
    var answer;
    var strClientId=ClientId.id;
    var endIndex=strClientId.indexOf("_GVAccountList");
   
    var parentId=strClientId.substring(0,parseInt(endIndex));
    var cultureElement=document.getElementById(parentId+"_InputCultureName");
    
    if(cultureElement.value=="English")
    {
                answer=confirm("Are you sure you want to delete this Account number?");            
          
            return answer;
    }
    else if(cultureElement.value=="Arabic")
    {
          
                answer=confirm("هل انت متأكد من طلب إلغاء رقم العقد");
         
            return answer;            
    }
}

//Group Top Up Validations===============================================================================
//Added by Vaseem on 30th June 2008;
function ValidateAmountdouble(ClientID, Culture)
{
    debugger;
    //alert('Here');
    var Expdecimal = /^[0-9]+(.[0-9]+)$/
    var ExpNumeric = /^[0-9]+$/
    var Amount = document.getElementById(ClientID+"_TbAmount");
    var ddlGroups = document.getElementById(ClientID+"_DlGroup");
    var hdnName = document.all('hdnGroupCode' + ddlGroups.value);
    var MaxAmount = parseFloat(document.all('hdnGroupCode' + ddlGroups.value).value) * 100;
    
    if(Amount.value == "" || parseFloat(Amount.value) <= 0)
    {
        if(Culture == "English")
        {
            alert('Please enter a valid amount');
            Amount.focus();
            return false;
        }
        else if(Culture == "Arabic")
        {
            alert('الرجاء إدخال المبلغ الصحيح');
            Amount.focus();
            return false;
        }
    }
    else if((!Amount.value.match(ExpNumeric)) && (!Amount.value.match(Expdecimal)))
    {
        if(Culture == "English")
        {
            alert('Please enter a valid amount');
            Amount.focus();
            return false;
        }
        else if(Culture == "Arabic")
        {
            alert('الرجاء إدخال المبلغ الصحيح');
            Amount.focus();
            return false;
        }
    }
    else if((parseFloat(hdnName.value)) > (parseFloat(Amount.value)))
    {
        if(Culture == "English")
        {
            alert('Minimum Amount should be greater than ' + hdnName.value);
            Amount.focus();
            return false;
        }
        else if(Culture == "Arabic")
        {
            alert(' ا لحد الأدنى لتعبئة الرصيد يجب ان يكون   ريال عماني ' + hdnName.value);
            Amount.focus();
            return false;
        }
    }
    else if(MaxAmount < (parseFloat(Amount.value)))
    {
        if(Culture == "English")
        {
            alert('Amount should be less than ' + MaxAmount);
            Amount.focus();
            return false;
        }
        else if(Culture == "Arabic")
        {
            alert('المبلغ يجب أن يكون أقل من ' + MaxAmount);
            Amount.focus();
            return false;
        }
    }
    return true;
}
//------------------------------------------------------------------------------------------
//GroupTopUP Validate Amount entered in TopUp button click
function ValidateGroupTopUp(ClientId, Culture)
{
    //debugger;
    var lblAmountRemaining = document.getElementById(ClientId + "_LblAmountRemaining");
    var hdnCheckBoxValue = document.getElementById(ClientId + "_hdnCheckBoxValue");
    if(hdnCheckBoxValue.value == "0")
    {
        if(lblAmountRemaining.innerText != "0")
        {
            if(Culture == "English")
            {
                alert('Amount Available should be 0');
                return false;
            }
            else if(Culture == "Arabic")
            {
                alert('يجب ان يكون المبلغ المتوفر ');
                return false;
            }
        }
    }
    return true;
}

//------------------------------------------------------------------------------------------
//Validations for Amount entered in the Grid TextBox; Fires OnBlur event;
function AmountValidation(ClientId, Culture)
{
    //debugger;
    
    var Expdecimal = /^[0-9]+(.[0-9]+)$/
    var ExpNumeric = /^[0-9]+$/
    
    var AmountAvailable = document.getElementById(ParentClientId + "_LblAmountRemaining");
    var AmountDistributed = document.getElementById(ParentClientId + "_LblAmountCalculatedValue");
    var AmountEntered = document.getElementById(ParentClientId + "_LblAmountEntered");
    
    try
    {
        //Get target base control
        TargetBaseControl = document.getElementById(ClientId + "_DgGroupTopUp");
    }
    catch(err)
    {
        TargetBaseControl = null;
    }

    if(TargetBaseControl == null) return false;
     
    //Get target child control
    var TargetChildControl = "EditTbAmount";
            
    //Get all the control of the type INPUT in the base control
    var Inputs = TargetBaseControl.getElementsByTagName("input");
            
    for(var n = 0; n < Inputs.length; ++n)
    {
        if(Inputs[n].type == 'text' && Inputs[n].id.indexOf(TargetChildControl,0) >= 0 && Inputs[n].value == "")
        {
            if(Culture=="English")
            {
                alert('Please Enter Amount');
                Inputs[n].focus();
                return false;
            }
            else if(Culture=="Arabic")
            {
                alert('الرجاء إدخال المبلغ');
                Inputs[n].focus();
                return false;
            }
        }
        else if(Inputs[n].type == 'text' && Inputs[n].id.indexOf(TargetChildControl,0) >= 0 && Inputs[n].value != null)
        {
            if((!Inputs[n].value.match(ExpNumeric)) && (!Inputs[n].value.match(Expdecimal)))
            {
                if(Culture == "English")
                {
                    alert('Please enter a valid amount');
                    Inputs[n].focus();
                    return false;
                }
                else if(Culture == "Arabic")
                {
                    alert('الرجاء إدخال المبلغ الصحيح');
                    Inputs[n].focus();
                    return false;
                }
            }
            else if(parseFloat(Inputs[n].value) < 1)
            {
                if(Culture=="English")
                {
                    alert('Minimum TopUp Amount Should Be RO 1');
                    Inputs[n].focus();
                    return false;
                }
                else if(Culture=="Arabic")
                {
                    alert('الحد الأدنى لتعبئة الرصيد يجب ان يكون   ريال عماني');
                    Inputs[n].focus();
                    return false;
                }
            }
            else
            {
                if(parseFloat(Inputs[n].value) <= parseFloat(AmountAvailable.innerText))
                {
                    var txtValue = parseFloat(Inputs[n].value);
                    var amtAvailable = parseFloat(AmountAvailable.innerText);
                    var amtDistributed = parseFloat(AmountDistributed.innerText);
                    var newAmountAvailable = amtAvailable - txtValue;
                    var newAmtDistributed = amtDistributed + txtValue;
                    
                    AmountDistributed.text = newAmtDistributed + '';
                    AmountAvailable.text = newAmountAvailable + '';
                }
                else
                {
                    if(Culture=="English")
                    {
                        alert('Amount entered cannot be more than amount availabe');
                        return false;
                    }
                    else if(Culture=="Arabic")
                    {
                        alert('لايمكن ان يكون المبلغ المدخل اكثر من المبلغ المتوفر');
                        return false;
                    }
                }
            }
        }
    }
}

//------------------------------------------------------------------------------------------
//GroupTopUP Validate Amount entered in Grid control
function ValidateAmountEnteredInGrid(ClientId, Culture, ParentClientId)
{       
    //debugger;
    var Sum = 0;
    var Expdecimal = /^[0-9]+(.[0-9]+)$/
    var ExpNumeric = /^[0-9]+$/
    var AmountAvailable = document.getElementById(ParentClientId + "_LblAmountRemaining");
    
    try
    {
        //Get target base control
        TargetBaseControl = document.getElementById(ClientId);
    }
    catch(err)
    {
        TargetBaseControl = null;
    }

    if(TargetBaseControl == null) return false;
     
    //Get target child control
    var TargetChildControl = "EditTbAmount";
            
    //Get all the control of the type INPUT in the base control
    var Inputs = TargetBaseControl.getElementsByTagName("input");
            
    for(var n = 0; n < Inputs.length; ++n)
    {
        if(Inputs[n].type == 'text' && Inputs[n].id.indexOf(TargetChildControl,0) >= 0 && Inputs[n].value == "")
        {
            if(Culture=="English")
            {
                alert('Please Enter Amount');
                Inputs[n].focus();
                return false;
            }
            else if(Culture=="Arabic")
            {
                alert('الرجاء إدخال المبلغ');
                Inputs[n].focus();
                return false;
            }
        }
        else if(Inputs[n].type == 'text' && Inputs[n].id.indexOf(TargetChildControl,0) >= 0 && Inputs[n].value != null)
        {
            if((!Inputs[n].value.match(ExpNumeric)) && (!Inputs[n].value.match(Expdecimal)))
            {
                if(Culture == "English")
                {
                    alert('Please enter a valid amount');
                    Inputs[n].focus();
                    return false;
                }
                else if(Culture == "Arabic")
                {
                    alert('الرجاء إدخال المبلغ الصحيح');
                    Inputs[n].focus();
                    return false;
                }
            }
            else if(parseFloat(Inputs[n].value) > 0 && parseFloat(Inputs[n].value) < 1)
            {
                if(Culture=="English")
                {
                    alert('Minimum TopUp Amount Should Be RO 1');
                    Inputs[n].focus();
                    return false;
                }
                else if(Culture=="Arabic")
                {
                    alert('الحد الأدنى لتعبئة الرصيد يجب ان يكون   ريال عماني');
                    Inputs[n].focus();
                    return false;
                }
            }
            else if(parseFloat(Inputs[n].value) > 100)
            {
                if(Culture=="English")
                {
                    alert('Maximum TopUp Amount should be RO 100');
                    Inputs[n].focus();
                    return false;
                }
                else if(Culture=="Arabic")
                {
                    alert('أكبر مبلغ لإعادة التعبئة هو 100 ريال');
                    Inputs[n].focus();
                    return false;
                }
            }
            else if(parseFloat(Inputs[n].value) == 0 || (parseFloat(Inputs[n].value) >= 1  && parseFloat(Inputs[n].value)<= 100))
            {
                Sum = Sum + parseFloat(Inputs[n].value);
            }
        }
    }
    
    if(parseFloat(AmountAvailable.innerText) < Sum)
    {
        if(Culture=="English")
        {
            alert('Amount entered cannot be more than amount availabe');
            return false;
        }
        else if(Culture=="Arabic")
        {
            alert('لايمكن ان يكون المبلغ المدخل اكثر من المبلغ المتوفر');
            return false;
        }
    }
    return true;
}
//======================================================================================================
//for ValidateTopup
function ValidateTopup(ClientId,Culture,MinAmount,MaxAmount)
{

      MinAmount=parseFloat(MinAmount);
      MaxAmount=parseFloat(MaxAmount)
      var ExpNumeric =/^[0-9]+$/
      var txtTopUpAmount=document.getElementById(ClientId+"_txtTopUpAmount");
     
    if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_ddlGSmNumbers")!=null && document.getElementById(ClientId+"_ddlGSmNumbers").selectedIndex==0)
           {
                 alert("Please select GSM Number");
                 document.getElementById(ClientId+"_ddlGSmNumbers").focus();
                 return false;
           }
                
           else if(txtTopUpAmount.value=="")
            {
                 alert("Please enter Payment Amount");
                 document.getElementById(ClientId+"_txtTopUpAmount").focus();
                 return false;
            }
            else if(ValidateTopUpAmount(txtTopUpAmount.value)!=true)
            {
                 alert("Amount should be numeric and should not have decimal values");
                 txtTopUpAmount.focus();
                 txtTopUpAmount.value="";
                 return false;
            }
            else if((parseFloat(txtTopUpAmount.value))<MinAmount||(parseFloat(txtTopUpAmount.value))>MaxAmount)
            {
                 alert("Top-Up amount should be between RO "+MinAmount+" and RO "+MaxAmount);
                 return false;
            }
            else 
                return true;
        }
        else if(Culture=="Arabic")
        {
                if(document.getElementById(ClientId+"_ddlGSmNumbers")!=null && document.getElementById(ClientId+"_ddlGSmNumbers").selectedIndex==0)
                {
                     alert("الرجاء إختيار رقم الهاتف النقال");
                     document.getElementById(ClientId+"_ddlGSmNumbers").focus();
                     return false;
                }
                else if(txtTopUpAmount.value=="")
                {
                     alert("الرجاء إدخال المبلغ المراد دفعه");
                     document.getElementById(ClientId+"_txtTopUpAmount").focus();
                     return false;
                }
                else if(ValidateTopUpAmount(txtTopUpAmount.value)!=true)
                {
                     alert("يجب ان يكون المبلغ رقمي و لا يحتوي على القيم العشريه");
                     txtTopUpAmount.focus();
                     txtTopUpAmount.value="";
                     return false;
                 }
                 else if((parseFloat(txtTopUpAmount.value))<MinAmount||(parseFloat(txtTopUpAmount.value))>MaxAmount)
                 {
                     alert("مبلغ إعادة التعبئة يجب أن يكون بين "+MinAmount+" و RO "+MaxAmount);
                     return false;
                 }
                else 
                    return true;       
        }
}


function ValidateTopupForFriend(ClientId,Culture,MinAmount,MaxAmount)
{
      
    MinAmount=parseFloat(MinAmount);
    MaxAmount=parseFloat(MaxAmount)
    var ExpNumeric =/^[0-9]+$/
    var txtTopUpAmount=document.getElementById(ClientId+"_txtTopUpAmount");
    
    if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_txtGSmNumber")!=null && document.getElementById(ClientId+"_txtGSmNumber").value=="")
            {
                 alert("Please enter GSM Number");
                 document.getElementById(ClientId+"_txtGSmNumber").focus();
                 return false;
            }
            else if(document.getElementById(ClientId+"_txtGSmNumber")!=null && document.getElementById(ClientId+"_txtGSmNumber").value!="" && (!document.getElementById(ClientId+"_txtGSmNumber").value.match(ExpNumeric)))
            {
                 alert("GSM Number should be numeric");
                 document.getElementById(ClientId+"_txtGSmNumber").focus();
                 return false;
            }
            else if( document.getElementById(ClientId+"_txtGSmNumber")!=null && document.getElementById(ClientId+"_txtGSmNumber").value.charAt(0)!='9')
            {
                alert("GSM Number should start with \'9\'");
                document.getElementById(ClientId+"_txtGSmNumber").focus();
                return false;
            }
            else if(document.getElementById(ClientId+"_txtGSmNumber").value.length!=8)
            {
                alert("The length of GSM number should be 8 digits");
                return false;
            }
            else if(txtTopUpAmount.value=="")
            {
                 alert("Please enter Payment Amount");
                 txtTopUpAmount.focus();
                 return false;
            }
            else if(ValidateTopUpAmount(txtTopUpAmount.value)!=true)
            {
                 alert("Amount should be numeric and should not have decimal values");
                 txtTopUpAmount.focus();
                 txtTopUpAmount.value="";
                 return false;
            }
            else if((parseFloat(txtTopUpAmount.value))<MinAmount||(parseFloat(txtTopUpAmount.value))>MaxAmount)
            {
                alert("Top-Up amount should be between RO "+MinAmount+" and RO "+MaxAmount);
                return false;
            }
            else 
                return true;
        }
        else if(Culture=="Arabic")
        {
                if(document.getElementById(ClientId+"_txtGSmNumber")!=null && document.getElementById(ClientId+"_txtGSmNumber").value=="")
                {
                     alert("الرجاء إدخال رقم الهاتف النقال");
                     document.getElementById(ClientId+"_txtGSmNumber").focus();
                     return false;
                }
                else if(document.getElementById(ClientId+"_txtGSmNumber")!=null && document.getElementById(ClientId+"_txtGSmNumber").value!="" && (!document.getElementById(ClientId+"_txtGSmNumber").value.match(ExpNumeric)))
                {
                     alert("رقم الهاتف النقال يجب ان يكون رقمياً");
                     document.getElementById(ClientId+"_txtGSmNumber").focus();
                     return false;
                } 
                else if( document.getElementById(ClientId+"_txtGSmNumber")!=null && document.getElementById(ClientId+"_txtGSmNumber").value.charAt(0)!='9')
                {
                    alert("يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
                    document.getElementById(ClientId+"_txtGSmNumber").focus();
                    return false;
                }
                else if(document.getElementById(ClientId+"_txtGSmNumber").value.length!=8)
                {
                    alert("يجب ان يكون الرقم مكون من 8 أرقام");
                    return false;
                }
               else if(txtTopUpAmount.value=="")
                {
                     alert("الرجاء إدخال المبلغ المراد دفعه");
                     txtTopUpAmount.focus();
                     return false;
                }
                else if(ValidateTopUpAmount(txtTopUpAmount.value)!=true)
                {
                     alert("المبلغ يجب أن يكون بالأعداد وليس به كسور عشرية");
                     txtTopUpAmount.focus();
                     txtTopUpAmount.value="";
                     return false;
                }
                else if((parseFloat(txtTopUpAmount.value))<MinAmount||(parseFloat(txtTopUpAmount.value))>MaxAmount)
                {
                     alert("مبلغ إعادة التعبئة يجب أن يكون بين RO "+MinAmount+" و RO "+MaxAmount);
                     return false;
                }
                else 
                    return true;       
        }
}

function ValidateAmount(fieldvalue)
{
    /*var Exp=/^[0-9]+$/;
    var Exp1=/^[0-9]+(.[0-9]{1})$/;
    var Exp2=/^[0-9]+(.[0-9]{2})$/;
    var Exp3=/^[0-9]+(.[0-9]{3})$/;*/
    
    var Exp=/^[0-9]+$/;
    var Exp1=/^[0-9]+(\.[0-9])$/;
    var Exp2=/^[0-9]+(\.[0-9][0-9])$/;
    var Exp3=/^[0-9]+(\.[0-9][0-9][0-9])$/;
    
    if(Exp.test(fieldvalue) || Exp1.test(fieldvalue) || Exp2.test(fieldvalue) || Exp3.test(fieldvalue))
    {
        return true;
    }	
    else
        return false;
}
//end of Make Payment

//Search functionality
function cleartxtbox(b)
{
	b.value = "";
}

function ValidateTopUpAmount(fieldvalue)
{

    var Exp=/^[0-9]+$/;
    var Exp1=/^[0-9]+(\.)$/;
    var Exp2=/^[0-9]+(\.)$/;
    var Exp3=/^[0-9]+(\.)$/;
    if(Exp.test(fieldvalue) || Exp1.test(fieldvalue) || Exp2.test(fieldvalue) || Exp3.test(fieldvalue))
    {
    //alert('true');
        return true;
    }	
    else
    {
     //alert('false')
        return false;
    }
}



//Group TopUp Transaction Log================================================================================
function ValidateTransactionLog(ClientId,Culture)
 {
    //debugger;
    if(Culture=="English")
    {
        if(document.getElementById(ClientId+"_ddlGroupName").selectedIndex==0)
           {
               alert('Select the Hayyak Group');
               document.getElementById(ClientId+"_ddlGroupName").focus();
               return false;
           }
           
           if(document.getElementById(ClientId+"_txtFromDate").value == "")
           {
                alert('Select From Date');
                document.getElementById(ClientId+"_txtFromDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_txtToDate").value == "")
           {
                alert('Select To Date');
                document.getElementById(ClientId+"_txtToDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_txtFromDate").value != "" && DateCompare(document.getElementById(ClientId+"_txtFromDate").value,null)== 1)
           {
                alert('From date should not be greater than today\'s date');
                document.getElementById(ClientId+"_txtFromDate").focus();
                return false;
           }
           
           if(document.getElementById(ClientId+"_txtToDate").value != "" && DateCompare(document.getElementById(ClientId+"_txtToDate").value,null)== 1)
           {
                alert('To date should not be greater than today\'s date');
                document.getElementById(ClientId+"_txtToDate").focus();
                return false;
           }
           if(DateCompare(document.getElementById(ClientId+"_txtFromDate").value,document.getElementById(ClientId+"_txtToDate").value)==1)
           {
            alert('From date should not be greater than or equal to To date');
            document.getElementById(ClientId+"_txtFromDate").focus();
            return false;
           }
       }
       else if(Culture=="Arabic")
       {
            if(document.getElementById(ClientId+"_ddlGroupName").selectedIndex==0)
           {
               alert('إختر مجموعة حياك');
               document.getElementById(ClientId+"_ddlGroupName").focus();
               return false;
           }
           
           if(document.getElementById(ClientId+"_txtFromDate").value == "")
           {
                alert('إختر تاريخ البدء');
                document.getElementById(ClientId+"_txtFromDate").focus();
                return false;
           }
            if(document.getElementById(ClientId+"_txtToDate").value == "")
           {
                alert('إختر تاريخ الانتهاء');
                document.getElementById(ClientId+"_txtToDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_txtFromDate").value != "" && CompareDates(document.getElementById(ClientId+"_txtFromDate").value)==0)
           {
                alert('يجب ألا يكون تاريخ البدء أعلى من تاريخ اليوم');
                document.getElementById(ClientId+"_txtFromDate").focus();
                return false;
           }
          
           if(document.getElementById(ClientId+"_txtToDate").value != "" && CompareDates(document.getElementById(ClientId+"_txtToDate").value)==0)
           {
                alert('يجب ألا يكون تاريخ الانتهاء أعلى من تاريخ اليوم');
                document.getElementById(ClientId+"_txtToDate").focus();
                return false;
           }
           if(CompareGivenDates(document.getElementById(ClientId+"_txtFromDate").value,document.getElementById(ClientId+"_txtToDate").value)==0)
           {
            alert('يجب ألا يكون تاريخ البدء أعلى أو يساوي تاريخ الاتنهاء');
            document.getElementById(ClientId+"_txtFromDate").focus();
            return false;
           }
       }
       return true;          
  }
  
   function ValidateTransactionReciept(ClientId,Culture)
 {
    
    if(Culture=="English")
    {
        if(document.getElementById(ClientId+"_ddlTransactionReceipt").selectedIndex==0)
           {
               alert('Select the Transaction Receipt Number');
               document.getElementById(ClientId+"_ddlTransactionReceipt").focus();
               return false;
           }
    }
    else if(Culture=="Arabic")
    {      
         if(document.getElementById(ClientId+"_ddlTransactionReceipt").selectedIndex==0)
           {
               alert('إختر رقم إيصال العملية');
               document.getElementById(ClientId+"_ddlTransactionReceipt").focus();
               return false;
           }
    }
  }
//Group TopUp Transaction Log=================================================================================



// ----------------------------------- Make Payment ---------------------------------

function Validate(ClientId,Culture)
{
    if(document.getElementById(ClientId+"_lblOutstandingAmountValue").innerText != "")
    {
        if(Culture=="English")
        {
            if(document.getElementById(ClientId+"_txtPaymentAmount").value=="")
            {
                 alert("Please enter Payment Amount");
                 document.getElementById(ClientId+"_txtPaymentAmount").focus();
                return false;
            }
	    else if(document.getElementById(ClientId+"_txtPaymentAmount").value < 1)
            {
                 alert("Payment amount should be greater than or equal to RO 1");
                 document.getElementById(ClientId+"_txtPaymentAmount").focus();
                return false;
            }
            else if(document.getElementById(ClientId+"_txtPaymentAmount").value!="")
            {
                if(ValidateAmount(document.getElementById(ClientId+"_txtPaymentAmount").value)!=true)
                {
                    alert("Please enter valid Payment Amount");
                    document.getElementById(ClientId+"_txtPaymentAmount").focus();
                    document.getElementById(ClientId+"_txtPaymentAmount").value="";
                    return false;
                }
            }
            else 
		{
			changeMakePaymentImg3(ClientId,Culture)
                	return true;
		}
        }
        else if(Culture=="Arabic")
        {
                if(document.getElementById(ClientId+"_txtPaymentAmount").value=="")
                {
                     alert("الرجاء إدخال المبلغ المراد دفعه");
                     document.getElementById(ClientId+"_txtPaymentAmount").focus();
                    return false;
                }
		else if(document.getElementById(ClientId+"_txtPaymentAmount").value < 1)
            	{
                     alert("الحد الادنى للدفع  ينبغي ان يكون 1 ريال عماني");
                     document.getElementById(ClientId+"_txtPaymentAmount").focus();
                     return false;
            	}
                else if(document.getElementById(ClientId+"_txtPaymentAmount").value!="")
                {
                    if(ValidateAmount(document.getElementById(ClientId+"_txtPaymentAmount").value)!=true)
                    {
                        alert("الرجاء إدخال المبلغ الصحيح");
                        document.getElementById(ClientId+"_txtPaymentAmount").focus();
                        document.getElementById(ClientId+"_txtPaymentAmount").value="";
                        return false;
                    }
                    
                }
                else 
                   {
			changeMakePaymentImg3(ClientId,Culture)
                	return true;
		   }
        
         }
     }
     else
     {
       return false;
     }
}




function ValidateAccount(ClientId,Culture)
{
    
    if(Culture=="English")
    {
        if(document.getElementById(ClientId+"_ddlAccountNumbers").selectedIndex==0)
        {
            alert("Please select Account No");
            document.getElementById(ClientId+"_ddlAccountNumbers").focus();
            return false;
        }
    }
    else if(Culture=="Arabic")
    {
        if(document.getElementById(ClientId+"_ddlAccountNumbers").selectedIndex==0)
        {
            alert("رقم العقد الرجاء إختيار");
            document.getElementById(ClientId+"_ddlAccountNumbers").focus();
            return false;
        }
    }
}

function ValidateAccountNums(ClientId,Culture)
{
    
    if(Culture=="English")
    {
        if(document.getElementById(ClientId+"_DlAccNum").selectedIndex==0)
        {
            alert("Please select Account No");
            document.getElementById(ClientId+"_DlAccNum").focus();
            return false;
        }
    }
    else if(Culture=="Arabic")
    {
        if(document.getElementById(ClientId+"_DlAccNum").selectedIndex==0)
        {
            alert("رقم العقد الرجاء إختيار");
            document.getElementById(ClientId+"_DlAccNum").focus();
            return false;
        }
    }
}

function ValidateAmount(fieldvalue)
{
    /*var Exp=/^[0-9]+$/;
    var Exp1=/^[0-9]+(.[0-9]{1})$/;
    var Exp2=/^[0-9]+(.[0-9]{2})$/;
    var Exp3=/^[0-9]+(.[0-9]{3})$/;*/
    
    var Exp=/^[0-9]+$/;
    var Exp1=/^[0-9]+(\.[0-9])$/;
    var Exp2=/^[0-9]+(\.[0-9][0-9])$/;
    var Exp3=/^[0-9]+(\.[0-9][0-9][0-9])$/;
    
    if(Exp.test(fieldvalue) || Exp1.test(fieldvalue) || Exp2.test(fieldvalue) || Exp3.test(fieldvalue))
    {
        return true;
    }	
    else
        return false;
}


function changeMakePaymentImg3(ClientId,Culture)
{
   
    
    var image=document.getElementById(ClientId+"_StepImage");
        
    if(Culture == "Arabic")
    {
        image.src="wpresources/images/ar/stepimage31.png";
    }
    else
    {
        image.src="wpresources/images/en/stepimage31.png";
    }
    
}

function changeMakePaymentImg2(ClientId,Culture)
{
   
    
    var image=document.getElementById(ClientId+"_StepImage");
        
    if(Culture == "Arabic")
    {
        image.src="wpresources/images/ar/stepimage21.png";
    }
    else
    {
        image.src="wpresources/images/en/stepimage21.png";
    }
    
}

// ------------------------------- Make Payment End ---------------------------
// ------------------------------- Payment History ----------------------------

function ValidatePaymentHistory(ClientId,Culture)
 {
  
 if(Culture == "English")
 {
 
    //alert(document.getElementById(ClientId+"_DdlAccountNumber").selectedIndex);
    if(document.getElementById(ClientId+"_DdlAccountNumber").selectedIndex==0)
       {
           alert('Select the Account Number');
            return false;
       }
       
       if(document.getElementById(ClientId+"_TxtFromDate").value == "")
       {
            alert('Select From Date');
            document.getElementById(ClientId+"_TxtFromDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtFromDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,null)== 1))
       {
            alert('From date should not be greater than today\'s date');
            document.getElementById(ClientId+"_TxtFromDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtToDate").value == "")
       {
            alert('Select To Date');
            document.getElementById(ClientId+"_TxtToDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtToDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtToDate").value,null)== 1))
       {
            alert('To date should not be greater than today\'s date');
            document.getElementById(ClientId+"_TxtToDate").focus();
            return false;
       }
       if(DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,document.getElementById(ClientId+"_TxtToDate").value)==1)
       {
        alert('From date should not be greater than or equal to To date');
        document.getElementById(ClientId+"_TxtFromDate").focus();
        return false;
       }
     }
     else if (Culture == "Arabic")
     {
     if(document.getElementById(ClientId+"_DdlAccountNumber").selectedIndex==0)
       {
           alert('إختر رقم الحساب');
            return false;
       }
       
       if(document.getElementById(ClientId+"_TxtFromDate").value == "")
       {
            alert('إختر التاريخ من');
            document.getElementById(ClientId+"_TxtFromDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtFromDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtToDate").value,null)== 1))
       {
            alert('التاريخ من يجب ان يكون اقل من تاريخ اليوم');
            document.getElementById(ClientId+"_TxtFromDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtToDate").value == "")
       {
            alert('إختر التاريخ الى');
            document.getElementById(ClientId+"_TxtToDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtToDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtToDate").value,null)== 1))
       {
            alert('التاريخ الى يجب ان يكون مساوي او اقل من التاريخ اليوم');
            document.getElementById(ClientId+"_TxtToDate").focus();
            return false;
       }
       if(DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,document.getElementById(ClientId+"_TxtToDate").value)==1)
       {
        alert('التاريخ من يجب ان لا يكون مساوي او اكثر من التاريخ الى');
        document.getElementById(ClientId+"_TxtFromDate").focus();
        return false;
       }
     }  
       return true;          
  }


//-------------------------------------- Payment History End ---------------------------
// ------------------------------------  View User Profile -----------------------------

function ValidateEmailField(clientId,UICulture)
{
   var Email;
   var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;
   
   if(UICulture=="English")
     {
        Email=document.getElementById(clientId+"_Email");
        if(Email.value=="")
          {
               alert("Please enter E-mail ID");
               Email.focus();
               return false;
          }
        if(!Email.value.match(ExpEmail))
          {
                alert("E-mail is not in standard format (example: abc@xyz.com)");
                Email.focus();
                return false;
          }


	try
	{
	 var Email1=document.getElementById(clientId+"_AltEmail1");
	 var Email2=document.getElementById(clientId+"_AltEmail2");

        if(Email1.value!="")
          {

		if(!Email1.value.match(ExpEmail))
          	{
                	alert("Alternate Email1 is not in standard format (example: abc@xyz.com)");
                	Email1.focus();
                	return false;
          	}
             
          }
        
	if(Email2.value!="")
          {

		if(!Email2.value.match(ExpEmail))
          	{
                	alert("Alternate Email2 is not in standard format (example: abc@xyz.com)");
                	Email2.focus();
                	return false;
          	}
             
          }


	}
	catch(err)
	{
	}



      }
    else if(UICulture=="Arabic")
    {
         Email=document.getElementById(clientId+"_Email");
         if(Email.value=="")
          {
            alert("الرجاء إدخال البريد الإلكتروني");
            Email.focus();
            return false;
          }
            
         if(!Email.value.match(ExpEmail))
          {
            alert("البريد الإلكتروني غير صحيح (مثال : abc@xyz.com )");
            Email.focus();
            return false;
          }


	try
	{
	 	var Email1=document.getElementById(clientId+"_AltEmail1");
	 	var Email2=document.getElementById(clientId+"_AltEmail2");

        		if(Email1.value!="")
          		{

			if(!Email1.value.match(ExpEmail))
          			{
                			    alert("البريد الإلكتروني غير صحيح (مثال : abc@xyz.com )");
                			Email1.focus();
                			return false;
          			}
             
          		}
        
		if(Email2.value!="")
          		{

			if(!Email2.value.match(ExpEmail))
          			{
                			alert("البريد الإلكتروني غير صحيح (مثال : abc@xyz.com )");
                			Email2.focus();
                			return false;
          			}
             
          		}


	}
	catch(err)
	{
	}


            
    }
    return ValidateGSMField(clientId,UICulture);
}
function ValidateGSMField(clientId,UICulture)
{
    var GSMNo=document.getElementById(clientId+"_GSMNo");
    var ExpNumeric =/^[0-9]+$/
    
    if(UICulture=="English")
    {
        if(GSMNo.value=="")
        {
        alert("Please enter GSM number");
        return false;
        }
        if(!GSMNo.value.match(ExpNumeric))
        {
        alert("GSM number should be numeric");
        return false;
        }
        if(GSMNo.value.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
            return false;
        }
        if(GSMNo.value.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
            return false;
        }
    }
    else if(UICulture=="Arabic")
    {
        if(GSMNo.value=="")
        {
        alert("الرجاء إدخال رقم الهاتف النقال");
        return false;
        }
        if(!GSMNo.value.match(ExpNumeric))
        {
        alert("رقم الهاتف النقال يجب ان يكون رقمياً");
        return false;
        }
        if(GSMNo.value.charAt(0)!='9')
        {
            alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
            return false;
        }
        if(GSMNo.value.length != 8)
        {
            alert("يجب ان يكون الرقم مكون من 8 أرقام");
            return false;
        }
    }
    return true;
}

//function EditProfile(status,clientID)
//{
//   if(status == 'show')
//   {
//        var Email = document.all('lblEmailID').innerText;
//        document.all(clientID +"_Email").value = Email;
//        var GSMNo = document.all('lblGSMNo').innerText;
//        document.all(clientID +"_GSMNo").value = GSMNo;       
//        document.all("editablerow1").style.display = "block";
//        document.all("fixedrow1").style.display = "none";
//        document.all("editablerow2").style.display = "block";
//        document.all("fixedrow2").style.display = "none";
//   }
//   else if(status == 'hide') 
//   {
//        document.all("editablerow1").style.display = "none";
//        document.all("fixedrow1").style.display = "block";
//        document.all("editablerow2").style.display = "none";
//        document.all("fixedrow2").style.display = "block";        
//   }
//   return false;
//}


function EditProfileOnload(clientID)
{
        document.getElementById("editablerow1").style.display = 'none';            
        document.getElementById("editablerow2").style.display = 'none';    
        document.getElementById("fixedrow1").style.display = '';
        document.getElementById("fixedrow2").style.display = '';     


//buttons

        document.getElementById("editablerow5").style.display = 'none';    
        document.getElementById("fixedrow5").style.display = '';

try
{
        document.getElementById("editablerow3").style.display = 'none';            
        document.getElementById("editablerow4").style.display = 'none';    
        document.getElementById("fixedrow3").style.display = '';
        document.getElementById("fixedrow4").style.display = ''; 
 
	

	if(document.getElementById(clientID +"_chk")!=null)
	{
   		
	
		document.getElementById(clientID +"_chk").disabled=true;

	}
}
catch(err)
{
}
 
}


function EditProfile(status,clientID)
{
   if(status == 'show')
   {   
        var Email = document.all('lblEmailID').innerHTML;
        document.all(clientID +"_Email").value = Email;
        var GSMNo = document.all('lblGSMNo').innerHTML;        
        document.all(clientID +"_GSMNo").value = GSMNo;       
        
        document.getElementById("editablerow1").style.display = '';            
        document.getElementById("editablerow2").style.display = '';    
        document.getElementById("fixedrow1").style.display = 'none';
        document.getElementById("fixedrow2").style.display = 'none';


        document.getElementById("editablerow5").style.display = '';    
        document.getElementById("fixedrow5").style.display = 'none';

       
try
{

	 var Email1 = document.all('lblEmailID1').innerHTML;
	var Email2 = document.all('lblEmailID2').innerHTML;
        
	
	if(Email1!="Not available")
	{
        	document.all(clientID +"_AltEmail1").value = Email1;
	}
	else
	{
		document.all(clientID +"_AltEmail1").value = "";
	}
   
	if( Email2 !="Not available")   
	{
		document.all(clientID +"_AltEmail2").value = Email2;
	}
	else 
	{
		document.all(clientID +"_AltEmail2").value = "";

	}	

        document.getElementById("editablerow3").style.display = '';            
        document.getElementById("editablerow4").style.display = '';    
        document.getElementById("fixedrow3").style.display = 'none';
        document.getElementById("fixedrow4").style.display = 'none';


	if(document.getElementById(clientID +"_chk")!=null)
	{
   		
		//alert(document.getElementById(clientID +"_chk").disabled);
		document.getElementById(clientID +"_chk").disabled=false;

	}
	else
	{
		//alert ( "hello");
	}
	

}
catch(err)
{
}


   }
   else if(status == 'hide') 
   {
        document.getElementById("editablerow1").style.display = 'none';            
        document.getElementById("editablerow2").style.display = 'none';    
        document.getElementById("fixedrow1").style.display = '';
        document.getElementById("fixedrow2").style.display = '';     


       document.getElementById("editablerow5").style.display = 'none';    
        document.getElementById("fixedrow5").style.display = '';
try
{

	document.getElementById("editablerow3").style.display = 'none';            
        document.getElementById("editablerow4").style.display = 'none';    
        document.getElementById("fixedrow3").style.display = '';
        document.getElementById("fixedrow4").style.display = ''; 

	if(document.getElementById(clientID +"_chk")!=null)
	{
   		
	
		document.getElementById(clientID +"_chk").disabled=true;

	}

}
catch(err)
{
}



   }
   return false;
}


//-------------------------------- View User Profile End -----------------------------------

//-------------------------------- Login  -----------------------------------

function clickTextbox(usernameClientID)
{
//    
//    if(document.getElementById(ClientID+"_txtUserName").value=="User name" || document.getElementById(ClientID+"_txtUserName").value=="اسم المستخدم")
//    {
//        document.getElementById(ClientID+"_txtUserName").value="";
//    }

if(document.getElementById(usernameClientID).value=="User name" || document.getElementById(usernameClientID).value=="اسم المستخدم")
    {
        document.getElementById(usernameClientID).value="";
    }


}

function clickTextboxPassword(ClientID,passwordclientid)
{

//if(document.getElementById(ClientID+"_txtPassword").value=="Password")
//{
//document.getElementById(ClientID+"_txtPassword").value="";
//alert('1');
//document.getElementById("tdPassword").innerHTML = '<input name="password" type="password" id="ClientID+"_txtPassword" class="newtextboxstyle"  />'

//
// var passwordtextboxid = document.getElementById("txtPassword2").id.replace("txtPassword2",ClientID+"_txtPassword");
// document.getElementById("txtPassword2").value="";
//            document.getElementById("txtPassword2").style.display = 'none';
//            var passwordtextbox = document.getElementById(passwordtextboxid);
//            passwordtextbox.style.display = 'block';
//            passwordtextbox.focus();
            var passwordtextboxid = document.getElementById("txtPassword2").id.replace("txtPassword2",passwordclientid);
             document.getElementById("txtPassword2").value="";
            document.getElementById("txtPassword2").style.display = 'none';
            var passwordtextbox = document.getElementById(passwordtextboxid);
            passwordtextbox.style.display = 'block';
            passwordtextbox.focus();
}



function ValidateLogin(ClientID,Culture,usernameclientid,passwordclientid)
 {

      var UserName = document.getElementById(usernameclientid).value;
       var Password="";
       
      if((navigator.appName)=="Microsoft Internet Explorer")
       Password = document.getElementById(ClientID+"_txtPassword").value;
       else
       Password=document.getElementById(passwordclientid).value;
       
      var Password2=document.getElementById("txtPassword2").value;
     
      if(Culture=="English")
      {
              if(UserName=="" || UserName=="User name" )
              {
                 alert('Enter the user name');
                 document.getElementById(usernameclientid).focus();
                 return false;
              }
              
              else if( Password2=="Password")
               {
              
                    alert('Enter the password');
                    document.getElementById("txtPassword2").focus();
                   
                    return false;
               }
               
               else if(Password == "")
               {
                alert('Enter the password');
                    document.getElementById(passwordclientid).focus();
                    return false;
               }
               else
               {
               
                return true;
               }
       }
       else if(Culture="Arabic")
       {
              if(UserName=="" || UserName=="اسم المستخدم")
              {
                 alert('ادخل اسم المستخدم');
                 document.getElementById(usernameclientid).focus();
                 return false;
              }
              
              else if(Password2=="كلمة المرور")
              {
               alert('أدخل كلمة المرور');
                    document.getElementById("txtPassword2").focus();
                    return false;
              
              }
              else if(Password == "" )
              {
                  alert('أدخل كلمة المرور');
                   document.getElementById(passwordclientid).focus();
                    return false;
              }
             else
               {
                    return true;
               }
            
       }
 }




function changeMakePaymentImg1(ClientId,Culture)
{
   
    
    var image=document.getElementById(ClientId+"_StepImage");
        
    if(Culture == "Arabic")
    {
        image.src="wpresources/images/ar/stepimage11.png";
    }
    else
    {
        image.src="wpresources/images/en/stepimage11.png";
    }
    
}


function changeMakePaymentImg2(ClientId,Culture)
{
   
    
    var image=document.getElementById(ClientId+"_StepImage");
        
    if(Culture == "Arabic")
    {
        image.src="wpresources/images/ar/stepimage21.png";
    }
    else
    {
        image.src="wpresources/images/en/stepimage21.png";
    }
    
}

//APR Region

function ValidateAPRTransHistory(ClientId,Culture)
 {
     if(Culture == "English")
     {
        if(document.getElementById(ClientId+"_DdlAccountNumber").selectedIndex==0)
           {
               alert('Select the Account Number');
                return false;
           }
           
           if(document.getElementById(ClientId+"_TxtFromDate").value == "")
           {
                alert('Select From Date');
                document.getElementById(ClientId+"_TxtFromDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_TxtFromDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,null)== 1))
           {
                alert('From date should not be greater than today\'s date');
                document.getElementById(ClientId+"_TxtFromDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_TxtToDate").value == "")
           {
                alert('Select To Date');
                document.getElementById(ClientId+"_TxtToDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_TxtToDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtToDate").value,null)== 1))
           {
                alert('To date should not be greater than today\'s date');
                document.getElementById(ClientId+"_TxtToDate").focus();
                return false;
           }
           
           DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,null)
//             if(document.getElementById(ClientId+"_TxtToDate").value != "" && document.getElementById(ClientId+"_TxtFromDate").value != "" )
//             {
           if(DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,document.getElementById(ClientId+"_TxtToDate").value)==1)
           {
            alert('From date should not be greater than or equal to To date');
            document.getElementById(ClientId+"_TxtFromDate").focus();
            return false;
           }
//           }
         }
    else if (Culture == "Arabic")
    {
         if(document.getElementById(ClientId+"_DdlAccountNumber").selectedIndex==0)
           {
               alert('إختر رقم الحساب');
                return false;
           }
           
           if(document.getElementById(ClientId+"_TxtFromDate").value == "")
           {
                alert('إختر التاريخ من');
                document.getElementById(ClientId+"_TxtFromDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_TxtFromDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,null)== 1))
           {
                alert('التاريخ من يجب ان يكون اقل من تاريخ اليوم');
                document.getElementById(ClientId+"_TxtFromDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_TxtToDate").value == "")
           {
                alert('إختر التاريخ الى');
                document.getElementById(ClientId+"_TxtToDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_TxtToDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtToDate").value,null)== 1))
           {
                alert('التاريخ الى يجب ان يكون مساوي او اقل من التاريخ اليوم');
                document.getElementById(ClientId+"_TxtToDate").focus();
                return false;
           }
           if(DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,document.getElementById(ClientId+"_TxtToDate").value)==1)
           {
            alert('التاريخ من يجب ان لا يكون مساوي او اكثر من التاريخ الى');
            document.getElementById(ClientId+"_TxtFromDate").focus();
            return false;
           }
         }  
           return true;          
  }



function ValidateAPROnlinePayment(ClientId,Culture)
{
//    if(document.getElementById(ClientId+"_lblOutstandingAmountValue").innerText != "")
//    {
        if(Culture=="English")
        {
            if(document.getElementById(ClientId+"_txtPaymentAmount").value=="")
            {
                 alert("Please enter Payment Amount");
                 document.getElementById(ClientId+"_txtPaymentAmount").focus();
                return false;
            }
	    else if(document.getElementById(ClientId+"_txtPaymentAmount").value < 1)
            {
                 alert("Minimum Payment Amount Should be 1 RO");
                 document.getElementById(ClientId+"_txtPaymentAmount").focus();
                return false;
            }
            else if(document.getElementById(ClientId+"_txtPaymentAmount").value!="")
            {
                if(ValidateAmount(document.getElementById(ClientId+"_txtPaymentAmount").value)!=true)
                {
                    alert("Please enter valid Payment Amount");
                    document.getElementById(ClientId+"_txtPaymentAmount").focus();
                    document.getElementById(ClientId+"_txtPaymentAmount").value="";
                    return false;
                }
            }
            else 
		    {
			    changeMakePaymentImg3(ClientId,Culture)
                	    return true;
		    }
        }
        else if(Culture=="Arabic")
        {
                if(document.getElementById(ClientId+"_txtPaymentAmount").value=="")
                {
                     alert("الرجاء إدخال المبلغ المراد دفعه");
                     document.getElementById(ClientId+"_txtPaymentAmount").focus();
                    return false;
                }
		        else if(document.getElementById(ClientId+"_txtPaymentAmount").value < 1)
            	{
                     alert("الحد الادنى للدفع  ينبغي ان يكون 1 ريال عماني");
                     document.getElementById(ClientId+"_txtPaymentAmount").focus();
                     return false;
            	}
                else if(document.getElementById(ClientId+"_txtPaymentAmount").value!="")
                {
                    if(ValidateAmount(document.getElementById(ClientId+"_txtPaymentAmount").value)!=true)
                    {
                        alert("الرجاء إدخال المبلغ الصحيح");
                        document.getElementById(ClientId+"_txtPaymentAmount").focus();
                        document.getElementById(ClientId+"_txtPaymentAmount").value="";
                        return false;
                    }
                    
                }
                else 
                   {
			        changeMakePaymentImg3(ClientId,Culture)
                	return true;
		            }
        
         }
     //}
//     else
//     {
//       return false;
//     }
}

function ValidateHayyakCallHistory(ClientId,Culture)
 {
  var ExpNumeric =/^[0-9]+$/
  
 if(Culture == "English")
 {
 if(document.getElementById(ClientId+"_DdlGSMNumbers") != null)
 {
    if(document.getElementById(ClientId+"_DdlGSMNumbers").selectedIndex==0)
       {
           alert('Please select GSM Number');
            return false;
       }
       }
       else
       {
                      
       var GSMNo=document.getElementById(ClientId+"_txtGSMNumber");
        if(GSMNo.value=="")
        {
        alert("Please enter GSM number");
        return false;
        }
        if(!GSMNo.value.match(ExpNumeric))
        {
        alert("GSM number should be numeric");
        return false;
        }
        if(GSMNo.value.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
            return false;
        }
        if(GSMNo.value.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
            return false;
        }
        
       }       
       
       
       if(document.getElementById(ClientId+"_TxtFromDate").value == "")
       {
            alert('Select From Date');
            document.getElementById(ClientId+"_TxtFromDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtFromDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,null)== 1))
       {
            alert('From date should not be greater than today\'s date');
            document.getElementById(ClientId+"_TxtFromDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtToDate").value == "")
       {
            alert('Select To Date');
            document.getElementById(ClientId+"_TxtToDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtToDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtToDate").value,null)== 1))
       {
            alert('To date should not be greater than today\'s date');
            document.getElementById(ClientId+"_TxtToDate").focus();
            return false;
       }
       if(DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,document.getElementById(ClientId+"_TxtToDate").value)==1)
       {
        alert('From date should not be greater than or equal to To date');
        document.getElementById(ClientId+"_TxtFromDate").focus();
        return false;
       }
     }
     else if (Culture == "Arabic")
     {
     if(document.getElementById(ClientId+"_DdlGSMNumbers") != null)
 {
     if(document.getElementById(ClientId+"_DdlGSMNumbers").selectedIndex==0)
       {
           alert('الرجاء إختيار رقم الهاتف النقال');
            return false;
       }
       }
       else
       {
        var GSMNo=document.getElementById(ClientId+"_txtGSMNumber");
           if(GSMNo.value=="")
        {
        alert("الرجاء إدخال رقم الهاتف النقال");
        return false;
        }
        if(!GSMNo.value.match(ExpNumeric))
        {
        alert("رقم الهاتف النقال يجب ان يكون رقمياً");
        return false;
        }
        if(GSMNo.value.charAt(0)!='9')
        {
            alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
            return false;
        }
        if(GSMNo.value.length != 8)
        {
            alert("يجب ان يكون الرقم مكون من 8 أرقام");
            return false;
        }
      
       }
       
       if(document.getElementById(ClientId+"_TxtFromDate").value == "")
       {
            alert('إختر التاريخ من');
            document.getElementById(ClientId+"_TxtFromDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtFromDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,null)== 1))
       {
            alert('التاريخ من يجب ان يكون اقل من تاريخ اليوم');
            document.getElementById(ClientId+"_TxtFromDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtToDate").value == "")
       {
            alert('إختر التاريخ الى');
            document.getElementById(ClientId+"_TxtToDate").focus();
            return false;
       }
       if(document.getElementById(ClientId+"_TxtToDate").value != "" && (DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,null)== 1))
       {
            alert('التاريخ الى يجب ان يكون مساوي او اقل من التاريخ اليوم');
            document.getElementById(ClientId+"_TxtToDate").focus();
            return false;
       }
       if(DateCompare(document.getElementById(ClientId+"_TxtFromDate").value,document.getElementById(ClientId+"_TxtToDate").value)==1)
       {
        alert('التاريخ من يجب ان لا يكون مساوي او اكثر من التاريخ الى');
        document.getElementById(ClientId+"_TxtFromDate").focus();
        return false;
       }
     }  
       return true;          
  }

 
 
function DateCompare(StartDate, EndDate) 
{
    if(EndDate==null)
    {
        var Now = new Date();
        EndDate=FormatDate(Now,"M/dd/yyyy");
        month2 = parseInt(EndDate.substring (0, EndDate.indexOf ("/")),10);
        date2 = parseInt(EndDate.substring (EndDate.indexOf ("/")+1, EndDate.lastIndexOf ("/")),10);
        year2 = EndDate.substring (EndDate.lastIndexOf ("/")+1, EndDate.length);
      
    }
    else
    {
        date2 = parseInt(EndDate.substring (0, EndDate.indexOf ("/")),10);
        month2 = parseInt(EndDate.substring (EndDate.indexOf ("/")+1, EndDate.lastIndexOf ("/")),10);
        year2 = EndDate.substring (EndDate.lastIndexOf ("/")+1, EndDate.length);
        
    }
    var date1, date2;
    var month1, month2;
    var year1, year2;

    date1   = parseInt(StartDate.substring (0, StartDate.indexOf ("/")),10);
    month1 = parseInt(StartDate.substring (StartDate.indexOf ("/")+1, StartDate.lastIndexOf ("/")),10);
    year1 = StartDate.substring (StartDate.lastIndexOf ("/")+1, StartDate.length);
   
    if(year1>year2)
    {
        return 1;
    }
    else if(year2>year1)
    {
        return 2;
    }
    else
    {
        if(month1>month2)
        {
            return 1;
        }
        else if(month2>month1)
        {
            return 2;
        }
        else
        {        
        
            if(date1>date2)
            {
                return 1;
            }
            else if (date2>date1)
            {
                return 2;
            }
            else
            {
                return 0;
            }
        }
    }
}

function CreateClientSelectUser(ClientId,Culture)
{
        if(Culture == 'English')
        {
          if( document.getElementById(ClientId+"_ddlClientName") != null)
             {
                  if(document.getElementById(ClientId+"_ddlClientName").selectedIndex==0)
                  {
                    alert("Please select Corporate Client");
                    document.getElementById(ClientId+"_ddlClientName").focus();
                    return false;
                  }
              }
        }
        else if(Culture== 'Arabic')
        {
            if( document.getElementById(ClientId+"_ddlClientName") != null)
             {
                  if(document.getElementById(ClientId+"_ddlClientName").selectedIndex==0)
                  {
                    alert("الرجاء اختيار الشركة العميلة");
                    document.getElementById(ClientId+"_ddlClientName").focus();
                    return false;
                  }
              }
        }
}


var IsAPR=null;

function onGridViewRowSelected(IsAPRUser)
{        
   IsAPR=IsAPRUser;
}

function CreateSubscriberSelectGroup(ClientId,Culture)
{
    if(Culture=='English')
    {
      if( document.getElementById(ClientId+"_ddlAccount") != null)
             {
                  if(document.getElementById(ClientId+"_ddlAccount").selectedIndex==0)
                  {
                    alert("Please select an Account");
                    document.getElementById(ClientId+"_ddlAccount").focus();
                    return false;
                  }
              }
          if( document.getElementById(ClientId+"_ddlGroupName") != null)
             {
                  if(document.getElementById(ClientId+"_ddlGroupName").selectedIndex==0)
                  {
                    alert("Select the Hayyak Group");
                    document.getElementById(ClientId+"_ddlGroupName").focus();
                    return false;
                  }
              }
             
     }
     else if(Culture == 'Arabic')
     {
          
               if( document.getElementById(ClientId+"_ddlAccount") != null)
             {
                  if(document.getElementById(ClientId+"_ddlAccount").selectedIndex==0)
                  {
                    alert("الرجاء اختيار الحساب");
                    document.getElementById(ClientId+"_ddlAccount").focus();
                    return false;
                  }
              }
                if( document.getElementById(ClientId+"_ddlGroupName") != null)
             {
                  if(document.getElementById(ClientId+"_ddlGroupName").selectedIndex==0)
                  {
                    alert("إختر مجموعة حياك");
                    document.getElementById(ClientId+"_ddlGroupName").focus();
                    return false;
                  }
              }
     }
}



function ValidateRechargeAmountCreateSubscriber(ClientId,Culture)
{
       var txtTopUpAmount = document.getElementById(ClientId);  
                                  
       if(Culture=="English")
        {
           if(txtTopUpAmount.value=="")
           {
                     alert("Please enter amount");
                     txtTopUpAmount.focus();
                     return false;
           }
           if(txtTopUpAmount.value > 100 && txtTopUpAmount.value < 1 )
           {
                     alert("Recharge amount should be between RO 1 and RO 100");
                     txtTopUpAmount.focus();
                     return false;
           }
            if(ValidateTopUpAmount(txtTopUpAmount.value)!=true)
            {
                 alert("Amount should be numeric and should not have decimal values");
                 //txtTopUpAmount.value="";
                 txtTopUpAmount.focus();
                 return false;
            }    
              
        }
        else  if(Culture=="Arabic")
        {
             if(txtTopUpAmount.value=="")
               {
                         alert("الرجاء إدخال المبلغ");
                         txtTopUpAmount.focus();
                         return false;
               }
                if((txtTopUpAmount.value > 100) && (txtTopUpAmount.value < 1) )
               {
                         alert("يجب أن يتراوح مبلغ إعادة التعبئة بين 1ر.ع و 100ر.ع");
                         txtTopUpAmount.focus();
                         return false;
               }
            if(ValidateTopUpAmount(txtTopUpAmount.value)!=true)
                {
                     alert("يجب ان يكون المبلغ رقمي و لا يحتوي على القيم العشريه");
                      txtTopUpAmount.focus();
                      //txtTopUpAmount.value="";  
                      return false;                       
                }                
        }   
}



function ValidateExpiryDateCreateSubscriber(ClientId,Culture)
{
    if(Culture == "English")
    {
        if(document.getElementById(ClientId).value == "")
           {
                alert('Select Expiry Date');
                document.getElementById(ClientId).focus();
                return false;
           }
        //if(!(document.getElementById(ClientId).value != "" && CompareDates(document.getElementById(ClientId).value)==0))
        else if((document.getElementById(ClientId).value != "") && (DateCompare(document.getElementById(ClientId).value,null)== 2))
         {
              alert('Expiry date should be greater than today\'s date');
              document.getElementById(ClientId).focus();
              return false;
         }
         else         
         {
            return true;
         }
     }
     else if(Culture == "Arabic")
     {
         if(document.getElementById(ClientId).value == "")
           {
                alert('إختر التاريخ من');
                document.getElementById(ClientId).focus();
                return false;
           }
        else if((document.getElementById(ClientId).value != "") && (DateCompare(document.getElementById(ClientId).value,null)== 2))
         {
              alert('تاريخ انتهاء الصلاحية ينبغي أن يكون أكبر من تاريخ اليوم');
              document.getElementById(ClientId).focus();
              return false;
         }
          else         
         {
            return true;
         }
     }
}



function ManageSubscriberSelectAccount(ClientId,Culture)
{
        if(Culture == 'English')
        {
          if( document.getElementById(ClientId+"_ddlAccount") != null)
             {
                  if(document.getElementById(ClientId+"_ddlAccount").selectedIndex==0)
                  {
                    alert("Please select an Account");
                    document.getElementById(ClientId+"_ddlAccount").focus();
                    return false;
                  }
              }
        }
        else if(Culture== 'Arabic')
        {
            if( document.getElementById(ClientId+"_ddlAccount") != null)
             {
                  if(document.getElementById(ClientId+"_ddlAccount").selectedIndex==0)
                  {
                    alert("الرجاء اختيار حساب الشركة");
                    document.getElementById(ClientId+"_ddlAccount").focus();
                    return false;
                  }
              }
        }
}


function DisableControlsOnLoadInPayment(ClientId)
{
        
        document.getElementById(ClientId+"_lblCheqNo").disabled = true;
        document.getElementById(ClientId+"_lblCheqDate").disabled = true;
        document.getElementById(ClientId+"_lblBank").disabled = true;
        document.getElementById(ClientId+"_lblCheqDate").disabled = true;
        document.getElementById(ClientId+"_txtCheqNo").disabled = true;
        document.getElementById(ClientId+"_txtBank").disabled = true;
        document.getElementById("PaymentDate").disabled=true;
}

function DisableControlsInPayment(ClientId)
{
    var DropDownId=ClientId+"_ddlPaymentMode";
    document.getElementById(ClientId+"_txtCheqNo").value="";
    document.getElementById(ClientId+"_txtCheqDate").value="";
    document.getElementById(ClientId+"_txtBank").value="";
    
     
    if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].text=='Cheque')
    {
        document.getElementById(ClientId+"_lblCheqNo").disabled = false;
        document.getElementById(ClientId+"_lblCheqDate").disabled = false;
        document.getElementById(ClientId+"_lblBank").disabled = false;
        document.getElementById(ClientId+"_txtCheqNo").disabled = false;
        document.getElementById(ClientId+"_txtBank").disabled = false;
        document.getElementById("PaymentDate").disabled=false;
     }
     else
     {
        document.getElementById(ClientId+"_lblCheqNo").disabled = true;
        document.getElementById(ClientId+"_lblCheqDate").disabled = true;
        document.getElementById(ClientId+"_lblBank").disabled = true;
        document.getElementById(ClientId+"_txtCheqNo").disabled = true;
        document.getElementById(ClientId+"_txtBank").disabled = true;
        document.getElementById("PaymentDate").disabled=true;
     }
    
}
function IsAlphabets(strValue)
{            
         var strValue1=strValue.toUpperCase();
            for (i=0;i<strValue1.length;i++)
            {
                  if (strValue1.charAt(i)<"A" || strValue1.charAt(i) > "Z")
                  {
                        return false;
                  }
            }
            return true;
}


function ValidateManageSubscriberUserName(ClientId,Culture)
{
 
 UserName=document.getElementById(ClientId);
 var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9]+([.][a-zA-Z]+)+$/;
 var ExpAlpha=/^[a-zA-Z]+$/
 
 var ExpNumeric =/^[0-9]+$/
 var SxpSpecialChar=/^[a-zA-Z0-9!@#$%^&*(),=/";:"]+$/
 var SpecialChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";
 var SpecialCharsComplete="!@#$%^&*()+=-[]\\\'._;,/{}|\":<>?"


 if(Culture=="English")
 {
         if(UserName.value!="")
         {
           
            if(UserName.value.length<8 || UserName.value.length>16)
            {
                alert("The length of user name should be between 8 to 16 characters");                
                return false;
            }   
                      
            var count=0;
            var i=0;
            var index=-1;
            
            while(i<UserName.value.length)
            {
                index=SpecialChars.indexOf(UserName.value.charAt(i))
                if(index!=-1)
                {
                    alert("User name cannot have special characters other than . and _");
                    return false;
                }
                else                
                {
                    return true ;
                }
                i++;
            } 
             if(!IsAlphabets(UserName.value))
            {      
                alert("User name cannot be numeric and cannot have special characters.");
                return false;
            } 
         }
         else
         {         
            return true;
         }          
           
     }
    else if(Culture=="Arabic")
    {
        if(UserName.value!="")
        {
                          
            if(UserName.value.length<8 || UserName.value.length>16)
            {
                alert("يجب ان يكون إسم المستخدم مكون من 8 الى 16 حرف");
                return false;
            }
          
            var count=0;
            var i=0;
            var index=-1;
            
            while(i<UserName.value.length)
            {
                index=SpecialChars.indexOf(UserName.value.charAt(i))
                if(index!=-1)
                {
                    alert("إسم المستخدم لا يجب ان يحتوى على رموز غير هذا . و  _");
                    return false;
                }
                else                
                {
                    return true ;
                }
                i++;
            }  
              if(!IsAlphabets(UserName.value))
            {
                alert("اسم المستخدم لا يمكن أن تكون رقمية ، ولا يمكن أن يكون أحرف خاصة");
                return false;
            } 
        }   
         else
         {
            return true;
         }   
    }    
}



function ValidateManageSubscriberNumber(ClientId,Culture)
{   
    
  var ExpNumeric =/^[0-9]+$/
     
    MNo=document.getElementById(ClientId);
    
    
    if(Culture=="English")
    {
            if(MNo.value=="")
            {
                alert("Please enter GSM number");
                return false;
            }
            
            if(!MNo.value.match(ExpNumeric))
            {
                alert("GSM number should be numeric");
                return false;
            }
            if(MNo.value.charAt(0)!='9')
            {
                alert("GSM Number should start with \'9\'");
                return false;
            }
             if(MNo.value.length!=8)
            {
                alert("The length of GSM number should be 8 digits");
                return false;
            }
     }
     else if(Culture=="Arabic")
     {
            if(MNo.value=="")
            {
                alert("الرجاء إدخال رقم الهاتف النقال");
                return false;
            }
            
            if(!MNo.value.match(ExpNumeric))
            {
                alert("رقم الهاتف النقال يجب ان يكون رقمياً");
                return false;
            }
            if(MNo.value.charAt(0)!='9')
            {
                alert("يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
                return false;
            }
            if(MNo.value.length!=8)
            {
                alert("يجب ان يكون الرقم مكون من 8 أرقام");
                return false;
            }
      }
      
}

function ValidateAPRTopUpAmount(clientID,Culture,ImageID)
{       
   var column=clientID.substring(clientID.length-1,clientID.length);   
    
        if(column =="4")
            {
                   var txtTopUpAmount = document.getElementById(clientID);                             
                           if(Culture=="English")
                            {
                               if(ValidateTopUpAmount(txtTopUpAmount.value)!=true)
                                    {
                                         alert("Amount should be numeric and should not have decimal values");
                                            txtTopUpAmount.focus();
                                    }      
                            }
                            else  if(Culture=="Arabic")
                            {
                                if(ValidateTopUpAmount(txtTopUpAmount.value)!=true)
                                    {
                                         alert("يجب ان يكون المبلغ رقمي و لا يحتوي على القيم العشريه");
                                          txtTopUpAmount.focus();
                                          txtTopUpAmount.value="";                         
                                    }                
                            }                                                                                                                                                              
            }
        else if(column =="3")
        {
           if(ValidateManageSubscriberNumber(clientID,Culture)!=true)
           {
            txtTopUpAmount.focus();
           }
        }
        else if(column =="2")
        {
           if(ValidateManageSubscriberUserName(clientID,Culture)!=true)
           {
              txtTopUpAmount.focus() ;
           }
        }   
        
        else if(column =="5")
        {
            if(Culture == "English")
                 {
                    if(document.getElementById(clientID).value == "")
                       {
                            alert('Select Expiry Date');
                            document.getElementById(clientID).focus();
                            return false;
                       }
                    if(document.getElementById(clientID).value != "" && DateCompare(document.getElementById(clientID).value,null)!=1)
                       {
                            alert('Expiry date should be greater than today\'s date');
                            document.getElementById(clientID).focus();
                            return false;
                       }
                 } 
            else if (Culture == "Arabic")
                {
                   if(document.getElementById(clientID).value == "")
                       {
                            alert('إختر التاريخ من');
                            document.getElementById(clientID).focus();
                            return false;
                       }
                   if(document.getElementById(clientID).value != "" && DateCompare(document.getElementById(clientID).value,null)!=1)
                       {
                            alert('تاريخ انتهاء الصلاحية وينبغي أن يكون أكبر من اليوم وحتى الآن');
                            document.getElementById(clientID).focus();
                            return false;
                       }
                }
        }  
}

function ValidateManageAprAccountWhenDeactivate(ClientId,Culture)
{
 if( document.getElementById(ClientId+"_ddlCorpClient") != null)
     {
         if(Culture == "English")
         {
            if(document.getElementById(ClientId+"_ddlCorpClient").selectedIndex==0)
              {
                alert("Please select Corporate Client");
                document.getElementById(ClientId+"_ddlCorpClient").focus();
                return false;
              }
         }
         else
         {
            if(document.getElementById(ClientId+"_ddlCorpClient").selectedIndex==0)
              {
                alert("الرجاء اختيار الشركة العميلة");
                document.getElementById(ClientId+"_ddlCorpClient").focus();
                return false;
              }
         }
          
          
      }
      
     if( document.getElementById(ClientId+"_ddlCorpAccount") != null)
     {
         if(Culture == "English")
         {
              if(document.getElementById(ClientId+"_ddlCorpAccount").selectedIndex==0)
              {
                alert("Please select an Account");
                document.getElementById(ClientId+"_ddlCorpAccount").focus();
                return false;
              }
          }
          else
          {
             if(document.getElementById(ClientId+"_ddlCorpAccount").selectedIndex==0)
              {
                alert("الرجاء اختيار الحساب");
                document.getElementById(ClientId+"_ddlCorpAccount").focus();
                return false;
              }
          }
      }
      
      var answer;
      var AccountDropDown=document.getElementById(ClientId+"_ddlCorpAccount");
      if(Culture == "English")
        answer = confirm("Are you sure you want to deactivate Account "+ AccountDropDown.options[AccountDropDown.selectedIndex].innerText+" ?");
       return answer;
}

function ValidateManageAPRAccount(ClientId,Culture)
 {
 
 
    if( document.getElementById(ClientId+"_ddlCorpClient") != null)
     {
         if(Culture == "English")
         {
            if(document.getElementById(ClientId+"_ddlCorpClient").selectedIndex==0)
              {
                alert("Please select Corporate Client");
                document.getElementById(ClientId+"_ddlCorpClient").focus();
                return false;
              }
         }
         else
         {
            if(document.getElementById(ClientId+"_ddlCorpClient").selectedIndex==0)
              {
                alert("الرجاء اختيار الشركة العميلة");
                document.getElementById(ClientId+"_ddlCorpClient").focus();
                return false;
              }
         }
          
          
      }
      
     if( document.getElementById(ClientId+"_ddlCorpAccount") != null)
     {
         if(Culture == "English")
         {
              if(document.getElementById(ClientId+"_ddlCorpAccount").selectedIndex==0)
              {
                alert("Please select an Account");
                document.getElementById(ClientId+"_ddlCorpAccount").focus();
                return false;
              }
          }
          else
          {
             if(document.getElementById(ClientId+"_ddlCorpAccount").selectedIndex==0)
              {
                alert("الرجاء اختيار الحساب");
                document.getElementById(ClientId+"_ddlCorpAccount").focus();
                return false;
              }
          }
      }
      var AmountId=ClientId+"_txtThresholdAmount";
      if(Culture == "English")
      {
           if(document.getElementById(AmountId).value=="")
            {
                alert("Please Enter Amount");
                document.getElementById(AmountId).focus();
                return false;
            }
                       
           if(!ValidateRechargeAmount(AmountId))
            {
               alert("Amount should be numeric and can not have decimal value");
               document.getElementById(AmountId).value="";
               document.getElementById(AmountId).focus();
               return false;
            }
            if(document.getElementById(AmountId).value < 1)
            {
                alert("Please Enter Valid Threshold amount");
                document.getElementById(AmountId).focus();
                return false;
            }
            
       }
       else
       {
            if(document.getElementById(AmountId).value=="")
            {
                alert("الرجاء إدخال المبلغ");
                document.getElementById(AmountId).focus();
                return false;
            }
           
            if(document.getElementById(AmountId).value < 1)
            {
                alert("الرجاء إدخال حد مقبول للمبلغ");
                document.getElementById(AmountId).focus();
                return false;
            }
            
           if(!ValidateRechargeAmount(AmountId))
            {
               alert("ينبغي أن يكون المبلغ بالأرقام وأن لا يحتوي على قيم عشرية");
               document.getElementById(AmountId).value="";
               document.getElementById(AmountId).focus();
               return false;
            }
       }
       
       
    if(document.getElementById(ClientId+"_rbtnMonth").checked)
    {
    if(Culture == 'English')
    {
    
     if(document.getElementById(ClientId+"_ddlDayOfMonth").selectedIndex==0)
          {
            alert("Please select Day Of Month");
            document.getElementById(ClientId+"_ddlDayOfMonth").focus();
            return false;
          }
    }
    else
    {
          if(document.getElementById(ClientId+"_ddlDayOfMonth").selectedIndex==0)
          {
            alert("الرجاء اختيار يوم من الشهر");
            document.getElementById(ClientId+"_ddlDayOfMonth").focus();
            return false;
          }
    }
    
    }
    
   if(document.getElementById(ClientId+"_rbtnWeek").checked)
    {
    if(Culture == 'English')
    {
          if(document.getElementById(ClientId+"_ddlDayOfWeek").selectedIndex==0)
          {
            alert("Please select Day Of Week");
            document.getElementById(ClientId+"_ddlDayOfWeek").focus();
            return false;
          }
    }
    else
    {
        if(document.getElementById(ClientId+"_ddlDayOfWeek").selectedIndex==0)
          {
            alert("الرجاء اختيار يوم من الأسبوع");
            document.getElementById(ClientId+"_ddlDayOfWeek").focus();
            return false;
          }
    
    }
    }
 
 
     if(document.getElementById(ClientId+"_rbtnBarring").checked)
     {
         if(Culture == "English")
         {       
           if(document.getElementById(ClientId+"_txtFrom").value == "")
           {
                alert('Select From Date');
                document.getElementById(ClientId+"_txtFrom").focus();
                return false;
           }
//           if(document.getElementById(ClientId+"_txtFrom").value != "" && CompareDates(document.getElementById(ClientId+"_txtFrom").value)==0)
//           {
//                alert('From date should not be greater than today\'s date');
//                document.getElementById(ClientId+"_txtFrom").focus();
//                return false;
//           }
           if(document.getElementById(ClientId+"_txtTo").value == "")
           {
                alert('Select To Date');
                document.getElementById(ClientId+"_txtTo").focus();
                return false;
           }
        if((document.getElementById(ClientId+"_txtFrom").value != "") && (DateCompare(document.getElementById(ClientId+"_txtFrom").value,null)== 2))                                            
           {
                alert('From date should be greater than today\'s date');
                document.getElementById(ClientId+"_txtFrom").focus();
                return false;
           }
           if(CompareGivenDates(document.getElementById(ClientId+"_txtFrom").value,document.getElementById(ClientId+"_txtTo").value)==0)
           {
            alert('From date should not be greater than or equal to To date');
            document.getElementById(ClientId+"_txtFrom").focus();
            return false;
           }
       }          
     else if (Culture == "Arabic")
        {
           if(document.getElementById(ClientId+"_txtFrom").value == "")
           {
                alert('إختر التاريخ من');
                document.getElementById(ClientId+"_txtFrom").focus();
                return false;
           }
           if((document.getElementById(ClientId+"_txtFrom").value != "") && (DateCompare(document.getElementById(ClientId+"_txtFrom").value,null)== 2))                                            
           {   
//           if(document.getElementById(ClientId+"_txtFrom").value != "" && CompareDates(document.getElementById(ClientId+"_TxtFromDate").value)==0)
//           {
                alert('من التاريخ وينبغي أن يكون أكبر من اليوم وحتى الآن');
                document.getElementById(ClientId+"_txtFrom").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_txtTo").value == "")
           {
                alert('إختر التاريخ الى');
                document.getElementById(ClientId+"_txtTo").focus();
                return false;
           }
           if((document.getElementById(ClientId+"_txtFrom").value != "") && (DateCompare(document.getElementById(ClientId+"_txtFrom").value,null)== 2))                                            
           {
                alert('التاريخ الى يجب ان يكون مساوي او اقل من التاريخ اليوم');
                document.getElementById(ClientId+"_txtTo").focus();
                return false;
           }
           if(CompareGivenDates(document.getElementById(ClientId+"_txtFrom").value,document.getElementById(ClientId+"_txtTo").value)==0)
           {
            alert('التاريخ من يجب ان لا يكون مساوي او اكثر من التاريخ الى');
            document.getElementById(ClientId+"_txtFrom").focus();
            return false;
           }
        }  
        return true;          
      }  
}

function ConfirmDeleteHayyakFromGroup(ClientId)
{
    var answer;
    var strClientId=ClientId.id;
    var endIndex=strClientId.indexOf("_gvCorpDeleteHayyakGroup");
   
    var parentId=strClientId.substring(0,parseInt(endIndex));
    var cultureElement=document.getElementById(parentId+"_InputCultureName");
    
//    if(cultureElement.value=="English")
//    {
//        answer=confirm("Are you sure you want to delete this number from Group?");            
//        return answer;
//    }
//    else if(cultureElement.value=="Arabic")
//    {
//     
//        answer=confirm("هل أنت متاكد إنك تريد إلغاء هذا الرقم من المجموعة");
//        return answer;            
//    }

if(IsAPR=='0')
    {
            if(cultureElement.value=="English")
            {
                answer=confirm("Are you sure you want to delete this number from Group?");            
                return answer;
            }
            else if(cultureElement.value=="Arabic")
            {
             
                answer=confirm("هل أنت متاكد إنك تريد إلغاء هذا الرقم من المجموعة");
                return answer;            
            }
    }
    else
    {
            if(cultureElement.value=="English")
            {
                answer=confirm("This Number is register in APR.If you delete this number then it will be deleted from APR.Are you sure you want to delete this number from Group?");            
                return answer;
            }
            else if(cultureElement.value=="Arabic")
            {
             
                answer=confirm("هل أنت متاكد إنك تريد إلغاء هذا الرقم من المجموعة");
                return answer;            
            }
    }
  
}

function ValidateCheckBox(ClientId,Culture,ddlClientId)
   {       
   var flag = "0";       
      try
      {
         //get target base control.
         TargetBaseControl = document.getElementById(ClientId);
      }
      catch(err)
      {
         TargetBaseControl = null;
      }

   
      if(TargetBaseControl == null) return false;
      
      //get target child control.
      var TargetChildControl = "chkBoxSelect";
            
      //get all the control of the type INPUT in the base control.
      var Inputs = TargetBaseControl.getElementsByTagName("input"); 
            
      for(var n = 0; n < Inputs.length; ++n)
      {
         if(Inputs[n].type == 'checkbox' && Inputs[n].id.indexOf(TargetChildControl,0) >= 0 && Inputs[n].checked)
         {
            //return true;        
            flag = "1";
         }
      }
      
     if(flag == "0")
     {
         if(Culture=="English")
         {
          alert('Select at least one HAYYAK Number');
          return false;
         }
         else if(Culture=="Arabic")
         {
          alert('إختار أخر رقم حياك');
          return false;
         }
     }
     
     if(Culture=="English")
    {
           if(document.getElementById(ddlClientId+"_ddlGroupName").selectedIndex==0)
           {
               alert('Select the HAYYAK Group');
                return false;
           }
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ddlClientId+"_ddlGroupName").selectedIndex==0)
           {
               alert('إختار مجموعة أرقام حياك');
                return false;
           }
    }
    return true;   
   
   }

function ValidateHayyakGroup(ClientId,Culture)
 {
 
    if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_ddlGroupName").selectedIndex==0)
           {
               alert('Select the HAYYAK Group');
                return false;
           }
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_ddlGroupName").selectedIndex==0)
           {
               alert('إختار مجموعة أرقام حياك');
                return false;
           }
    }
     return true;   
  }


function DisableControlsInManageAPRAccount(ClientId)
{
    var RadioId=ClientId+"_rbtnBarring";
    var DayOfMonthRadioId=ClientId+"_rbtnMonth";
    var DayOfWeekRadioId=ClientId+"_rbtnWeek";
    var DayOfMonthDdlId=ClientId+"_ddlDayOfMonth";
    var DayOfWeekDdlId=ClientId+"_ddlDayOfWeek";
    
    //document.getElementById(ClientId+"_txtFrom").value="";
    //document.getElementById(ClientId+"_txtTo").value="";   
    
    if(document.getElementById(DayOfMonthRadioId).checked)
    {
        document.getElementById(DayOfMonthDdlId).disabled=false;
        document.getElementById(DayOfWeekDdlId).disabled=true;
    }
    
    if(document.getElementById(DayOfWeekRadioId).checked)    
    {
        document.getElementById(DayOfWeekDdlId).disabled=false;
        document.getElementById(DayOfMonthDdlId).disabled=true;
    }   
             
    if(document.getElementById(RadioId).checked)
    {
        document.getElementById(DayOfWeekDdlId).disabled=true;
        document.getElementById(DayOfMonthDdlId).disabled=true;
        document.getElementById(ClientId+"_txtTo").disabled = false;
        document.getElementById("calFrom").disabled = false;
        document.getElementById("calTo").disabled = false;       
    }
    else
    {
        document.getElementById(ClientId+"_txtTo").disabled = true;         
        document.getElementById("calFrom").disabled = true;
        document.getElementById("calTo").disabled = true;
    }
    
}


function CheckSpecialChar(ControlId)
{
    var SpecialChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";
    var SpecialCharsComplete="!@#$%^&*()+=-[]\\\'._;,/{}|\":<>?";
    var i=0
    var index=-1
    
    while(i<document.getElementById(ControlId).value.length)
            {
                index=SpecialCharsComplete.indexOf(document.getElementById(ControlId).value.charAt(i));
                if(index!=-1)
                {
                  return false;
                }
                i++;
            }
     return true;
    
}

function CheckNumaricChar(ControlId)
{
    var NumericChars = "0123456789";
    var i=0
    var index=-1
    
    while(i<document.getElementById(ControlId).value.length)
            {
                index=NumericChars.indexOf(document.getElementById(ControlId).value.charAt(i));
                if(index!=-1)
                {
                  return false;
                }
                i++;
            }
     return true;
    
}
function ValidateMakeAPRPayment(ClientId,UICulture)
{
      var DropDownID=ClientId+"_ddlPaymentMode";
      var AmountId=ClientId+"_txtAmount";
      var NumberId=ClientId+"_txtCheqNo";
      var BankNameId=ClientId+"_txtBank";
      var CheqDateId=ClientId+"_txtCheqDate";
      var RecepitId=ClientId+"_txtReceiptNo";
      
      if(UICulture=='English')
      {
          if( document.getElementById(ClientId+"_ddlCorpClient") != null)
             {
                if(document.getElementById(ClientId+"_ddlCorpClient").selectedIndex==0)
                {
                    alert("Please select Corporate Client");
                    document.getElementById(ClientId+"_ddlCorpClient").focus();
                    return false;
                }
             }
         
             if( document.getElementById(ClientId+"_ddlCorpAcc") != null)
             {
                if(document.getElementById(ClientId+"_ddlCorpAcc").selectedIndex==0)
                {
                    alert("Please select an Account");
                    document.getElementById(ClientId+"_ddlCorpAcc").focus();
                    return false;
                }
              }
          
                if(document.getElementById(ClientId+"_ddlPaymentMode").selectedIndex==0)
                {
                    alert("Please select Payment Mode");
                    document.getElementById(ClientId+"_ddlPaymentMode").focus();
                    return false;
                }
                if(document.getElementById(AmountId).value=="")
                {
                    alert("Please Enter Amount");
                    document.getElementById(AmountId).focus();
                    return false;
                }
    
               if(!ValidateRechargeAmount(AmountId))
                {
                   alert("Amount should be numeric and can not have decimal value");
                   document.getElementById(AmountId).value="";
                   document.getElementById(AmountId).focus();
                   return false;
                }
        
             if(document.getElementById(AmountId).value < 1)
                {
                   alert("Payment Amount Should Be More Than RO 1");
                   document.getElementById(AmountId).value="";
                   document.getElementById(AmountId).focus();
                   return false;
                }
                
                if(document.getElementById(RecepitId).value=="")
                {
                    alert("Please Enter Receipt Number");
                    document.getElementById(RecepitId).focus();
                    return false;
                }
                
           if(document.getElementById(RecepitId).value!="")
            {
                var iChars = "!@#$%^&*()+=-[]\';,./{}|\":<>?";            
                var ExpAlpha =/^[a-zA-Z ]+$/            
                var ExpNumeric =/^[0-9]+$/
                var invalid = " ";
                    if(document.getElementById(RecepitId).value.indexOf(invalid) > -1) 
                    {
                         alert("Receipt Number cannot have special characters.");
                           document.getElementById(RecepitId).value="";
                           document.getElementById(RecepitId).focus();
                           return false;
                    }
                
                for (var i = 0; i < document.getElementById(RecepitId).value.length; i++) 
                {
  	                //if (iChars.indexOf(document.getElementById(RecepitId).value.charAt(i)) != -1)   	            
  	                 if(document.getElementById(RecepitId).value.charAt(i).match(ExpNumeric) || document.getElementById(RecepitId).value.charAt(i).match(ExpAlpha))
  	                     {  	                     
  	                         //return true;
  	                     }
                     else
                        {
  	                       alert("Receipt Number cannot have special characters.");
                           document.getElementById(RecepitId).value="";
                           document.getElementById(RecepitId).focus();
                           return false;
  	                    }
  	            }  

            }  
       if(document.getElementById(DropDownID).options[document.getElementById(DropDownID).selectedIndex].text=='Cheque')
        {

                if(document.getElementById(NumberId).value=="")
                {
                    alert("Please Enter Cheque Number");
                    document.getElementById(NumberId).focus();
                    return false;
                }
                
                if(!ValidateRechargeAmount(NumberId))
                {
                    alert("Cheque Number must be numeric");
                    document.getElementById(NumberId).value="";
                    document.getElementById(NumberId).focus();
                    return false;
                }
                
                if(!CheckSpecialChar(NumberId))
                {
                    alert("Cheque Number cannot have Special characters");
                    document.getElementById(NumberId).value="";
                    document.getElementById(NumberId).focus();
                    return false;
                }
                                                             
                if(document.getElementById(BankNameId).value=="")
                {
                    alert("Please Enter Bank Name");
                    document.getElementById(BankNameId).focus();
                    return false;
                }
                
                if(!ValidateName(BankNameId) || !CheckNumaricChar(BankNameId))
                {
                    alert("Bank Name cannot be numaric");
                    document.getElementById(BankNameId).value="";
                    document.getElementById(BankNameId).focus();
                    return false;
                }
                
//                if(!CheckNumaricChar(BankNameId))
//                {
//                    alert("Bank Name cannot be numaric");
//                    document.getElementById(BankNameId).value="";
//                    document.getElementById(BankNameId).focus();
//                    return false;
//                }
                
                if(!CheckSpecialChar(BankNameId))
                {
                    alert("Bank Name cannot have Special characters");
                    document.getElementById(BankNameId).value="";
                    document.getElementById(BankNameId).focus();
                    return false;
                }
                if(document.getElementById(CheqDateId).value=="")
                {
                   alert('Please select a date');
                   return false;
                }
                
                if(document.getElementById(CheqDateId).value!="")
                {
                   var Messsage="";
                   Messsage= ValidateChequeDateInMakeAprPayment(document.getElementById(CheqDateId).value,Culture);
                   if(Messsage!="")
                   {
                        alert(Messsage);
                        return false;
                   }
                   else                   
                   {
                        return true;
                   }
                }
                
                        
//               if(DateCompare(document.getElementById(CheqDateId).value,null)== 2)
//                {
//                    alert("Cheque date cannot be less than today\'s date");
//                    document.getElementById(CheqDateId).Value="";
//                    return false;
//                }
          }
       
      }
      
      else if(UICulture=='Arabic')
      {
       if(document.getElementById(ClientId+"_ddlCorpClient").selectedIndex==0)
        {
            alert("الرجاء اختيار الشركة العميلة");
            document.getElementById(ClientId+"_ddlCorpClient").focus();
            return false;
        }
        
        if(document.getElementById(ClientId+"_ddlCorpAcc").selectedIndex==0)
        {
            alert("الرجاء اختيار الحساب");
            document.getElementById(ClientId+"_ddlCorpAcc").focus();
            return false;
        }
        if(document.getElementById(AmountId).value=="")
        {
            alert("الرجاء إدخال المبلغ");
            document.getElementById(AmountId).focus();
            return false;
        }
          if(document.getElementById(ClientId+"_ddlPaymentMode").selectedIndex==0)
        {
            alert("الرجاء اختيار طريقة الدفع");
            document.getElementById(ClientId+"_ddlPaymentMode").focus();
            return false;
        }
       if(!ValidateRechargeAmount(AmountId))
        {
           alert("ينبغي أن يكون المبلغ بالأرقام وأن لا يحتوي على قيم عشرية");
           document.getElementById(AmountId).value="";
           document.getElementById(AmountId).focus();
           return false;
        }
        
         if(document.getElementById(AmountId).value < 1)
        {
           alert("مقدار مبلغ التسديد يجب أن يكون أكبر من 1ر.ع");
           document.getElementById(AmountId).value="";
           document.getElementById(AmountId).focus();
           return false;
        }
        
        if(document.getElementById(RecepitId).value=="")
        {
            alert("الرجاء إدخال رقم وصل الاستلام");
            document.getElementById(RecepitId).focus();
            return false;
        }
        
        
        if(document.getElementById(RecepitId).value!="")
        {
            var iChars = "!@#$%^&*()+=-[]\';,./{}|\":<>?";
             var ExpAlpha =/^[a-zA-Z ]+$/            
            var ExpNumeric =/^[0-9]+$/
            var invalid = " ";
            if(document.getElementById(RecepitId).value.indexOf(invalid) > -1) 
            {
                 alert("تسلم ولا يمكن أن يكون عدد أحرف خاصة");
                   document.getElementById(RecepitId).value="";
                   document.getElementById(RecepitId).focus();
                   return false;
            }
            
            for (var i = 0; i < document.getElementById(RecepitId).value.length; i++) 
            {
  	            //if (iChars.indexOf(document.getElementById(RecepitId).value.charAt(i)) != -1)   	            
  	             if(document.getElementById(RecepitId).value.charAt(i).match(ExpNumeric) || document.getElementById(RecepitId).value.charAt(i).match(ExpAlpha))
  	                 {
  	                    //return true;
  	                 }
                 else
                    {
  	                   alert("تسلم ولا يمكن أن يكون عدد أحرف خاصة");
                       document.getElementById(RecepitId).value="";
                       document.getElementById(RecepitId).focus();
                       return false;
  	                }
  	        }                     
        }  
             
        if(document.getElementById(DropDownID).options[document.getElementById(DropDownID).selectedIndex].text=='Cheque')
        {
                if(document.getElementById(NumberId).value=="")
                {
                    alert("الرجاء إدخال رقم الشيك");
                    document.getElementById(NumberId).focus();
                    return false;
                }
                
                if(!ValidateRechargeAmount(NumberId))
                {
                    alert("ينبغي أن يكون رقم الشيك بالأرقام");
                    document.getElementById(NumberId).value="";
                    document.getElementById(NumberId).focus();
                    return false;
                }
                
                if(!CheckSpecialChar(NumberId))
                {
                    alert("ينبغي أن لا يحتوي رقم الشيك على أحرف خاصة");
                    document.getElementById(NumberId).value="";
                    document.getElementById(NumberId).focus();
                    return false;
                }
                                                             
                if(document.getElementById(BankNameId).value=="")
                {
                    alert("الرجاء إدخال اسم المصرف");
                    document.getElementById(BankNameId).focus();
                    return false;
                }
                
                if(!ValidateName(BankNameId))
                {
                    alert("اسم المصرف ينبغي أن لا يكون بالأرقام");
                    document.getElementById(BankNameId).value="";
                    document.getElementById(BankNameId).focus();
                    return false;
                }
                
                if(!CheckNumaricChar(BankNameId))
                {
                    alert("اسم المصرف ينبغي أن لا يكون بالأرقام");
                    document.getElementById(BankNameId).value="";
                    document.getElementById(BankNameId).focus();
                    return false;
                }
                
                if(!CheckSpecialChar(BankNameId))
                {
                    alert("ينبغي أن لا يحتوي اسم المصرف على أحرف خاصة");
                    document.getElementById(BankNameId).value="";
                    document.getElementById(BankNameId).focus();
                    return false;
                }
                      
                if(document.getElementById(CheqDateId).value=="")
                {
                   alert('Please select a date');
                   return false;
                }
                  
                if(DateCompare(document.getElementById(CheqDateId).value,null)== 2)
                {
                    alert("تاريخ الشيك ينبغي أن لا يكون أكبر من تاريخ اليوم ");
                    document.getElementById(CheqDateId).Value="";
                    return false;
                }
               
          }
       
      }
}

function CreateSubscriberOnLoad(ClientId)
{

  var SingleRadioId=ClientId+"_rbtnSingleEntry";
  var MultipleRadioId=ClientId+"_rbtnMultipleEntry";
  var AmountId=ClientId+"_txtAmount";
  var NumberId=ClientId+"_txtNumber";
  var NameId=ClientId+"_txtUserName";
  var ExpiryId=ClientId+"_txtMonths";
  var RadioId=ClientId+"_rbtnMultipleEntry";
  var FileID=ClientId+"_lblFileUpload"
  var FileUploadId=ClientId+"_fileUpload1";
  
        document.getElementById(SingleRadioId).checked=true;
	document.getElementById(MultipleRadioId).checked=false;
        document.getElementById(AmountId).disabled = false;
        document.getElementById(NumberId).disabled = false;
        document.getElementById(NameId).disabled = false;
        document.getElementById(ExpiryId).disabled = false;
        document.getElementById("ExpiryDate").disabled = false;
        document.getElementById(FileID).disabled = true;
        document.getElementById(FileUploadId).disabled =true;
}


function ValidateCorporateSubscriber(ClientId,UICulture)
{
      var RadioId=ClientId+"_rbtnMultipleEntry";
      var AmountId=ClientId+"_txtAmount";
      var NumberId=ClientId+"_txtNumber";
      var NameId=ClientId+"_txtUserName";
      var ExpiryId=ClientId+"_txtMonths";
      
      
      if(UICulture=='English')
      {
                if(document.getElementById(ClientId+"_ddlAccount").selectedIndex==0)
                {
                    alert("Please select an Account");
                    document.getElementById(ClientId+"_ddlAccount").focus();
                    return false;
                }
              if(!document.getElementById(RadioId).checked)
              {
                                           
                 if(document.getElementById(NameId).value!="")
                 {
                    
                        if(!ValidateName(NameId))
                        {
                            alert("Subscriber Name cannot be numaric");
                            document.getElementById(NameId).value="";
                            document.getElementById(NameId).focus();
                            return false;
                        }
                        
                      if(document.getElementById(NameId).value.length<8 || document.getElementById(NameId).value.length>16)
                        {
                            alert("The length of Subscriber Name should be between 8 to 16 characters");
                             document.getElementById(NameId).value="";
                            document.getElementById(NameId).focus();
                            return false;
                        }
                        
                        if(!CheckNumaricChar(NameId))
                        {
                            alert("Subscriber Name cannot be numeric");
                            document.getElementById(NameId).value="";
                            document.getElementById(NameId).focus();
                            return false;
                        }
                        
                        if(!CheckSpecialChar(NameId))
                        {
                            alert("Subscriber Name cannot have Special characters");
                            document.getElementById(NameId).Value="";
                            document.getElementById(NameId).focus();
                            return false;
                        }
                        
                  }
                
                if(document.getElementById(NumberId).value=="")
                {
                    alert("Please enter GSM number");
                    document.getElementById(NumberId).focus();
                    return false;
                }
            
                if(!ValidateNumber(NumberId))
                {
                    if((document.getElementById(NumberId).value.length)==8)
                      {
                        alert("GSM number should be numeric");
                      }
                    else
                      {
                        alert("The length of GSM number should be 8 digits");
                      }
                     document.getElementById(NumberId).value="";
                     document.getElementById(NumberId).focus();
                     return false;
                }
                
                if(document.getElementById(NumberId).value.charAt(0)!='9')
                {
                    alert("GSM Number should start with \'9\'");
                    document.getElementById(NumberId).focus();
                    return false;
                }
                
                if(!ValidateRechargeAmount(AmountId))
                {
                    alert("Amount should be numeric and can not have decimal value");
                    document.getElementById(AmountId).value="";
                    document.getElementById(AmountId).focus();
                    return false;
                }
		if(!(document.getElementById(ExpiryId).value != "" && CompareDates(document.getElementById(ExpiryId).value)==0))
                 {
                      alert("Expiry date should not be greater than today\'s date");
                      document.getElementById(ExpiryId).Value="";
                      document.getElementById(ExpiryId).focus();
                      return false;
                 }
              }
              
                 
         }
         else
         {
          if(document.getElementById(ClientId+"_ddlAccount").selectedIndex==0)
                {
                    alert("الرجاء اختيار الحساب");
                    document.getElementById(ClientId+"_ddlAccount").focus();
                    return false;
                }
                
          if(!document.getElementById(RadioId).checked)
          {
              
             if(document.getElementById(NameId).value!="")
             {
                    if(!ValidateName(NameId))
                    {
                            alert("لا يجب ان يكون إسم المستخدم مكون من أرقام");
                            document.getElementById(NameId).value="";
                            document.getElementById(NameId).focus();
                            return false;
                    }
                    
                    if(document.getElementById(NameId).value.length<8 || document.getElementById(NameId).value.length>16)
                    {
                        alert("اسم المستخدم يجب أن يتراوح بين 8 إلى 16 حرف ");
                         document.getElementById(NameId).value="";
                        document.getElementById(NameId).focus();
                        return false;
                    }
                }
                if(document.getElementById(NumberId).value=="")
                {
                    alert("الرجاء إدخال رقم الهاتف النقال");
                    document.getElementById(NumberId).focus();
                    return false;
                }
                
                if(!ValidateNumber(NumberId))
                {
                    if((document.getElementById(NumberId).value.length)==8)
                      {
                         alert("رقم الهاتف النقال يجب ان يكون رقمياً");
                      }
                    else
                      {
                         alert("يجب ان يكون الرقم مكون من 8 أرقام");
                      }
                     document.getElementById(NumberId).value="";
                     document.getElementById(NumberId).focus();
                     return false;
                }
                
                 if(document.getElementById(NumberId).value.charAt(0)!='9')
                {
                    alert("يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
                    document.getElementById(NumberId).focus();
                    return false;
                }
                
                if(!ValidateRechargeAmount(AmountId))
                {
                    alert("المبلغ يجب أن يكون بالأعداد وليس به كسور عشرية");
                    document.getElementById(AmountId).value="";
                    document.getElementById(AmountId).focus();
                    return false;
                }
                
                if(!(document.getElementById(ExpiryId).value != "" && CompareDates(document.getElementById(ExpiryId).value)==0))
                 {
                      alert('تاريخ انتهاء الصلاحية يجب أن لا يكون أكبر من تاريخ اليوم');
                      document.getElementById(ExpiryId).Value="";
                      document.getElementById(ExpiryId).focus();
                      return false;
                 }
              }
               
         }

}


function ValidateRechargeAmount(AmountId)
{
  // var Exp=/^[0-9]+$/;
 //  var Exp1=/^[0-9]+(\.[0-9])$/;
 //  var Exp2=/^[0-9]+(\.[0-9][0-9])$/;
 //  var Exp3=/^[0-9]+(\.[0-9][0-9][0-9])$/;
 
    var Exp=/^[0-9]+$/;
    var Exp1=/^[0-9]+(\.)$/;
    var Exp2=/^[0-9]+(\.)$/;
    var Exp3=/^[0-9]+(\.)$/;
     
   
 
    if((Exp.test(document.getElementById(AmountId).value) || Exp1.test(document.getElementById(AmountId).value) || Exp2.test(document.getElementById(AmountId).value) || Exp3.test(document.getElementById(AmountId).value)))
    {
    return true;
    }	
    else
    {    
       return false;
    }
}


function ValidateNumber(NumberId)
{
  // var Exp=/^[0-9]+$/;
 //  var Exp1=/^[0-9]+(\.[0-9])$/;
  // var Exp2=/^[0-9]+(\.[0-9][0-9])$/;
 //  var Exp3=/^[0-9]+(\.[0-9][0-9][0-9])$/;
    var Exp=/^[0-9]+$/;
    var Exp1=/^[0-9]+(\.[0])$/;
    var Exp2=/^[0-9]+(\.[0][0])$/;
    var Exp3=/^[0-9]+(\.[0][0][0])$/;
     
   if(((Exp.test(document.getElementById(NumberId).value) || Exp1.test(document.getElementById(NumberId).value) || Exp2.test(document.getElementById(NumberId).value) || Exp3.test(document.getElementById(NumberId).value))&& (document.getElementById(NumberId).value.length)==8))
    {
        return true;
    }	
    else
    {
       return false;
    }
}


function ValidateName(NameId)
{
 var ExpNumeric =/^[0-9]+$/;
 //alert(Exp.test(document.getElementById(NameId).value));
 if(!document.getElementById(NameId).value.match(ExpNumeric))
 {
    return true;
 }
 else
 {   
    return false;
 }
 
}


function DisableControls(ClientId)
{
    var RadioId=ClientId+"_rbtnMultipleEntry";
    document.getElementById(ClientId+"_txtAmount").value="";
    document.getElementById(ClientId+"_txtUserName").value="";
    document.getElementById(ClientId+"_txtNumber").value="";
    document.getElementById(ClientId+"_txtMonths").value="";

     
    if(document.getElementById(RadioId).checked)
    {
        document.getElementById(ClientId+"_lblUserName").disabled = true;
        document.getElementById(ClientId+"_lblNumber").disabled = true;
        document.getElementById(ClientId+"_lblAmount").disabled = true;
        document.getElementById(ClientId+"_txtAmount").disabled = true;
        document.getElementById(ClientId+"_txtMonths").disabled = true;
        document.getElementById(ClientId+"_txtUserName").disabled = true;
        document.getElementById(ClientId+"_txtNumber").disabled = true;
        document.getElementById(ClientId+"_lblFileUpload").disabled = false;
        document.getElementById(ClientId+"_fileUpload1").disabled = false;
        document.getElementById(ClientId+"_lblRechargeText1").disabled = true;
        document.getElementById("ExpiryDate").disabled = true;
         
    }
    else
    {
        document.getElementById(ClientId+"_lblUserName").disabled = false;
        document.getElementById(ClientId+"_lblNumber").disabled = false;
        document.getElementById(ClientId+"_lblAmount").disabled = false;
        document.getElementById(ClientId+"_txtAmount").disabled = false;
        document.getElementById(ClientId+"_txtUserName").disabled = false;
        document.getElementById(ClientId+"_txtNumber").disabled = false;
        document.getElementById(ClientId+"_lblFileUpload").disabled = true;
        document.getElementById(ClientId+"_fileUpload1").disabled = true;
        document.getElementById("ExpiryDate").disabled = false;
        document.getElementById(ClientId+"_lblRechargeText1").disabled = false;
        document.getElementById(ClientId+"_txtMonths").disabled = false;
    }
}

function ValidateChequeDateInMakeAprPayment(dateEntered,Culture)
{    
    var dteSix= new Date();
    var dteLast= new Date();
    dteSix.setMonth(dteSix.getMonth()+6);
    dteLast.setMonth(dteLast.getMonth()-1);
    var MMs = dteSix.getMonth()+1;
    var DDs = dteSix.getDate();
    var YYs = dteSix.getFullYear();                     
    var MMl = dteLast.getMonth()+1;
    var DDl = dteLast.getDate();
    var YYl = dteLast.getFullYear();                    
    dteLast= d2c(DDl)+"/"+d2c(MMl)+"/"+YYl;
    dteSix=d2c(DDs)+"/"+d2c(MMs)+"/"+YYs;   
    var MMt = parseInt(dateEntered.substring(dateEntered.indexOf ("/")+1, dateEntered.lastIndexOf ("/")),10);
    var DDt =parseInt(dateEntered.substring (0, dateEntered.indexOf ("/")),10);
    var YYt = dateEntered.substring(dateEntered.lastIndexOf ("/")+1, dateEntered.length);
    var Message="";
//    alert('dteLast:'+dteLast);
//    alert('dteSix:'+dteSix);
//    alert('dateEntered:'+dateEntered);
    if(Culture=="English")
    {
        Message='Cheque date should be between '+ dteLast + ' and '+ dteSix;
    }
    else
    {
        Message='Cheque date should be between '+ dteLast + ' and '+ dteSix;
    }
    if(YYl > YYt)
    {
    //alert('YYl > YYt');
        return Message;
    }
    else
    {
        if(MMl >MMt)
        {
        //alert('MMl >MMt');
            return Message;
        }
        else 
        {        
//            if(MMl < MMt)
//            {
//                return "";
//            }
          // else 
           if(MMl == MMt)
            {
                if(DDl >DDt)
                {
                //alert('DDl >DDt');
                   return Message;
                }  
                else
                {                
                    return "";
                }   
            }     
        }
    }
    
    if(YYs < YYt)
    {
    //alert('YYs < YYt');
        return Message;
    }
    else
    {
        if(MMs <MMt)
        {
        //alert('MMs < MMt:'+MMs+','+MMt);
            return Message;
        }
        else
        {
            if(MMs > MMt)           
            {     //alert('MMs > MMt:'MMs+','+MMt)     ;   
                 //alert('MMs > MMt:'+MMs+','+MMt);
                return "";
            } 
           else if(MMs == MMt)
            {
                if(DDs<DDt)
                {
                    return Message;
                } 
                else
                {
                   // alert('MMs = MMt:'+(MMs == MMt));                   
                    return "";
                }  
            }               
        }
    }    
}

function d2c(theVal)
    {
    if(theVal<10) return "0"+theVal;
    return theVal;
}
 
function ValidateManageSubscriberWhileSaving(ClientID,Culture)
{   
     var rowCount;
    var irowCount;
    var cellCount;
    var gridID=document.getElementById(ClientID);
    var txtBoxID;
    var ImageID;
    var col=1;
    var row=1;
    var irow=1;
    var result=false;
    var i=0;
    var chkBoxID;
    var chkBox;
    var txtBox ;
    var isAnychecked=false;
        if(gridID!= null)
        {
            irowCount= gridID.rows.length; 
            for(irow=1;irow<=irowCount;irow++)
            {
                if(irow!=1)
                {//alert('hi');
                    if(irow < 10)
                    {
                        chkBoxID=ClientID +"_ctl0" + irow +"_ctl00";
                    }
                    else if(irow >= 10 && irow!= irowCount)
                    {
                        chkBoxID=ClientID +"_ctl" + irow +"_ctl00";
                    }
                    chkBox = document.getElementById(chkBoxID);                   
                    if(chkBox.checked == true)
                    {//alert('Checked');
                        isAnychecked=true;
                        irow=irowCount;
                    }                      
                }                        
            }    
            if(isAnychecked)
            {
                 rowCount= gridID.rows.length; 
                 //alert(rowCount);
                for(row=1;row<=rowCount;row++)
                { 
                    if(row!=1)
                    {            
                        if(row < 10)
                        {  
                            chkBoxID=ClientID +"_ctl0" + row +"_ctl00";  
                            chkBox = document.getElementById(chkBoxID);                            
                            if(chkBox.checked == true)
                            {    
                                 txtBoxID= ClientID+"_ctl0"+ row+"_txtItem_"+ (row-2) +"2";                                  
                                 txtBox = document.getElementById(txtBoxID);
                                 result=ValidateManageSubscriberUserName(txtBoxID,Culture); 
                                 //alert(result);
                                   if(result!=true)
                                   {
                                     txtBox.focus();   
                                      return result;
                                   }
                                   txtBoxID= ClientID+"_ctl0"+ row+"_txtItem_"+ (row-2) +"4";   
                                   //alert(txtBoxID);                                                                
                                    txtBox = document.getElementById(txtBoxID);                                   
                                    result=ValidateTopUpAmount(txtBox.value); 
                                    //alert(result);  
                                   if(Culture=="English")
                                    {
                                        if(result!=true)
                                            {
                                                 alert("Amount should be numeric and should not have decimal values");
                                                    txtBox.focus();
                                                     return result;
                                            }
                                         if((txtBox.value>100) || (txtBox.value < 1))
                                            {
                                                alert('يجب أن يتراوح مبلغ إعادة التعبئة بين 1ر.ع و 100ر.ع');
                                                txtBox.focus();
                                                result=false;
                                                return result;
                                            }     
                                    }
                                    else  if(Culture=="Arabic")
                                    {
                                        if(result!=true)
                                            {
                                                 alert("يجب ان يكون المبلغ رقمي و لا يحتوي على القيم العشريه");
                                                  txtBox.focus(); 
                                                   return result;                                                                            
                                            }  
                                        if((txtBox.value>100) || (txtBox.value < 1))
                                            {
                                                alert('أقصى TopUp ينبغي أن يكون المبلغ 100 ريال عماني');
                                                 txtBox.focus();
                                                result=false;
                                                return result;
                                            }               
                                    }                                    
                                     txtBoxID= ClientID+"_ctl0"+ row+"_txtItem_"+ (row-2) +"5"; 
                                     ImageID=ClientID+"_ctl0"+ row+"_imgbtn_"+ (row-2) +"5"; 
                                     if(Culture == "English")
                                         {
                                            if(document.getElementById(txtBoxID).value == "")
                                               {
                                                    alert('Select Expiry Date');
                                                    document.getElementById(txtBoxID).focus();
                                                    result= false;
                                                     return result;
                                               }
                                            //if(document.getElementById(txtBoxID).value != "" && DateCompare(document.getElementById(txtBoxID).value,null)!=1)
                                            //alert(DateCompare(document.getElementById(txtBoxID).value,null));
                                             //alert(txtBoxID);
                                            if((document.getElementById(txtBoxID).value != "") && (DateCompare(document.getElementById(txtBoxID).value,null)== 2))                                            
                                               {
                                                    alert('Expiry date should be greater than today\'s date');
                                                    document.getElementById(txtBoxID).focus();
                                                    result= false;
                                                    return result;
                                               }                                              
                                         } 
                                      else if (Culture == "Arabic")
                                        {
                                           if(document.getElementById(txtBoxID).value == "")
                                               {
                                                    alert('إختر التاريخ من');
                                                    document.getElementById(txtBoxID).focus();
                                                    result= false;
                                                    //row=rowCount;
                                                     return result;
                                               }
                                            if((document.getElementById(txtBoxID).value != "") && (DateCompare(document.getElementById(txtBoxID).value,null)== 2))                                            
                                               {        
                                               alert('تاريخ انتهاء الصلاحية وينبغي أن يكون أكبر من اليوم وحتى الآن');
                                                    document.getElementById(txtBoxID).focus();
                                                    result= false;
                                                    //row=rowCount;
                                                     return result;
                                               }
                                        } 
                            }
                        }
                        else
                        {
                        if(row!=rowCount)
                        {
                             chkBoxID=ClientID +"_ctl" + row +"_ctl00";  
                            chkBox = document.getElementById(chkBoxID);  
                            //alert(chkBoxID);                        
                            if(chkBox.checked == true)
                            {    
                                 txtBoxID= ClientID+"_ctl"+ row+"_txtItem_"+ (row-2) +"2"; 
                                  txtBox = document.getElementById(txtBoxID); 
                                 result=ValidateManageSubscriberUserName(txtBoxID,Culture);
                                   if(result!=true)
                                   {
                                      txtBox.focus();
                                      //row=rowCount;
                                       return result;
                                   }
                                   txtBoxID= ClientID+"_ctl"+ row+"_txtItem_"+ (row-2) +"4";                                   
                                   txtBox = document.getElementById(txtBoxID); 
                                   //alert(txtBoxID+ txtBox.value);  
                                    result=ValidateTopUpAmount(txtBox.value); 
                                   if(Culture=="English")
                                    {
                                       if(result!=true)
                                            {
                                                 alert("Amount should be numeric and should not have decimal values");
                                                    txtBox.focus();
                                                    //row=rowCount;
                                                     return result;
                                            } 
                                        if((txtBox.value>100) || (txtBox.value < 1))
                                            {
                                                alert('Recharge Amount Should Be Between RO 1 And RO 100');
                                                 txtBox.focus();
                                                result=false;
                                                return result;
                                            }     
                                    }
                                    else  if(Culture=="Arabic")
                                    {
                                        if(result!=true)
                                            {
                                                 alert("يجب ان يكون المبلغ رقمي و لا يحتوي على القيم العشريه");
                                                  txtBox.focus(); 
                                                  //row=rowCount; 
                                                   return result;                                                                            
                                            } 
                                         if((txtBox.value>100) || (txtBox.value < 1))
                                            {
                                                alert('أقصى TopUp ينبغي أن يكون المبلغ 100 ريال عماني');
                                                 txtBox.focus();
                                                result=false;
                                                return result;
                                            }                  
                                    } 
                                    
                                     txtBoxID= ClientID+"_ctl"+ row+"_txtItem_"+ (row-2) +"5"; 
                                     ImageID=ClientID+"_ctl"+ row+"_imgbtn_"+ (row-2) +"5"; 
                                     if(Culture == "English")
                                         {
                                            if(document.getElementById(txtBoxID).value == "")
                                               {
                                                    alert('Select Expiry Date');
                                                    document.getElementById(txtBoxID).focus();
                                                    result= false;
                                                    //row=rowCount;
                                                    return result;
                                               }
                                            if((document.getElementById(txtBoxID).value != "") && (DateCompare(document.getElementById(txtBoxID).value,null)== 2))                                            
                                               {
                                                    alert('Expiry date should be greater than today\'s date');
                                                    document.getElementById(txtBoxID).focus();
                                                    result= false;
                                                    //row=rowCount;
                                                    return result;
                                               }
                                         } 
                                    else if (Culture == "Arabic")
                                        {
                                           if(document.getElementById(txtBoxID).value == "")
                                               {
                                                    alert('إختر التاريخ من');
                                                    document.getElementById(txtBoxID).focus();
                                                    result= false;
                                                    //row=rowCount;
                                                     return result;
                                               }
                                           if((document.getElementById(txtBoxID).value != "") && (DateCompare(document.getElementById(txtBoxID).value,null)== 2))                                            
                                               {
                                                    alert('تاريخ انتهاء الصلاحية وينبغي أن يكون أكبر من اليوم وحتى الآن');
                                                    document.getElementById(txtBoxID).focus();
                                                    result= false;
                                                    //row=rowCount;
                                                     return result;
                                               }
                                        } 
                                }
                            }
                          }
                    }
                }
            }
            else            
            {
                 if(culture=="English")
                    {
                        alert('Please select atleast one item');
                        result=false;
                         return result;
                    }            
                else            
                    {
                        alert('يرجى اختيار بند واحد على الأقل');
                        result=false;
                         return result;
                    }
            }
        }
  return result;
}





function ValidateCreateSubscriberWhileSubmit(ClientID,culture)
{
    //alert('hi');
    var rowCount;
    var irowCount;
    var cellCount;
    var gridID=document.getElementById(ClientID);
    var txtBoxID;
    var col=1;
    var row=1;
    var irow=1;
    var result=false;
    var i=0;
    var chkBoxID;
    var chkBox;
    var isAnychecked=false;
   
    if(gridID!= null)
    {          
        irowCount= gridID.rows.length; 
            for(irow=1;irow<=irowCount;irow++)
            {
                if(irow!=1)
                {
                    if(irow < 10)
                    {
                        chkBoxID=ClientID +"_ctl0" + irow +"_ctl00";
                    }
                    else if(irow >= 10 && irow!=irowCount)
                    {
                        chkBoxID=ClientID +"_ctl" + irow +"_ctl00";
                    }
                    chkBox = document.getElementById(chkBoxID);                   
                    if(chkBox.checked == true)
                    {
                        isAnychecked=true;
                        irow=irowCount;
                    }                      
                }                        
            }           
        if(isAnychecked ==true)
        {     
            rowCount= gridID.rows.length; 
            for(row=1;row<=rowCount;row++)
            { 
            //alert(rowCount);
                if(row!=1)
                {            
                        if(row < 10)
                        {  
                            chkBoxID=ClientID +"_ctl0" + row +"_ctl00";  
                            chkBox = document.getElementById(chkBoxID);                            
                            if(chkBox.checked == true)
                            {          
                                    txtBoxID= ClientID+"_ctl0"+ row+"_txtAmount"+ i; 
                                    //alert(txtBoxID);                                  
                                     if(txtBoxID!=null)
                                        {                                           
                                         result=ValidateTopUpAmount(document.getElementById(txtBoxID).value);                            
                                           if(Culture=="English")
                                            {
                                               if(result!=true)
                                                    {
                                                         alert("Amount should be numeric and should not have decimal values");
                                                            document.getElementById(txtBoxID).focus();
                                                            //row=rowCount;
                                                             return result;
                                                    } 
                                               if((document.getElementById(txtBoxID).value>100) || (document.getElementById(txtBoxID).value<1))
                                                    {
                                                        alert('Recharge Amount Should Be Between RO 1 And RO 100');
                                                        document.getElementById(txtBoxID).focus();
                                                        result=false;
                                                        return result;
                                                    }      
                                            }
                                            else  if(Culture=="Arabic")
                                            {
                                                if(result!=true)
                                                    {
                                                         alert("يجب ان يكون المبلغ رقمي و لا يحتوي على القيم العشريه");
                                                          document.getElementById(txtBoxID).focus(); 
                                                          //row=rowCount; 
                                                           return result;                                                                            
                                                    } 
                                                    
                                                 if((document.getElementById(txtBoxID).value>100) || (document.getElementById(txtBoxID).value<1))
                                                    {
                                                        alert('أقصى TopUp ينبغي أن يكون المبلغ 100 ريال عماني');
                                                        document.getElementById(txtBoxID).focus();
                                                        result=false;
                                                        return result;
                                                    }                 
                                            } 
                                        }
                                     txtBoxID=ClientID+"_ctl0"+ row+"_txtExpiryDate"+ i;
                                     //alert(txtBoxID);
                                     if(txtBoxID!=null)
                                        {   
                                         //alert(document.getElementById(txtBoxID));
                                          result= ValidateExpiryDateCreateSubscriber(txtBoxID,culture);
                                          //alert(result);
                                           if(result!=true)
                                             {
                                                //col=cellCount;
                                                //row=rowCount; 
                                                //alert('hi');                                               
                                                document.getElementById(txtBoxID).focus(); 
                                                return result;
                                             }
                                        }                                                                     
                            }                          
                         }
                        else
                        { 
                        if(row!=rowCount )
                        {
                            chkBoxID=ClientID +"_ctl" + row +"_ctl00";
                            chkBox = document.getElementById(chkBoxID);
                            if(chkBox.checked == true)
                            {
                                    txtBoxID=ClientID+"_ctl"+ row+"_txtAmount"+ i;
                                    if(txtBoxID!=null)
                                        {   
                                          result=ValidateTopUpAmount(document.getElementById(txtBoxID).value);                            
                                           if(Culture=="English")
                                            {
                                               if(result!=true)
                                                    {
                                                         alert("Amount should be numeric and should not have decimal values");
                                                            document.getElementById(txtBoxID).focus();
                                                            //row=rowCount;
                                                             return result;
                                                    }
                                                    
                                                 if((document.getElementById(txtBoxID).value>100) || (document.getElementById(txtBoxID).value<1))
                                                    {
                                                        alert('Maximum TopUp Amount Should Be RO 100.');
                                                        document.getElementById(txtBoxID).focus();
                                                        result=false;
                                                        return result;
                                                    }       
                                            }
                                            else  if(Culture=="Arabic")
                                            {
                                                if(result!=true)
                                                    {
                                                         alert("يجب ان يكون المبلغ رقمي و لا يحتوي على القيم العشريه");
                                                          document.getElementById(txtBoxID).focus(); 
                                                          //row=rowCount; 
                                                           return result;                                                                            
                                                    }  
                                                  if((document.getElementById(txtBoxID).value>100) || (document.getElementById(txtBoxID).value<1))
                                                    {
                                                        alert('أقصى TopUp ينبغي أن يكون المبلغ 100 ريال عماني');
                                                        document.getElementById(txtBoxID).focus();
                                                        result=false;
                                                        return result;
                                                    }                
                                            } 
                                        }
                                    txtBoxID=ClientID+"_ctl"+ row+"_txtExpiryDate"+ i;
                                    if(txtBoxID!=null)
                                        {   
                                          result= ValidateExpiryDateCreateSubscriber(txtBoxID,culture);
                                           if(!result)
                                                 {
                                                    //col=cellCount;
                                                    //row=rowCount;
                                                    return result;
                                                 }
                                        }
                            }
                           }
                        }                                        
                    i++;
                 }
            }
        }
        else
        {
            if(culture=="English")
            {
                alert('Please select atleast one item');
                result=false;
                return result;
            }            
            else            
            {
                alert('يرجى اختيار بند واحد على الأقل');
                result=false;
                return result;
            }
        }
    }  
  return result;
}


//APR_Region_END
function ValidateService(clientID,culture)
{
    var ddlNumbers=document.getElementById(clientID+"_ddlNumbers");
    if(ddlNumbers.selectedIndex==0)
    {
        if(culture=="English")
        {
            alert("Please select number");
            ddlNumbers.focus();
            return false;
        }
        if(culture=="Arabic")
        {
            alert("الرجاء اختيار الحساب");
            ddlNumbers.focus();
            return false;
        }
        
    }
    
}


//-------------------------------Online Payment End----------------------------------------------
//------------------------------ Disclaimer Page- ------------------------------------------------

function ChangeStatus(var1,var2)
{
 document.all(var1).style.display = "block";
 document.all(var2).style.display = "none";
 
 return false;
}

//----------------------------- Disclaimer Page end --------------------------------------------

//------------------------------ User Registration ------------------------------------
function changeImage3(ClientId,Culture)
{
    //alert("hi");
    var image=document.getElementById(ClientId+"_StepImage");
       
    if(Culture == "Arabic")
    {
        image.src="wpresources/images/ar/stepimage31.png";
    }
    else
    {
        image.src="wpresources/images/en/stepimage31.png";
    }
}


function changeImage2(ClientId,Culture)
{
    var image=document.getElementById(ClientId+"_StepImage");
    if(Culture == "Arabic")
    {
        image.src="wpresources/images/ar/stepimage21.png";
    }
    else
    {
        image.src="wpresources/images/en/stepimage21.png";
    }
}

function changeImage1(ClientId,Culture)
{
   
    
    var image=document.getElementById(ClientId+"_StepImage");
        
    if(Culture == "Arabic")
    {
        image.src="wpresources/images/ar/stepimage11.png";
    }
    else
    {
        image.src="wpresources/images/en/stepimage11.png";
    }
    
}

function ValidateRegistration(ClientId,Culture)
{ 
    UserName=document.getElementById(ClientId+"_TbUserName");
    AccDropDown=document.getElementById(ClientId+"_DdlAccType");
    var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;
    var ExpAlpha=/^[a-zA-Z]+$/
 
    var ExpNumeric =/^[0-9]+$/
    var SxpSpecialChar=/^[a-zA-Z0-9!@#$%^&*(),=/";:"]+$/
    var SpecialChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";
    var SpecialCharsComplete="!@#$%^&*()+=-[]\\\'._;,/{}|\":<>?"

    if(Culture=="English")
    {
        if(UserName.value=="")
        {
            alert("Please enter user name");
            return false;
        }
        if(UserName.value.length<8 || UserName.value.length>16)
        {
            alert("The length of user name should be between 8 to 16 characters");
            return false;
        }
        if(UserName.value.match(ExpNumeric))
        {
            alert("User name cannot be numeric.");
            return false;
        }
        var count=0;
        var i=0;
        var index=-1;
        while(i<UserName.value.length)
        {
            index=SpecialChars.indexOf(UserName.value.charAt(i))
            if(index!=-1)
            {
                alert("User name cannot have special characters other than . and _");
                return false;
            }
            i++;
        }
        TbMobileNumber=document.getElementById(ClientId+"_TbMobileNumber");
        if(TbMobileNumber.value=="")
        {
            alert("Please enter GSM number");
            return false;
        }
        if(!TbMobileNumber.value.match(ExpNumeric))
        {
            alert("GSM number should be numeric");
            return false;
        }
        if(TbMobileNumber.value.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
            return false;
        }
        if(TbMobileNumber.value.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
            return false;
        }
        TbTelephoneNumber=document.getElementById(ClientId+"_TbTelephoneNumber");
        if(AccDropDown.options[AccDropDown.selectedIndex].value=="FixedLine")
        {
            if(TbTelephoneNumber.value=="")
            {
                alert("Please enter Fixed Line number");
                return false;
            }
            if(!TbTelephoneNumber.value.match(ExpNumeric))
            {
                alert("Fixed Line number should be numeric");
                return false;
            }
        }
        if(AccDropDown.options[AccDropDown.selectedIndex].value=="ISP")
        {
            if(TbTelephoneNumber.value=="")
            {
                alert("Please enter Login Name");
                return false;
            }
        }
        if(AccDropDown.selectedIndex==0)
        {
            alert("Select an Account type");
            return false;
        }
        TbAccountNo=document.getElementById(ClientId+"_TbAccountNo");
        if(AccDropDown.options[AccDropDown.selectedIndex].value!="Mobile")
        {
            if(TbAccountNo.value=="")
            {
                alert("Please enter Account number");
                return false;
            }
            if(!TbAccountNo.value.match(ExpNumeric))
            {
                alert("Account number should be numeric");
                return false;
            }
        }
        if(document.getElementById(ClientId+"_DlSecurityID").selectedIndex==0)
        {
            alert("Select an ID Type");                
            return false;
        }
        SecurityId=document.getElementById(ClientId+"_TbSecurityID");
        if(SecurityId.value=="")
        {
            alert("Please enter Security Id");
            return false;
        }
        TbEmail=document.getElementById(ClientId+"_TbEmail");
        if(TbEmail.value=="")
        {
            alert("Please enter E-mail ID");
            return false;
        }
        if(!TbEmail.value.match(ExpEmail))
        {
            alert("E-mail is not in standard format (example: abc@xyz.com)");
            return false;
        }
    }
    else if(Culture=="Arabic")
    {
        if(UserName.value=="")
        {
            alert("الرجاء ادخال اسم المستخدم");
            return false;
        }
        if(UserName.value.length<8 || UserName.value.length>16)
        {
            alert("يجب ان يكون إسم المستخدم مكون من 8 الى 16 حرف");
            return false;
        }
        if(UserName.value.match(ExpNumeric))
        {
            alert("اسم المستخدم لا يمكن ان يكون رقمي");
            return false;
        }
        var count=0;
                               
        TbTelephoneNumber=document.getElementById(ClientId+"_TbTelephoneNumber");
        if(AccDropDown.options[AccDropDown.selectedIndex].value=="FixedLine")
        {
            if(TbTelephoneNumber.value=="")
            {
                alert("الرجاء اختيار رقم هاتف ثابت");
                return false;
            }
            if(!TbTelephoneNumber.value.match(ExpNumeric))
            {
                alert("رقم الهاتف الثابت يجب أن يكون بالأرقام");
                return false;
            }
        }
        if(AccDropDown.options[AccDropDown.selectedIndex].value=="ISP")
        {
            if(TbTelephoneNumber.value=="")
            {
                alert("الرجاء إدخال اسم الدخول");
                return false;
            }
        }
        if(AccDropDown.selectedIndex==0)
        {
            alert("الرجاء اختيار نوع الحساب");
            return false;
        }

        TbAccountNo=document.getElementById(ClientId+"_TbAccountNo");
        if(AccDropDown.options[AccDropDown.selectedIndex].value!="Mobile")
        {
            if(TbAccountNo.value=="")
            {
                alert("الرجاء إدخال رقم الحساب");
                return false;
            }
            if(!TbAccountNo.value.match(ExpNumeric))
            {
                alert("رقم الحساب يجب أن يكون بالأرقام");
                return false;
            }
        }
        TbMobileNumber=document.getElementById(ClientId+"_TbMobileNumber");
        if(TbMobileNumber.value=="")
        {
            alert("الرجاء إدخال رقم الهاتف النقال");
            return false;
        }
        if(!TbMobileNumber.value.match(ExpNumeric))
        {
            alert("رقم الهاتف النقال يجب ان يكون رقمياً");
            return false;
        }
        if(TbMobileNumber.value.charAt(0)!='9')
        {
            alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
            return false;
        }
        if(TbMobileNumber.value.length != 8)
        {
            alert("يجب ان يكون الرقم مكون من 8 أرقام");
            return false;
        }
        if(document.getElementById(ClientId+"_DlSecurityID").selectedIndex==0)
        {
            alert('إختار نوع الهوية');
            return false;
        }
             
        SecurityId=document.getElementById(ClientId+"_TbSecurityID");
        if(SecurityId.value=="")
        {
            alert("الرجاء إدخال رقم بطاقة الحماية");
            return false;
        }
        i=0;
        while(i<SecurityId.value.length)
        {
            index=SpecialCharsComplete.indexOf(SecurityId.value.charAt(i))
            if(index!=-1)
            {
                alert("رقم بطاقة الحماية يجب أن لا يحتوي على حروف خاصة");
                return false;
            }
            i++;
        }
            
        TbEmail=document.getElementById(ClientId+"_TbEmail");
        if(TbEmail.value=="")
        {
            alert("الرجاء إدخال البريد الإلكتروني");
            return false;
        }
            
        if(!TbEmail.value.match(ExpEmail))
        {
            alert("البريد الإلكتروني غير صحيح (مثال : abc@xyz.com )");
            return false;
        }            
    }
}


function ValidatePincode(ClientID,Culture)
{
    if(Culture=="English")
    {
            pincode=document.getElementById(ClientID+"_TbPinCode");
            if(pincode.value=="")
            {
            alert("Please enter the 6 digit Security code");
            return false;
            }
    }
    else if(Culture=="Arabic")
    {
            pincode=document.getElementById(ClientID+"_TbPinCode");
            if(pincode.value=="")
            {
            alert("الرجاء إدخال الرقم السري المكون من 6 أرقام");
            return false;
            }
    
    }
}


function ValidatePassword(ClientId,Culture)
{
 
    if(Culture=="English")
    {
             OldPassword=document.getElementById(ClientId+"_TbEnterPassword");
             NewPassword=document.getElementById(ClientId+"_TbConfirmPassword");
             
              if(OldPassword.value.length<8 || OldPassword.value.length>16)
            {
                alert("The length of password should be between 8 to 16 characters");
                return false;
            }
             
             if(OldPassword.value!=NewPassword.value)
             {
                alert("Passwords donot match");
                return false;
             }                       
            
     }
     else if(Culture=="Arabic")
     {
             OldPassword=document.getElementById(ClientId+"_TbEnterPassword");
             NewPassword=document.getElementById(ClientId+"_TbConfirmPassword");
             
              if(OldPassword.value.length<8 || OldPassword.value.length>16)
            {
                alert("طول كلمة المرور ينبغي ان تكون بين 8 الى 16 حرفا");
                return false;
            }
             
             if(OldPassword.value!=NewPassword.value)
             {
                alert("كلمات المرور غير متطابقات");
                return false;
             }

     }
 }
//--------------end 
//-----------Add Account-----------
function AccountTypeChangeForAddAccount(ClientId,Culture)
{
    var DropDownId=ClientId+"_DdlAccType";
    var ddlAccountType = document.getElementById(DropDownId);
    var MobileNoLbl = ClientId+"_LblMobileNumber";
    var MobileNoTb =  ClientId+"_TbMobileNumber";
     var AccountNoTr = "trAccountNo";
    
    if(Culture == 'English')
    {
         if(document.getElementById(AccountNoTr)!=null)
            document.getElementById(AccountNoTr).style.display = '';        
        if(ddlAccountType.options[ddlAccountType.selectedIndex].value == 'MADA')
        {
            document.getElementById(MobileNoLbl).innerHTML='GSM Number'; 
            document.getElementById(MobileNoTb).maxLength=8;
        }
        else if(ddlAccountType.options[ddlAccountType.selectedIndex].value == 'FixedLine')
        {
            document.getElementById(MobileNoLbl).innerHTML='Fixed line number'; 
            document.getElementById(MobileNoTb).maxLength=8;
        }
        else if(ddlAccountType.options[ddlAccountType.selectedIndex].value == 'ISP')
        {
            document.getElementById(MobileNoLbl).innerHTML='Login name'; 
            document.getElementById(MobileNoTb).maxLength=50;
        }
        else if(ddlAccountType.options[ddlAccountType.selectedIndex].value == 'Hayyak')
        {
            document.getElementById(MobileNoLbl).innerHTML='GSM Number'; 
            document.getElementById(MobileNoTb).maxLength=8;
            if(document.getElementById(AccountNoTr)!=null)
             document.getElementById(AccountNoTr).style.display = 'none';        
        }
    }
    else
    {
        if(document.getElementById(AccountNoTr)!=null)
            document.getElementById(AccountNoTr).style.display = '';
        if(ddlAccountType.options[ddlAccountType.selectedIndex].value == 'MADA')
        {
            document.getElementById(MobileNoLbl).innerHTML='رقم الهاتف النقال'; 
            document.getElementById(MobileNoTb).maxLength=8;
        }
        else if(ddlAccountType.options[ddlAccountType.selectedIndex].value == 'FixedLine')
        {
            document.getElementById(MobileNoLbl).innerHTML='رقم الخط الثابت'; 
            document.getElementById(MobileNoTb).maxLength=8;  
        }
        else if(ddlAccountType.options[ddlAccountType.selectedIndex].value == 'ISP')
        {
            document.getElementById(MobileNoLbl).innerHTML='اسم التسجيل الدخول'; 
            document.getElementById(MobileNoTb).maxLength=50;
        }
        else if(ddlAccountType.options[ddlAccountType.selectedIndex].value == 'Hayyak')
        {
           document.getElementById(MobileNoLbl).innerHTML='رقم الهاتف النقال';             
           document.getElementById(MobileNoTb).maxLength=8;
           
           if(document.getElementById(AccountNoTr)!=null)
            document.getElementById(AccountNoTr).style.display = 'none';        
        }
    }
}
function ValidateAddHayyakNumber(ClientId,Culture)
{   
    
    var ExpNumeric =/^[0-9]+$/
     
    MNo=document.getElementById(ClientId+"_TbMobileNumber");
    
    
    if(Culture=="English")
    {
            if(MNo.value=="")
            {
                alert("Please enter GSM number");
                return false;
            }
            
            if(!MNo.value.match(ExpNumeric))
            {
                alert("GSM number should be numeric");
                return false;
            }
            if(MNo.value.charAt(0)!='9')
            {
                alert("GSM Number should start with \'9\'");
                return false;
            }
             if(MNo.value.length!=8)
            {
                alert("The length of GSM number should be 8 digits");
                return false;
            }
     }
     else if(Culture=="Arabic")
     {
            if(MNo.value=="")
            {
                alert("الرجاء إدخال رقم الهاتف النقال");
                return false;
            }
            
            if(!MNo.value.match(ExpNumeric))
            {
                alert("رقم الهاتف النقال يجب ان يكون رقمياً");
                return false;
            }
            if(MNo.value.charAt(0)!='9')
            {
                alert("يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
                return false;
            }
            if(MNo.value.length!=8)
            {
                alert("يجب ان يكون الرقم مكون من 8 أرقام");
                return false;
            }
      }
      
   
}




/*function ValidateAddAccount(ClientId,Culture)
{
    
    var Exp1 =/^[a-zA-Z0-9]+$/
    var ExpAlpha =/^[a-zA-Z ]+$/
    var ExpSpace=/^[ ][a-zA-Z ]+$/
    var ExpNumeric =/^[0-9]+$/
    var SpecialChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";
    var SpecialCharsComplete="!@#$%^&*()+=-[]\\\'._;,/{}|\":<>?"
    var Exp5=/^[+91]*[0-9]+$/
    var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+[.][a-zA-Z]+$/
    
    AId=document.getElementById(ClientId+"_TbAccountID");
    
    if(Culture=="English")
    {
            if(AId.value=="")
            {
            alert("Please enter Account number");
            return false;
            }
            if(!AId.value.match(ExpNumeric))
            {
            alert("Account number must be numeric");
            return false;
            }
            
            MNo=document.getElementById(ClientId+"_TbMobileNumber");
            
            if(MNo.value=="")
            {
            alert("Please enter GSM number");
            return false;
            }
            
            if(!MNo.value.match(ExpNumeric))
            {
            alert("GSM number should be numeric");
            return false;
            }
            if(MNo.value.charAt(0)!='9')
            {
                alert("GSM Number should start with \'9\'");
                return false;
            }
            if(MNo.value.length!=8)
            {
                alert("The length of GSM number should be 8 digits");
                return false;
            }
            
            
            
           
   }
   else if(Culture="Arabic")
   {
            if(AId.value=="")
            {
            alert("الرجاء إدخال رقم العقد");
            return false;
            }
            if(!AId.value.match(ExpNumeric))
            {
            alert("رقم الهاتف النقال يجب ان يكون رقمياً");
            return false;
            }
            
            MNo=document.getElementById(ClientId+"_TbMobileNumber");
            
            if(MNo.value=="")
            {
            alert("الرجاء إدخال رقم الهاتف النقال");
            return false;
            }
            
            if(!MNo.value.match(ExpNumeric))
            {
            alert("رقم الهاتف النقال يجب ان يكون رقمياً");
            return false;
            }
            if(MNo.value.charAt(0)!='9')
            {
                alert("يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
                return false;
            }
            if(MNo.value.length!=8)
            {
                alert("يجب ان يكون الرقم مكون من 8 أرقام");
                return false;
            }            
            
            
              
   }
   
}*/
//-----------Corporate Registration -----------


function AccountTypeChange(ClientId,Culture)
{
   var DropDownId=ClientId+"_DdlAccType";
    var PhoneNoLbl=ClientId+"_LblPhoneNo";
    var AccountNoLbl=ClientId+"_LblAccountNo";
    var TelephoneNumberTr="trTelephoneNumber"; 
    var AccountNoTr = "trAccountNo";
    var GsmNumberlbl = "trGsmNumber";   
    var SecurityDropDownId=document.getElementById(ClientId+"_DlSecurityID");
    var PhoneNoTxt=ClientId+"_TbTelephoneNumber";
     
    if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='Mobile')
    {  
        document.getElementById(TelephoneNumberTr).style.display = 'none';
        document.getElementById(AccountNoTr).style.display = 'none';
        if(document.getElementById(GsmNumberlbl) != null)
            document.getElementById(GsmNumberlbl).style.display = '';
        if(document.getElementById("trSpace1") != null)//Used for Corporate registration
        {
            document.getElementById("trSpace1").style.display = 'none';
            document.getElementById("trSpace2").style.display = 'none';
            document.getElementById("trSpace3").style.display = '';
            if(document.getElementById("chkRegisterForAPR") != null)
                document.getElementById("chkRegisterForAPR").style.display = 'block';
        }
    }
    else
    {
        document.getElementById(TelephoneNumberTr).style.display = '';
        document.getElementById(AccountNoTr).style.display = '';
        if(document.getElementById(GsmNumberlbl) != null)
            document.getElementById(GsmNumberlbl).style.display = 'none';
        if(document.getElementById("trSpace1") != null)//Used for Corporate registration
        {
            document.getElementById("trSpace1").style.display = '';
            document.getElementById("trSpace2").style.display = '';
            document.getElementById("trSpace3").style.display = 'none';
            if(document.getElementById("chkRegisterForAPR") != null)
                document.getElementById("chkRegisterForAPR").style.display = 'none';
        }
    }
    if(Culture == 'English')
    {
        if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='FixedLine')
        {            
            document.getElementById(PhoneNoLbl).innerHTML='Fixed line number'; 
            document.getElementById(PhoneNoTxt).maxLength=8;
        }
        if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='ISP')
        {              
            document.getElementById(PhoneNoLbl).innerHTML='Login name'; 
            document.getElementById(PhoneNoTxt).maxLength=50;
        }        
    }
    if(Culture == 'Arabic')
    {
        if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='FixedLine')
        {
            document.getElementById(PhoneNoLbl).innerHTML='رقم الخط الثابت'; 
            document.getElementById(PhoneNoTxt).maxLength=8;                            
        }
        if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='ISP')
        {              
            document.getElementById(PhoneNoLbl).innerHTML='اسم التسجيل الدخول'; 
            document.getElementById(PhoneNoTxt).maxLength=50;
        }
    }
}

function validateCorpRegistration(ClientId,Culture)
{
    var DropDownId=ClientId+"_DdlAccType";
    UserName=document.getElementById(ClientId+"_TxtUserName");
    var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;
    var ExpAlpha=/^[a-zA-Z]+$/
 
    var ExpNumeric =/^[0-9]+$/
    var SxpSpecialChar=/^[a-zA-Z0-9!@#$%^&*(),=/";:"]+$/
    var SpecialChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";
    var SpecialCharsComplete="!@#$%^&*()+=-[]\\\'._;,/{}|\":<>?"

    if(Culture=="English")
    {
        if(UserName.value=="")
        {
            alert("Please enter user name");
            return false;
        }
                
        if(UserName.value.length<8 || UserName.value.length>16)
        {
            alert("The length of user name should be between 8 to 16 characters");
            return false;
        }
               
        if(UserName.value.match(ExpNumeric))
        {
            alert("User name cannot be numeric");
            return false;
        }
        var count=0;
        var i=0;
        var index=-1;
                
        while(i<UserName.value.length)
        {
            index=SpecialChars.indexOf(UserName.value.charAt(i))
            if(index!=-1)
            {
                alert("User name cannot have special characters other than . and _");
                return false;
            }
            i++;
        }
        
        TxtGSMNo=document.getElementById(ClientId+"_TxtGSMNo");
        if(TxtGSMNo.value=="")
        {
            alert("Please enter GSM number");
            return false;
        }
        if(!TxtGSMNo.value.match(ExpNumeric))
        {
            alert("GSM number should be numeric");
            return false;
        }
        if(TxtGSMNo.value.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
            return false;
        }
                
        if(TxtGSMNo.value.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
            return false;
        }
                
        if(document.getElementById(ClientId+"_DdlAccType").selectedIndex==0)
        {
            alert("Select an Account Type");                
            return false;
        }
                
        TxtAccountNO=document.getElementById(ClientId+"_TxtAccNo");
        if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value!='Mobile')
        {
            if(TxtAccountNO.value=="")
            {
                alert("Please enter Account number");
                return false;
            }
            if(!TxtAccountNO.value.match(ExpNumeric))
            {
                alert("Account number should be numeric");
                return false;
            }
        }       
        TxtFixedLineNo=document.getElementById(ClientId+"_TbTelephoneNumber");
        if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='FixedLine')
        {
            if(TxtFixedLineNo.value=="")
            {
                alert("Please enter Fixed Line number");
                return false;
            }
            if(!TxtFixedLineNo.value.match(ExpNumeric))
            {
                alert("Fixed Line number should be numeric");
                return false;
            }
        }
        else if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='ISP')
        {
            if(TxtFixedLineNo.value=="")
            {
                alert("Please enter Login Name");
                return false;
            }
        }
        if(document.getElementById(ClientId+"_DlSecurityID").selectedIndex==0)
        {
            alert("Select an ID Type");
            return false;
        }
                
        TxtId=document.getElementById(ClientId+"_TxtId");
        if(TxtId.value=="")
        {
            alert("Please enter the ID");
            return false;
        }
        TxtEmailId=document.getElementById(ClientId+"_TxtEmailId");
        if(TxtEmailId.value=="")
        {
            alert("Please enter E-mail ID");
            return false;
        }
                
        if(!TxtEmailId.value.match(ExpEmail))
        {
            alert("E-mail is not in standard format (example: abc@xyz.com)");
            return false;
        }
        TxtConfirmEmailId=document.getElementById(ClientId+"_TxtConfirmEmailId");
        if(TxtConfirmEmailId.value=="")
        {
            alert("Please confirm the E-mail ID");
            TxtConfirmEmailId.focus();
            return false;
        }
        if(TxtConfirmEmailId.value!=TxtEmailId.value)
        {
            alert("E-mail IDs do not match");
            TxtConfirmEmailId.focus();
            return false;
        }
    }
    else if(Culture=="Arabic")
    {
        if(UserName.value=="")
        {
            alert("الرجاء إدخال إسم المستخدم");
            return false;
        }
                
        if(UserName.value.length<8 || UserName.value.length>16)
        {
            alert("طول اسم المستخدم ينبغي ان يكون بين 8 الى 16 حرفا");
            return false;
        }
        if(UserName.value.match(ExpNumeric))
        {
            alert("لا يجب ان يكون إسم المستخدم مكون من أرقام");
            return false;
        }
        var count=0;
               
        TxtGSMNo=document.getElementById(ClientId+"_TxtGSMNo");
        if(TxtGSMNo.value=="")
        {
            alert("الرجاء إدخال رقم الهاتف النقال");
            return false;
        }
        if(!TxtGSMNo.value.match(ExpNumeric))
        {
            alert("رقم الهاتف النقال يجب ان يكون رقمياً");
            return false;
        }
        if(TxtGSMNo.value.charAt(0)!='9')
        {
            alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
            return false;
        }
        if(TxtGSMNo.value.length != 8)
        {
            alert("يجب ان يكون الرقم مكون من 8 أرقام");
            return false;
        }
        if(document.getElementById(ClientId+"_DdlAccType").selectedIndex==0)
        {
            alert("الرجاء اختيار نوع الحساب");                
            return false;
        }
                
        TxtAccountNO=document.getElementById(ClientId+"_TxtAccNo");
        if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value!='Mobile')
        {
            if(TxtAccountNO.value=="")
            {
                alert("الرجاء إدخال رقم الحساب");
                return false;
            }
            if(!TxtAccountNO.value.match(ExpNumeric))
            {
                alert("رقم الحساب يجب أن يكون بالأرقام");
                return false;
            }
        }       
        TxtFixedLineNo=document.getElementById(ClientId+"_TbTelephoneNumber");
        if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='FixedLine')
        {
            if(TxtFixedLineNo.value=="")
            {
                alert("الرجاء إدخال رقم هاتف ثابت");
                return false;
            }
            if(!TxtFixedLineNo.value.match(ExpNumeric))
            {
                alert("رقم الهاتف الثابت يجب أن يكون بالأرقام");
                return false;
            }
        }
        else if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='ISP')
        {
            if(TxtFixedLineNo.value=="")
            {
                alert("الرجاء إدخال اسم الدخول");
                return false;
            }
        }
                 
        if(document.getElementById(ClientId+"_DlSecurityID").selectedIndex==0)
        {
            alert('إختار نوع الهوية');
            return false;
        }
                 
        TxtId=document.getElementById(ClientId+"_TxtId");
        if(TxtId.value=="")
        {
            alert("الرجاء إدخال رقم البطاقة الشخصية/ رقم جوازِ سفر / رقم بطاقة الإقامة/ الرقم المدني ");
            return false;
        }
        i=0;
        while(i<TxtId.value.length)
        {
            index=SpecialCharsComplete.indexOf(TxtId.value.charAt(i))
            if(index!=-1)
            {
                alert("يجب ان يكون رقم البطاقة الشخصية/ رقم جوازِ سفر / رقم بطاقة الإقامة/ الرقم المدني بدون رموز خاصة ");
                return false;
            }
            i++;
        }

        TxtEmailId=document.getElementById(ClientId+"_TxtEmailId");
        if(TxtEmailId.value=="")
        {
            alert("الرجاء إدخال البريد الإلكتروني");
            return false;
        }
                
        if(!TxtEmailId.value.match(ExpEmail))
        {
            alert("البريد الإلكتروني غير صحيح (مثال : abc@xyz.com )");
            return false;
        }
                
        TxtConfirmEmailId=document.getElementById(ClientId+"_TxtConfirmEmailId");
        if(TxtConfirmEmailId.value=="")
        {
            alert("الرجاء تأكيد البريد الالكتروني المعرف");
            TxtConfirmEmailId.focus();
            return false;
        }
        if(TxtConfirmEmailId.value!=TxtEmailId.value)
        {
            alert("البريد الالكتروني غير مطابق");
            TxtConfirmEmailId.focus();
            return false;
        }            
    }
}


//---------------- end corporate registration ---------------

//---------------------------------------------- FAQ Page --------------------------------------------------

function Alter(Div,ChangeImage,UICulture)
{
    var disp = document.getElementById(Div); 
    var change = document.getElementById(ChangeImage);   
    if(disp.style.display== "none")
    {
        disp.style.display="block";
        change.src = "https://" + location.hostname + "/wpresources/WebsiteImages/w21.jpg";
        hid=false;
    }
    else
    {
	    disp.style.display="none";

   	   if(UICulture=="English")
     	    {
      	
	    	change.src = "https://" + location.hostname + "/wpresources/WebsiteImages/w22.jpg";
	    }
	    else
	    {
		    change.src = "https://" + location.hostname + "/wpresources/WebsiteImages/w22_ar.jpg";
	    }
        hid=true;
    }    
}

//------------------------------------------ End ---------------------------
//---------------------------- Forget Password ------------------------
function ValidateForgotPassword(ClientID,Culture)
 {
    var DropDownId=ClientID+"_DdlAccType";
    var SecurityId = document.getElementById(ClientID+"_txtSecurityId").value;
    var FixedLineNumber = document.getElementById(ClientID+"_TbTelephoneNumber").value;
     var GSMNumber = document.getElementById(ClientID+"_txtGSMNumber").value;
    var AccountNumber=document.getElementById(ClientID+"_txtAccountNumber").value;
    var ExpNumeric =/^[0-9]+$/;
     
    
     if(Culture=="English")
     {
                if(document.getElementById(DropDownId).selectedIndex==0)
                {
                    alert('Select an Account Type');
                    return false;
                }
                if(document.getElementById(ClientID+"_DlSecurityID").selectedIndex==0)
                {
                    alert('Select an ID Type');
                    return false;
                }
                if(SecurityId=="")
                  {
                     alert('Please enter National ID/Passport Number/Resident Card/Civil Number');
                     document.getElementById(ClientID+"_txtSecurityId").focus();
                     return false;
                  }
                  
                   if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value!='Mobile')
                   {
                  
                  if(AccountNumber =="")
                  {
                  alert('Enter the Account Number');
                     document.getElementById(ClientID+"_txtAccountNumber").focus();
                     return false;
                  }
                if(!AccountNumber.match(ExpNumeric))
                    {
                        alert("Account Number should be numeric");
                        document.getElementById(ClientID+"_txtAccountNumber").value="";
                       document.getElementById(ClientID+"_txtAccountNumber").focus();
                        return false;
                    }
                    }
                    
                    
            if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='FixedLine')
            {
                if(FixedLineNumber =="")
                  {
                  alert('Enter the FixedLine Number');
                     document.getElementById(ClientID+"_TbTelephoneNumber").focus();
                     return false;
                  }
                if(!FixedLineNumber.match(ExpNumeric))
                    {
                        alert("FixedLine number should be numeric");
                        document.getElementById(ClientID+"_TbTelephoneNumber").value="";
                       document.getElementById(ClientID+"_TbTelephoneNumber").focus();
                        return false;
                    }
                if(FixedLineNumber.charAt(0)!='2')
                {
                       alert("FixedLine Number should start with \'2\'");
                     document.getElementById(ClientID+"_TbTelephoneNumber").value="";
                       document.getElementById(ClientID+"_TbTelephoneNumber").focus();
                       return false;
                }  
                if(FixedLineNumber.length!=8)
                {
                       alert("The length of FixedLine number should be 8 digits");
                       document.getElementById(ClientID+"_TbTelephoneNumber").value="";
                       document.getElementById(ClientID+"_TbTelephoneNumber").focus();
                       return false;
                }  
            }
            else if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='ISP')
            {
                if(FixedLineNumber =="")
                  {
                  alert('Enter the Login Name');
                     document.getElementById(ClientID+"_TbTelephoneNumber").focus();
                     return false;
                  }
            }
            
             else if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='Mobile')
            {
                if(GSMNumber =="")
                  {
                  alert('Enter the GSM Number');
                     document.getElementById(ClientID+"_txtGSMNumber").focus();
                     return false;
                  }
                if(!GSMNumber.match(ExpNumeric))
                    {
                        alert("GSM number should be numeric");
                        document.getElementById(ClientID+"_txtGSMNumber").value="";
                       document.getElementById(ClientID+"_txtGSMNumber").focus();
                        return false;
                    }
                if(GSMNumber.charAt(0)!='9')
                {
                       alert("GSM Number should start with \'9\'");
                     document.getElementById(ClientID+"_txtGSMNumber").value="";
                       document.getElementById(ClientID+"_txtGSMNumber").focus();
                       return false;
                }  
                if(GSMNumber.length!=8)
                {
                       alert("The length of GSM number should be 8 digits");
                       document.getElementById(ClientID+"_txtGSMNumber").value="";
                       document.getElementById(ClientID+"_txtGSMNumber").focus();
                       return false;
                }  
            }
                return true;
        }
        else if(Culture=="Arabic")
        {
                 if(DropDownId.selectedIndex==0)
                {
                    alert('الرجاء اختيار نوع الحساب');
                    return false;
                }
                
                if(document.getElementById(ClientID+"_DlSecurityID").selectedIndex==0)
                {
                    alert('إختار نوع الهوية');
                    return false;
                }
                if(SecurityId=="")
                {
                     alert('الرجاء ادخال رقم البطاقة الشخصية / اورقم جواز السفر /او رقم بطاقه المقيم / او رقم البطاقة المدنية / او رقم رخصة السجل التجاري');
                     document.getElementById(ClientID+"_txtSecurityId").focus();
                     return false;
                }
                
                if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value!='Mobile')
                   {
                 if(AccountNumber =="")
                  {
                  alert('الرجاء إدخال رقم الحساب');
                     document.getElementById(ClientID+"_txtAccountNumber").focus();
                     return false;
                  }
                if(!AccountNumber.match(ExpNumeric))
                    {
                        alert("رقم الحساب يجب أن يكون بالأرقام");
                        document.getElementById(ClientID+"_txtAccountNumber").value="";
                       document.getElementById(ClientID+"_txtAccountNumber").focus();
                        return false;
                    }
                    }
                    
                    
                if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='FixedLine')
                {
                if(FixedLineNumber =="")
                {
                     alert('الرجاء إدخال رقم الهاتف النقال');
                     document.getElementById(ClientID+"_TbTelephoneNumber").focus();
                     return false;
                }
                if(!FixedLineNumber.match(ExpNumeric))
                {
                     alert("رقم الهاتف النقال يجب ان يكون رقمياً");
                     document.getElementById(ClientID+"_TbTelephoneNumber").value="";
                       document.getElementById(ClientID+"_TbTelephoneNumber").focus();
                     return false;
                }
                if(FixedLineNumber.charAt(0)!='2')
                {
                       alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  2 ");
                       document.getElementById(ClientID+"_TbTelephoneNumber").value="";
                       document.getElementById(ClientID+"_TbTelephoneNumber").focus();
                       return false;
                }
                if(FixedLineNumber.length!=8)
                {
                    alert("يجب ان يكون الرقم مكون من 8 أرقام");
                   document.getElementById(ClientID+"_TbTelephoneNumber").value="";
                       document.getElementById(ClientID+"_TbTelephoneNumber").focus();
                    return false;
                }
                }
            else if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='ISP')
            {
                if(FixedLineNumber =="")
                  {
                  alert('الرجاء إدخال اسم الدخول');
                     document.getElementById(ClientID+"_TbTelephoneNumber").focus();
                     return false;
                  }
            }
            
             else if(document.getElementById(DropDownId).options[document.getElementById(DropDownId).selectedIndex].value=='Mobile')
            {
                if(GSMNumber =="")
                  {
                  alert('الرجاء إدخال رقم الهاتف المتنقل');
                     document.getElementById(ClientID+"_txtGSMNumber").focus();
                     return false;
                  }
                if(!GSMNumber.match(ExpNumeric))
                    {
                        alert("رقم الهاتف المتنقل يجب أن يكون بالأرقام");
                        document.getElementById(ClientID+"_txtGSMNumber").value="";
                       document.getElementById(ClientID+"_txtGSMNumber").focus();
                        return false;
                    }
                if(GSMNumber.charAt(0)!='9')
                {
                       alert("رقم الهاتف المتنقل يجب أن يبدأ بالرقم 9");
                     document.getElementById(ClientID+"_txtGSMNumber").value="";
                       document.getElementById(ClientID+"_txtGSMNumber").focus();
                       return false;
                }  
                if(GSMNumber.length!=8)
                {
                       alert("رقم الهاتف المتنقل يجب ان يتكون من 8 أرقام");
                       document.getElementById(ClientID+"_txtGSMNumber").value="";
                       document.getElementById(ClientID+"_txtGSMNumber").focus();
                       return false;
                }  
            }
                return true;                
        }
 }
 
 //-----------------------------------------------------------------------------------------------------------------
 
//session timeout script





function BuildXMLResults(){

  if(reqXML.readyState == 4){ //completed state
  
    if(reqXML.status == 200){ //We got a sucess page back
         
      //Check to verify the message from the server 
      //if(reqXML.responseText.indexOf("Session Updated - Server Time:") == -1)
      {
      
        window.status = reqXML.responseText;
       //display the message in the status bar
        SetTimer(timeout,warningtime,culture); //restart timer
      }
      //else
     //{
        //display that that session expired
       // alert("Your session appears to have expired. You may loose your current data.");
      //}
    } 
    else{
      //display server code not be accessed
       if(culture=='English')
      alert("There was a problem retrieving the XML data:\n" + reqXML.statusText);
      else
      alert("يوجد هنالك مشكلة في قراءة المعلومات ");
      }		
  }
}

var reqXML;
    
function LoadXMLDoc(url){ 
  if (window.XMLHttpRequest){ //Mozilla, Firefox, Opera 8.01, Safari
    reqXML = new XMLHttpRequest(); 
    reqXML.onreadystatechange = BuildXMLResults; 
    reqXML.open("GET", url, true); 
    reqXML.send(null); 
  }
  else if(window.ActiveXObject){ //IE
  
    reqXML = new ActiveXObject("Microsoft.XMLHTTP"); 
    if (reqXML) { 
      reqXML.onreadystatechange = BuildXMLResults; 
      reqXML.open("GET", url, true); 
     
      reqXML.send(); 
    } 
  }
  else{ //Older Browsers
  if(culture=='English')
    alert("Your Browser does not support Ajax!");
    else
    alert("إن قارئ الانترنت لا يدعم اجاكس");
    }

} 

      
function ConfirmUpdate()
{
    //load server side page if ok
    LoadXMLDoc(location.href); 
}  

function popup()
{

    var myObject = new Object();
    myObject.pagename = location.href;
    myObject.warningTime = warningtime;
    myObject.Culture = culture;
    var retVal = window.showModalDialog("/_layouts/Logoutfile_OT.html",myObject,"dialogWidth:300px; dialogHeight:120px; center:yes; resizable:0; status:0; help:0; scroll:no");
    if(retVal==0)
    {
        ConfirmUpdate(timeout);
    }
     else if(retVal==1)
    {
   
    document.getElementById(btnid).click();   

     //window.location = "default.aspx";
    }
    else if(retVal==2)
    {
    if(culture=='English')
    {
    alert("Your session has expired.Relogin to continue");
     window.location = "/en/default.aspx";
    }
    else
    {
     alert("معاملتك قد انتهت.  للمتابعة نرجو إعادة الدخول");
     
    window.location = "/ar/default.aspx";
    }
    }
}   
 

var timerObj;
var timeout;
var culture;
var warningtime;
var btnid;
function SetTimer(sessiontimeout,sessionwarningtime,siteculture,clearbtnid)
{
btnid=clearbtnid;
timeout=sessiontimeout;
culture=siteculture;
warningtime=sessionwarningtime;
 
   //set timer to call function to confirm update 
   timerObj = setTimeout("popup()",1000*60*(sessiontimeout-((+sessionwarningtime))));
    
} 

function getBrowserlanguage()

{
alert("The navigator system language is:"+navigator.systemLanguage);

alert("The navigator language is:"+navigator.language);
alert("The navigator user language is:"+navigator.userLanguage);//regional settings
alert("The navigator browser language is:"+navigator.browserLanguage);//internet options
var userLang = (navigator.language) ? navigator.language : navigator.userLanguage; 


}

/*------------------------------------------send sms----------*/
function AddNumber(ID,culture)
{
    var div = document.all('NumberContainer');
    var divHTML = div.innerHTML;

    var TableHtml = CreateStructure(ID,culture);

    div.innerHTML = divHTML + TableHtml;
    return false;
}

function DeleteNumber(ID)
{
    var hdnGsmNumberCount = document.all(ID+'_hdnGsmCount');
    
    if(hdnGsmNumberCount.value == 1)
    {
        return false;
    }   
    
    var TableHtml = "";
    hdnGsmNumberCount.value = hdnGsmNumberCount.value -1;
    
    for(var i=2;i<=hdnGsmNumberCount.value;i++)
    {
        TableHtml = TableHtml + document.all('rcpt'+i).outerHTML;
    }
    var div = document.all('NumberContainer');
    div.innerHTML = "";
    div.innerHTML = TableHtml;  
   
}



function CreateStructure(ID,culture)
{
    var hdnGsmNumberCount = document.all(ID+'_hdnGsmCount');
    if(hdnGsmNumberCount.value < 10)
    {
        var GsmCount = parseInt(hdnGsmNumberCount.value) + 1;
        hdnGsmNumberCount.value = GsmCount;
        
        if(culture == "English")
        {
           var TableHTML = "<table id='rcpt"+GsmCount+"'><tr><td width=70><span>Recipient "+GsmCount+":</span></td><td>&nbsp;&nbsp;<input class='smalltxtbox' type=text maxlength=7 onblur=\"CalculateTotal('"+ID+"');\" runat=server id='ISDCode"+GsmCount+"'/></td><td>&nbsp;<input type=text class='mediumtxtbox' maxlength=20 runat=server id='GsmNumber"+GsmCount+"'/></td></tr></table>"; 
        }
       else
        {
           var TableHTML = "<table id='rcpt"+GsmCount+"'><tr><td width=70><span>المستقبل  "+GsmCount+":</span></td><td>&nbsp;&nbsp;<input class='smalltxtbox' type=text maxlength=7 onblur=\"CalculateTotal('"+ID+"');\" runat=server id='ISDCode"+GsmCount+"'/></td><td>&nbsp;<input type=text class='mediumtxtbox' maxlength=20 runat=server id='GsmNumber"+GsmCount+"'/></td></tr></table>"; 
        }
        return TableHTML;
    }
    else
    if(culture == "English")
    {
        alert('You can add only 10 recipients');
    }
    else
    {
       alert('بإمكانك إضافة 10 مستقبلين');
    }
    return "";
}


function ValidateSmsScreen(ID,culture)
{

    if(document.all(ID+'_NumberList').selectedIndex == 0)
    {
      if(culture == "English")
        {
            alert("Please Select Sender's GSM Number");
        }
      else
        {
            alert("الرجاء إختار رقم هاتف نقال المرسل");
        }
      
      
      document.all(ID+'_NumberList').focus();
      return false;
    }

 
    var hdnGsmNumberCount = document.all(ID+'_hdnGsmCount');
   
    for(var i=1;i<=hdnGsmNumberCount.value;i++)
    {
        var TextElementISD = document.all('ISDCode'+i);
        var TextElementGSM = document.all('GSMNumber'+i);
        
        if(!IsValidGSMNumber(TextElementISD,TextElementGSM,i,culture))
        {
          return false;
        }
    }
   var div = document.all('NumberContainer');
   var hdnHTML = document.all(ID+'_hdnHTML');
   hdnHTML.value = div.innerHTML;
 
   var hdnSmsNumbers = "";
   var hdnIsInternational = "";
   
   for(var i=1;i<=hdnGsmNumberCount.value;i++)
   {
        var TextElementISD = document.all('ISDCode'+i).value;
        var TextElementGSM = document.all('GSMNumber'+i).value;
        if(TextElementISD.charAt(0)=="0")
        {
            while (TextElementISD.charAt(0)=="0")
            {
                TextElementISD=TextElementISD.substring(1,TextElementISD.length);
            }
        } 
        else if(TextElementISD.charAt(0)=="+")
        {
            TextElementISD=TextElementISD.substring(1,TextElementISD.length);
        }
        if(i==1)
        {
           document.all(ID+'_PrimaryRcp').value = TextElementISD + '^' +TextElementGSM;
        }
                
        hdnSmsNumbers = hdnSmsNumbers + TextElementISD + TextElementGSM;
        if(TextElementISD == "968")
        {
            hdnIsInternational = hdnIsInternational + "N";
        }
        else
          {
            hdnIsInternational = hdnIsInternational + "Y";
          }
        if(i!= hdnGsmNumberCount.value)
           {
              hdnSmsNumbers = hdnSmsNumbers + '^';
              hdnIsInternational = hdnIsInternational + '^';
           }
   }
  
   document.all(ID+'_hdnSmsNumbers').value = hdnSmsNumbers;
   document.all(ID+'_hdnIsInternational').value = hdnIsInternational;
   return true;
}

function ClearPage(ClientID)
{
    var Message = document.getElementById(ClientID+"_Message");
    Message.value = "";
    smsTextCount(ClientID);   
}

function IsValidGSMNumber(TextElementISD,TextElementGSM,i,culture)
{    
    var ExpNumeric =/^[0-9]+$/;
    var strISD=TextElementISD.value;
    var strGSM=TextElementGSM.value;
    
    if(TextElementISD.value == "")
    {
        TextElementISD.focus();
        
        if(culture == "English")
        {        
          alert('Please enter the country code');
        }
        else
        {        
          alert('الرجاء أدخال رمز الدولة');
        }        
        return false;
    }
    
    
    if(strISD.charAt(0)=="0")
    {
        while (strISD.charAt(0)=="0")
        {
                strISD=strISD.substring(1,strISD.length);
        }
        if(strISD.length==0)
        {
           if(culture == "English")
            {        
              alert('Please enter the country code');
            }
            else
            {        
              alert('الرجاء أدخال رمز الدولة');
            } 
            TextElementISD.focus();
            TextElementISD.select();
            return false;
       }
        
    }
    else if(strISD.charAt(0)=="+")
    {
        strISD=strISD.substring(1,strISD.length);
    }    
    if(!ExpNumeric.test(strISD))
    {
        if(culture == "English")
        {        
          alert('Country code should be numeric');
        }
        else
        {        
          alert('رمز الدولة يجب ان يكون ارقام');
        }   
       
       TextElementISD.focus();
       TextElementISD.select();
       return false;
    }
    
   /* if(TextElementISD.value.charAt(0)=='0')
    {
        TextElementISD.focus();
         if(culture == "English")
        {        
          alert('Country code should not start with 0. Please change country code for Recipient '+i);
        }
        else
        {        
          alert(i+ 'لا يجب ان يبدأ ISD برقم صفر ');
        }   
        
        return false;
    }*/
    
    if(TextElementGSM.value=="")
    {
        TextElementGSM.focus();
        if(culture == "English")
        {        
          alert('Please enter the GSM Number');
        }
        else
        {        
          alert('الرجاء أدخال رقم الهاتف النقال');
        }  
        
        return false;
    }
    
    if(!ExpNumeric.test(TextElementGSM.value))
    {
       if(culture == "English")
        {        
          alert('GSM number should be numeric');
        }
        else
        {        
          alert('يجب أن يبدأ رقم النقال برقم ');
        }
       TextElementGSM.focus();
       TextElementGSM.select();
       return false;
    }
    
    
  /*  if(TextElementGSM.value.charAt(0)=='0')
    {
        TextElementGSM.focus();
        if(culture == "English")
        {        
          alert('GSM number should not start with 0. Please change GSM number '+i);
        }
        else
        {        
          alert('Arabic : GSM number should not start with 0. Please change GSM number '+i);
        }
        
        return false;
    }          
               
    if(TextElementISD.value=="968"||TextElementISD.value=="00968")
    {
        //check local GSM number
        if(TextElementGSM.value.length!=8)
        {
            //chk prv script
            TextElementGSM.focus();
            if(culture == "English")
            {        
              alert('GSM number should contain \'8\' digits');
            }
            else
            {        
              alert('GSM number should contain \'8\' digits');
            }
        
            return false;
        }
        if(TextElementGSM.value.charAt(0)!='9')
        {
            TextElementGSM.focus();
            if(culture == "English")
            {        
              alert('GSM number should start with \'9\'');
            }
            else
            {        
              alert('يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ');
            }
            
            return false;
        }
        //check for normal GSM Validation
     }           
    else 
     {
        //check the international numbers
        if(TextElementGSM.value.length<6)
        {
            TextElementGSM.focus();
            if(culture == "English")
            {        
              alert('International GSM number '+i+' should contain more than \'6\' digits');
            }
            else
            {        
              alert('الرقم الدولي '+i+' يجب ان يتضمن أكثر من 6 أرقام ');
            }
            
            return false;
        }
     }*/ 
return true;
}    

function smsTextCount(ClientID,culture)
{
  var Message = document.getElementById(ClientID+"_Message");
  var smsText = document.getElementById(ClientID+"_Message").value;
  var smsTextLength = document.getElementById(ClientID+"_Message").value.length;
  var hdnCharacterCount = document.all(ClientID+"_hdnCharacterCount");    
  var hdnCharacterLeft = document.all(ClientID + '_hdnCharactersLeft');
  var hdnSMSLang = document.all(ClientID + '_hdnSMSLang');

  
  if(smsTextLength == 0)
     {
        hdnCharacterCount.value = 0;         
     }
  else
   {
         hdnCharacterCount.value = smsTextLength;
   }
   
   var character;
   var isArabic = 0;
   for(var index=0;index<smsTextLength;index++)
   {
    character= smsText.charCodeAt(index);
    if(character> 1500)
    {
        isArabic = 1;
       hdnSMSLang.value="A";
        break;
    }
   }
   
   if(isArabic == 0)
   {
        hdnCharacterLeft.value = 1000 - eval(smsTextLength);        
        
        if(smsTextLength > 1000)
        {
           Message.value =Message.value.substring(0,1000);
        }
       hdnSMSLang.value="E";
        getSmsCount(0,smsTextLength,ClientID);
   }
   else if(isArabic == 1)
   {
        hdnSMSLang.value="A";
        hdnCharacterLeft.value = 468 - eval(smsTextLength);        
       if(smsTextLength > 468)
        {
           Message.value =Message.value.substring(0,468);
        }      
        getSmsCount(1,smsTextLength,ClientID); 
   }
   
    document.all('CharactersLeft').innerText = Math.ceil(hdnCharacterLeft.value);
    
    return true;
}


function CalculateTotal(ClientID)
{
 var hdnSMSCount = document.all(ClientID+"_hdnSMSCount");
 var hdnGsmNumberCount = document.all(ClientID+'_hdnGsmCount');
 
  
  var amount=0;
   if(hdnSMSCount.value != 0)
   {
      for(var i=1;i<=hdnGsmNumberCount.value;i++)
      {
        var TextElementISD = document.all('ISDCode'+i);
        
        if(TextElementISD.value == "968"||TextElementISD.value=="00968"||TextElementISD.value=="+968")
        {
            amount = amount + hdnSMSCount.value * 10;
        }
        else if(TextElementISD.value != "")
        {
            amount = amount + hdnSMSCount.value * 50;
        }
      }
   }
   
   amount = amount / 1000;
   document.all(ClientID+"_lblAmount").innerText = amount + " RO";
}

function getSmsCount(flag,len,ClientID)
{
   var hdnSMSCount = document.all(ClientID+"_hdnSMSCount");
   var lblCharLength = document.getElementById(ClientID+"_lblCharsEntered");
   var lblSMSCount = document.getElementById(ClientID+"_lblSMSCount"); 
   var CharEnteredLabel = lblCharLength.innerText.split(':')[0];  
   var SMSCountLabel = lblSMSCount.innerText.split(':')[0];
   
   if(flag==1)
   {
            if(len>=0 && len<71)
            {
                 hdnSMSCount.value = "1";
                 CalculateTotal(ClientID); 
            }
            else if(len>70 && len<135)
            {
                 hdnSMSCount.value = "2";
                 CalculateTotal(ClientID);
            }
            else if(len>134 && len<202)
            {
                 hdnSMSCount.value = "3";
                 CalculateTotal(ClientID);
            }
            else if(len>201 && len<269)
            {
                 hdnSMSCount.value = "4";
                 CalculateTotal(ClientID);
            }
            else if(len>268 && len<336)
            {
                 hdnSMSCount.value = "5";
                 CalculateTotal(ClientID);
            }
            else if(len>335 && len<403)
            {
                 hdnSMSCount.value = "6";
                 CalculateTotal(ClientID);
            }
            else if(len>402 && len<469)
            {
                 hdnSMSCount.value = "7";
                 CalculateTotal(ClientID);
            }
            else if(len>468 && len<537)
            {
                 hdnSMSCount.value = "8";
                 CalculateTotal(ClientID);
            }
            else if(len>536 && len<604)
            {
                 hdnSMSCount.value = "9";
                 CalculateTotal(ClientID);
            }
            else if(len>603 && len<671)
            {
                 hdnSMSCount.value = "10";
                 CalculateTotal(ClientID);
            }
            else if(len>670 && len<738)
            {
                 hdnSMSCount.value = "11";
                 CalculateTotal(ClientID);
            }
            else if(len>737 && len<805)
            {
                 hdnSMSCount.value = "12";
                 CalculateTotal(ClientID);
            }
            else if(len>804 && len<872)
            {
                 hdnSMSCount.value = "13";
                 CalculateTotal(ClientID);
            }
            else if(len>871 && len<939)
            {
                 hdnSMSCount.value = "14";
                 CalculateTotal(ClientID);
            }
            else if(len>938)
            {
                 hdnSMSCount.value = "15";
                 CalculateTotal(ClientID);
            }  
     }
     else if(flag == 0)
     {
           if(len>=0 && len<161)
            {
                hdnSMSCount.value = "1"; 
                CalculateTotal(ClientID);
            }
            else if(len>160 && len<306)
            {
                 hdnSMSCount.value = "2";    
                 CalculateTotal(ClientID);    
            }
            else if(len>305 && len<458)
            {
                hdnSMSCount.value = "3";
                CalculateTotal(ClientID);
            
            }
            else if(len>457 && len<610)
            {
                 hdnSMSCount.value = "4";
                 CalculateTotal(ClientID);
            }
            else if(len>609 && len<762)
            {
                 hdnSMSCount.value = "5";
                 CalculateTotal(ClientID);
            }
            else if(len>761 && len<914)
            {
                 hdnSMSCount.value = "6";
                 CalculateTotal(ClientID);
            }
            else if(len>913)
            {
                 hdnSMSCount.value = "7";
                 CalculateTotal(ClientID);
            }
      }
       lblCharLength.innerText= CharEnteredLabel + ": " + len;
       lblSMSCount.innerText= SMSCountLabel + ": " + hdnSMSCount.value; 
   
}

//Flyout Menu  Start

 function HideCoveredDDLs(sDiv) 
   {   
      var oDiv = document.getElementById(sDiv);      
      var colS = document.all.tags("SELECT");        
      if (colS!=null)   
      {   
         for (i=0; i<colS.length; i++)    
         {   
            if (OBJIsUnderDiv(colS[i], oDiv)) 
            {                  
               colS[i].style.visibility="hidden"; 
            }   
         }   
      }   
   }   
  
  function ShowHiddenDDLs()   
   {   
      var colS = document.all.tags("SELECT");   
      if (colS!=null)   
      {   
         for (i=0; i<colS.length; i++)    
            colS[i].style.visibility="inherit";    
      }   
   } 

  
   function OBJIsUnderDiv(oOBJ, oDiv)   
   {   
      var oX1 = findPosX(oOBJ); //oLeft1   
      //alert(oX1);   
      var oX2 = oX1 + oOBJ.offsetWidth; //oLeft2   
      //alert(oX2);   
      var oY1 = findPosY(oOBJ); //oTop1   
      //alert(oY1);   
      var oY2 = oY1 + oOBJ.offsetHeight; //oTop2   
      //alert(oY2);   
      var dX1 = findPosX(oDiv); //dLeft1   
      //alert(dX1);   
      var dX2 = dX1 + oDiv.offsetWidth; //dLeft2   
      //alert(dX2);   
      var dY1 = findPosY(oDiv); //dTop1   
      //alert(dY1);   
      var dY2 = dY1 + oDiv.offsetHeight; //dTop2   
      //alert(dY2);              
      if (oX1>=dX1 && oX1<=dX2 && oY1>=dY1 && oY1<=dY2)  
      { 
        //alert('1');
         return true;            
      }
      if (oX2>=dX1 && oX2<=dX2 && oY2>=dY1 && oY2<=dY2)                    
      {
          //alert('2');
         return true; 
      }
        //alert('3');
      return false;   
   }   
  
   function findPosX(obj)   
   {   
       var curleft = 0;   
       if (obj.offsetParent)   
       {   
           while (obj.offsetParent)   
           {   
               curleft += obj.offsetLeft   
               obj = obj.offsetParent;   
           }   
       }   
       else if (obj.x)   
           curleft += obj.x;   
       return curleft;   
   }   
  
   function findPosY(obj)   
   {   
       var curtop = 0;   
       if (obj.offsetParent)   
       {   
           while (obj.offsetParent)   
           {   
               curtop += obj.offsetTop   
               obj = obj.offsetParent;   
           }   
       }   
       else if (obj.y)   
           curtop += obj.y;   
       return curtop;   
   }   
function is_ie6()
{
     return ((window.XMLHttpRequest == undefined) && (ActiveXObject != undefined));
}
function showDiv()
{
    var div=document.getElementById("div1");
    div.style.zIndex=-1;   
    svn=document.getElementsByTagName("SELECT");
//    var browserName=navigator.appName; 
//    var browserVer=parseInt(navigator.appVersion); 
//    alert(browserName);
//    alert(browserVer);
    for (a=0;a<svn.length;a++)
    {
        if (svn[a].id.indexOf(div)>=0)
        {
            svn[a].style.visibility="visible";
        } 
        else 
        {
            if(is_ie6())
            {
             svn[a].style.visibility="hidden";
            }
        }
    }
    //document.getElementById("menu").style.zIndex=0;
    div.style.zIndex=1;
}
   
function positionIFrame()
{
	if(navigator.userAgent.toLowerCase().indexOf("msie")!=-1)
	{
	    var iframe = document.getElementById('iframetop'); 
	    if(iframe!=null)
        {		   
            //alert('hi');    
            //iframe.src="//0";        
            var layer = document.getElementById("div1");
            layer.style.display = 'block';    
            iframe.style.display = 'block';
            iframe.style.width = layer.offsetWidth-5;
            //iframe.style.height = layer.offsetHeight-5;
            iframe.style.left = layer.offsetLeft;
            iframe.style.top = layer.offsetTop;                    
            //HideDropDowns();
        }   
    }	
}

function HideIframe()
{
    if(document.getElementById("iframetop")!=null)
    {      
        var iframe = document.getElementById("iframetop");
        iframe.style.display = 'none';
    }
}

var m =0;
function showTable(result, context)
{ 
    var div= document.getElementById("div1");
    if(result =="")
    {
        div.innerHTML="";
    }
    else
    {
        var curleft = 0;
        var curtop = 0; 
        var obj;  
        var s=result.split("####");
        var s1= s[0];    
        var LinkID= s[1];    
        var Language= s[2];          
        div.innerHTML = s1;      
        div.className="balloonstyle";        
        var objCenter=document.getElementById(LinkID+"_center");         
        if(objCenter.className !="OmanMobileMenuHighlight" && objCenter.className !="nonMobileMenuHighlight")
        {
            objCenter.className="relatedlinkUnderline";
        }         
        if(Language=="English")
        {        
             obj=document.getElementById(LinkID+"_left");             
             if(obj.offsetParent)
                {
                    while(1) 
                    {
                      curleft += obj.offsetLeft;
                      if(!obj.offsetParent)
                        break;
                      obj = obj.offsetParent;
                    }
                }
                else if(obj.x)
                {
                    curleft += obj.x;
                }          
                if(obj.offsetParent)
                {
                    while(1)
                    {
                      curtop += obj.offsetTop;
                      if(!obj.offsetParent)
                        break;
                      obj = obj.offsetParent;
                    }
                }
                else if(obj.y)
                {
                    curtop += obj.y;
                }        
            document.getElementById("outertab").style.left =curleft;             
            //positionIFrame();	    
            //HideCoveredDDLs("div1"); 
            showDiv();   
        }
        else
        {
            obj=document.getElementById(LinkID+"_right"); 
                if(obj.offsetParent)
                {           
                    while(1) 
                    {
                      curleft += obj.offsetLeft;                   
                      if(!obj.offsetParent)
                        break;
                      obj = obj.offsetParent;
                    }
                }
                else if(obj.x)
                {
                    curleft += obj.x;
                }
              
                if(obj.offsetParent)
                {
                    while(1)
                    {
                      curtop += obj.offsetTop;
                      if(!obj.offsetParent)
                        break;
                      obj = obj.offsetParent;
                    }
                }
                else if(obj.y)
                {
                    curtop += obj.y;
                }                   
                curleft=self.screen.width - curleft;                                                
            document.getElementById("outertab").style.right =curleft-135;
            //positionIFrame();
            showDiv();
        }	  
     }    
}

function hidemenu(id)
{
//alert(i);
	if(m==0)
	{	   
	    document.getElementById("div1").innerHTML =""; 	       
	}  		 
}
function selectedCss(id,isTab)
{
	if(isTab)
	{
	//alert(i);
	    if(m==2 || m==3)
	    {	   
            m=3;
            //alert(m); 
        }
        else
        {
            m=1;	
            //alert(m);
        }
	}
	else
	{
		if(m==1 || m==3)
		{
            m=3;  //alert(m);
        }
        else
        {
            m=2;  //alert(m);
        }
	}
	showDiv();
}

function deselectedCss(id,isTab)
{
    var objCenter=document.getElementById(id+"_center");      
    if(objCenter.className !="OmanMobileMenuHighlight" && objCenter.className !="nonMobileMenuHighlight")
    {
        document.getElementById(id+"_center").className = "relatedlink";
    }       
    setTimeout("hidemenu("+id+")", 300);
	if(isTab)
	{
	    if(m==3)
	    {
	        m=2;  //alert(m);
	    }
	    else if (m==1)
	    {
	        m=0;	  //alert(m);
	    }
	}
	else
	{	
		if(m==3)
		{
	        m=1;  //alert(m);
	    }
	    else if (m==2)
	    {
	        m=0;  //alert(m);
	    }
	}
	ShowHiddenDDLs();
}

function selectedCssArabic(id,isTab)
{
	if(isTab)
	{
	    if(m==2 || m==3)
            m=3;
        else
            m=1;	
	}
	else
	{
		if(m==1 || m==3)
            m=3;
        else
            m=2;
	}
	showDiv();
}

function deselectedCssArabic(id,isTab)
{
    var objCenter=document.getElementById(id+"_center");      
    if(objCenter.className !="OmanMobileMenuHighlight" && objCenter.className !="nonMobileMenuHighlight")
    {
        document.getElementById(id+"_center").className = "relatedlink";
    }
    setTimeout("hidemenu("+id+")", 300);
	if(isTab)
	{
	    if(m==3)
	        m=2;
	    else if (m==1)
	        m=0;	
	}
	else
	{
		if(m==3)
	        m=1;
	    else if (m==2)
	        m=0;
	}
	ShowHiddenDDLs();
}


function changebg(a)
{
	a.style.cursor="hand";		
}

function MenuCollapse(DivID,MainId)
{

    var ctr=document.getElementById(DivID);
    
    if(ctr.style.display !='none')
    {                
        ctr.style.display='none';       
    }
    else
    { 
        ctr.style.display='';
    }
}




function websiteHover(id)
{    
    document.getElementById(id).className = "websiteHover";
}

function relatedlink(id)
{
    document.getElementById(id).className = "relatedlink";
}

function nonMobileMenuHighlight(id,id1,id2)
{  
    document.getElementById(id).className = "nonMobileMenuHighlight";
    document.getElementById(id1).className = "relatedlinkselecteda";
    document.getElementById(id2).className = "relatedlinkselectedb";
}

function OmanMobileMenuHighlight(id,id1,id2)
{  
    document.getElementById(id).className = "OmanMobileMenuHighlight";
    document.getElementById(id1).className = "Mobilerelatedlinkselecteda";
    document.getElementById(id2).className = "Mobilerelatedlinkselectedb";
}

function changebg(a)
{
	a.style.cursor="hand";		
}


var cssmenuids=["cssmenu1"] //Enter id(s) of CSS Horizontal UL menus, separated by commas
var csssubmenuoffset=-1 //Offset of submenus from main menu. Default is 0 pixels.

function createcssmenu2(){
for (var i=0; i<cssmenuids.length; i++){
  var ultags=document.getElementById(cssmenuids[i]).getElementsByTagName("ul")
    for (var t=0; t<ultags.length; t++){
			ultags[t].style.top=ultags[t].parentNode.offsetHeight+csssubmenuoffset+"px"
    	var spanref=document.createElement("span")
			spanref.className="arrowdiv"
			spanref.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;"
			ultags[t].parentNode.getElementsByTagName("a")[0].appendChild(spanref)
    	ultags[t].parentNode.onmouseover=function(){
					this.style.zIndex=100
    	this.getElementsByTagName("ul")[0].style.visibility="visible"
					this.getElementsByTagName("ul")[0].style.zIndex=0
    	}
    	ultags[t].parentNode.onmouseout=function(){
					this.style.zIndex=0
					this.getElementsByTagName("ul")[0].style.visibility="hidden"
					this.getElementsByTagName("ul")[0].style.zIndex=100
    	}
    }
  }
}

if (window.addEventListener)
window.addEventListener("load", createcssmenu2, false)
else if (window.attachEvent)
window.attachEvent("onload", createcssmenu2)








function ValidateSearch(txtSearch,Culture)
{


    var strSearchValue=document.getElementById(txtSearch).value;
    if(Culture=="English")
    {
	        if(strSearchValue=="")
	        {
		        document.getElementById('txtSearch').innerText = "Enter a search keyword";		        
		        document.getElementById('txtSearch').style.fontWeight = "bold";
		        document.getElementById('txtSearch').style.color = "black";
		        return false;
	        }
	        else
	        {	 	       
                var url = window.location.href;
                //alert(url);                           
                var nohttp = url.split('//')[1];        
                var hostPort = nohttp.split('/')[0];        
                var hostAddress = hostPort.split(':')[0];
                var hostAddressPort = hostPort.split(':')[1];	           
	            //url="http://"+hostAddress+':'+ hostAddressPort+"/en/Search.aspx?k=" + strSearchValue + "&cs=OmanMobileWebLib&u=http%3A%2F%2F" + hostAddress;
	             url="https://"+hostAddress+"/en/Search.aspx?k=" + strSearchValue ;
	            window.open(url,'_self');
	          
	            return false;
	        }
	}
	else if(Culture=="Arabic")
	{
	        if(strSearchValue=="")
	        {
	        
		          document.getElementById('txtSearch').innerText = "إدخل كلمة البحث";	
		          document.getElementById('txtSearch').style.fontWeight = "bold";
		        document.getElementById('txtSearch').style.color = "black";
		        return false;
	        }
	        else
	        {	    
                var url = window.location.href;        
                var nohttp = url.split('//')[1];        
                var hostPort = nohttp.split('/')[0];        
                var hostAddress = hostPort.split(':')[0];
                var hostAddressPort = hostPort.split(':')[1];;
	              //url="http://"+hostAddress+"/Search.aspx?k=" + strSearchValue + "&cs=OmanMobileWebLib&u=http%3A%2F%2F" + hostAddress;
	              url="https://"+hostAddress+"/ar/Search.aspx?k=" + strSearchValue ;
	            window.open(url,'_self');
	            return false;
	        }	 
	}
}
//End Search

function clickButton(e, buttonid)
{
    
    var evt = e ? e : window.event;
    var bt = document.getElementById(buttonid);
    if (bt)
       {
            if (evt.keyCode == 13)
                {                    
                    bt.click();
                    return false;
                }
        }
}

function clickSearch(e, txt,language)
{
   
    var evt = e ? e : window.event;
  
   
            if (evt.keyCode == 13)
                { 
                //alert('hii');                   
                   ValidateSearch(txt,language);
                    
                }
        
}


function ValidateUnblliedAmountSearch(ClientId,Culture)
 {
   var ExpNumeric =/^[0-9]+$/;
    if(Culture == "English")
     {
       var TxtGSMNo=document.getElementById(ClientId+"_txtSearchGSMNumber");
        if(TxtGSMNo.value=="")
        {
            alert("Please enter GSM number");
            return false;
        }
        if(!TxtGSMNo.value.match(ExpNumeric))
        {
            alert("GSM number should be numeric");
            return false;
        }
        if(TxtGSMNo.value.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
            return false;
        }
                
        if(TxtGSMNo.value.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
            return false;
        }
     }
     else if (Culture == "Arabic")
     {                 
        var TxtGSMNo=document.getElementById(ClientId+"_txtSearchGSMNumber");
        if(TxtGSMNo.value=="")
        {
            alert("الرجاء إدخال رقم الهاتف النقال");
            return false;
        }
        if(!TxtGSMNo.value.match(ExpNumeric))
        {
            alert("رقم الهاتف النقال يجب ان يكون رقمياً");
            return false;
        }
        if(TxtGSMNo.value.charAt(0)!='9')
        {
            alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
            return false;
        }
        if(TxtGSMNo.value.length != 8)
        {
            alert("يجب ان يكون الرقم مكون من 8 أرقام");
            return false;
        }
     }  
      return true;          
  }




function ValidateBPCCSubmitButton(ClientId)
{   
   ValidateBPCCGOButton(ClientId);        
   var varControl=document.getElementById(ClientId+"_txtPaymentAmount");
    var Exp=/^[0-9]+$/;
    var Exp1=/^[0-9]+(\.[0-9])$/;
    var Exp2=/^[0-9]+(\.[0-9][0-9])$/;
    var Exp3=/^[0-9]+(\.[0-9][0-9][0-9])$/;    
    if(Exp.test(varControl.value) || Exp1.test(varControl.value) || Exp2.test(varControl.value) || Exp3.test(varControl.value))
    {       
    }	
    else
    {
        return false;
    }
    if((parseFloat(varControl.value))<1)
    {  
         alert("Amount should be greater than or equal to 1 R.O");
         return false;
    }
    else 
    {
        return true;
    }
   return true;    
} 



function ValidateBPCCGOButton(ClientId)
{    

     var varControl=document.getElementById(ClientId+"_txtCallerName");
        if(varControl.value=="")
        {
            alert("Please enter name of the caller");
            varControl.focus();
            return false;
        }
      varControl=document.getElementById(ClientId+"_txtCallerPlaceOfWork");
        if(varControl.value=="")
        {
            alert("Please enter place of work of the caller");
            varControl.focus();
            return false;
        }
       varControl=document.getElementById(ClientId+"_txtCallerID");
        if(varControl.value=="")
        {
            alert("Please enter security ID of the caller");
            varControl.focus();
            return false;
        }
        varControl=document.getElementById(ClientId+"_DlSecurityID");
        if(varControl.selectedIndex==0)
        {
            alert("Please select ID type of the caller");
            varControl.focus();
            return false;
        }        
        varControl=document.getElementById(ClientId+"_txtCallerGSMNumber");
        if(varControl.value=="")
        {
            alert("Please enter GSM Number of the caller");
            varControl.focus();
            return false;
        }               
        varControl=document.getElementById(ClientId+"_txtCallerGSMNumber");
        var ExpNumeric =/^[0-9]+$/
        if(varControl.value=="")
        {
            alert("Please enter GSM number");
            varControl.focus();
            return false;
        }
        if(!varControl.value.match(ExpNumeric))
        {
            alert("GSM number should be numeric");
            varControl.focus();
            return false;
        }
        if(varControl.value.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
            varControl.focus();
            return false;
        }
        if(varControl.value.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
            varControl.focus();
            return false;
        }        
        varControl=document.getElementById(ClientId+"_txtCallerEmailID");
        if(varControl.value!="")
        {           
           var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;   
           if(!varControl.value.match(ExpEmail))
                {
                        alert("E-mail is not in standard format (example: abc@xyz.com)");
                        varControl.focus();
                        return false;
                }
             
        }
        varControl=document.getElementById(ClientId+"_DdlAccType");
        if(varControl.selectedIndex==0)
        {
            alert("Please select an account type");
            varControl.focus();
            return false;
        } 
        varControl=document.getElementById(ClientId+"_txtAccountNumber");
        if(!varControl.value.match(ExpNumeric))
        {
             alert("Account number should be numeric");
            varControl.focus();
            return false;
        }  
       varControl=document.getElementById(ClientId+"_txtPOBox");
        if(varControl.value=="")
        {
            alert("Please enter P.O. Box Number of the caller");
            varControl.focus();
            return false;
        }               
    return true;               
}


function ValidateHayyakPinPuk(ClientId,Culture)
{
 
    if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_ddlMSISDN").selectedIndex==0)
           {
               alert('Please select a GSM Number');
               return false;
           }
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_ddlMSISDN").selectedIndex==0)
           {
               alert('الرجاء اختيار رقم هاتف متنقل');
               return false;
           }
    }
    return true;   
  }
  
  function ValidateMadaPinPuk(ClientId,Culture)
{
 
    if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_ddlAccountNumber").selectedIndex==0)
           {
               alert('Please select Account Number');
               return false;
           }
           
           if(document.getElementById(ClientId+"_ddlMSISDN").selectedIndex==0)
           {
               alert('Please select a GSM Number');
               return false;
           }
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_ddlAccountNumber").selectedIndex==0)
           {
               alert("رقم العقد الرجاء إختيار");
               return false;
           }
           
           if(document.getElementById(ClientId+"_ddlMSISDN").selectedIndex==0)
           {
               alert('الرجاء اختيار رقم هاتف متنقل');
               return false;
           }
    }
    return true;   
  }
  
  
  function ValidateHayyakBalanceDetails(ClientId,Culture)
  {
    if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_ddlGSmNumbers")!=null && document.getElementById(ClientId+"_ddlGSmNumbers").selectedIndex==0)
           {
                 alert("Please select GSM Number");
                 document.getElementById(ClientId+"_ddlGSmNumbers").focus();
                 return false;
           }
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_ddlGSmNumbers")!=null && document.getElementById(ClientId+"_ddlGSmNumbers").selectedIndex==0)
                {
                     alert("الرجاء إختيار رقم الهاتف النقال");
                     document.getElementById(ClientId+"_ddlGSmNumbers").focus();
                     return false;
                }
    }
    return true;   
  }
  
  
function LTE_Validate(ClientId,Culture)
{

    var BtnSubmit1=document.getElementById(ClientId+"_BtnSubmit1");
	var ddlPlan=document.getElementById(ClientId+"_ddlPlan");  	
	if(ddlPlan.selectedIndex==0)
        {
            alert("Please select your plan.");
            return false;
        }    
	var val=confirm("Are you sure you want to subscribe?");       	
	if(val)
       	{       	       	
       		return true;
       	}
       	else
       	{	
        	return false;
       	}
   
}



function LTE_EditProfile(status,clientID)
{
   if(status == 'show')
   {      
        var Email = document.getElementById(clientID +"_lblEmailIDValue").innerHTML;
        document.all(clientID +"_Email").value = Email;
        var GSMNo = document.getElementById(clientID +"_lblAltGSMNumberValue").innerHTML;        
        document.all(clientID +"_GSMNo").value = GSMNo;       
        
        document.getElementById("editablerow1").style.display = '';            
        document.getElementById("editablerow2").style.display = '';    
        document.getElementById("fixedrow1").style.display = 'none';
        document.getElementById("fixedrow2").style.display = 'none';
   }
   else if(status == 'hide') 
   {
        document.getElementById("editablerow1").style.display = 'none';            
        document.getElementById("editablerow2").style.display = 'none';    
        document.getElementById("fixedrow1").style.display = '';
        document.getElementById("fixedrow2").style.display = '';     
   }
   return false;
}

function LTE_ValidateTopup(ClientId,Culture,MinAmount,MaxAmount)
{

      MinAmount=parseFloat(MinAmount);
      MaxAmount=parseFloat(MaxAmount)
      var ExpNumeric =/^[0-9]+$/
      var txtTopUpAmount=document.getElementById(ClientId+"_txtTopUpAmount");
     
    if(Culture=="English")
    {          
           if(txtTopUpAmount.value=="")
            {
                 alert("Please enter Payment Amount");
                 document.getElementById(ClientId+"_txtTopUpAmount").focus();
                 return false;
            }
            else if(ValidateTopUpAmount(txtTopUpAmount.value)!=true)
            {
                 alert("Amount should be numeric and should not have decimal values");
                 txtTopUpAmount.focus();
                 txtTopUpAmount.value="";
                 return false;
            }
            else if((parseFloat(txtTopUpAmount.value))<MinAmount||(parseFloat(txtTopUpAmount.value))>MaxAmount)
            {
                 alert("Top-Up amount should be between RO "+MinAmount+" and RO "+MaxAmount);
                 return false;
            }
            else 
                return true;
        }
        else if(Culture=="Arabic")
        {
                if(txtTopUpAmount.value=="")
                {
                     alert("الرجاء إدخال المبلغ المراد دفعه");
                     document.getElementById(ClientId+"_txtTopUpAmount").focus();
                     return false;
                }
                else if(ValidateTopUpAmount(txtTopUpAmount.value)!=true)
                {
                     alert("يجب ان يكون المبلغ رقمي و لا يحتوي على القيم العشريه");
                     txtTopUpAmount.focus();
                     txtTopUpAmount.value="";
                     return false;
                 }
                 else if((parseFloat(txtTopUpAmount.value))<MinAmount||(parseFloat(txtTopUpAmount.value))>MaxAmount)
                 {
                     alert("مبلغ إعادة التعبئة يجب أن يكون بين "+MinAmount+" و RO "+MaxAmount);
                     return false;
                 }
                else 
                    return true;       
        }
}




function MISC_ValidateNext(ClientId,Culture)
{ 
  if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
           {
                 alert("Please select an Account Number");
                 document.getElementById(ClientId+"_DLAccountNo").focus();
                 return false;
           }
         else  if(document.getElementById(ClientId+"_DdlGSMNumber")!=null && document.getElementById(ClientId+"_DdlGSMNumber").selectedIndex==0)
           {
                 alert("Please select a GSM Number");
                 document.getElementById(ClientId+"_DdlGSMNumber").focus();
                 return false;
           }                     
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
            {
                     alert("رقم العقد الرجاء إختيار");
                     document.getElementById(ClientId+"_DLAccountNo").focus();
                     return false;
            }
          else if(document.getElementById(ClientId+"_DdlGSMNumber")!=null && document.getElementById(ClientId+"_DdlGSMNumber").selectedIndex==0)
           {
                  alert('الرجاء اختيار رقم هاتف متنقل');
                 document.getElementById(ClientId+"_DdlGSMNumber").focus();
                 return false;
           }                  
    }
    return true;   
}


function MISC_ValidatePlanChange(ClientId,Culture)
{
  if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_ddlNewPlanList")!=null && document.getElementById(ClientId+"_ddlNewPlanList").selectedIndex==0)
           {
                 alert("Please select a plan");
                 document.getElementById(ClientId+"_ddlNewPlanList").focus();
                 return false;
           }
                    
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_ddlNewPlanList")!=null && document.getElementById(ClientId+"_ddlNewPlanList").selectedIndex==0)
            {
                     alert("الرجاء اختيار الباقة");
                     document.getElementById(ClientId+"_ddlNewPlanList").focus();
                     return false;
            }                          
    }
    return true;   
}



function MISC_SBQALZ_ValidateShow(ClientId,Culture)
{
  if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_ddlCategories")!=null && document.getElementById(ClientId+"_ddlCategories").selectedIndex==0)
           {
                 alert("Please select a channel");
                 document.getElementById(ClientId+"_ddlCategories").focus();
                 return false;
           }                  
    }
    else if(Culture=="Arabic")
    {
        if(document.getElementById(ClientId+"_ddlCategories")!=null && document.getElementById(ClientId+"_ddlCategories").selectedIndex==0)
           {
                 alert("الرجاء اختيار القناة");
                 document.getElementById(ClientId+"_ddlCategories").focus();
                 return false;
           }                      
    }
    return true;   
}

function MISC_ValidateMultipleofTen(Value)
{
    try
    {
       var resultOfMod = Value % 10;       
       if (resultOfMod== 0)
         return true;
       else
         return false;        
    }
    catch(err)
    {
        return false;
    }    
}

function MISC_MT_ValidateMoneyTranfer(ClientId,Culture)
{
    var ExpNumeric =/^[0-9]+$/
    var txtAmount= document.getElementById(ClientId+"_txtAmount");
  if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
           {
                 alert("Please select an Account Number");
                 document.getElementById(ClientId+"_DLAccountNo").focus();
                 return false;
           }
         else  if(document.getElementById(ClientId+"_DdlGSMNumber")!=null && document.getElementById(ClientId+"_DdlGSMNumber").selectedIndex==0)
           {
                 alert("Please select a GSM Number");
                 document.getElementById(ClientId+"_DdlGSMNumber").focus();
                 return false;
           }  
         else  if(document.getElementById(ClientId+"_txtPIN")!=null 
         && document.getElementById(ClientId+"_txtPIN").value=="")
           {
                 alert("Please enter PIN");
                 document.getElementById(ClientId+"_txtPIN").focus();
                 return false;
           }  
         else  if(document.getElementById(ClientId+"_txtHayyak")!=null 
         && document.getElementById(ClientId+"_txtHayyak").value=="")
           {
                 alert("Please enter a Hayyak number");
                 document.getElementById(ClientId+"_txtHayyak").focus();
                 return false;
           }  
           
          else if(document.getElementById(ClientId+"_txtHayyak")!=null
           && document.getElementById(ClientId+"_txtHayyak").value!="" 
           && (!document.getElementById(ClientId+"_txtHayyak").value.match(ExpNumeric)))
            {
                 alert("Hayyak Number should be numeric");
                 document.getElementById(ClientId+"_txtHayyak").focus();
                 return false;
            }
        else if( document.getElementById(ClientId+"_txtHayyak")!=null 
        && document.getElementById(ClientId+"_txtHayyak").value.charAt(0)!='9')
        {
            alert("Hayyak Number should start with \'9\'");
            document.getElementById(ClientId+"_txtHayyak").focus();
            return false;
        }
        else if(document.getElementById(ClientId+"_txtHayyak").value.length!=8)
        {
            alert("The length of Hayyak number should be 8 digits");
            document.getElementById(ClientId+"_txtHayyak").focus();
            return false;
        }
        else if(txtAmount.value=="")
        {
             alert("Please enter an amount");
             txtAmount.focus();
             return false;
        }
        else if(ValidateTopUpAmount(txtAmount.value)!=true)
        {
             alert("Amount should be numeric and should not have decimal values");
             txtAmount.focus();
             return false;
        }
       else if(txtAmount.value <100 || txtAmount.value >10000)
           {
                 alert("Amount should be starting from 100 Baisa to 10000 Baisa per day");
                 txtAmount.focus();
                 return false;
           }
       else if(!MISC_ValidateMultipleofTen(txtAmount.value))
           {
                 alert("Amount should be in multiples of 10 Baisa");
                 txtAmount.focus();
                 return false;
           }
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_DLAccountNo")!=null 
           && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
            {
                     alert("رقم العقد الرجاء إختيار");
                     document.getElementById(ClientId+"_DLAccountNo").focus();
                     return false;
            }
          else if(document.getElementById(ClientId+"_DdlGSMNumber")!=null 
          && document.getElementById(ClientId+"_DdlGSMNumber").selectedIndex==0)
           {
                   alert('الرجاء اختيار رقم هاتف متنقل');
                 document.getElementById(ClientId+"_DdlGSMNumber").focus();
                 return false;
           }  
          else  if(document.getElementById(ClientId+"_txtPIN")!=null 
          && document.getElementById(ClientId+"_txtPIN").value=="")
           {
                 alert("ارجاء ادخال الرقم السري");
                 document.getElementById(ClientId+"_txtPIN").focus();
                 return false;
           } 
          else  if(document.getElementById(ClientId+"_txtHayyak")!=null 
          && document.getElementById(ClientId+"_txtHayyak").value=="")
           {
                 alert("الرجاء ادخال رقم حياك");
                 document.getElementById(ClientId+"_txtHayyak").focus();
                 return false;
           }             
         else if(document.getElementById(ClientId+"_txtHayyak")!=null 
         && document.getElementById(ClientId+"_txtHayyak").value!="" 
         && (!document.getElementById(ClientId+"_txtHayyak").value.match(ExpNumeric)))
            {
                 alert("الرجاء ادخال ارقام ");
                 document.getElementById(ClientId+"_txtHayyak").focus();
                 return false;
            }
            else if( document.getElementById(ClientId+"_txtHayyak")!=null 
            && document.getElementById(ClientId+"_txtHayyak").value.charAt(0)!='9')
            {
                alert("الرقم يجب ان يبدا بـ 9");
                document.getElementById(ClientId+"_txtHayyak").focus();
                return false;
            }
            else if(document.getElementById(ClientId+"_txtHayyak").value.length!=8)
            {
                alert("يجب اضافة 8 ارقام في خانة الرقم");
                document.getElementById(ClientId+"_txtHayyak").focus();
                return false;
            }
            else if(txtAmount.value=="")
            {
                 alert("الرجاء ادخال المبلغ");
                 txtAmount.focus();
                 return false;
            }
            else if(ValidateTopUpAmount(txtAmount.value)!=true)
            {
                alert("المبلغ يجب أن يكون بالأعداد وليس به كسور عشرية");
                 txtAmount.focus();
                 return false;
            } 
           else if(txtAmount.value <100 || txtAmount.value >10000)
           {
                 alert("المبلغ يجب ان يبدا من 100 بيسة الى 10000 بيسة في اليوم");
                 txtAmount.focus();
                 return false;
           }
            else if(!MISC_ValidateMultipleofTen(txtAmount.value))
           {
                 alert("المبلغ يجب ان يكون من مضاعفات 10 بيسات");
                 txtAmount.focus();
                 return false;
           }               
    }
    return true;  
}



function MISC_MT_ValidateChangePIN(ClientId,Culture)
{
    var ExpNumeric =/^[0-9]+$/
  if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
           {
                 alert("Please select an Account Number");
                 document.getElementById(ClientId+"_DLAccountNo").focus();
                 return false;
           }
         else  if(document.getElementById(ClientId+"_DdlGSMNumber")!=null && document.getElementById(ClientId+"_DdlGSMNumber").selectedIndex==0)
           {
                 alert("Please select a GSM Number");
                 document.getElementById(ClientId+"_DdlGSMNumber").focus();
                 return false;
           }  
         else  if(document.getElementById(ClientId+"_txtOldPIN")!=null 
         && document.getElementById(ClientId+"_txtOldPIN").value=="")
           {
                 alert("Please enter old PIN");
                 document.getElementById(ClientId+"_txtOldPIN").focus();
                 return false;
           }  
            else if(document.getElementById(ClientId+"_txtOldPIN")!=null 
         && document.getElementById(ClientId+"_txtOldPIN").value!="" 
         && (!document.getElementById(ClientId+"_txtOldPIN").value.match(ExpNumeric)))
            {
                 alert("PIN should be numeric");
                 document.getElementById(ClientId+"_txtOldPIN").focus();
                 return false;
            }
         else  if(document.getElementById(ClientId+"_txtNewPIN")!=null 
         && document.getElementById(ClientId+"_txtNewPIN").value=="")
           {
                 alert("Please enter a new PIN");
                 document.getElementById(ClientId+"_txtNewPIN").focus();
                 return false;
           }   
             else if(document.getElementById(ClientId+"_txtNewPIN")!=null 
         && document.getElementById(ClientId+"_txtNewPIN").value!="" 
         && (!document.getElementById(ClientId+"_txtNewPIN").value.match(ExpNumeric)))
            {
                 alert("PIN should be numeric");
                 document.getElementById(ClientId+"_txtNewPIN").focus();
                 return false;
            }   
            
           else if(document.getElementById(ClientId+"_txtOldPIN")!=null && document.getElementById(ClientId+"_txtNewPIN")!=null 
           && (document.getElementById(ClientId+"_txtOldPIN").value == document.getElementById(ClientId+"_txtNewPIN").value ))
            {
                 alert("Old PIN and new PIN should not be same");
                 document.getElementById(ClientId+"_txtNewPIN").focus();
                 return false;
            }           
       
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
            {
                      alert("رقم العقد الرجاء إختيار");
                     document.getElementById(ClientId+"_DLAccountNo").focus();
                     return false;
            }
          else if(document.getElementById(ClientId+"_DdlGSMNumber")!=null && document.getElementById(ClientId+"_DdlGSMNumber").selectedIndex==0)
           {
                    alert("الرجاء إدخال رقم الهاتف النقال");
                 document.getElementById(ClientId+"_DdlGSMNumber").focus();
                 return false;
           }  
            else  if(document.getElementById(ClientId+"_txtOldPIN")!=null 
         && document.getElementById(ClientId+"_txtOldPIN").value=="")
           {
                 alert("الرجاء ادخال الرقم السري القديم");
                 document.getElementById(ClientId+"_txtOldPIN").focus();
                 return false;
           }  
            else if(document.getElementById(ClientId+"_txtOldPIN")!=null 
         && document.getElementById(ClientId+"_txtOldPIN").value!="" 
         && (!document.getElementById(ClientId+"_txtOldPIN").value.match(ExpNumeric)))
            {
                 alert("الرجاء ادخال ارقام فقط");
                 document.getElementById(ClientId+"_txtOldPIN").focus();
                 return false;
            }
         else  if(document.getElementById(ClientId+"_txtNewPIN")!=null 
         && document.getElementById(ClientId+"_txtNewPIN").value=="")
           {
                 alert("الرجاء ادخال الرقم السري الجديد");
                 document.getElementById(ClientId+"_txtNewPIN").focus();
                 return false;
           }   
             else if(document.getElementById(ClientId+"_txtNewPIN")!=null 
         && document.getElementById(ClientId+"_txtNewPIN").value!="" 
         && (!document.getElementById(ClientId+"_txtNewPIN").value.match(ExpNumeric)))
            {
                 alert("الرجاء ادخال ارقام فقط");
                 document.getElementById(ClientId+"_txtNewPIN").focus();
                 return false;
            }  
              else if(document.getElementById(ClientId+"_txtOldPIN")!=null && document.getElementById(ClientId+"_txtNewPIN")!=null 
           && (document.getElementById(ClientId+"_txtOldPIN").value == document.getElementById(ClientId+"_txtNewPIN").value ))
            {
                 alert("الرقم السري القديم والرقم السري الجديد يجب ان لا يتطابق");
                 document.getElementById(ClientId+"_txtNewPIN").focus();
                 return false;
            }                  
    }
    return true;  
}


function MISC_MT_ValidateFamilyFrnds(ClientId,Culture)
{
  var ExpNumeric =/^[0-9]+$/
  var Numberfld=document.getElementById(ClientId+"_txtTarget1");  
  
     if(Culture == 'English')
      {
         if(document.getElementById(ClientId+"_txtTarget1")!=null 
         && document.getElementById(ClientId+"_txtTarget1").value=="")
           {
                 alert("Please enter a number");
                 document.getElementById(ClientId+"_txtTarget1").focus();
                 return false;
           }
         else  if(Numberfld!=null && (!Numberfld.value.match(ExpNumeric)))
            {
                alert("Number must be numeric");
                Numberfld.focus();
                return false;
            }
         else  if(document.getElementById(ClientId+"_DdlNumbers")!=null 
         && document.getElementById(ClientId+"_DdlNumbers").selectedIndex==0)
           {
                 alert("Please select a number");
                 document.getElementById(ClientId+"_DdlNumbers").focus();
                 return false;
           } 
     }
     else
     {
         if(document.getElementById(ClientId+"_txtTarget1")!=null 
         && document.getElementById(ClientId+"_txtTarget1").value=="")
           {
                 alert("الرجاء ادخال رقم");
                 document.getElementById(ClientId+"_txtTarget1").focus();
                 return false;
           }
         else  if(Numberfld!=null && (!Numberfld.value.match(ExpNumeric)))
            {
                alert("الرجاء ادخال ارقام فقط");
                Numberfld.focus();
                return false;
            }
         else  if(document.getElementById(ClientId+"_DdlNumbers")!=null 
         && document.getElementById(ClientId+"_DdlNumbers").selectedIndex==0)
           {
                 alert("الرجاء اختيار رقم");
                 document.getElementById(ClientId+"_DdlNumbers").focus();
                 return false;
           } 
     }
     return true;
}



function MISC_InternetEmailValidateNext(ClientId,Culture)
{

        //var Emails=ClientID+"_ddlEmails";
        //document.getElementById(Emails).disabled=false;      

	if(Culture=="English")
    	{
	  if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
           {
                 alert("Please select an Account Number");
                 document.getElementById(ClientId+"_DLAccountNo").focus();
                 return false;
           }
          else  if(document.getElementById(ClientId+"_DdlLoginName")!=null && document.getElementById(ClientId+"_DdlLoginName").selectedIndex==0)
           {
                 alert("Please select a Login Name");
                 document.getElementById(ClientId+"_DdlLoginName").focus();
                 return false;
           }  
	}
	else if(Culture=="Arabic")
    	{
if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
           {
                alert("رقم العقد الرجاء إختيار");
                 document.getElementById(ClientId+"_DLAccountNo").focus();
                 return false;
           }
          else  if(document.getElementById(ClientId+"_DdlLoginName")!=null && document.getElementById(ClientId+"_DdlLoginName").selectedIndex==0)
           {
                 alert("الرجاء اختيار اسم المستخدم");
                 document.getElementById(ClientId+"_DdlLoginName").focus();
                 return false;
           }  

	}
return true;


}


function MISC_InternetWifiValidate(ClientId,Culture)
{

        //var Emails=ClientID+"_ddlEmails";
        //document.getElementById(Emails).disabled=false;      

	if(Culture=="English")
    	{
	  if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
           {
                 alert("Please select an Account Number");
                 document.getElementById(ClientId+"_DLAccountNo").focus();
                 return false;
           }
          else  if(document.getElementById(ClientId+"_DdlLoginName")!=null && document.getElementById(ClientId+"_DdlLoginName").selectedIndex==0)
           {
                 alert("Please select a Login Name");
                 document.getElementById(ClientId+"_DdlLoginName").focus();
                 return false;
           } 
           
          var val=confirm("Are you sure you want to activate Wifi?","Yes","No");
           
           if(val)
       	   {
       			return true;
       	   }
       	   else
       	   {
       		
        		return false;
       	   }
 
	}
	else if(Culture=="Arabic")
    	{
           if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
           {
                alert("رقم العقد الرجاء إختيار");
                 document.getElementById(ClientId+"_DLAccountNo").focus();
                 return false;
           }
           else  if(document.getElementById(ClientId+"_DdlLoginName")!=null && document.getElementById(ClientId+"_DdlLoginName").selectedIndex==0)
           {
                 alert("الرجاء اختيار اسم المستخدم");
                 document.getElementById(ClientId+"_DdlLoginName").focus();
                 return false;
           }  
           var val=confirm("Are you sure you want to activate Wifi?","Yes","No");
       	
	       if(val)
       	   {
       			return true;
       	   }
       	   else
       	   {
       		
        		return false;
       	   }

	    }
     return true;
}





function Misc_ValidateIntPwdchng(ClientId,Culture)
{
	var servicetype=document.getElementById(ClientId +"_Ddlservicetype");  
  
  //alert(document.getElementById(ClientId+"_txtcurrentpassword").value);
  //alert(document.getElementById(ClientId+"_txtNewpassword").value);
  
  if(Culture=="English")
    {
           
	if(document.getElementById(ClientId+"_Ddlservicetype")!=null && document.getElementById(ClientId+"_Ddlservicetype").selectedIndex==0)
           {
                 alert("Please select a service type");
                 document.getElementById(ClientId+"_Ddlservicetype").focus();
                 return false;
           }
         else  if(servicetype.options[servicetype.selectedIndex].text=="Email" && document.getElementById(ClientId+"_ddlEmails").selectedIndex==0)
           {
                    alert("Please select an Email-ID");
                 	document.getElementById(ClientId+"_ddlEmails").focus();
                 	return false;
           }  
         else  if(document.getElementById(ClientId+"_txtcurrentpassword")!=null 
         && document.getElementById(ClientId+"_txtcurrentpassword").value=="")
           {
                 alert("Please enter current password");
                 document.getElementById(ClientId+"_txtcurrentpassword").focus();
                 return false;
           }  
         else  if(document.getElementById(ClientId+"_txtNewpassword")!=null 
         && document.getElementById(ClientId+"_txtNewpassword").value=="")
           {
                 alert("Please enter new password");
                 document.getElementById(ClientId+"_txtNewpassword").focus();
                 return false;
           }  
	       else  if(document.getElementById(ClientId+"_txtNewcnfrmpassword")!=null 
           && document.getElementById(ClientId+"_txtNewcnfrmpassword").value=="")
           {
                 alert("Please enter confirm password");
                 document.getElementById(ClientId+"_txtNewcnfrmpassword").focus();
                 return false;
           }
           else if(document.getElementById(ClientId+"_txtcurrentpassword").value== document.getElementById(ClientId+"_txtNewpassword").value)
           {
                    alert('Old Password and New Password can not be the same');
                    return false;
           }
           else if (document.getElementById(ClientId+"_txtNewpassword").value.length < 7 || document.getElementById(ClientId+"_txtNewpassword").value.length>16)
           {
                    alert('The length of password should be between 7 to 16 characters');
                    return false;
           }
           else if (document.getElementById(ClientId+"_txtNewpassword").value!=document.getElementById(ClientId+"_txtNewcnfrmpassword").value)
           {
                 alert("Password and confirm password are not matching");
                 document.getElementById(ClientId+"_txtNewPassword").focus();
                 document.getElementById(ClientId+"_txtNewPassword").value="";
                 document.getElementById(ClientId+"_txtNewcnfrmpassword").value="";
                 return false;
           }  
                        
       
    }
    else if(Culture=="Arabic")
    {

         if(document.getElementById(ClientId+"_Ddlservicetype")!=null && document.getElementById(ClientId+"_Ddlservicetype").selectedIndex==0)
           {
                 alert("الرجاء اختيار نوع الخدمة");
                 document.getElementById(ClientId+"_Ddlservicetype").focus();
                 return false;
           }
         else  if(servicetype.options[servicetype.selectedIndex].text=="Email" && document.getElementById(ClientId+"_ddlEmails").selectedIndex==0)
           {
                    alert("الرجاء اختيار عنوان البريد الالكتروني");
                 	document.getElementById(ClientId+"_ddlEmails").focus();
                 	return false;
           }  
         else  if(document.getElementById(ClientId+"_txtcurrentpassword")!=null 
         && document.getElementById(ClientId+"_txtcurrentpassword").value=="")
           {
                 alert("الرجاء ادخال كلمة المرور الحالية");
                 document.getElementById(ClientId+"_txtcurrentpassword").focus();
                 return false;
           }  
         else  if(document.getElementById(ClientId+"_txtNewpassword")!=null 
         && document.getElementById(ClientId+"_txtNewpassword").value=="")
           {
                 alert("الرجاء ادخال كلمة المرور الجديدة");
                 document.getElementById(ClientId+"_txtNewpassword").focus();
                 return false;
           }  
	       else  if(document.getElementById(ClientId+"_txtNewcnfrmpassword")!=null 
           && document.getElementById(ClientId+"_txtNewcnfrmpassword").value=="")
           {
                 alert("الرجاء ادخال تاكيد كلمة المرور");
                 document.getElementById(ClientId+"_txtNewcnfrmpassword").focus();
                 return false;
           }
           else if(document.getElementById(ClientId+"_txtcurrentpassword").value== document.getElementById(ClientId+"_txtNewpassword").value)
           {
                    alert('كلمة المرور القديمة وكلمة المرور الجديدة يجب ان لا تكون متطابقة');
                    return false;
           }
           else if (document.getElementById(ClientId+"_txtNewpassword").value.length < 7 || document.getElementById(ClientId+"_txtNewpassword").value.length>16)
           {
                    alert('الرجاء اختيار كلمة المرور ما بين 7 و 16 حرف');
                    return false;
           }
           else if (document.getElementById(ClientId+"_txtNewpassword").value!=document.getElementById(ClientId+"_txtNewcnfrmpassword").value)
           {
                 alert("كلمة المرور الجديدة وتاكيد كلمة المرور بيست متطابقة");
                 document.getElementById(ClientId+"_txtNewPassword").focus();
                 document.getElementById(ClientId+"_txtNewPassword").value="";
                 document.getElementById(ClientId+"_txtNewcnfrmpassword").value="";
                 return false;
           }  
    }
    return true;  
}

function MISC_Servicetypechng(ClientID,Culture)
{	
        var Emails=ClientID+"_ddlEmails"; 
        var servicetype=document.getElementById(ClientID +"_Ddlservicetype");  
		if(servicetype.options[servicetype.selectedIndex].text=="Email")
		{ 
			document.getElementById(Emails).disabled=false;              				
		}
		else
		{
			document.getElementById(Emails).disabled=true; 
		}
}

function Misc_EmailIDsubmitValidate(ClientId,Culture)
{

 var pwd="";
 var confpwd="";
 
 var ExpEmail =/^[a-zA-Z0-9_]+$/;

 var Email = document.getElementById(ClientId+"_txtNewEmailLoginname").value;


  if(Culture=="English")
    {
           
	      if(document.getElementById(ClientId+"_txtNewEmailLoginname")!=null 
          && document.getElementById(ClientId+"_txtNewEmailLoginname").value=="")
          {
                 alert('Please choose an email account name');
                 document.getElementById(ClientId+"_txtNewEmailLoginname").focus();
                 return false;
          }  
          else if(!Email.match(ExpEmail))
          {
                alert('Invalid email account name. Special characters are not allowed');
                return false;
          }
          else  if(document.getElementById(ClientId+"_txtNewpassword")!=null 
          && document.getElementById(ClientId+"_txtNewpassword").value=="")
           {
                 alert("Please enter password");
                 document.getElementById(ClientId+"_txtNewpassword").focus();
                 return false;
           }  
	      else  if(document.getElementById(ClientId+"_txtConfirmNewpassword")!=null 
          && document.getElementById(ClientId+"_txtConfirmNewpassword").value=="")
           {
                 alert("Please enter confirm password");
                 document.getElementById(ClientId+"_txtConfirmNewpassword").focus();
                 return false;
           } 
           else if (document.getElementById(ClientId+"_txtNewpassword").value.length < 7 || document.getElementById(ClientId+"_txtNewpassword").value.length>16)
           {
                    alert('The length of password should be between 7 to 16 characters');
                    return false;
           } 
           else if (document.getElementById(ClientId+"_txtNewpassword").value!=document.getElementById(ClientId+"_txtConfirmNewpassword").value)
           {
             alert("Password and confirm password are not matching");
             return false;
           }
           else if(!document.getElementById(ClientId+"_chkTC").checked)
           {
                alert('Please accept the terms and conditions');
                return false;
           }
           
//           var val=confirm("Are you sure you, want to add EmailID?","Yes","No");
//       	
//	       if(val)
//       	   {
//       			return true;
//       	   }
//       	   else
//       	   {
//       		
//        		return false;
//       	   }
                               
    }
    else if(Culture=="Arabic")
    {

          if(document.getElementById(ClientId+"_txtNewEmailLoginname")!=null 
          && document.getElementById(ClientId+"_txtNewEmailLoginname").value=="")
          {
                 alert('الرجاء اختيار اسم البريد الالكتروني');
                 document.getElementById(ClientId+"_txtNewEmailLoginname").focus();
                 return false;
          }  
          else if(!Email.match(ExpEmail))
          {
                alert('البريد الالكتروني غير صحيح ');
                return false;
          }
          else  if(document.getElementById(ClientId+"_txtNewpassword")!=null 
          && document.getElementById(ClientId+"_txtNewpassword").value=="")
           {
                 alert("الرجاء ادخال كلمة المرور");
                 document.getElementById(ClientId+"_txtNewpassword").focus();
                 return false;
           }  
	      else  if(document.getElementById(ClientId+"_txtConfirmNewpassword")!=null 
          && document.getElementById(ClientId+"_txtConfirmNewpassword").value=="")
           {
                 alert("الرجاء ادخال تاكيد كلمة المرور");
                 document.getElementById(ClientId+"_txtConfirmNewpassword").focus();
                 return false;
           }  
           else if (document.getElementById(ClientId+"_txtNewpassword").value.length < 7 || document.getElementById(ClientId+"_txtNewpassword").value.length>16)
           {
                    alert('الرجاء اختيار كلمة المرور ما بين 7 و 16 حرف');
                    return false;
           }
           else if (document.getElementById(ClientId+"_txtNewpassword").value!=document.getElementById(ClientId+"_txtConfirmNewpassword").value)
           {
             alert("كلمة المرور وتاكيد كلمة المرور ليست متطابقة");
             return false;
           }
           else if(!document.getElementById(ClientId+"_chkTC").checked)
           {
                alert('الرجاء الموافقة على البنود والشروط');
                return false;
           }
           
//           var val=confirm("Are you sure you want to add EmailID?","Yes","No");
//       	
//	       if(val)
//       	   {
//       			return true;
//       	   }
//       	   else
//       	   {
//       		
//        		return false;
//       	   }
             
    }
    return true;  
}



function Misc_ValidateBBSub(ClientId,Culture)
{

    if(Culture=="English")
    {
	     if(document.getElementById(ClientId+"_ddlmsisdnname")!=null && document.getElementById(ClientId+"_ddlmsisdnname").selectedIndex==0)
           {
                 alert('Please select a GSM Number');
                 document.getElementById(ClientId+"_ddlmsisdnname").focus();
                 return false;
           }
          else  if(document.getElementById(ClientId+"_ddlservicetype")!=null && document.getElementById(ClientId+"_ddlservicetype").selectedIndex==0)
           {
                 alert("Please select a service");
                 document.getElementById(ClientId+"_ddlservicetype").focus();
                 return false;
           }
           
           var val=confirm("Are you sure you want to subscribe?");
       	
	       if(val)
       	   {
       			return true;
       	   }
       	   else
       	   {
       		
        		return false;
       	   }  
	}
	else if(Culture=="Arabic")
    	{
    	
          if(document.getElementById(ClientId+"_ddlmsisdnname")!=null && document.getElementById(ClientId+"_ddlmsisdnname").selectedIndex==0)
           {
                 alert('الرجاء اختيار رقم هاتف متنقل');
                 document.getElementById(ClientId+"_ddlmsisdnname").focus();
                 return false;
           }
          else  if(document.getElementById(ClientId+"_ddlservicetype")!=null && document.getElementById(ClientId+"_ddlservicetype").selectedIndex==0)
           {
                 alert("الرجاء اختيار نوع الخدمة");
                 document.getElementById(ClientId+"_ddlservicetype").focus();
                 return false;
           }  
            var val=confirm("Are you sure you want to subscribe?");
       	
	       if(val)
       	   {
       			return true;
       	   }
       	   else
       	   {
       		
        		return false;
       	   }  

	}
    return true;
  
 
}

function Misc_ValidateBBUnSub(ClientId,Culture)
{


    if(Culture=="English")
    {
	     if(document.getElementById(ClientId+"_ddlmsisdnname")!=null && document.getElementById(ClientId+"_ddlmsisdnname").selectedIndex==0)
           {
                 alert('Please select a GSM Number');
                 document.getElementById(ClientId+"_ddlmsisdnname").focus();
                 return false;
           }
           var val=confirm("Are you sure you want to unsubscribe blackberry services for this number?");
       	
	       if(val)
       	   {
       			return true;
       	   }
       	   else
       	   {
       		
        		return false;
       	   }  
          
	}
    else if(Culture=="Arabic")
    	{
    	
          if(document.getElementById(ClientId+"_ddlmsisdnname")!=null && document.getElementById(ClientId+"_ddlmsisdnname").selectedIndex==0)
           {
               alert('الرجاء اختيار رقم هاتف متنقل');
                 document.getElementById(ClientId+"_ddlmsisdnname").focus();
                 return false;
           }
           var val=confirm("Are you sure you want to unsubscribe blackberry services for this number?");
       	
	       if(val)
       	   {
       			return true;
       	   }
       	   else
       	   {
       		
        		return false;
       	   }  
          

	}
    return true;
  
 
}

function TC_validate(ClientId)
{
    if(document.getElementById(ClientId+"_chkTC").checked)
    {
        document.getElementById(ClientId+"_BtnShubmit").disabled=false;
    }
    else
    {
        document.getElementById(ClientId+"_BtnShubmit").disabled=true;
    }

}

function EmailsTC()
{
    myRef = window.open('https://www.omantel.om/en/wpresources/files/TC_Emails.htm','mywin','toolbar=no,location=no,directories=no, status=no,menubar=no,scrollbars=no,resizable=no, copyhistory=no,width=550,height=400');
    //myRef.focus();
}


function MI_ValidateLogin(ClientID,Culture,usernameclientid,passwordclientid)
 {

      var UserName = document.getElementById(usernameclientid).value;
       var Password="";
       
      if((navigator.appName)=="Microsoft Internet Explorer")
       Password = document.getElementById(ClientID+"_txtPassword").value;
       else
       Password=document.getElementById(passwordclientid).value;
       
      var Password2=document.getElementById("txtPassword2").value;
     
      if(Culture=="English")
      {
              if(UserName=="" || UserName=="ADSL login name" )
              {
                 alert('Enter the ADSL login name');
                 document.getElementById(usernameclientid).focus();
                 return false;
              }
              
              else if( Password2=="ADSL Pin")
               {
              
                    alert('Enter the ADSL Pin');
                    document.getElementById("txtPassword2").focus();
                   
                    return false;
               }
               
               else if(Password == "")
               {
                alert('Enter the ADSL Pin');
                    document.getElementById(passwordclientid).focus();
                    return false;
               }
               else
               {
               
                return true;
               }
       }
       
 }

function MI_clickTextbox(usernameClientID)
{


   if(document.getElementById(usernameClientID).value=="ADSL login name" || document.getElementById(usernameClientID).value=="اسم المستخدم")
    {
        document.getElementById(usernameClientID).value="";
    }


}

//Web TV
function toggleProgramDetails(id)
{    
  var L = document.getElementById(id);  
  if(id!=null)
  {
    var _index= id.indexOf("_");
    id=id.substring(_index+1,id.length);
  }  
  var img = document.getElementById("img_"+id);  
  if (L.style.display == 'none')
  {    
    L.style.display = '';
    if(img!=null)
        img.src ="/wpresources/Images/up_arw.gif";
  }
  else 
  {     
    L.style.display = 'none';
    if(img!=null)
        img.src ="/wpresources/Images/dn_arw.gif";
  }  
}



function WebTV_ValidateNext(ClientId,Culture)
  {
    if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
           {
                 alert("Please select an Account Number");
                 document.getElementById(ClientId+"_DLAccountNo").focus();
                 return false;
           }
           if(document.getElementById(ClientId+"_DdlLoginName")!=null && document.getElementById(ClientId+"_DdlLoginName").selectedIndex==0)
           {
                 alert("Please select a Login Name");
                 document.getElementById(ClientId+"_DdlLoginName").focus();
                 return false;
           }          
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
                {
                     alert("الرجاء اختيار رقم حساب");
                     document.getElementById(ClientId+"_DLAccountNo").focus();
                     return false;
                }
            if(document.getElementById(ClientId+"_DdlLoginName")!=null && document.getElementById(ClientId+"_DdlLoginName").selectedIndex==0)
           {
                 alert("الرجاء اختيار اسم الدخول");
                 document.getElementById(ClientId+"_DdlLoginName").focus();
                 return false;
           }
    }
    return true;   
  }
  
  function WebTV_ChangePassword(ClientId,Culture)
  {
    if(document.getElementById(ClientId+"_txtNewPassword")!=null)
    {
        var  oldpassword="";
        var  newpassword="";
        var ConfirmPassword="";
        if(document.getElementById(ClientId+"_txtOldPassword")!=null)
            oldpassword =  document.getElementById(ClientId+"_txtOldPassword").value;
        if(document.getElementById(ClientId+"_txtNewPassword")!=null)
            newpassword =  document.getElementById(ClientId+"_txtNewPassword").value;
        if(document.getElementById(ClientId+"_txtConfirmPassword")!=null)
        ConfirmPassword = document.getElementById(ClientId+"_txtConfirmPassword").value;
      
        if(Culture=="English")
        {        
                if(document.getElementById(ClientId+"_txtOldPassword")!=null && oldpassword=="")
                {                
                    alert('Please enter old password');
                    document.getElementById(ClientId+"_txtOldPassword").focus();
                    return false;
                }
                if(newpassword=="")
                {                
                    alert('Please enter new Password');
                    document.getElementById(ClientId+"_txtNewPassword").focus();
                    return false;
                }
                else if(ConfirmPassword=="")
                 {
                    alert('Please confirm the Password');
                    document.getElementById(ClientId+"_txtConfirmPassword").focus();
                    return false;
                }                
                else if (newpassword.length < 8 || newpassword.length>16)
                {
                    alert('The length of password should be between 8 to 16 characters');
                    return false;
                }
                else if(newpassword!= ConfirmPassword)
                {
                    alert('Passwords are not matching');
                    document.getElementById(ClientId+"_txtNewPassword").focus();
                    document.getElementById(ClientId+"_txtNewPassword").value="";
                    document.getElementById(ClientId+"_txtConfirmPassword").value="";
                    return false;
                }                
                 return true;
          }
          else if(Culture=="Arabic")
          {
                if(oldpassword=="")
                {                
                    alert('الرجاء ادخال كلمة المرور القديمة');
                    document.getElementById(ClientId+"_txtOldPassword").focus();
                    return false;
                }
               if(newpassword=="")
                {
                    alert('ادخال كلمة مرور جديدة');
                    document.getElementById(ClientId+"_txtNewPassword").focus();
                    return false;
                }
                else if(ConfirmPassword=="")
                {
                    alert('ادخل تأكيد كلمة المرور الجديدة');
                    document.getElementById(ClientId+"_txtConfirmPassword").focus();
                    return false;
                }
                else if (newpassword.length < 8 || newpassword.length>16)
                {
                    alert("طول كلمة المرور ينبغي ان تكون بين 8 الى 16 حرفا");
                    return false;
                }
                else if(newpassword!= ConfirmPassword)
                {
                    alert('كلمة المرور ليست مطابقه');
                    document.getElementById(ClientId+"_txtNewPassword").focus();
                    document.getElementById(ClientId+"_txtNewPassword").value="";
                    document.getElementById(ClientId+"_txtConfirmPassword").value="";
                    return false;
                }                
                return true;                
          }
      } 
  }
  
  function WebTVReasonChange(ClientId,Culture)
  {
    var DropDownId=ClientId+"_ddlReason";
    var tbReason=ClientId+"_txtReason";
     
    if(document.getElementById(DropDownId).selectedIndex==3)
    {  
        document.getElementById(tbReason).disabled=false;               
    }
    else
    {
         document.getElementById(tbReason).disabled=true;     
    }   
  }
  
  function WebTV_ValidateChangePackage(ClientId,Culture)
  {
    if(Culture=="English")
    {         
           if(document.getElementById(ClientId+"_DLNewPackage")!=null && document.getElementById(ClientId+"_DLNewPackage").selectedIndex==0)
           {
                 alert("Please select a Package");
                 document.getElementById(ClientId+"_DLNewPackage").focus();
                 return false;
           }
           if(document.getElementById(ClientId+"_ddlReason")!=null && document.getElementById(ClientId+"_ddlReason").selectedIndex==0)
           {
                 alert("Please select a Reason");
                 document.getElementById(ClientId+"_ddlReason").focus();
                 return false;
           }    
           if(document.getElementById(ClientId+"_ddlReason")!=null && document.getElementById(ClientId+"_ddlReason").selectedIndex==3 && document.getElementById(ClientId+"_txtReason").value=="")
           {
                 alert("Please enter a Reason");
                 document.getElementById(ClientId+"_txtReason").focus();
                 return false;
           }   
            if(document.getElementById(ClientId+"_txtNewPassword")!=null)
            {         
                var  newpassword =  document.getElementById(ClientId+"_txtNewPassword").value;  
                if(newpassword=="")
                {                
                    alert('Enter New Password');
                    document.getElementById(ClientId+"_txtNewPassword").focus();
                    return false;
                }
            }  
    }
    else if(Culture=="Arabic")
    {
          if(document.getElementById(ClientId+"_DLNewPackage")!=null && document.getElementById(ClientId+"_DLNewPackage").selectedIndex==0)
           {
                 alert("الرجاء اختيار الباقة");
                 document.getElementById(ClientId+"_DLNewPackage").focus();
                 return false;
           }
           if(document.getElementById(ClientId+"_ddlReason")!=null && document.getElementById(ClientId+"_ddlReason").selectedIndex==0)
           {
                 alert("الرجاء تحديد السبب");
                 document.getElementById(ClientId+"_ddlReason").focus();
                 return false;
           }           
           if(document.getElementById(ClientId+"_txtNewPassword")!=null)
            {         
                var  newpassword =  document.getElementById(ClientId+"_txtNewPassword").value;  
                if(newpassword=="")
                {                
                    alert('ادخال كلمة مرور جديدة');                 
                    document.getElementById(ClientId+"_txtNewPassword").focus();
                    return false;
                }
            }  
    }
    return true;   
  }
  
  function WebTV_ValidateSubscription(ClientId,Culture)
  {
        var  newpassword =  document.getElementById(ClientId+"_txtNewPassword").value;       
        var  webtvUsername =  document.getElementById(ClientId+"_txtWebTVUsername").value;
             
        if(Culture=="English")
        {
           if(webtvUsername=="")
            {   
                alert('Please choose a WebTV user name');
                document.getElementById(ClientId+"_txtWebTVUsername").focus();
                return false;
            }  
            if(newpassword=="")
            {                
                alert('Please choose a WebTV Password');
                document.getElementById(ClientId+"_txtNewPassword").focus();
                return false;
            }  
            
                      
            if(!WebTV_ChangePassword(ClientId,Culture))       
                 return false;     
                 
             
           if(document.getElementById(ClientId+"_DLNewPackage")!=null && document.getElementById(ClientId+"_DLNewPackage").selectedIndex==0)
           {
                 alert("Please select a Package");
                 document.getElementById(ClientId+"_DLNewPackage").focus();
                 return false;
           }
        }
      else if(Culture=="Arabic")
      {
            if(webtvUsername=="")
            {                
                alert('الرجاء اختيار اسم المستخدم للتلفزيون على الإنترنت');
                document.getElementById(ClientId+"_txtWebTVUsername").focus();
                return false;
            }              
           if(newpassword=="")
            {
                alert('الرجاء اختيار كلمة المرور للتلفزيون على الإنترنت');
                document.getElementById(ClientId+"_txtNewPassword").focus();
                return false;
            }
            if(!WebTV_ChangePassword(ClientId,Culture))       
             return false;     
             
           if(document.getElementById(ClientId+"_DLNewPackage")!=null && document.getElementById(ClientId+"_DLNewPackage").selectedIndex==0)
           {
                 alert("الرجاء اختيار الباقة");
                 document.getElementById(ClientId+"_DLNewPackage").focus();
                 return false;
           }
      }
    return true;   
  }
  
  
  function WebTV_ValidateChangePackageConfirm(ClientId,Culture)
  {
        var  newpassword =  document.getElementById(ClientId+"_txtNewPassword").value;       
        if(Culture=="English")
        {
           if(newpassword=="")
            {                
                alert('Please enter the Password');
                document.getElementById(ClientId+"_txtNewPassword").focus();
                return false;
            }     
        }
      else if(Culture=="Arabic")
      {
           if(newpassword=="")
            {
                alert('الرجاء إدخال كلمة المرور');
                document.getElementById(ClientId+"_txtNewPassword").focus();
                return false;
            }
      }
    return true;   
  }
  
  function WebTV_ValidateCODHistory(ClientId,Culture)
  {
       //debugger;
    if(Culture=="English")
    {
          if(document.getElementById(ClientId+"_txtFromDate").value == "")
           {
                alert('Please select From Date');
                document.getElementById(ClientId+"_txtFromDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_txtToDate").value == "")
           {
                alert('Please select To Date');
                document.getElementById(ClientId+"_txtToDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_txtFromDate").value != "" && DateCompare(document.getElementById(ClientId+"_txtFromDate").value,null)== 1)
           {
                alert('From date should not be greater than today\'s date');
                document.getElementById(ClientId+"_txtFromDate").focus();
                return false;
           }
           
           if(document.getElementById(ClientId+"_txtToDate").value != "" && DateCompare(document.getElementById(ClientId+"_txtToDate").value,null)== 1)
           {
                alert('To date should not be greater than today\'s date');
                document.getElementById(ClientId+"_txtToDate").focus();
                return false;
           }
           if(DateCompare(document.getElementById(ClientId+"_txtFromDate").value,document.getElementById(ClientId+"_txtToDate").value)==1)
           {
            alert('From date should not be greater than or equal to To date');
            document.getElementById(ClientId+"_txtFromDate").focus();
            return false;
           }
       }
       else if(Culture=="Arabic")
       {
           
           if(document.getElementById(ClientId+"_txtFromDate").value == "")
           {
                alert('إختر تاريخ البدء');
                document.getElementById(ClientId+"_txtFromDate").focus();
                return false;
           }
            if(document.getElementById(ClientId+"_txtToDate").value == "")
           {
                alert('إختر تاريخ الانتهاء');
                document.getElementById(ClientId+"_txtToDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_txtFromDate").value != "" && CompareDates(document.getElementById(ClientId+"_txtFromDate").value)==0)
           {
                alert('يجب ألا يكون تاريخ البدء أعلى من تاريخ اليوم');
                document.getElementById(ClientId+"_txtFromDate").focus();
                return false;
           }
          
           if(document.getElementById(ClientId+"_txtToDate").value != "" && CompareDates(document.getElementById(ClientId+"_txtToDate").value)==0)
           {
                alert('يجب ألا يكون تاريخ الانتهاء أعلى من تاريخ اليوم');
                document.getElementById(ClientId+"_txtToDate").focus();
                return false;
           }
           if(CompareGivenDates(document.getElementById(ClientId+"_txtFromDate").value,document.getElementById(ClientId+"_txtToDate").value)==0)
           {
            alert('يجب ألا يكون تاريخ البدء أعلى أو يساوي تاريخ الاتنهاء');
            document.getElementById(ClientId+"_txtFromDate").focus();
            return false;
           }
       }
       return true; 
  }  


//password reset
function OTH_Validateresetpwd(ClientId,Culture)
{


	var servicetype=document.getElementById(ClientId +"_Ddlservicetype");  
  
  //alert(document.getElementById(ClientId+"_txtcurrentpassword").value);
  //alert(document.getElementById(ClientId+"_txtNewpassword").value);
  


  if(Culture=="English")
    {
           
	if(document.getElementById(ClientId+"_Ddlservicetype")!=null && document.getElementById(ClientId+"_Ddlservicetype").selectedIndex==0)
           {
                 alert("Please select a service type");
                 document.getElementById(ClientId+"_Ddlservicetype").focus();
                 return false;
           }
         else  if(servicetype.options[servicetype.selectedIndex].text=="Email" && document.getElementById(ClientId+"_ddlEmails").selectedIndex==0)
           {
                    alert("Please select an Email-ID");
                 	document.getElementById(ClientId+"_ddlEmails").focus();
                 	return false;
           }          
         else  if(document.getElementById(ClientId+"_txtNewpassword")!=null 
         && document.getElementById(ClientId+"_txtNewpassword").value=="")
           {
                 alert("Please enter new password");
                 document.getElementById(ClientId+"_txtNewpassword").focus();
                 return false;
           }  
	       else  if(document.getElementById(ClientId+"_txtNewcnfrmpassword")!=null 
           && document.getElementById(ClientId+"_txtNewcnfrmpassword").value=="")
           {
                 alert("Please enter confirm password");
                 document.getElementById(ClientId+"_txtNewcnfrmpassword").focus();
                 return false;
           }
           else if (document.getElementById(ClientId+"_txtNewpassword").value.length < 7 || document.getElementById(ClientId+"_txtNewpassword").value.length>16)
           {
                    alert('The length of password should be between 7 to 16 characters');
                    return false;
           }
           else if (document.getElementById(ClientId+"_txtNewpassword").value!=document.getElementById(ClientId+"_txtNewcnfrmpassword").value)
           {
                 alert("Password and confirm password are not matching");
                   //alert('11');
                   document.getElementById(ClientId+"_txtNewpassword").focus();
                  //alert(document.getElementById(ClientId+"_txtNewpassword"));
                  document.getElementById(ClientId+"_txtNewpassword").value="";
              
                 document.getElementById(ClientId+"_txtNewcnfrmpassword").value="";
               
                 return false;
           }
           else if (document.getElementById(ClientId+"_TbPinCode")!=null 
           && document.getElementById(ClientId+"_TbPinCode").value=="")
           {
                 alert("Please enter verification code");
                 document.getElementById(ClientId+"_TbPinCode").focus();
                 return false;
           }
                        
       
    }
    else if(Culture=="Arabic")
    {

         if(document.getElementById(ClientId+"_Ddlservicetype")!=null && document.getElementById(ClientId+"_Ddlservicetype").selectedIndex==0)
           {
                 alert("الرجاء اختيار نوع الخدمة");
                 document.getElementById(ClientId+"_Ddlservicetype").focus();
                 return false;
           }
         else  if(servicetype.options[servicetype.selectedIndex].text=="Email" && document.getElementById(ClientId+"_ddlEmails").selectedIndex==0)
           {
                    alert("الرجاء اختيار عنوان البريد الالكتروني");
                 	document.getElementById(ClientId+"_ddlEmails").focus();
                 	return false;
           }           
         else  if(document.getElementById(ClientId+"_txtNewpassword")!=null 
         && document.getElementById(ClientId+"_txtNewpassword").value=="")
           {
                 alert("الرجاء ادخال كلمة المرور الجديدة");
                 document.getElementById(ClientId+"_txtNewpassword").focus();
                 return false;
           }  
	       else  if(document.getElementById(ClientId+"_txtNewcnfrmpassword")!=null 
           && document.getElementById(ClientId+"_txtNewcnfrmpassword").value=="")
           {
                 alert("الرجاء ادخال تاكيد كلمة المرور");
                 document.getElementById(ClientId+"_txtNewcnfrmpassword").focus();
                 return false;
           }           
           else if (document.getElementById(ClientId+"_txtNewpassword").value.length < 7 || document.getElementById(ClientId+"_txtNewpassword").value.length>16)
           {
                    alert('الرجاء اختيار كلمة المرور ما بين 7 و 16 حرف');
                    return false;
           }
           else if (document.getElementById(ClientId+"_txtNewpassword").value!=document.getElementById(ClientId+"_txtNewcnfrmpassword").value)
           {
                 alert("كلمة المرور الجديدة وتاكيد كلمة المرور بيست متطابقة");
                 document.getElementById(ClientId+"_txtNewPassword").focus();
                 document.getElementById(ClientId+"_txtNewPassword").value="";
                 document.getElementById(ClientId+"_txtNewcnfrmpassword").value="";
                 return false;
           } 
           else if (document.getElementById(ClientId+"_TbPinCode")!=null 
           && document.getElementById(ClientId+"_TbPinCode").value=="")
           {
                 alert("الرجاء إدخال رمز التحقق");
                 document.getElementById(ClientId+"_TbPinCode").focus();
                 return false;
           } 
    }
    return true;  
}



function Selection_validation(ClientId,Culture)
{

        //var Emails=ClientID+"_ddlEmails";
        //document.getElementById(Emails).disabled=false;      

	if(Culture=="English")
    	{
	  if(document.getElementById(ClientId+"_DdlAccType")!=null 
	  && document.getElementById(ClientId+"_DdlAccType").selectedIndex==0)
           {
                 alert("Please select an Account Type");
                 document.getElementById(ClientId+"_DdlAccType").focus();
                 return false;
           }
          if(document.getElementById(ClientId+"_ddlAccountNo")!=null 
          && (!document.getElementById(ClientId+"_ddlAccountNo").disabled)
           && document.getElementById(ClientId+"_ddlAccountNo").selectedIndex==0)
           {
                 alert("Please select an Account Number");
                 document.getElementById(ClientId+"_ddlAccountNo").focus();
                 return false;
           }  
 	  if(document.getElementById(ClientId+"_ddlNumberLogin")!=null 
 	 && document.getElementById(ClientId+"_ddlNumberLogin").selectedIndex==0)
           {
                 alert("Please select a value");
                 document.getElementById(ClientId+"_ddlNumberLogin").focus();
                 return false;
           }  
	}
	else if(Culture=="Arabic")
    	{

	if(document.getElementById(ClientId+"_DdlAccType")!=null 
	&& document.getElementById(ClientId+"_DdlAccType").selectedIndex==0)
           {
                 alert("الرجاء اختيار نوع الحساب");
                 document.getElementById(ClientId+"_DdlAccType").focus();
                 return false;
           }
       if(document.getElementById(ClientId+"_ddlAccountNo")!=null 
      && (!document.getElementById(ClientId+"_ddlAccountNo").disabled)
       && document.getElementById(ClientId+"_ddlAccountNo").selectedIndex==0)
       {
             alert("الرجاء اختيار رقم الحساب");
             document.getElementById(ClientId+"_ddlAccountNo").focus();
             return false;
       }  
 	  if(document.getElementById(ClientId+"_ddlNumberLogin")!=null 
 	 && document.getElementById(ClientId+"_ddlNumberLogin").selectedIndex==0)
           {
                 alert("الرجاء اختيار قيمة");
                 document.getElementById(ClientId+"_ddlNumberLogin").focus();
                 return false;
           }  
	}
return true;
}

function AddAccountHideControls(ClientID)
{ 
    var DropDownId=ClientID+"_DdlAccType";
    var ddlAccountType = document.getElementById(DropDownId);   
    var AccountNoTr= "trAccountNo";
    document.getElementById(AccountNoTr).style.display = '';        
    if(ddlAccountType.options[ddlAccountType.selectedIndex].value == 'Hayyak')
    {
        if(document.getElementById(AccountNoTr)!=null)
         document.getElementById(AccountNoTr).style.display = 'none';        
    }    
}



function VAS_ValidateNext(ClientId,Culture)
{ 
//alert('Hi');

  if(Culture=="English")
    {
           if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
           {
                 alert("Please select an Account Number");
                 document.getElementById(ClientId+"_DLAccountNo").focus();
                 return false;
           }
         else  if(document.getElementById(ClientId+"_DdlGSMNumber")!=null && document.getElementById(ClientId+"_DdlGSMNumber").selectedIndex==0)
           {
                 alert("Please select a GSM Number");
                 document.getElementById(ClientId+"_DdlGSMNumber").focus();
                 return false;
           }   
	 else 
	 {

     		var chkControl= document.getElementById(ClientId+"_chkVAS"); 
 		var elements = chkControl.getElementsByTagName("INPUT");
           	
	
 
	       	var checkBoxCount = 0;

               	for (i = 0; i < elements.length; i++) 
		{

               		if (elements[i].checked) checkBoxCount++;

                }
   		
	      	if(checkBoxCount==0)
		{
			alert("Select at least one service");
			return false;
		}

	 }
                    
    }
    else if(Culture=="Arabic")
    {
           if(document.getElementById(ClientId+"_DLAccountNo")!=null && document.getElementById(ClientId+"_DLAccountNo").selectedIndex==0)
            {
                     alert("رقم العقد الرجاء إختيار");
                     document.getElementById(ClientId+"_DLAccountNo").focus();
                     return false;
            }
          else if(document.getElementById(ClientId+"_DdlGSMNumber")!=null && document.getElementById(ClientId+"_DdlGSMNumber").selectedIndex==0)
           {
                  alert('الرجاء اختيار رقم هاتف متنقل');
                 document.getElementById(ClientId+"_DdlGSMNumber").focus();
                 return false;
           }                  
    }


    return true;   
}




function ValidateUpdateCreditLimit(ClientId,Culture)
{ 
      var ExpNumeric =/^[0-9]+$/
      var txtNewLimit=document.getElementById(ClientId+"_txtNewLimit");
      var lblCurrentLimit=document.getElementById(ClientId+"_LblCurrentLimitValue");
     
        if(Culture=="English")
        {
          if(txtNewLimit.value=="")
            {
                 alert("Please enter New credit limit");
                 txtNewLimit.focus();
                 return false;
            }
            else if(ValidateTopUpAmount(txtNewLimit.value)!=true)
            {
                 alert("Amount should be numeric and should not have decimal values");
                 txtNewLimit.focus();
                 return false;
            }
            else if(lblCurrentLimit.innerText == txtNewLimit.value)
            {
                 alert("Current credit limit and new limit cannot be same");
                 txtNewLimit.focus();
                 return false;
            }
            else if(txtNewLimit.value < 20 || txtNewLimit.value > 250)
            {
                alert("Minimum credit limit is 20 RO and maximum credit limit is 250 RO.");
                txtNewLimit.focus();
                return false;
            }
            else 
                return true;
        }
        else if(Culture=="Arabic")
        {
            if(txtNewLimit.value=="")
            {
                 alert("الرجاء إدخال حد إئتمان جديد");
                 txtNewLimit.focus();
                 return false;
            }
            else if(ValidateTopUpAmount(txtNewLimit.value)!=true)
            {
                 alert("يجب أن يكون المبلغ بالأرقام وألا يحتوي على قيم عشرية");
                 txtNewLimit.focus();
                 return false;
            }
             else if(lblCurrentLimit.innerText == txtNewLimit.value)
            {
                 alert("حد الإئتمان الحالي يجب أن لا يكون هو نفس حد الإئتمان الجديد");
                 txtNewLimit.focus();
                 return false;
            }
            else if(txtNewLimit.value < 20 || txtNewLimit.value > 250)
            {
                alert("حد الإئتمان الأدنى هو 20 (ر.ع) وحد الإئتمان الأقصى هو 250 (ر.ع)");
                txtNewLimit.focus();
                return false;
            }
            else 
                return true;    
        }
}

     
   var ischkAddISDenabled=0;
     var ischkAddISDRoamenabled = 0;
     var chkDelISDenabled= 0;
     var chkDelISDRoamenabled =0;
     
 
function CorporateVAS_CheckboxSelect(ClientId)
{     
    var chkAddISD = document.getElementById(ClientId+ "_chkVAS_0");
    var chkAddISDRoam = document.getElementById(ClientId+ "_chkVAS_1");
    var chkDelISD= document.getElementById(ClientId+ "_chkVAS_2");
    var chkDelISDRoam = document.getElementById(ClientId+ "_chkVAS_3");
    
     if((chkAddISD!=null) && (chkAddISDRoam!=null) && (chkDelISD!=null)  && (chkDelISDRoam!=null))
    {         
        if((chkAddISD.disabled==false) && (ischkAddISDenabled==0))
        {
            ischkAddISDenabled=1;
        }
        if((chkAddISDRoam.disabled==false) && (ischkAddISDRoamenabled==0))
        {
            ischkAddISDRoamenabled=1;
        }
        if((chkDelISD.disabled==false) && (chkDelISDenabled==0))
        {
            chkDelISDenabled=1;
        }
        if((chkDelISDRoam.disabled==false) && (chkDelISDRoamenabled==0))
        {
            chkDelISDRoamenabled=1;
        }
         
        if(chkAddISDRoam.checked)
        {   
            if((chkAddISD.disabled==false) &&(!chkAddISD.checked))
            {
                chkAddISD.checked=true;              
            }            
            if((chkDelISD.disabled==false) || (chkDelISDRoam.disabled==false))
            {
                chkDelISD.disabled=true;  
                chkDelISDRoam.disabled=true;  
            }
        }   
        else        
        {
            if(chkDelISDenabled==1)            
            {
                 chkDelISD.disabled=false;  
            }
        } 
//        alert(chkDelISDenabled);    
//        alert(ischkAddISDRoamenabled);
//        alert(ischkAddISDenabled);    
//        alert(chkDelISDRoamenabled);
        if(chkDelISD.checked)
        {  
            if((chkDelISDRoam.disabled==false) &&(!chkDelISDRoam.checked))
            {
                chkDelISDRoam.checked=true;           
            }
            if((chkAddISD.disabled==false) || (chkAddISDRoam.disabled==false))
            {
                chkAddISD.disabled=true;  
                chkAddISDRoam.disabled=true;  
            }            
        }
        else        
        {
            if(ischkAddISDRoamenabled==1)            
            {
                 chkAddISDRoam.disabled=false;  
            }
        }
    }    

}


//Provision


function ValidateRegistration_New(ClientId,Culture)
{ 

  

   UserName=document.getElementById(ClientId+"_txtFirstName");
   LastName=document.getElementById(ClientId+"_txtLastName");


    //AccDropDown=document.getElementById(ClientId+"_DdlAccType");
    var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;
    var ExpAlpha=/^[a-zA-Z]+$/
 
    var ExpNumeric =/^[0-9]+$/
    var SxpSpecialChar=/^[a-zA-Z0-9!@#$%^&*(),=/";:"]+$/
    var SpecialChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";
    var SpecialCharsComplete="!@#$%^&*()+=-[]\\\'._;,/{}|\":<>?"

    if(Culture=="English")
    {
        if(UserName.value=="")
        {
            alert("Please enter First name");
            return false;
        }


       if( LastName.value=="")
        {
            alert("Please enter Last name");
            return false;
        }


       
         TbEmail=document.getElementById(ClientId+"_TbEmail");
        if(TbEmail.value=="")
        {
            alert("Please enter E-mail ID");
            return false;
        }
        if(!TbEmail.value.match(ExpEmail))
        {
            alert("E-mail is not in standard format (example: abc@xyz.com)");
            return false;
        }

        TBconfirmEmail=document.getElementById(ClientId+"_TbConfirmEmail");
       
        if( TBconfirmEmail.value=="")
        {
            alert("Please enter confrimed E-mail ID");
            return false;
        }
        if(TBconfirmEmail.value!=TbEmail.value)
        {
            alert("Email ID and confirmed Email ID are not matched.");
            return false;
        }


        TbMobileNumber=document.getElementById(ClientId+"_TbMobileNumber");
        if(TbMobileNumber.value=="")
        {
            alert("Please enter GSM number");
            return false;
        }
        if(!TbMobileNumber.value.match(ExpNumeric))
        {
            alert("GSM number should be numeric");
            return false;
        }
        if(TbMobileNumber.value.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
            return false;
        }
        if(TbMobileNumber.value.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
            return false;
        }


     if(document.getElementById(ClientId+"_ddlNationality").selectedIndex==0)
        {
              alert("Please select nationality");                
              return false;
        }

     var isItemChecked = false;
     for (var i=0; i<3; i++)
     {
     
         var listItem = document.getElementById(ClientId+"_DlSecurityID_" + i);
         //alert(listItem.checked);
         if (listItem.checked )
         { 
                       
            isItemChecked = true;
        }
     }      
     //alert(isItemChecked);
     if(isItemChecked==false)
     {
        alert("Please select security ID.");      
        return false;
     }
     
       SecurityId=document.getElementById(ClientId+"_TbSecurityID");
        if(SecurityId.value=="")
        {
            alert("Please enter Security Id");
            return false;
        }
     
//        if(document.getElementById(ClientId+"_DlSecurityID").selectedIndex==0)
//        {
//            alert("Select an ID Type");                
//            return false;
//        }
//        SecurityId=document.getElementById(ClientId+"_TbSecurityID");
//        if(SecurityId.value=="")
//        {
//            alert("Please enter Security Id");
//            return false;
//        }


//         DOB=document.getElementById(ClientId+"_txtDOB");
//         
//        if( DOB.value=="")
//        {
//            alert("Please enter Date of Birth");
//            return false;
//        }
//        //Gender=document.getElementById(ClientId+"_ddlGender");
//  
//       if(document.getElementById(ClientId+"_ddlGender").selectedIndex==0)
//        {
//            alert("Select gender type");                
//            return false;
//        }
         
          
    
          
        if(document.getElementById(ClientId+"_drpDate").selectedIndex==0)
        {
              alert("Please select full date of birth");                
              return false;
        }
        
        if(document.getElementById(ClientId+"_drpMonth").selectedIndex==0)
        {
            alert("Please select full date of birth");                   
            return false;
        }
        
        if(document.getElementById(ClientId+"_drpYear").selectedIndex==0)
        {
            alert("Please select full date of birth");                  
            return false;
        }
        
        
        ///Validate birthday
        
          var y = document.getElementById(ClientId+"_drpYear");
          var m = document.getElementById(ClientId+"_drpMonth");
          var d = document.getElementById(ClientId+"_drpDate");
          
          var year=y.options[y.selectedIndex].value;
          var month=m.options[m.selectedIndex].value;
          var date=d.options[d.selectedIndex].value;
          
          //alert(year + month + date);
          if(month=="2")
          {
          
            if(isleap(year)=='true')
            {
              if(date>29)
              {
               alert( "Date is not valid for this month");
               return false;
              }
            }
            else 
            {
              
               if(date>28)
                {
                 alert( "Date is not valid for this month");
                 return false;
                }
            }
            
          }
          //4,6,9,11
          if( (month==4) || (month==6) || (month==9) || (month==11))
          {
            if(date>30)
            {
                 alert( "Date is not valid for this month");
                 return false;
            }
            
          }
          
          
        
        ///end validation birthday
        
        
     var isItemChecked2 = false;
     for (var i=0; i<2; i++)
     {
         var listItem = document.getElementById(ClientId+"_ddlGender_" + i);
         if (listItem.checked )
         { 
                  
            isItemChecked2 = true;
        }
     }      
     
     if(isItemChecked2==false)
     {
        alert("Please select Gender.");      
        return false;
     }

      
        
        


    }
    else if(Culture=="Arabic")
    {
        if(UserName.value=="")
        {
            alert("الرجاء ادخال اسم المستخدم");
            return false;
        }
        
        var count=0;
                               
        TbTelephoneNumber=document.getElementById(ClientId+"_TbTelephoneNumber");
        if(AccDropDown.options[AccDropDown.selectedIndex].value=="FixedLine")
        {
            if(TbTelephoneNumber.value=="")
            {
                alert("الرجاء اختيار رقم هاتف ثابت");
                return false;
            }
            if(!TbTelephoneNumber.value.match(ExpNumeric))
            {
                alert("رقم الهاتف الثابت يجب أن يكون بالأرقام");
                return false;
            }
        }
        if(AccDropDown.options[AccDropDown.selectedIndex].value=="ISP")
        {
            if(TbTelephoneNumber.value=="")
            {
                alert("الرجاء إدخال اسم الدخول");
                return false;
            }
        }
        if(AccDropDown.selectedIndex==0)
        {
            alert("الرجاء اختيار نوع الحساب");
            return false;
        }

        TbAccountNo=document.getElementById(ClientId+"_TbAccountNo");
        if(AccDropDown.options[AccDropDown.selectedIndex].value!="Mobile")
        {
            if(TbAccountNo.value=="")
            {
                alert("الرجاء إدخال رقم الحساب");
                return false;
            }
            if(!TbAccountNo.value.match(ExpNumeric))
            {
                alert("رقم الحساب يجب أن يكون بالأرقام");
                return false;
            }
        }
        TbMobileNumber=document.getElementById(ClientId+"_TbMobileNumber");
        if(TbMobileNumber.value=="")
        {
            alert("الرجاء إدخال رقم الهاتف النقال");
            return false;
        }
        if(!TbMobileNumber.value.match(ExpNumeric))
        {
            alert("رقم الهاتف النقال يجب ان يكون رقمياً");
            return false;
        }
        if(TbMobileNumber.value.charAt(0)!='9')
        {
            alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
            return false;
        }
        if(TbMobileNumber.value.length != 8)
        {
            alert("يجب ان يكون الرقم مكون من 8 أرقام");
            return false;
        }
        if(document.getElementById(ClientId+"_DlSecurityID").selectedIndex==0)
        {
            alert('إختار نوع الهوية');
            return false;
        }
             
        SecurityId=document.getElementById(ClientId+"_TbSecurityID");
        if(SecurityId.value=="")
        {
            alert("الرجاء إدخال رقم بطاقة الحماية");
            return false;
        }
        i=0;
        while(i<SecurityId.value.length)
        {
            index=SpecialCharsComplete.indexOf(SecurityId.value.charAt(i))
            if(index!=-1)
            {
                alert("رقم بطاقة الحماية يجب أن لا يحتوي على حروف خاصة");
                return false;
            }
            i++;
        }
            
        TbEmail=document.getElementById(ClientId+"_TbEmail");
        if(TbEmail.value=="")
        {
            alert("الرجاء إدخال البريد الإلكتروني");
            return false;
        }
            
        if(!TbEmail.value.match(ExpEmail))
        {
            alert("البريد الإلكتروني غير صحيح (مثال : abc@xyz.com )");
            return false;
        }            
    }




}


function isleap(year)
{
     //var yr=document.getElementById("year").value;
     var yr=year;
     if ((parseInt(yr)%4) == 0)
     {
          if (parseInt(yr)%100 == 0)
          {
            if (parseInt(yr)%400 != 0)
            {
            //alert("Not Leap");
            return "false";
            }
            if (parseInt(yr)%400 == 0)
            {
            //alert("Leap");
            return "true";
            }
          }
          
          if (parseInt(yr)%100 != 0)
          {
            //alert("Leap");
            return "true";
          }
     }
     
     if ((parseInt(yr)%4) != 0)
     {
        //alert("Not Leap");
        return "false";
     } 
}

function ValidatePincode_New(ClientID,Culture)
{
    var ExpNumeric =/^[0-9]+$/
    if(Culture=="English")
    {
            pincode=document.getElementById(ClientID+"_TbPinCode");
            if(pincode.value=="")
            {
                  alert("Please enter the 6 digit Security code");
                 return false;
            }
            if(!pincode.value.match(ExpNumeric))
            {
                alert("Pincode should be numeric");
                return false;
            }
            if(pincode.value.length!=6)
            {
                alert("Please enter the 6 digit Security code");
                return false;
            }
    }
    else if(Culture=="Arabic")
    {
            pincode=document.getElementById(ClientID+"_TbPinCode");
            if(pincode.value=="")
            {
            alert("الرجاء إدخال الرقم السري المكون من 6 أرقام");
            return false;
            }
            if(!pincode.value.match(ExpNumeric))
            {
                alert("الرقم السري يجب أن يكون بالأرقام");
                return false;
            }
             if(pincode.value.length!=6)
            {
                alert("الرجاء إدخال الرقم السري المكون من 6 أرقام");
                return false;
            }
    
    }
}

function ValidatePassword_New(ClientId,Culture)
{

    if(Culture=="English")
    {
             OldPassword=document.getElementById(ClientId+"_TbEnterPassword");
             NewPassword=document.getElementById(ClientId+"_TbConfirmPassword");
             
              if(OldPassword.value.length<8 || OldPassword.value.length>16)
            {
                alert("The length of password should be between 8 to 16 characters");
                return false;
            }
             
             if(OldPassword.value!=NewPassword.value)
             {
                alert("Passwords don't match");
                return false;
             }                       
            
     }
     else if(Culture=="Arabic")
     {
             OldPassword=document.getElementById(ClientId+"_TbEnterPassword");
             NewPassword=document.getElementById(ClientId+"_TbConfirmPassword");
             
              if(OldPassword.value.length<8 || OldPassword.value.length>16)
            {
                alert("طول كلمة المرور ينبغي ان تكون بين 8 الى 16 حرفا");
                return false;
            }
             
             if(OldPassword.value!=NewPassword.value)
             {
                alert("كلمات المرور غير متطابقات");
                return false;
             }

     }
 }




function ValidateForgotPassword_New(ClientID,Culture)
 {
    //var DropDownId=ClientID+"_DdlAccType";

    var SecurityId = document.getElementById(ClientID+"_txtSecurityId").value;
    //var FixedLineNumber = document.getElementById(ClientID+"_TbTelephoneNumber").value;
     //var GSMNumber = document.getElementById(ClientID+"_txtGSMNumber").value;
    //var AccountNumber=document.getElementById(ClientID+"_txtAccountNumber").value;
    var ExpNumeric =/^[0-9]+$/;
    var TbMobileNumber=document.getElementById(ClientID+"_txtGSMNumber");
     
     //alert(TbMobileNumber.value);
    
     if(Culture=="English")
     {
                if(document.getElementById(ClientID+"_DlSecurityID").selectedIndex==0)
                {
                    alert('Select an ID Type');
                    return false;
                }
                
                if(SecurityId=="")
                  {
                     //alert(document.getElementById(ClientID+"_DlSecurityID").selectedValue);
                     alert('Please enter ID field');
                     document.getElementById(ClientID+"_txtSecurityId").focus();
                     return false;
                  }                 
               
                if(TbMobileNumber.value=="")
                {
                    alert("Please enter GSM number");
                    return false;
                }
                if(!TbMobileNumber.value.match(ExpNumeric))
                {
                    alert("GSM number should be numeric");
                    return false;
                }
                if(TbMobileNumber.value.charAt(0)!='9')
                {
                    alert("GSM Number should start with \'9\'");
                    return false;
                }
                if(TbMobileNumber.value.length != 8)
                {
                    alert("The length of GSM number should be 8 digits");
                    return false;
                }
        }
        else if(Culture=="Arabic")
        {       
            if(document.getElementById(ClientID+"_DlSecurityID").selectedIndex==0)
            {
                alert('إختار نوع الهوية');
                return false;
            }
            if(SecurityId=="")
            {
                 alert('الرجاء ادخال رقم البطاقة الشخصية / اورقم جواز السفر /او رقم بطاقه المقيم / او رقم البطاقة المدنية / او رقم رخصة السجل التجاري');
                 document.getElementById(ClientID+"_txtSecurityId").focus();
                 return false;
            }            
             return true;                
        } 
 }


function AlufuqClick(ClientID,Culture)
{
    var chkAlufuq = document.getElementById(ClientID+"_chkAlufuq");
    var AlufuqNumber = document.getElementById(ClientID+"_txtAlufuq");       
    
     if(chkAlufuq!=null)
     {        
         if(chkAlufuq.checked) 
         {            
            AlufuqNumber.disabled=false;     
         }
         else     
         {            
            AlufuqNumber.value="";
            AlufuqNumber.disabled=true;     
         }          
     }
}

function servicedetailsonclick_ddl(ClientID,Culture)
{
    
    var ddlconn=document.getElementById(ClientID+"_ddlconntype");
    
    var trExistingPSTNNum = document.getElementById("trExistingPSTNNum");     
    
    var trIDType = document.getElementById("trIDType");     
    var trID = document.getElementById("trID");   
    var trIDExpiry = document.getElementById("trIDExpiry"); 
    
    
    
    if( (ddlconn.selectedIndex==1)||(ddlconn.selectedIndex==3))//Existing & upgrade
    {
        
             trExistingPSTNNum.style.visibility="visible";
            if(trIDType!=null && trID!=null)
            {
                trIDType.style.visibility="hidden";
                trID.style.visibility="hidden";  
                trIDExpiry.style.visibility="hidden";    
  
            }
            
            if(ddlconn.selectedIndex==3)
            {
                
                if(trIDType!=null && trID!=null)
                {
                    trIDType.style.visibility="visible";
                    trID.style.visibility="visible";  
		            
                }
            }
    
    } 
    else if( ddlconn.selectedIndex==2)
    {
            trExistingPSTNNum.style.visibility="hidden";
            if(trIDType!=null && trID!=null)
            {
                trIDType.style.visibility="visible";
                trID.style.visibility="visible";  
		trIDExpiry.style.visibility="visible";    
            }
    
    }
    

}



function servicedetailsonclick(ClientID,chkid,Culture)
{

 //alert(chkid );
 
 //NEW CODE
    var chkExisting = document.getElementById(ClientID+"_chkExisting");
    var chknew = document.getElementById(ClientID+"_chkNew");
    
    var trExistingPSTNNum = document.getElementById("trExistingPSTNNum");     
    
    var trIDType = document.getElementById("trIDType");     
    var trID = document.getElementById("trID");   
    var trIDExpiry = document.getElementById("trIDExpiry");   
  // alert(trIDExpiry);
    
    //alert(chknew.checked);
    
    
     //if(listItem1!=null)
     //{
     if(chkid=="chkExisting")
     {
        //alert(chkExisting);

         if(chkExisting.checked) 
         {  
            trExistingPSTNNum.style.visibility="visible";
            if(trIDType!=null && trID!=null)
            {
                trIDType.style.visibility="hidden";
                trID.style.visibility="hidden";  
                trIDExpiry.style.visibility="hidden";    
  
            }
            chknew.checked=false;   
         }
         else     
         {            
            trExistingPSTNNum.style.visibility="hidden";
             if(trIDType!=null && trID!=null)
            {
                
		trIDType.style.visibility="visible";
                trID.style.visibility="visible";    
		trIDExpiry.style.visibility="visible";    


            }
         } 
     }
     
     if(chkid=="chkNew")
     {
        if(chknew.checked)      
         {
            trExistingPSTNNum.style.visibility="hidden";
            if(trIDType!=null && trID!=null)
            {
                trIDType.style.visibility="visible";
                trID.style.visibility="visible";  
		trIDExpiry.style.visibility="visible";    
            }
            chkExisting.checked=false;         
         }  
         else         
         {
            trExistingPSTNNum.style.visibility="visible";                
         }
     }
 
 //END CODE
 
//     var count=0;
//     var isItemChecked = false;
//     for (var i=0; i<2; i++)
//     {
//         var listItem = document.getElementById(ClientID+"_rbtnExistingPSTNCust_" + i);
//         if (listItem.checked )
//         { 
//            count=i;             
//            isItemChecked = true;
//        }
//     }      
//     if(isItemChecked)
//     {
//       if(count==1)
//       {                                       
//             document.getElementById(ClientID+"_txtExistingPSTNNum").value="";
//             document.getElementById(ClientID+"_txtExistingPSTNNum").disabled=true;
//       }
//       else
//       {
//             document.getElementById(ClientID+"_txtExistingPSTNNum").disabled=false;
//       }
//     }
     
//   var NearlistItem1 = document.getElementById(ClientID+"_rbtnNearTelephone_0");          
//   var NearlistItem2 = document.getElementById(ClientID+"_rbtnNearTelephone_1");  
//   var NearlistItem3 = document.getElementById(ClientID+"_rbtnNearTelephone_2");  
//   var listItem1 = document.getElementById(ClientID+"_rbtnExistingPSTNCust_0");          
//   var listItem2 = document.getElementById(ClientID+"_rbtnExistingPSTNCust_1");    
   
//   if((listItem2!=null) && (listItem2.checked))      
//   {
//        NearlistItem1.disabled=false;
//        NearlistItem2.disabled=false;
//        NearlistItem3.disabled=false;
//        document.getElementById(ClientID+"_txtExistingPSTNNum").disabled=false;
//   }
//   if((listItem1!=null) && (listItem1.checked))      
//   {
//        NearlistItem1.disabled=true;
//        NearlistItem2.disabled=true;
//        NearlistItem3.disabled=true;
//        document.getElementById(ClientID+"_txtExistingPSTNNum").disabled=false;
//   }



//    var listItem1 = document.getElementById(ClientID+"_rbtnExistingPSTNCust_0");
//    var listItem2 = document.getElementById(ClientID+"_rbtnExistingPSTNCust_1");
//    
//    var trExistingPSTNNum = document.getElementById("trExistingPSTNNum");     
//    var trIDType = document.getElementById("trIDType");     
//    var trID = document.getElementById("trID");   
    
    
        
//     var chkList = ClientID.parentNode.parentNode.parentNode;
//      var chks = chkList.getElementsByTagName("input"); 
//        for(var i=0;i<chks.length;i++)
//        {
//            if(chks[i] != chk && chk.checked)
//            {
//                chks[i].checked=false;
//            }
//        } 
//     for(var i=0;i<chks.length;i++)
//      {         
//         if(chks[i] == chk && chk.checked)
//         {
//            trExistingPSTNNum.style.visibility="visible";
//            trIDType.style.visibility="hidden";
//            trID.style.visibility="hidden";  
//         }
//         else     
//         {
//             trExistingPSTNNum.style.visibility="hidden";
//                trIDType.style.visibility="visible";
//                trID.style.visibility="visible";  
//         }
//      } 
        
//        
//     if(listItem1!=null)
//     {
//         if(listItem1.checked) 
//         {  
//            trExistingPSTNNum.style.visibility="visible";
//            trIDType.style.visibility="hidden";
//            trID.style.visibility="hidden";        
//         }
//         else     
//         {
//            
//            trExistingPSTNNum.style.visibility="hidden";
//            trIDType.style.visibility="visible";
//            trID.style.visibility="visible";    
//         } 
//     }
//     if(listItem2!=null)
//     {
//        if(listItem2.checked)      
//         {
//            trExistingPSTNNum.style.visibility="hidden";
//            trIDType.style.visibility="visible";
//            trID.style.visibility="visible";        
//         }  
//         else         
//         {
//            trExistingPSTNNum.style.visibility="visible";                
//         }
//     }
}
function landmarkdetailsonclick(ClientID,Culture)
{
//     var count=0;
//     var isItemChecked = false;
//     for (var i=0; i<3; i++)
//     {
//          var listItem = document.getElementById(ClientID+"_rbtnNearTelephone_" + i);
//          
//          if (listItem.checked )
//          {
//            count=i;             
//            isItemChecked = true;
//          }
//     }                 
//     if(isItemChecked==true)
//     {
//       if(count==2)
//       {
//         document.getElementById(ClientID+"_txtExistingPSTNNum").disabled=true;
//       }
//       else
//       {
//        document.getElementById(ClientID+"_txtExistingPSTNNum").disabled=false;
//       }
//     }
}
function ValidatePlanOnload(ClientID)
{   


   var fixedline = document.getElementById(ClientID+"_txtExistingPSTNNum");    
   
   var ddlconn=document.getElementById(ClientID+"_ddlconntype");
   
   //var listItem1 = document.getElementById(ClientID+"_chkExisting");          
   //var listItem2 = document.getElementById(ClientID+"_chkNew");
   
   
   var trExistingPSTNNum = document.getElementById("trExistingPSTNNum");    
     var trIDExpiry = document.getElementById("trIDExpiry");             

    if((ddlconn.selectedIndex==1)||(ddlconn.selectedIndex==3))
        { 
     //if(listItem1.checked) 
     //{
        trExistingPSTNNum.style.visibility="visible";
         trIDType.style.visibility="hidden";
         trID.style.visibility="hidden";  
         trIDExpiry.style.visibility="hidden"; 
         
          if(ddlconn.selectedIndex==3)
         {
         
            trIDType.style.visibility="visible";
            trID.style.visibility="visible"; 
         
         }
     } 
     else //if(listItem2.checked)     
     {
        trExistingPSTNNum.style.visibility="hidden";        
         trIDType.style.visibility="visible";
            trID.style.visibility="visible"; 
            trIDExpiry.style.visibility="visible"; 
     }
     
    var chkAlufuq = document.getElementById(ClientID+"_chkAlufuq");
    var AlufuqNumber = document.getElementById(ClientID+"_txtAlufuq");                  
     if(chkAlufuq!=null)
     {
         if(chkAlufuq.checked) 
         {            
            AlufuqNumber.disabled=false;     
         }
         else     
         {            
            AlufuqNumber.value="";
            AlufuqNumber.disabled=true;     
         } 
     }
}

function ValidatePreRequisitesNext(ClientID,Culture)
{  

 var ddlconn=document.getElementById(ClientID+"_ddlconntype");
      
   var fixedline = document.getElementById(ClientID+"_txtExistingPSTNNum");  
     
   var ExisNewPSTN1 = document.getElementById(ClientID+"_chkExisting");          
   var ExisNewPSTN2 = document.getElementById(ClientID+"_chkNew");          
   
//   var NearlistItem1 = document.getElementById(ClientID+"_rbtnNearTelephone_0");          
//   var NearlistItem2 = document.getElementById(ClientID+"_rbtnNearTelephone_1");  
//   var NearNoTel = document.getElementById(ClientID+"_rbtnNearTelephone_2");  
   
   var ExpNumeric =/^[0-9]+$/   
     
    if(Culture =="English")
    {
    
    //dec2013
       if(ddlconn!=null && ddlconn.selectedIndex==0)
        {
         alert('Please select a connection type');
         ddlconn.focus();
         ddlconn.style.background="#FAA28E"; 
         return false;
        
        }
        //
        
         

    
        if((ddlconn.selectedIndex==1)||(ddlconn.selectedIndex==3))
        {     
            if(fixedline.value=="")
              {
                 alert('Please enter a fixedline number');
                 fixedline.focus();
                 fixedline.style.background="#FAA28E"; 
                 return false;
              }
              if((fixedline.value!="") && (!fixedline.value.match(ExpNumeric)))
              {
                alert("fixedline number should be numeric");
                fixedline.focus();
                fixedline.style.background="#FAA28E"; 
                return false;
              }    
        }    
        
        
        if(ddlconn.selectedIndex==3)
        {
        
           var isItemChecked = false;
             for (var i=0; i<2; i++)
             {     
                 var listItem = document.getElementById(ClientID+"_DlSecurityID_" + i);         
                 if (listItem.checked )
                 {                        
                    isItemChecked = true;
                }
             }      
             if(isItemChecked==false)
             {
                alert("Please select ID type"); 
                return false;
             }     
             var  SecurityId=document.getElementById(ClientID+"_TbSecurityID");
             if(SecurityId.value=="")
             {
               alert("Please enter your Security Id");
               SecurityId.focus();
               return false;
             }
        
        }   

        
       if(ddlconn.selectedIndex==2)
        {
            var isItemChecked = false;
             for (var i=0; i<2; i++)
             {     
                 var listItem = document.getElementById(ClientID+"_DlSecurityID_" + i);         
                 if (listItem.checked )
                 {                        
                    isItemChecked = true;
                }
             }      
             if(isItemChecked==false)
             {
                alert("Please select ID type"); 
                return false;
             }     
             var  SecurityId=document.getElementById(ClientID+"_TbSecurityID");
             if(SecurityId.value=="")
             {
               alert("Please enter your Security Id");
               SecurityId.focus();
               return false;
             }
             
             
          
       
        
        if(document.getElementById(ClientID+"_drpMonth").selectedIndex==0)
        {
            alert("Please select full date");                   
            document.getElementById(ClientID+"_drpMonth").focus();
            return false;
        }
         if(document.getElementById(ClientID+"_drpDate").selectedIndex==0)
        {
              alert("Please select full date"); 
              document.getElementById(ClientID+"_drpDate").focus();               
              return false;
        }
        if(document.getElementById(ClientID+"_drpYearID").selectedIndex==0)
        {
            alert("Please select full date"); 
            document.getElementById(ClientID+"_drpYearID").focus();                 
            return false;
        }       
        
        
        ///Validate birthday
        
          var y = document.getElementById(ClientID+"_drpYearID");
          var m = document.getElementById(ClientID+"_drpMonth");
          var d = document.getElementById(ClientID+"_drpDate");
          
          var year=y.options[y.selectedIndex].value;
          var month=m.options[m.selectedIndex].value;
          var date=d.options[d.selectedIndex].value;
          
          //alert(year + month + date);
          if(month=="2")
          {          
            if(isleap(year)=='true')
            {
              if(date>29)
              {
               alert("Date is not valid for this month");
               d.focus();
               return false;
              }
            }
            else 
            {
              
               if(date>28)
                {                 
                 alert( "Date is not valid for this month");
                 d.focus();
                 return false;
                }
            }            
          }
          //4,6,9,11
          if( (month==4) || (month==6) || (month==9) || (month==11))
          {
            if(date>30)
            {                
                 alert("Date is not valid for this month");
                 d.focus();
                 return false;
            }            
          }          
        }
        //vish30
         var currentTime = new Date()
         
         var day1 = currentTime.getDate()
         //alert(day1);
         var month1 = currentTime.getMonth() + 1
         //alert(month1);
         var year1 = currentTime.getFullYear()
         //alert(year1);
         
         if(year<=year1)
         {
            if(month<month1)
            {  
                  alert("ID expiry date should be greater than today's date");
                  return false;
            }
            if(month==month1)
            { 
                if(date<=day1 )
                {
                   alert("ID expiry date should be greater than today's date");
                   return false;
                }
            }
               
            
         }
        
        ///
        
        var chkAlufuq = document.getElementById(ClientID+"_chkAlufuq");
        var AlufuqNumber = document.getElementById(ClientID+"_txtAlufuq");                  
        if(chkAlufuq!=null && chkAlufuq.checked) 
         {            
            if(AlufuqNumber.value=="")
            {
               alert("Please enter your Al ufuq mobile number");
               AlufuqNumber.focus();
               return false;    
             }
         }        
      
    }
    
      
    if(Culture =="Arabic")
    {
//        if((ExisNewPSTN1 != null) && (ExisNewPSTN2 != null))
//        {
//            if((!ExisNewPSTN1.checked) && (!ExisNewPSTN2.checked))
//            { 
//                 alert('الرجاء تحديد نوع الاتصال');                 
//                 ExisNewPSTN1.focus();
//                 return false;
//            }        
//        }


//
//dec2013
     if(ddlconn!=null && ddlconn.selectedIndex==0)
        {
        
                alert('الرجاء تحديد نوع الاتصال');                 
                ddlconn.focus();
                ddlconn.style.background="#FAA28E"; 
                return false;
                
        }
    
        //if((ExisNewPSTN1!=null) && (ExisNewPSTN1.checked))
        if((ddlconn.selectedIndex==1)||(ddlconn.selectedIndex==3))
        { 
             
            if(fixedline.value=="")
              {
                 alert('الرجاء إدخال رقم الهاتف الثابت');
                 fixedline.focus();
                 fixedline.style.background="#FAA28E"; 
                 return false;
              }
              if((fixedline.value!="") && (!fixedline.value.match(ExpNumeric)))
              {
                alert("يجب أن يكون رقم الهاتف الثابت بالأعداد");
                fixedline.focus();
                fixedline.style.background="#FAA28E"; 
                return false;
              }    
        }       
//        if((ExisNewPSTN2!=null) && (ExisNewPSTN2.checked))
//        {         
//         if((NearNoTel!=null) && (!NearNoTel.checked))
//          {    
//            if(fixedline.value=="")
//            {
//               alert('Please enter a fixedline number');
//               fixedline.focus();
//               fixedline.style.background="#FAA28E"; 
//               return false;
//            }
//             if((fixedline.value!="") && (!fixedline.value.match(ExpNumeric)))
//              {
//                alert("fixedline number should be numeric");
//                fixedline.focus();
//                fixedline.style.background="#FAA28E"; 
//                return false;
//              }  
//          }
//        }
//        if((NearlistItem1!=null) && (NearlistItem2 !=null) && (NearNoTel !=null))
//        {  
//            if((!NearlistItem1.checked) && (!NearlistItem2.checked) && (!NearNoTel.checked))
//            {
//                alert("Please select a nearest telephone type");
//                NearlistItem1.focus();
//                return false;
//            }
//        }
        
        //if((ExisNewPSTN2!=null) && (ExisNewPSTN2.checked))
        
        if(ddlconn.selectedIndex==2)
        {
         
            var isItemChecked = false;
             for (var i=0; i<2; i++)
             {     
                 var listItem = document.getElementById(ClientID+"_DlSecurityID_" + i);         
                 if (listItem.checked )
                 {                        
                    isItemChecked = true;
                }
             }      
             if(isItemChecked==false)
             {
                alert("الرجاء اختيار نوع ID"); 
                return false;
             }     
             var  SecurityId=document.getElementById(ClientID+"_TbSecurityID");
             if(SecurityId.value=="")
             {
               alert("الرجاء إدخال معرف الأمان الخاص");
               SecurityId.focus();
               return false;
             }
             
             
          
       
        
        if(document.getElementById(ClientID+"_drpMonth").selectedIndex==0)
        {
            alert("الرجاء تحديد تاريخ كامل");                   
            document.getElementById(ClientID+"_drpMonth").focus();
            return false;
        }
         if(document.getElementById(ClientID+"_drpDate").selectedIndex==0)
        {
              alert("الرجاء تحديد تاريخ كامل"); 
              document.getElementById(ClientID+"_drpDate").focus();               
              return false;
        }
        if(document.getElementById(ClientID+"_drpYearID").selectedIndex==0)
        {
            alert("الرجاء تحديد تاريخ كامل"); 
            document.getElementById(ClientID+"_drpYearID").focus();                 
            return false;
        }       
        
        ///Validate birthday
        
          var y = document.getElementById(ClientID+"_drpYearID");
          var m = document.getElementById(ClientID+"_drpMonth");
          var d = document.getElementById(ClientID+"_drpDate");
          
          var year=y.options[y.selectedIndex].value;
          var month=m.options[m.selectedIndex].value;
          var date=d.options[d.selectedIndex].value;
          
          //alert(year + month + date);
          if(month=="2")
          {          
            if(isleap(year)=='true')
            {
              if(date>29)
              {
               alert("التاريخ غير صالح لهذا الشهر");
               d.focus();
               return false;
              }
            }
            else 
            {
              
               if(date>28)
                {                 
                 alert( "التاريخ غير صالح لهذا الشهر");
                 d.focus();
                 return false;
                }
            }            
          }
          //4,6,9,11
          if( (month==4) || (month==6) || (month==9) || (month==11))
          {
            if(date>30)
            {                
                 alert("التاريخ غير صالح لهذا الشهر");
                 d.focus();
                 return false;
            }            
          }          
        }
        
        //vish30
         var currentTime = new Date()
         
         var day1 = currentTime.getDate()
         //alert(day1);
         var month1 = currentTime.getMonth() + 1
         //alert(month1);
         var year1 = currentTime.getFullYear()
         //alert(year1);
         
         if(year<=year1)
         {
            if(month<month1)
            {  
                  alert("ID expiry date should be greater than today's date");
                  return false;
            }
            if(month==month1)
            { 
                if(date<=day1 )
                {
                   alert("ID expiry date should be greater than today's date");
                   return false;
                }
            }
               
            
         }
        
        ///
        
        var chkAlufuq = document.getElementById(ClientID+"_chkAlufuq");
        var AlufuqNumber = document.getElementById(ClientID+"_txtAlufuq");                  
        if(chkAlufuq!=null && chkAlufuq.checked) 
         {            
            if(AlufuqNumber.value=="")
            {
               alert("الرجاء إدخال رقم هاتف الأفق المتنقل");
               AlufuqNumber.focus();
               return false;    
             }
         }        
      
    }
    
   return true;
}

function ValidateADSLUsername(ControlID,Culture)
{
   var ExpNumeric =/^[0-9]+$/
    var SpecialChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";
    var SpecialCharsComplete="!@#$%^&*()+=-[]\\\'.;,/{}|\":<>?";
    var letters = /^[A-Za-z0-9]+$/;     
    var i=0
    var index=-1
   var ADSLUsername = document.getElementById(ControlID);
     if(ADSLUsername.value.length < 5)
      {
        if(Culture =="English")        
            alert('ADSL login Name should be between 5 to 8 characters');
        else
            alert('يجب ان يكون اسم المستخدم مكون من 5 الى 8 حروف او ارقام');
        ADSLUsername.focus();
        return false;
      }
      if((ADSLUsername.value.indexOf("allah")!=-1)
      || (ADSLUsername.value.indexOf("god")!=-1)
      ||(ADSLUsername.value.indexOf("sex")!=-1)
      || (ADSLUsername.value.indexOf("qaboos")!=-1)
      ||(ADSLUsername.value.indexOf("binladen")!=-1)
      || (ADSLUsername.value.indexOf("sultan")!=-1)
      || (ADSLUsername.value.indexOf("porn")!=-1))
      {
       if(Culture =="English")
            alert('Please choose a alternative ADSL login Name');
        else 
            alert('الرجاء اختيار اسم مستخدم مختلف');
        ADSLUsername.focus();
        ADSLUsername.style.background="#FAA28E"; 
        return false;
      }
      if(ADSLUsername.value.charAt(0).match(ExpNumeric))
      {
       if(Culture =="English")
            alert('ADSL login Name can not start with numeric values');
        else
            alert('اسم المستخدم يجب الا يبدأ برقم');
        ADSLUsername.focus();
        ADSLUsername.style.background="#FAA28E"; 
        return false;
      }       
    while(i<ADSLUsername.value.length)
    {
        index=SpecialCharsComplete.indexOf(ADSLUsername.value.charAt(i));
        if(index!=-1)
        {
            if(Culture =="English")
                alert('ADSL login Name can not have special characters except _');
            else
                alert('اسم المستخدم يجب الا يبدأ بأحرف خاصة مثل (؟ , * - ; )');
            ADSLUsername.focus();
            ADSLUsername.style.background="#FAA28E"; 
          return false;
        }
        i++;
    } 
   var strValue1=ADSLUsername.value;
    for (i=0;i<strValue1.length;i++)
    {
      if (strValue1.charAt(i).toLowerCase() != strValue1.charAt(i))
      {
          if(Culture =="English")
            alert('ADSL login Name can only have small characters');
           else
            alert('يجب ان يكون اسم المستخدم مكون من حروف باللغة الانجليزيه (small case only)');
         ADSLUsername.focus();
         ADSLUsername.style.background="#FAA28E"; 
         return false;
      }
    }
    if(!ADSLUsername.value.match(letters))  
     {  
          if(Culture =="English")
                alert('ADSL login Name should contain only English alphabets');
          else
                 alert('يجب ان يكون اسم المستخدم مكون من حروف باللغة الانجليزيه (small case only)');
          
         ADSLUsername.focus();
         ADSLUsername.style.background="#FAA28E"; 
         return false;
     }  
    return true;         
}

function ValidatePlanNext(ClientID,Culture)
{
   //step 1
//    var isAnyChecked=false;   
//    for (i = 0; i < rbtnSelect.length; i++) 
//    {
//         var rb_Visitor = document.getElementById(rbtnSelect[i]);
//         if(rb_Visitor.checked)
//         {
//            isAnyChecked=true;
//         }            
//     }
//   if(!isAnyChecked)
//   {
//     alert('Please select a ADSL plan');
//     return false;
//   }  

 if(Culture =="English")
    {
    var ddlADSLBW=document.getElementById(ClientID+"_ddlADSLBW");
    if(ddlADSLBW!=null && ddlADSLBW.selectedIndex==0)
    {
         alert('Please select a ADSL plan');
         ddlADSLBW.focus();
        ddlADSLBW.style.background="#FAA28E"; 
        return false;
    }               
    
   var FixedPlan = document.getElementById(ClientID+"_rbtnPSTNRateplan_0");          
   var UnlimitedPlan = document.getElementById(ClientID+"_rbtnPSTNRateplan_1"); 
   var isAnyChecked=false;
    if(FixedPlan!=null && FixedPlan.checked)
    {
        isAnyChecked=true;
    }
    if(UnlimitedPlan!=null && UnlimitedPlan.checked)
    {
        isAnyChecked=true;
    }
    if((FixedPlan!=null) && (UnlimitedPlan!=null) && (!isAnyChecked))
    {
        alert('Please select a Fixedline plan'); 
        FixedPlan.focus()       
        return false;
    }
    
      //alert('h');
      //alert(document.getElementById(ClientID+"_txtADSLUsername"));
      
      if(document.getElementById(ClientID+"_txtADSLUsername")!=null)
      {
       
    
        var Username1 = document.getElementById(ClientID+"_txtADSLUsername").value;
        if(Username1=="")
        {
         alert('Please enter ADSL login Name option 1');
         document.getElementById(ClientID+"_txtADSLUsername").focus();
         document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
         return false;
        }


        if(Username1!="")
        {
        if(!ValidateADSLUsername(ClientID+"_txtADSLUsername",Culture))
        {
             document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
             return false;
        }      
        }    
        var Username2 = document.getElementById(ClientID+"_txtADSLUsername2").value;
        if(Username2=="")
        {
         alert('Please enter ADSL login Name option 2');
         document.getElementById(ClientID+"_txtADSLUsername2").focus();
         document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
         return false;
        }

        if(Username2!="")
        {
        if(!ValidateADSLUsername(ClientID+"_txtADSLUsername2",Culture))
        {
             document.getElementById(ClientID+"_txtADSLUsername2").focus();
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             return false;
        }       
        }    
        var Username3 = document.getElementById(ClientID+"_txtADSLUsername3").value;
        if(Username3=="")
        {
         alert('Please enter ADSL login Name option 3');
         document.getElementById(ClientID+"_txtADSLUsername3").focus();
         document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
         return false;
        }
        if(Username3!="")
        {
          if(!ValidateADSLUsername(ClientID+"_txtADSLUsername3",Culture))
          {
             document.getElementById(ClientID+"_txtADSLUsername3").focus();
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
          }      
        }  //alert('1');alert(Username1);alert(Username2);alert(Username3);

        if(Username1==Username2)
        {
            alert('Please enter different ADSL login Names');
            document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             return false;
        }
        if(Username1==Username3)
        {
            alert('Please enter different ADSL login Names');
            document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
        }
        if(Username2==Username3)
        {
            alert('Please enter different ADSL login Names');
            document.getElementById(ClientID+"_txtADSLUsername2").focus();
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
        }
     
     
     }
        var ExpNumeric =/^[0-9]+$/
        var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;    
        var  TbEmail=document.getElementById(ClientID+"_txtEmailID");
        if(TbEmail!=null && TbEmail.value=="")
        {
            alert("Please enter E-mail ID");
            TbEmail.focus();
            return false;
        }
        if((TbEmail!=null) && (!TbEmail.value.match(ExpEmail)))
        {
            alert("E-mail is not in standard format (example: abc@xyz.com)");
             TbEmail.focus();
            return false;
        }
           
        var txtContactNumb = document.getElementById(ClientID+"_txtContactNumb");
        if(txtContactNumb!=null && txtContactNumb.value=="")
          {
             alert('Please enter your contact number');
             document.getElementById(ClientID+"_txtContactNumb").focus();
             document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
             return false;
          } 
          
          ///
          
  
        if(txtContactNumb.value.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
            return false;
        }
        if(txtContactNumb.value.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
            return false;
        }
          
          ///
          
          

        if(txtContactNumb!=null && (!txtContactNumb.value.match(ExpNumeric)))
        {
            alert("Contact number should be numeric");
            document.getElementById(ClientID+"_txtContactNumb").focus();
            document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
            return false;
        }
         var isItemChecked2 = false;
         for (var i=0; i<2; i++)
         {
             var listItem = document.getElementById(ClientID+"_rbGender_" + i);
             if (listItem.checked )
             {                   
                isItemChecked2 = true;
             }
         }     
         
         if(isItemChecked2==false)
         {
            alert("Please select your Gender");    
            document.getElementById(ClientID+"_rbGender_0").focus();
            return false;
         }  
               
        if(document.getElementById(ClientID+"_drpMonth")!=null 
        && document.getElementById(ClientID+"_drpMonth").selectedIndex==0)
        {
            alert("Please select full date of birth");                   
            document.getElementById(ClientID+"_drpMonth").focus();
            return false;
        } 
        if(document.getElementById(ClientID+"_drpDate")!=null 
        && document.getElementById(ClientID+"_drpDate").selectedIndex==0)
        {
              alert("Please select full date of birth");   
              document.getElementById(ClientID+"_drpDate").focus();
              return false;
        }         
        if(document.getElementById(ClientID+"_drpYear")!=null 
        && document.getElementById(ClientID+"_drpYear").selectedIndex==0)
        {
            alert("Please select full date of birth");           
            document.getElementById(ClientID+"_drpYear").focus();       
            return false;
        }   
    
    ///Validate birthday
    
      var y = document.getElementById(ClientID+"_drpYear");
      var m = document.getElementById(ClientID+"_drpMonth");
      var d = document.getElementById(ClientID+"_drpDate");
      
      var year=y.options[y.selectedIndex].value;
      var month=m.options[m.selectedIndex].value;
      var date=d.options[d.selectedIndex].value;
      
      //alert(year + month + date);
      if(month=="2")
      {      
        if(isleap(year)=='true')
        {
          if(date>29)
          {
            alert("Please select a valid date for this month");
            document.getElementById(ClientID+"_drpDate").focus();
            return false;
          }
        }
        else 
        {          
           if(date>28)
            {
                alert("Please select a valid date for this month");
                document.getElementById(ClientID+"_drpDate").focus();
                return false;
            }
        }        
      }
      //4,6,9,11
      if( (month==4) || (month==6) || (month==9) || (month==11))
      {
        if(date>30)
        {
             alert("Please select a valid date for this month");
             document.getElementById(ClientID+"_drpDate").focus();
             return false;
        }        
      }    
      
    }  
    
    //Arabic
    
    if(Culture =="Arabic")
    {
    var ddlADSLBW=document.getElementById(ClientID+"_ddlADSLBW");
    if(ddlADSLBW!=null && ddlADSLBW.selectedIndex==0)
    {
         alert('يرجى تحديد باقة ADSL');
         ddlADSLBW.focus();
        ddlADSLBW.style.background="#FAA28E"; 
        return false;
    }               
    
   var FixedPlan = document.getElementById(ClientID+"_rbtnPSTNRateplan_0");          
   var UnlimitedPlan = document.getElementById(ClientID+"_rbtnPSTNRateplan_1"); 
   var isAnyChecked=false;
    if(FixedPlan!=null && FixedPlan.checked)
    {
        isAnyChecked=true;
    }
    if(UnlimitedPlan!=null && UnlimitedPlan.checked)
    {
        isAnyChecked=true;
    }
    if((FixedPlan!=null) && (UnlimitedPlan!=null) && (!isAnyChecked))
    {
        alert('يرجى تحديد باقة الهاتف الثابت'); 
        FixedPlan.focus()       
        return false;
    }
    
    
   if(document.getElementById(ClientID+"_txtADSLUsername")!=null)
   {
    
      var Username1 = document.getElementById(ClientID+"_txtADSLUsername").value;
      if(Username1=="")
      {
         alert('يرجى إدخال اسم الدخول لـ ADSL خيار 1 ');
         document.getElementById(ClientID+"_txtADSLUsername").focus();
         document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
         return false;
       }


     if(Username1!="")
     {
        if(!ValidateADSLUsername(ClientID+"_txtADSLUsername",Culture))
        {
             document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E";       
             return false;
        }         
     }    
     var Username2 = document.getElementById(ClientID+"_txtADSLUsername2").value;
     if(Username2=="")
      {
         alert('يرجى إدخال اسم الدخول لـ ADSL خيار 2 ');
         document.getElementById(ClientID+"_txtADSLUsername2").focus();
         document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
         return false;
      }

     if(Username2!="")
     {
        if(!ValidateADSLUsername(ClientID+"_txtADSLUsername2",Culture))
        {
             document.getElementById(ClientID+"_txtADSLUsername2").focus();
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             return false;
        }       
     }    
     var Username3 = document.getElementById(ClientID+"_txtADSLUsername3").value;
     if(Username3=="")
      {
         alert('يرجى إدخال اسم الدخول لـ ADSL خيار 3 ');
         document.getElementById(ClientID+"_txtADSLUsername3").focus();
         document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
         return false;
      }
      if(Username3!="")
      {
          if(!ValidateADSLUsername(ClientID+"_txtADSLUsername3",Culture))
          {
             document.getElementById(ClientID+"_txtADSLUsername3").focus();
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
          }      
      }  //alert('1');alert(Username1);alert(Username2);alert(Username3);

      if(Username1==Username2)
      {
            alert('الرجاء إدخال أسماء دخول مختلفة لـ ADSL');
            document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             return false;
      }
      if(Username1==Username3)
      {
            alert('الرجاء إدخال أسماء دخول مختلفة لـ ADSL');
            document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
      }
        if(Username2==Username3)
       {
            alert('الرجاء إدخال أسماء دخول مختلفة لـ ADSL');
            document.getElementById(ClientID+"_txtADSLUsername2").focus();
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
        }
     
     }
     
       var ExpNumeric =/^[0-9]+$/
        var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;    
       var  TbEmail=document.getElementById(ClientID+"_txtEmailID");
        if(TbEmail!=null && TbEmail.value=="")
        {
            alert("الرجاء إدخال عنوان البريد الإلكتروني");
            TbEmail.focus();
            return false;
        }
        if((TbEmail!=null) && (!TbEmail.value.match(ExpEmail)))
        {
            alert("البريد الإلكتروني ليس في الشكل المعياري (مثال: abc@xyz.com)");
             TbEmail.focus();
            return false;
        }
           
        var txtContactNumb = document.getElementById(ClientID+"_txtContactNumb");
        if(txtContactNumb!=null && txtContactNumb.value=="")
          {
             alert('الرجاء إدخال رقم الاتصال');
             document.getElementById(ClientID+"_txtContactNumb").focus();
             document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
             return false;
          } 
          
          ///
          
        
        if(txtContactNumb.value.charAt(0)!='9')
        {
            alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
            return false;
        }
        if(txtContactNumb.value.length != 8)
        {
            alert("يجب ان يكون الرقم مكون من 8 أرقام");
            return false;
        }
          
          
          ///

        if(txtContactNumb!=null && (!txtContactNumb.value.match(ExpNumeric)))
        {
            alert("يجب أن يكون رقم الاتصال بالأعداد");
            document.getElementById(ClientID+"_txtContactNumb").focus();
            document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
            return false;
        }
         var isItemChecked2 = false;
         for (var i=0; i<2; i++)
         {
             var listItem = document.getElementById(ClientID+"_rbGender_" + i);
             if (listItem.checked )
             {                   
                isItemChecked2 = true;
             }
         }     
         
         if(isItemChecked2==false)
         {
            alert("الرجاء إختيار الجنس");    
            document.getElementById(ClientID+"_rbGender_0").focus();
            return false;
         }  
               
        if(document.getElementById(ClientID+"_drpMonth")!=null 
        && document.getElementById(ClientID+"_drpMonth").selectedIndex==0)
        {
            alert("يرجى تحديد تاريخ الولادة الكامل");                   
            document.getElementById(ClientID+"_drpMonth").focus();
            return false;
        } 
        if(document.getElementById(ClientID+"_drpDate")!=null 
        && document.getElementById(ClientID+"_drpDate").selectedIndex==0)
        {
              alert("يرجى تحديد تاريخ الولادة الكامل");   
              document.getElementById(ClientID+"_drpDate").focus();
              return false;
        }         
        if(document.getElementById(ClientID+"_drpYear")!=null 
        && document.getElementById(ClientID+"_drpYear").selectedIndex==0)
        {
            alert("يرجى تحديد تاريخ الولادة الكامل");           
            document.getElementById(ClientID+"_drpYear").focus();       
            return false;
        }   
    
    ///Validate birthday
    
      var y = document.getElementById(ClientID+"_drpYear");
      var m = document.getElementById(ClientID+"_drpMonth");
      var d = document.getElementById(ClientID+"_drpDate");
      
      var year=y.options[y.selectedIndex].value;
      var month=m.options[m.selectedIndex].value;
      var date=d.options[d.selectedIndex].value;
      
      //alert(year + month + date);
      if(month=="2")
      {      
        if(isleap(year)=='true')
        {
          if(date>29)
          {
            alert("التاريخ غير صالح لهذا الشهر");
            document.getElementById(ClientID+"_drpDate").focus();
            return false;
          }
        }
        else 
        {          
           if(date>28)
            {
                alert("التاريخ غير صالح لهذا الشهر");
                document.getElementById(ClientID+"_drpDate").focus();
                return false;
            }
        }        
      }
      //4,6,9,11
      if( (month==4) || (month==6) || (month==9) || (month==11))
      {
        if(date>30)
        {
             alert("التاريخ غير صالح لهذا الشهر");
             document.getElementById(ClientID+"_drpDate").focus();
             return false;
        }        
      }    
      
    }  
    
    //
    
    
    
    
    return true;
}




function ValidateServiceNext(ClientID,Culture)
{   
  //step2
  
    if(Culture =="English")
    {
        if(document.getElementById(ClientID+"_ddlGovernate").selectedIndex==0)
        {
            alert('Please select a Governate');
           document.getElementById(ClientID+"_ddlGovernate").style.background="#FAA28E"; 
            return false;
        }
        
        if(document.getElementById(ClientID+"_ddlWilayat").selectedIndex==0)
        {
            alert('Please select a Wilayat');
            document.getElementById(ClientID+"_ddlWilayat").style.background="#FAA28E"; 
            return false;
        }
        
        var Username1 = document.getElementById(ClientID+"_txtTownVill").value;
        if(Username1=="")
          {
             alert('Please enter Town/Village');
             document.getElementById(ClientID+"_txtTownVill").focus();         
             document.getElementById(ClientID+"_txtTownVill").style.background="#FAA28E"; 
             return false;
          }
     }
     
    //Arabic 
    if(Culture =="Arabic")
    {
        if(document.getElementById(ClientID+"_ddlGovernate").selectedIndex==0)
        {
            alert('الرجاء تحديد المحافظة');
           document.getElementById(ClientID+"_ddlGovernate").style.background="#FAA28E"; 
            return false;
        }
        
        if(document.getElementById(ClientID+"_ddlWilayat").selectedIndex==0)
        {
            alert('الرجاء تحديد الولاية');
            document.getElementById(ClientID+"_ddlWilayat").style.background="#FAA28E"; 
            return false;
        }
        
        var Username1 = document.getElementById(ClientID+"_txtTownVill").value;
        if(Username1=="")
          {
             alert('الرجاء إدخال المدينة / القرية');
             document.getElementById(ClientID+"_txtTownVill").focus();         
             document.getElementById(ClientID+"_txtTownVill").style.background="#FAA28E"; 
             return false;
          }
     }
          
//    var Username2 = document.getElementById(ClientID+"_txtStreet").value;
//    if(Username2=="")
//      {
//         alert('Please enter Street');
//         document.getElementById(ClientID+"_txtStreet").focus();
//         document.getElementById(ClientID+"_txtStreet").style.background="#FAA28E"; 
//         return false;
//      }
//    var Username3 = document.getElementById(ClientID+"_txtHouseNo").value;
//    if(Username3=="")
//      {
//         alert('Please enter House/Building No.');
//         document.getElementById(ClientID+"_txtHouseNo").focus();
//         return false;
//      }
//      
//       var floorNo = document.getElementById(ClientID+"_txtFloorNo").value;
//    if(floorNo=="")
//      {
//         //alert(document.getElementById(ClientID+"_DlSecurityID").selectedValue);
//         alert('Please enter floor no');
//         document.getElementById(ClientID+"_txtFloorNo").focus();
//         return false;
//      }
//      
//       var flatno = document.getElementById(ClientID+"_txtFlatNo").value;
//    if(flatno=="")
//      {
//         //alert(document.getElementById(ClientID+"_DlSecurityID").selectedValue);
//         alert('Please enter flat no');
//         document.getElementById(ClientID+"_txtFlatNo").focus();
//         return false;
//      }
//      
//       var landmark = document.getElementById(ClientID+"_txtNearlandmark").value;
//    if(landmark=="")
//      {
//         //alert(document.getElementById(ClientID+"_DlSecurityID").selectedValue);
//         alert('Please enter a landmark');
//         document.getElementById(ClientID+"_txtNearlandmark").focus();
//         return false;
//      }

//     var isItemChecked = false;
//     for (var i=0; i<3; i++)
//     {
//          var listItem = document.getElementById(ClientID+"_rbtnNearTelephone_" + i);
//          
//          if (listItem.checked )
//          {            
//            isItemChecked = true;
//          }
//          if (listItem.disabled )
//          {            
//            isItemChecked = true;
//          }
//     }
//     
//     if ( isItemChecked == false )
//     {
//        alert("Please enter a nearest telephone number");
//        return false;
//     }



    return true;
}



function ValidateRequestDetails(ClientID,Culture)
{  


    if(Culture =="English")
    {  
        var txtLatitude = document.getElementById(ClientID+"_txtLatitude");    
        if(txtLatitude.innerHTML=="")
          {             
             alert('Please point your location in the map');
             txtLatitude.focus();
             return false;
          }
       var txtAddress = document.getElementById(ClientID+"_txtAddress");
        if(txtAddress.innerHTML=="")
          {
             alert('Please point your location in the map');
             txtAddress.focus();
             return false;
          }       
      
      }
      
      
    if(Culture =="Arabic")
    {  
        var txtLatitude = document.getElementById(ClientID+"_txtLatitude");    
        if(txtLatitude.innerHTML=="")
          {             
             alert('يرجى الإشارة إلى موقعك على الخريطة');
             txtLatitude.focus();
             return false;
          }
        var txtAddress = document.getElementById(ClientID+"_txtAddress");
        if(txtAddress.innerHTML=="")
          {
             alert('يرجى الإشارة إلى موقعك على الخريطة');
             txtAddress.focus();
             return false;
          }       
      
      }
      
      
    document.getElementById(ClientID+"_hdnMap").value=txtLatitude.innerHTML+"$"+txtAddress.innerHTML;
    return true;
}

function ValidateRequestConfirmDetails(ClientID,Culture)
{   
    if(Culture =="English")
    {   
        var chkTerms = document.getElementById(ClientID+"_chkTerms");    
        if(!chkTerms.checked)
          {             
             alert('Please agree to Omantel Terms & Conditions');
             chkTerms.focus();
             return false;
          }
      
     }  

    if(Culture =="Arabic")
    {   
        var chkTerms = document.getElementById(ClientID+"_chkTerms");    
        if(!chkTerms.checked)
          {             
             alert('يرجى الموافقة على الشروط والأحكام لعمانتل');
             chkTerms.focus();
             return false;
          }
      
     }  
     
     
   
     
    return true;
}


function ValidateBillingNext(ClientID,Culture)
{
       //step4    
   var ExpNumeric =/^[0-9]+$/
   
    var countryID =document.getElementById(ClientID+"_ddlNationality");
   var countryVal = countryID.options[countryID.selectedIndex].value;
   
   if(Culture =="English")
    {  

    if(document.getElementById(ClientID+"_ddlNationality").selectedIndex==0)
    {
        alert('Please select your Nationality');
        document.getElementById(ClientID+"_ddlNationality").style.background="#FAA28E"; 
        return false;
    }                    
     var isItemChecked2 = false;
     for (var i=0; i<2; i++)
     {
         var listItem = document.getElementById(ClientID+"_rbGender_" + i);
         if (listItem.checked )
         {                   
            isItemChecked2 = true;
        }
     }     
     
     if(isItemChecked2==false)
     {
        alert("Please select your Gender");    
        document.getElementById(ClientID+"_rbGender_0").focus();
        return false;
     }              
    var Username1 = document.getElementById(ClientID+"_txtEngFname").value;
    if(Username1=="")
      {
         alert('Please enter a first name');
         document.getElementById(ClientID+"_txtEngFname").focus();
         document.getElementById(ClientID+"_txtEngFname").style.background="#FAA28E"; 
         return false;
      }

    var Username3 = document.getElementById(ClientID+"_txtEngLname").value;
    if(Username3=="")
      {
         alert('Please enter a last name');
         document.getElementById(ClientID+"_txtEngLname").focus();
         document.getElementById(ClientID+"_txtEngLname").style.background="#FAA28E"; 
         return false;
      }  
     
      //02Aug
       if(countryVal=="512")
       {
            var middlename = document.getElementById(ClientID+"_txtEngMname").value;
            if(middlename=="")
            {
                alert('Please enter a Middle name');
                document.getElementById(ClientID+"_txtEngMname").focus();
                document.getElementById(ClientID+"_txtEngMname").style.background="#FAA28E"; 
                return false;
            } 
            var arbfname = document.getElementById(ClientID+"_txtAraFname").value;
            if(arbfname=="")
            {
                alert('Please enter Arabic first name');
                document.getElementById(ClientID+"_txtAraFname").focus();
                document.getElementById(ClientID+"_txtAraFname").style.background="#FAA28E"; 
                return false;
            } 
            var arbMname = document.getElementById(ClientID+"_txtAraMname").value;
            if(arbMname=="")
            {
                alert('Please enter Arabic middle name');
                document.getElementById(ClientID+"_txtAraMname").focus();
                document.getElementById(ClientID+"_txtAraMname").style.background="#FAA28E"; 
                return false;
            } 
            var arbLname = document.getElementById(ClientID+"_txtAraLname").value;
            if(arbLname=="")
            {
                alert('Please enter Arabic last name');
                document.getElementById(ClientID+"_txtAraLname").focus();
                document.getElementById(ClientID+"_txtAraLname").style.background="#FAA28E"; 
                return false;
            } 
            
            var arbThirdname = document.getElementById(ClientID+"_txtThirdname").value;
            if(arbThirdname=="")
            {
                alert('Please enter Arabic third name name');
                document.getElementById(ClientID+"_txtThirdname").focus();
                document.getElementById(ClientID+"_txtThirdname").style.background="#FAA28E"; 
                return false;
            } 
            
       } 
       //
     
    if(document.getElementById(ClientID+"_drpMonth").selectedIndex==0)
    {
        alert("Please select full date of birth");                   
        document.getElementById(ClientID+"_drpMonth").focus();
        return false;
    } 
    if(document.getElementById(ClientID+"_drpDate").selectedIndex==0)
    {
          alert("Please select full date of birth");   
          document.getElementById(ClientID+"_drpDate").focus();
          return false;
    }         
    if(document.getElementById(ClientID+"_drpYear").selectedIndex==0)
    {
        alert("Please select full date of birth");           
        document.getElementById(ClientID+"_drpYear").focus();       
        return false;
    }   
    
    ///Validate birthday
    
      var y = document.getElementById(ClientID+"_drpYear");
      var m = document.getElementById(ClientID+"_drpMonth");
      var d = document.getElementById(ClientID+"_drpDate");
      
      var year=y.options[y.selectedIndex].value;
      var month=m.options[m.selectedIndex].value;
      var date=d.options[d.selectedIndex].value;
      
      //alert(year + month + date);
      if(month=="2")
      {
      
        if(isleap(year)=='true')
        {
          if(date>29)
          {
          alert("Please select a valid date for this month");
            document.getElementById(ClientID+"_drpDate").focus();
           return false;
          }
        }
        else 
        {
          
           if(date>28)
            {
            alert("Please select a valid date for this month");
              document.getElementById(ClientID+"_drpDate").focus();
             return false;
            }
        }
        
      }
      //4,6,9,11
      if( (month==4) || (month==6) || (month==9) || (month==11))
      {
        if(date>30)
        {
             alert("Please select a valid date for this month");
              document.getElementById(ClientID+"_drpDate").focus();
             return false;
        }
        
      }  
    var txtPlaceofWork = document.getElementById(ClientID+"_txtPlaceofWork").value;
    if(txtPlaceofWork=="")
      {
         alert('Please enter your place of work');
         document.getElementById(ClientID+"_txtPlaceofWork").focus();
         document.getElementById(ClientID+"_txtPlaceofWork").style.background="#FAA28E"; 
         return false;
      } 
       if(document.getElementById(ClientID+"_ddlProfession").selectedIndex==0)
    {
        alert("Please select your profession");                   
        document.getElementById(ClientID+"_ddlProfession").focus();
        return false;
    } 
                   
      var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;    
       var  TbEmail=document.getElementById(ClientID+"_txtEmailID");
        if(TbEmail.value=="")
        {
            alert("Please enter E-mail ID");
            TbEmail.focus();
            return false;
        }
        if(!TbEmail.value.match(ExpEmail))
        {
            alert("E-mail is not in standard format (example: abc@xyz.com)");
             TbEmail.focus();
            return false;
        }
           
        var txtContactNumb = document.getElementById(ClientID+"_txtContactNumb").value;
        if(txtContactNumb=="")
          {
             alert('Please enter your Mobile number');
             document.getElementById(ClientID+"_txtContactNumb").focus();
             document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
             return false;
          } 

        if(!txtContactNumb.match(ExpNumeric))
        {
            alert("Mobile number should be numeric");
            document.getElementById(ClientID+"_txtContactNumb").focus();
            document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
            return false;
        }    
    
    
          
       //alert(txtContactNumb.value.charAt(0));
      
        if(txtContactNumb.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
            return false;
        }
        if(txtContactNumb.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
            return false;
        }
          
          ///
    
//         var txtFaxNo = document.getElementById(ClientID+"_txtFaxNo").value;
//        if(txtFaxNo=="")
//          {
//             alert('Please enter your Fax number');
//             document.getElementById(ClientID+"_txtFaxNo").focus();
//             document.getElementById(ClientID+"_txtFaxNo").style.background="#FAA28E"; 
//             return false;
//          } 
//           if(!txtFaxNo.match(ExpNumeric))
//        {
//            alert("Fax number should be numeric");
//             document.getElementById(ClientID+"_txtFaxNo").focus();
//             document.getElementById(ClientID+"_txtFaxNo").style.background="#FAA28E"; 
//            return false;
//        }   


         var txtPostalCode = document.getElementById(ClientID+"_txtPostalCode").value;
        if(txtPostalCode=="")
          {
             alert('Please enter your Postal code');
             document.getElementById(ClientID+"_txtPostalCode").focus();
             document.getElementById(ClientID+"_txtPostalCode").style.background="#FAA28E"; 
             return false;
          } 
         if(!txtPostalCode.match(ExpNumeric))
        {
            alert("Postal code should be numeric");
             document.getElementById(ClientID+"_txtPostalCode").focus();
             document.getElementById(ClientID+"_txtPostalCode").style.background="#FAA28E"; 
            return false;
        }           
         var txtPOBox = document.getElementById(ClientID+"_txtPOBox").value;
        if(txtPOBox=="")
          {
             alert('Please enter your PO Box number');
             document.getElementById(ClientID+"_txtPOBox").focus();
             document.getElementById(ClientID+"_txtPOBox").style.background="#FAA28E"; 
             return false;
          } 
         if(!txtPOBox.match(ExpNumeric))
         {
            alert("PO Box should be numeric");
             document.getElementById(ClientID+"_txtPOBox").focus();
             document.getElementById(ClientID+"_txtPOBox").style.background="#FAA28E"; 
            return false;
         }     
            var txtPreAddress = document.getElementById(ClientID+"_txtPreAddress").value;
        if(txtPreAddress=="")
          {
             alert('Please enter your present address');
             document.getElementById(ClientID+"_txtPreAddress").focus();
             document.getElementById(ClientID+"_txtPreAddress").style.background="#FAA28E"; 
             return false;
          }       
       var fpUpload1=document.getElementById(ClientID+"_fpDocs1");
       if(fpUpload1.value == "")
         {
             alert("Please upload related documents.");
             fpUpload1.focus();
             fpUpload1.style.background="#FAA28E"; 
             return false;
         } 
        var fpUpload2=document.getElementById(ClientID+"_fpDocs2");
       if(fpUpload2.value == "")
         {
             alert("Please upload related documents.");
             fpUpload2.focus();
             fpUpload2.style.background="#FAA28E"; 
             return false;
         }  
         
     }        
         
         
         //Arabic
         
         
    if(Culture =="Arabic")
    {  

    if(document.getElementById(ClientID+"_ddlNationality").selectedIndex==0)
    {
        alert('الرجاء إختيار الجنسية');
        document.getElementById(ClientID+"_ddlNationality").style.background="#FAA28E"; 
        return false;
    }                    
     var isItemChecked2 = false;
     for (var i=0; i<2; i++)
     {
         var listItem = document.getElementById(ClientID+"_rbGender_" + i);
         if (listItem.checked )
         {                   
            isItemChecked2 = true;
        }
     }     
     
     if(isItemChecked2==false)
     {
        alert("الرجاء إختيار الجنس");    
        document.getElementById(ClientID+"_rbGender_0").focus();
        return false;
     }              
    var Username1 = document.getElementById(ClientID+"_txtEngFname").value;
    if(Username1=="")
      {
         alert('الرجاء إدخال الاسم الأول');
         document.getElementById(ClientID+"_txtEngFname").focus();
         document.getElementById(ClientID+"_txtEngFname").style.background="#FAA28E"; 
         return false;
      }

    var Username3 = document.getElementById(ClientID+"_txtEngLname").value;
    if(Username3=="")
      {
         alert('الرجاء إدخال الاسم الأخير');
         document.getElementById(ClientID+"_txtEngLname").focus();
         document.getElementById(ClientID+"_txtEngLname").style.background="#FAA28E"; 
         return false;
      }  
     
      //02Aug
       if(countryVal=="512")
       {
            var middlename = document.getElementById(ClientID+"_txtEngMname").value;
            if(middlename=="")
            {
                alert('Please enter a Middle name');
                document.getElementById(ClientID+"_txtEngMname").focus();
                document.getElementById(ClientID+"_txtEngMname").style.background="#FAA28E"; 
                return false;
            } 
            var arbfname = document.getElementById(ClientID+"_txtAraFname").value;
            if(arbfname=="")
            {
                alert('Please enter Arabic first name');
                document.getElementById(ClientID+"_txtAraFname").focus();
                document.getElementById(ClientID+"_txtAraFname").style.background="#FAA28E"; 
                return false;
            } 
            var arbMname = document.getElementById(ClientID+"_txtAraMname").value;
            if(arbMname=="")
            {
                alert('Please enter Arabic middle name');
                document.getElementById(ClientID+"_txtAraMname").focus();
                document.getElementById(ClientID+"_txtAraMname").style.background="#FAA28E"; 
                return false;
            } 
            var arbLname = document.getElementById(ClientID+"_txtAraLname").value;
            if(arbLname=="")
            {
                alert('Please enter Arabic last name');
                document.getElementById(ClientID+"_txtAraLname").focus();
                document.getElementById(ClientID+"_txtAraLname").style.background="#FAA28E"; 
                return false;
            } 
            
            var arbThirdname = document.getElementById(ClientID+"_txtThirdname").value;
            if(arbThirdname=="")
            {
                alert('Please enter Arabic third name name');
                document.getElementById(ClientID+"_txtThirdname").focus();
                document.getElementById(ClientID+"_txtThirdname").style.background="#FAA28E"; 
                return false;
            } 
            
       } 
       //
     
    if(document.getElementById(ClientID+"_drpMonth").selectedIndex==0)
    {
        alert("يرجى تحديد تاريخ الولادة الكامل");                   
        document.getElementById(ClientID+"_drpMonth").focus();
        return false;
    } 
    if(document.getElementById(ClientID+"_drpDate").selectedIndex==0)
    {
          alert("يرجى تحديد تاريخ الولادة الكامل");   
          document.getElementById(ClientID+"_drpDate").focus();
          return false;
    }         
    if(document.getElementById(ClientID+"_drpYear").selectedIndex==0)
    {
        alert("يرجى تحديد تاريخ الولادة الكامل");           
        document.getElementById(ClientID+"_drpYear").focus();       
        return false;
    }   
    
    ///Validate birthday
    
      var y = document.getElementById(ClientID+"_drpYear");
      var m = document.getElementById(ClientID+"_drpMonth");
      var d = document.getElementById(ClientID+"_drpDate");
      
      var year=y.options[y.selectedIndex].value;
      var month=m.options[m.selectedIndex].value;
      var date=d.options[d.selectedIndex].value;
      
      //alert(year + month + date);
      if(month=="2")
      {
      
        if(isleap(year)=='true')
        {
          if(date>29)
          {
          alert("التاريخ غير صالح لهذا الشهر");
            document.getElementById(ClientID+"_drpDate").focus();
           return false;
          }
        }
        else 
        {
          
           if(date>28)
            {
            alert("التاريخ غير صالح لهذا الشهر");
              document.getElementById(ClientID+"_drpDate").focus();
             return false;
            }
        }
        
      }
      //4,6,9,11
      if( (month==4) || (month==6) || (month==9) || (month==11))
      {
        if(date>30)
        {
             alert("التاريخ غير صالح لهذا الشهر");
              document.getElementById(ClientID+"_drpDate").focus();
             return false;
        }
        
      }  
    var txtPlaceofWork = document.getElementById(ClientID+"_txtPlaceofWork").value;
    if(txtPlaceofWork=="")
      {
         alert('يرجى ادخال مكان العمل');
         document.getElementById(ClientID+"_txtPlaceofWork").focus();
         document.getElementById(ClientID+"_txtPlaceofWork").style.background="#FAA28E"; 
         return false;
      } 
       if(document.getElementById(ClientID+"_ddlProfession").selectedIndex==0)
    {
        alert("الرجاء اختيار مهنتك");                   
        document.getElementById(ClientID+"_ddlProfession").focus();
        return false;
    } 
                   
      var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;    
       var  TbEmail=document.getElementById(ClientID+"_txtEmailID");
        if(TbEmail.value=="")
        {
            alert("الرجاء إدخال عنوان البريد الإلكتروني");
            TbEmail.focus();
            return false;
        }
        if(!TbEmail.value.match(ExpEmail))
        {
            alert("البريد الإلكتروني ليس في الشكل المعياري (مثال: abc@xyz.com)");
             TbEmail.focus();
            return false;
        }
           
        var txtContactNumb = document.getElementById(ClientID+"_txtContactNumb").value;
        if(txtContactNumb=="")
          {
             alert('الرجاء إدخال رقم الاتصال');
             document.getElementById(ClientID+"_txtContactNumb").focus();
             document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
             return false;
          } 

        if(!txtContactNumb.match(ExpNumeric))
        {
            alert("يجب أن يكون رقم الاتصال بالأعداد");
            document.getElementById(ClientID+"_txtContactNumb").focus();
            document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
            return false;
        }  
        
         ///
          
        
        if(txtContactNumb.charAt(0)!='9')
        {
            alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
            return false;
        }
        if(txtContactNumb.length != 8)
        {
            alert("يجب ان يكون الرقم مكون من 8 أرقام");
            return false;
        }
          
          
          ///
            
    
//         var txtFaxNo = document.getElementById(ClientID+"_txtFaxNo").value;
//        if(txtFaxNo=="")
//          {
//             alert('Please enter your Fax number');
//             document.getElementById(ClientID+"_txtFaxNo").focus();
//             document.getElementById(ClientID+"_txtFaxNo").style.background="#FAA28E"; 
//             return false;
//          } 
//           if(!txtFaxNo.match(ExpNumeric))
//        {
//            alert("Fax number should be numeric");
//             document.getElementById(ClientID+"_txtFaxNo").focus();
//             document.getElementById(ClientID+"_txtFaxNo").style.background="#FAA28E"; 
//            return false;
//        }   


         var txtPostalCode = document.getElementById(ClientID+"_txtPostalCode").value;
        if(txtPostalCode=="")
          {
             alert('الرجاء إدخال الرمز البريدي الخاص بك');
             document.getElementById(ClientID+"_txtPostalCode").focus();
             document.getElementById(ClientID+"_txtPostalCode").style.background="#FAA28E"; 
             return false;
          } 
         if(!txtPostalCode.match(ExpNumeric))
        {
            alert("يجب أن يكون الرمز البريدي بالأعداد");
             document.getElementById(ClientID+"_txtPostalCode").focus();
             document.getElementById(ClientID+"_txtPostalCode").style.background="#FAA28E"; 
            return false;
        }           
         var txtPOBox = document.getElementById(ClientID+"_txtPOBox").value;
        if(txtPOBox=="")
          {
             alert('يرجى إدخال رقم صندوق البريد الخاص بك');
             document.getElementById(ClientID+"_txtPOBox").focus();
             document.getElementById(ClientID+"_txtPOBox").style.background="#FAA28E"; 
             return false;
          } 
         if(!txtPOBox.match(ExpNumeric))
         {
            alert("يجب أن يكون رقم صندوق البريد بالأعداد");
             document.getElementById(ClientID+"_txtPOBox").focus();
             document.getElementById(ClientID+"_txtPOBox").style.background="#FAA28E"; 
            return false;
         }     
            var txtPreAddress = document.getElementById(ClientID+"_txtPreAddress").value;
        if(txtPreAddress=="")
          {
             alert('يرجى ادخال عنوانك الحالي');
             document.getElementById(ClientID+"_txtPreAddress").focus();
             document.getElementById(ClientID+"_txtPreAddress").style.background="#FAA28E"; 
             return false;
          }       
       var fpUpload1=document.getElementById(ClientID+"_fpDocs1");
       if(fpUpload1.value == "")
         {
             alert("يرجى تحميل الوثائق ذات الصلة.");
             fpUpload1.focus();
             fpUpload1.style.background="#FAA28E"; 
             return false;
         } 
        var fpUpload2=document.getElementById(ClientID+"_fpDocs2");
       if(fpUpload2.value == "")
         {
             alert("يرجى تحميل الوثائق ذات الصلة.");
             fpUpload2.focus();
             fpUpload2.style.background="#FAA28E"; 
             return false;
         }  
         
     }       
         
         
    return true;
}

     function HidePlanInfoDiv(ClientID)
        {    
		  var  hdnPlanDetails=document.getElementById(ClientID+'_hdnPlanDetails');	
		  var  divPlanInfo=document.getElementById('divPlanInfo');
		    if(hdnPlanDetails!=null)
		    {
		    
		   	    if(hdnPlanDetails.value == "0")
			    {
				    divPlanInfo.style.visibility="visible";
			    }
			    else
			    {
			        divPlanInfo.style.visibility="hidden";
			    }
		    }
        }


        var map;
        var geocoder;
        var centerChangedLast;
        var reverseGeocodedLast;
        var currentReverseGeocodeResponse;
        var ccclientID;
        function initialize(clientID) {      
         
            var latlng = new google.maps.LatLng(32.5468, -23.2031);
        
            var myOptions = {
                zoom: 2,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.HYBRID
            };      
             
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                 
            geocoder = new google.maps.Geocoder();

            ccclientID=clientID;
            setupEvents(clientID);
            centerChanged(clientID);
        }

        function setupEvents(clientID) {
            reverseGeocodedLast = new Date();
            centerChangedLast = new Date();

            setInterval(function () {
                if ((new Date()).getSeconds() - centerChangedLast.getSeconds() > 1) {
                    if (reverseGeocodedLast.getTime() < centerChangedLast.getTime())
                        reverseGeocode();
                }
            }, 1000);

            google.maps.event.addListener(map, 'zoom_changed', function () {
               // document.getElementById("zoom_level").innerHTML = map.getZoom();
            });

            google.maps.event.addListener(map, 'center_changed', centerChanged);

            google.maps.event.addDomListener(document.getElementById('crosshair'), 'dblclick', function () {
                map.setZoom(map.getZoom() + 1);
            });

        }

        function getCenterLatLngText() {
            return '(' + map.getCenter().lat() + ', ' + map.getCenter().lng() + ')';
        }

        function centerChanged(clientID) {
            centerChangedLast = new Date();
            var latlng = getCenterLatLngText();
            document.getElementById(clientID+'_txtLatitude').innerHTML = latlng;
            //document.getElementById(clientID+'_txtLongitude').value = latlng;
            document.getElementById(clientID+'_txtAddress').innerHTML = '';
            currentReverseGeocodeResponse = null;
        }
        
         function centerChanged() {
            centerChangedLast = new Date();
            var latlng = getCenterLatLngText();
            document.getElementById(ccclientID+'_txtLatitude').innerHTML = latlng;
            //document.getElementById(ccclientID+'_txtLongitude').value = latlng;
            document.getElementById(ccclientID+'_txtAddress').innerHTML = '';
            currentReverseGeocodeResponse = null;
        }

        function reverseGeocode() {
            reverseGeocodedLast = new Date();
            geocoder.geocode({ latLng: map.getCenter() }, reverseGeocodeResult);
        }

        function reverseGeocodeResult(results, status) {
            currentReverseGeocodeResponse = results;
            if (status == 'OK') {
                if (results.length == 0) {
                    document.getElementById(ccclientID+'_txtAddress').innerHTML = 'None';
                } else {
                    document.getElementById(ccclientID+'_txtAddress').innerHTML = results[0].formatted_address;
                }
            } else {
                document.getElementById(ccclientID+'_txtAddress').innerHTML = 'Error';
            }
        }


        function geocode(clientID) {
         
             geocoder = new google.maps.Geocoder();
            var address = document.getElementById(clientID+"_hdnLocation").value;              
         
            geocoder.geocode({
                'address': address,
                'partialmatch': true
            }, geocodeResult);
            
            return false;
        }

        function geocodeResult(results, status) {
            if (status == 'OK' && results.length > 0) {
                map.fitBounds(results[0].geometry.viewport);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        }

        function addMarkerAtCenter() {
            var marker = new google.maps.Marker({
                position: map.getCenter(),
                map: map
            });

            var text = 'Lat/Lng: ' + getCenterLatLngText();
            if (currentReverseGeocodeResponse) {
                var addr = '';
                if (currentReverseGeocodeResponse.size == 0) {
                    addr = 'None';
                } else {
                    addr = currentReverseGeocodeResponse[0].formatted_address;
                }
                text = text + '<br>' + 'address: <br>' + addr;
            }

            var infowindow = new google.maps.InfoWindow({ content: text });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
        } 
        
        function SetUniqueRadioButton(index) {
             for (i = 0; i < rbtnSelect.length; i++) {
                 var rb_Visitor = document.getElementById(rbtnSelect[i]);
                 if (i == index) {
                     rb_Visitor.checked = true;
                 }
                 else {
                     rb_Visitor.checked = false;
                 }
             }
         }



//New Region

function RedirectOnCP(CPUrl)
{
//alert(CPUrl);
    location.href(CPUrl);   
    return false; 
}



function  Prov_ValidateRequestProcessing(ClientID)
{
     var ddlAction = document.getElementById(ClientID+"_ddlAction");
    
    if(ddlAction!=null && ddlAction.selectedIndex == 0)
      {
         alert('Please select an option');
         ddlAction.focus();
         ddlAction.style.background="#FAA28E"; 
         return false;
      }  
      
      //alert(ddlAction.selectedIndex);
       var ddlRemarks = document.getElementById(ClientID+"_ddlRemarks");
      
      if(ddlAction!=null && ddlAction.selectedIndex == 1)
      {
          if(ddlRemarks.selectedIndex == 0)
          {
             alert('Please select remarks');
             ddlRemarks.focus();
             ddlRemarks.style.background="#FAA28E"; 
             return false;
          }  

      } 
      
      if(ddlAction!=null && ddlAction.selectedIndex == 2)
      { 
            
        var BRMSerialNo = document.getElementById(ClientID+"_lnkAssignSerialNum");
        if(BRMSerialNo!=null)
          {
             alert('Please assign a BRM Serial Number');
             BRMSerialNo.focus();
             BRMSerialNo.style.background="#FAA28E"; 
             return false;
          }      
            var Username1 = document.getElementById(ClientID+"_txtADSLNameFinalized").value;
        if( Username1==""&& (!Username1.disabled))
          {
             alert('Please enter ADSL login Name');
             document.getElementById(ClientID+"_txtADSLNameFinalized").focus();
             document.getElementById(ClientID+"_txtADSLNameFinalized").style.background="#FAA28E"; 
             return false;
          }
         if(Username1!=""
         && (!Username1.disabled))
         {
            if(!ValidateADSLUsername(ClientID+"_txtADSLNameFinalized",Culture))
            {
                 document.getElementById(ClientID+"_txtADSLNameFinalized").focus();
                 document.getElementById(ClientID+"_txtADSLNameFinalized").style.background="#FAA28E"; 
                 return false;
            }      
         }  
         
         var PSTN = document.getElementById(ClientID+"_txtPSTNFinalized");
        if(PSTN!=null && PSTN.value==""
        && (!PSTN.disabled))
          {
             alert('Please enter FixedLine number');
             document.getElementById(ClientID+"_txtPSTNFinalized").focus();
             document.getElementById(ClientID+"_txtPSTNFinalized").style.background="#FAA28E"; 
             return false;
          }
          if(PSTN!=null && PSTN.value!=""
          && (!PSTN.disabled))
         {      
            var ExpNumeric =/^[0-9]+$/
            if(!PSTN.value.match(ExpNumeric))
            {
                  alert('FixedLine number should be numeric');
                 document.getElementById(ClientID+"_txtPSTNFinalized").focus();
                 document.getElementById(ClientID+"_txtPSTNFinalized").style.background="#FAA28E"; 
                 return false;
            }      
         }
       } 
  return true; 
}

function DisablePSTNAndADSLLoginBoxes(ClientID)
{
  var ddlaction=document.all(ClientID+ '_ddlAction');
  
 
  
  if(ddlaction.selectedIndex == 2)
  {
    if(document.getElementById(ClientID+"_txtPSTNFinalized")!=null)
     document.getElementById(ClientID+"_txtPSTNFinalized").disabled=false;
     
     if(document.getElementById(ClientID+"_txtADSLNameFinalized")!=null)
     document.getElementById(ClientID+"_txtADSLNameFinalized").disabled=false;
     
     document.getElementById(ClientID+"_ddlRemarks").disabled=true;
      
      //var remarks=document.getElementById(ClientID+"_ddlRemarks").focus();
     //alert( remarks);
      //remarks.disabled=true;
    //document.getElementById("mySelect").disabled=true;
    
     
  }
  else
  {
    if(document.getElementById(ClientID+"_txtPSTNFinalized")!=null)
     document.getElementById(ClientID+"_txtPSTNFinalized").disabled=true;
     if(document.getElementById(ClientID+"_txtADSLNameFinalized")!=null)
     document.getElementById(ClientID+"_txtADSLNameFinalized").disabled=true;
     
     document.getElementById(ClientID+"_ddlRemarks").disabled=false;
      //var remarks=document.getElementById(ClientID+"_ddlRemarks").focus();
     //remarks.disabled=false;
  }
}


//Start LMS


function LMS_ValidateOrderDetails(ClientId, Culture)
{

    if(Culture=="English")
    {
                   
           if(document.getElementById(ClientId+"_TxtFromDate").value == "")
           {
                alert('Select From Date');
                document.getElementById(ClientId+"_TxtFromDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_TxtToDate").value == "")
           {
                alert('Select End Date');
                document.getElementById(ClientId+"_TxtToDate").focus();
                return false;
           }
    }

    if(Culture =="Arabic")
    {  
           if(document.getElementById(ClientId+"_TxtFromDate").value == "")
           {
                alert('إختر تاريخ البدء');
                document.getElementById(ClientId+"_TxtFromDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_TxtToDate").value == "")
           {
                alert('إختر تاريخ الانتهاء');
                document.getElementById(ClientId+"_TxtToDate").focus();
                return false;
           }
    }

}


function LMS_ValidateTransactionDetails(ClientId, Culture)
{

    if(Culture=="English")
    {
                   
           if(document.getElementById(ClientId+"_TxtFromDate").value == "")
           {
                alert('Select From Date');
                document.getElementById(ClientId+"_TxtFromDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_TxtToDate").value == "")
           {
                alert('Select To Date');
                document.getElementById(ClientId+"_TxtToDate").focus();
                return false;
           }
    }

    if(Culture =="Arabic")
    {  
           if(document.getElementById(ClientId+"_TxtFromDate").value == "")
           {
                alert('إختر تاريخ البدء');
                document.getElementById(ClientId+"_TxtFromDate").focus();
                return false;
           }
           if(document.getElementById(ClientId+"_TxtToDate").value == "")
           {
                alert('إختر تاريخ الانتهاء');
                document.getElementById(ClientId+"_TxtToDate").focus();
                return false;
           }
    }

}

function LMS_Selrdbtn(ClientID,itemIndex) 
{

    var gvid=ClientID+"_gvRedeemPoints";

    var rowscount = document.getElementById(gvid);  
    var rowsize=parseInt(rowscount.rows.length)+1;

     //ctl00_m_g_2b441b70_09b4_4376_89a9_e19bcc4243a7_gvRedeemPoints
//ctl00_m_g_2b441b70_09b4_4376_89a9_e19bcc4243a7_gvRedeemPoints_ctl06

    var MyRadio;


    var index=parseInt(itemIndex) + 2;


    var count=2;
    for( var i = 2;i<rowsize;i++)
    {
             MyRadio = document.getElementById(ClientID + "_gvRedeemPoints_ctl0"+i + "_" + "rbtnSelect");
     
             
             if(parseInt(count)==index)
             {
             }
             else
             {
                MyRadio.checked = false;
             }
              
            count++; 
     }    
     
    
     
}


function LMS_RedeemSubmit(ClientId, Culture)
{

 
    var gvid2=ClientId + "_gvRedeemPoints";
    var count=0;
    

     var rowscount = document.getElementById(gvid2);  
     var rowsize=parseInt(rowscount.rows.length)+1;
    
     

    var MyRadio;


    //var index=parseInt(itemIndex) + 2;


  
    for( var i = 2;i<rowsize;i++)
    {
             MyRadio = document.getElementById(ClientId + "_gvRedeemPoints_ctl0"+ i + "_" + "rbtnSelect");
     
    
             if(MyRadio.checked)
             {
                count++; 
             }
             
              
          
     }   
     
 

    if(Culture=="English")
    {
      
      
     if(count==0)
     {
            alert("Please select one package");                  
            return false;
     }
      
      
    }
    
    
    if(Culture =="Arabic")
    { 
    
     if(count==0)
     {
            alert("الرجاء إختيار الباقة المناسبة");                  
            return false;
     }
    
    }

}



function LMS_RedeemNext(ClientId, Culture)
{

    if(Culture=="English")
    {
      
      
       if(document.getElementById(ClientId+"_ddlNumber").selectedIndex==0)
        {
            alert("Please select Number");                  
            return false;
        }
        
        
        if(document.getElementById(ClientId+"_ddlPackage").selectedIndex==0)
        {
            alert("Please select package category");                  
            return false;
        }
    }
    
    
    if(Culture =="Arabic")
    { 
    
       if(document.getElementById(ClientId+"_ddlNumber").selectedIndex==0)
        {
            alert("الرجاء إختيار الرقم ");                  
            return false;
        }
        
        
        if(document.getElementById(ClientId+"_ddlPackage").selectedIndex==0)
        {
            alert("الرجاء إختيار الباقة المناسبة");                  
            return false;
        }
    
    }

}



function LMS_RegisterNext(ClientID, Culture)
{
    var rowCount;
    var irowCount;
    var cellCount;
    var gvID=ClientID+"_gvGSMdetails";
    var gridID= document.getElementById(ClientID+"_gvGSMdetails");
    var txtBoxID;
    var ImageID;
    var col=1;
    var row=1;
    var irow=1;
    var result=false;
    var i=0;
    var chkBoxID;
    var chkBox;
    var txtBox ;
    var isAnychecked=false;
        if(gridID!= null)
        {
            irowCount= gridID.rows.length; 
           
            for(irow=1;irow<=irowCount;irow++)
            {
                if(irow!=1)
                {
                    if(irow < 10)
                    {
                        chkBoxID=gvID +"_ctl0" + irow +"_ctl00";
                    }
                    else if(irow >= 10 && irow<= irowCount)
                    {
                        chkBoxID=gvID +"_ctl" + irow +"_ctl00";
                    }
                    chkBox = document.getElementById(chkBoxID);                   
                    if(chkBox!=null && chkBox.checked == true)
                    {
                        isAnychecked=true;
                        irow=irowCount;
                    }                         
                } 
            }  
                             
            if(isAnychecked)
            {
               result=true;
               return result;
            }
            else            
            {
                 if(culture=="English")
                    {
                        alert('Please select atleast one item');
                        result=false;
                         return result;
                    }            
                else            
                    {
                        alert('يرجى اختيار بند واحد على الأقل');
                        result=false;
                         return result;
                    }
            }
        }
  return result;       

}

function LMS_RegisterSubmit(ClientId, Culture)
{
       
       
        if(Culture=="English")
        {
      
           if(document.getElementById(ClientId+"_ddlNumber").selectedIndex==0)
            {
                alert("Please select Number");                  
                return false;
            }
        }
        
        if(Culture =="Arabic")
        {
            if(document.getElementById(ClientId+"_ddlNumber").selectedIndex==0)
            {
                 alert("الرجاء إختيار الرقم ");            
                return false;
            }
        }
        
        
//        if(document.getElementById(ClientId+"_ddlPackage").selectedIndex==0)
//        {
//            alert("Please select package category");                  
//            return false;
//        }

}



function LMS_CreateaccSelectAll(ClientID, Culture) 
{
//    var options = document.getElementsByTagName("input");    
//    for(var x = 0; x < options.length; ++x ) 
//    {
//        if(options[x].type == "checkbox") 
//        {
//        alert(options[x].type);
//             for (var j = 0; j < 15; j++) 
//             {
//                if (MyRadio[j].checked) 
//                {
//                  alert(MyRadio[j].checked);
//                } 
//                else 
//                {
//                                    
//                }
//             }
//         }
//     }

    var rowCount;
    var irowCount;
    var cellCount;
    var gvID=ClientID+"_gvGSMdetails";
    var gridID= document.getElementById(gvID);
    var chkHdrID;
    var txtBoxID;
    var ImageID;
    var col=1;
    var row=1;
    var irow=1;
    var result=false;
    var i=0;
    var chkBoxID;
    var chkBox;
    var txtBox ;
    var isAnychecked=false;
             
    if(gridID!= null)
    {
    var HdrID =gvID +"_ctl0" + irow +"_chkHeader";     
    chkHdrID = document.getElementById(HdrID);  
    //alert(chkHdrID);
     if(chkHdrID!=null)
     {
        
        if(chkHdrID.checked)
        {
            irowCount= gridID.rows.length; 
            for(irow=1;irow<=irowCount;irow++)
            {
                if(irow!=1)
                {
                    if(irow < 10)
                    {
                        chkBoxID=gvID +"_ctl0" + irow +"_ctl00";
                    }
                    else if(irow >= 10 && irow!= irowCount)
                    {
                        chkBoxID=gvID +"_ctl" + irow +"_ctl00";
                    }
                    //alert(chkBoxID);
                    chkBox = document.getElementById(chkBoxID);                   
                    if(chkBox!=null)
                    {
                        chkBox.checked =true;
                    }
                }     
            }
        } 
        else
        {
             irowCount= gridID.rows.length; 
            for(irow=1;irow<=irowCount;irow++)
            {
                if(irow!=1)
                {
                    if(irow < 10)
                    {
                        chkBoxID=gvID +"_ctl0" + irow +"_ctl00";
                    }
                    else if(irow >= 10 && irow!= irowCount)
                    {
                        chkBoxID=gvID +"_ctl" + irow +"_ctl00";
                    }
                    chkBox = document.getElementById(chkBoxID);                   
                    if(chkBox!=null)
                    {
                        chkBox.checked = false;
                    }
                }     
            }
        }
        
      }
    }
} 

//End LMS



function ValidateEPGSubmit(ClientId, Culture) 
{
    var ddlchannels =  document.getElementById(ClientId+"_ddlChannels");
    var ddlDate =  document.getElementById(ClientId+"_ddlDate");
    
    if(ddlchannels!=null && ddlchannels.selectedIndex==0)
    {
            alert("Please select a channel");
            ddlchannels.focus();
            return false;
    }
    if(ddlDate!=null && ddlDate.selectedIndex==0)
    {
            alert("Please select a date");
            ddlDate.focus();
            return false;
    }

}




//VAS 3



function VAS3_ValidateSerialNumberNext(ClientId, Culture) 
{
    var ExpNumeric =/^[0-9]+$/
    var txtSerialNumber =  document.getElementById(ClientId+"_txtSerialNumber");  
    var ddlPrimaryOrSecondary=  document.getElementById(ClientId+"_ddlPrimaryOrSecondary");  
                  
    if(Culture=="English")
    {  
        if(ddlPrimaryOrSecondary!=null && ddlPrimaryOrSecondary.selectedIndex==0)
        {
            alert("Please select the serial number to be replaced");
            ddlPrimaryOrSecondary.focus();
            return false;
        }
        if(txtSerialNumber!=null && txtSerialNumber.value=="")
        {
            alert("Please enter a serial number");
            txtSerialNumber.focus();
            return false;
        }
        if(txtSerialNumber!=null && (!txtSerialNumber.value.match(ExpNumeric)))
        {
            alert("Serial number should be numeric");
            txtSerialNumber.focus();
            return false;
        }
        
    }
    else
    {
        if(ddlPrimaryOrSecondary!=null && ddlPrimaryOrSecondary.selectedIndex==0)
        {
            alert("الرجاء اختيار الرقم المتسلسل ليتم استبداله");
            ddlPrimaryOrSecondary.focus();
            return false;
        }
        if(txtSerialNumber!=null && txtSerialNumber.value=="")
        {
            alert("الرجاء إدخال الرقم المتسلسل");
            txtSerialNumber.focus();
            return false;
        }
        if(txtSerialNumber!=null && (!txtSerialNumber.value.match(ExpNumeric)))
        {
            alert("الرقم المتسلسل يجب أن يكون بالأرقام");
            txtSerialNumber.focus();
            return false;
        }
       
    } 
    
    
   
    return true;   
}


function VAS3_ValidateAddNewLine(ClientId, Culture) 
{
    var ExpNumeric =/^[0-9]+$/
    var txtSerialNumber =  document.getElementById(ClientId+"_txtSerialNumber");  
                  
    if(Culture=="English")
    {  
        if(txtSerialNumber!=null && txtSerialNumber.value=="")
        {
            alert("Please enter a serial number");
            return false;
        }
        if(txtSerialNumber!=null && (!txtSerialNumber.value.match(ExpNumeric)))
        {
            alert("Serial number should be numeric");
            return false;
        }
    }
    else
    {
         if(txtSerialNumber!=null && txtSerialNumber.value=="")
        {
            alert("الرجاء إدخال الرقم المتسلسل");
            return false;
        }
        if(txtSerialNumber!=null && (!txtSerialNumber.value.match(ExpNumeric)))
        {
            alert("الرقم المتسلسل يجب أن يكون بالأرقام");
            return false;
        }
    } 
    
     
    
    return true;   
}



function VAS3_ValidateSIMReplace(ClientId, Culture) 
{
    var ExpNumeric =/^[0-9]+$/
    var txtSerialNumber =  document.getElementById(ClientId+"_txtSerialNumber");  
                  
    if(Culture=="English")
    {  
        if(txtSerialNumber!=null && txtSerialNumber.value=="")
        {
            alert("Please enter a serial number");
            return false;
        }
        if(txtSerialNumber!=null && (!txtSerialNumber.value.match(ExpNumeric)))
        {
            alert("Serial number should be numeric");
            return false;
        }
    }
    else
    {
         if(txtSerialNumber!=null && txtSerialNumber.value=="")
        {
            alert("الرجاء إدخال الرقم المتسلسل");
            return false;
        }
        if(txtSerialNumber!=null && (!txtSerialNumber.value.match(ExpNumeric)))
        {
            alert("الرقم المتسلسل يجب أن يكون بالأرقام");
            return false;
        }
    } 
    
   
    
    
    return true;   
}


function VAS3_ValidateAddSAWASIM(ClientId, Culture) 
{
    var ExpNumeric =/^[0-9]+$/
    var txtSerialNumber =  document.getElementById(ClientId+"_txtSerialNumber");  
                  
    if(Culture=="English")
    {  
        if(txtSerialNumber!=null && txtSerialNumber.value=="")
        {
            alert("Please enter a serial number");
            return false;
        }
        if(txtSerialNumber!=null && (!txtSerialNumber.value.match(ExpNumeric)))
        {
            alert("Serial number should be numeric");
            return false;
        }
    }
    else
    {
         if(txtSerialNumber!=null && txtSerialNumber.value=="")
        {
            alert("الرجاء إدخال الرقم المتسلسل");
            return false;
        }
        if(txtSerialNumber!=null && (!txtSerialNumber.value.match(ExpNumeric)))
        {
            alert("الرقم المتسلسل يجب أن يكون بالأرقام");
            return false;
        }
    } 
    
    
    
    return true;   
}



function VAS3_AddNewLineISD(ClientId)
{     
    var chkAddISD = document.getElementById(ClientId+ "_chkISD");
    var chkAddISDRoam = document.getElementById(ClientId+ "_chkISDRoaming");
    
    if((chkAddISD!=null) && (chkAddISDRoam!=null))
    {    
        if(chkAddISDRoam.checked)
        {  
           chkAddISD.checked=true;                         
        }   
        else        
        {
            if(chkAddISD.checked)
            {
            
            }
            else            
            {
            
                chkAddISDRoam.checked=false;
            }
        } 
    }    
}


function VAS3_ValidatebtnPlanNext(ClientId, Culture) 
{    
    var ddlNumbers=  document.getElementById(ClientId+"_ddlNumbers");  
    var ddlMBBPlan=  document.getElementById(ClientId+"_ddlMBBPlan");  
    var ddlBBPlan=  document.getElementById(ClientId+"_ddlBBPlan");  
    var txtNewLimit=  document.getElementById(ClientId+"_txtCreditLimit");  
    var ExpNumeric =/^[0-9]+$/    
     
    if(Culture=="English")
    {
        if(ddlNumbers!=null && ddlNumbers.selectedIndex==0)
        {
             alert("Please select a number");
             ddlNumbers.focus();
             return false;
        }
        if(ddlMBBPlan!=null && ddlMBBPlan.selectedIndex==0)
        {
             alert("Please select a Taif Plan");
             ddlMBBPlan.focus();
             return false;
        }
//        if(ddlBBPlan!=null && ddlBBPlan.selectedIndex==0)
//        {
//             alert("Please select a Taif Plan");
//             ddlBBPlan.focus();
//             return false;
//        }        
    
        if(txtNewLimit!=null)
        {
          if(txtNewLimit.value=="")
            {
                 alert("Please enter credit limit");
                 txtNewLimit.focus();
                 return false;
            }
            else if(ValidateTopUpAmount(txtNewLimit.value)!=true)
            {
                 alert("Amount should be numeric and should not have decimal values");
                 txtNewLimit.focus();
                 return false;
            }
            else if(txtNewLimit.value < 20 || txtNewLimit.value > 250)
            {
                alert("Minimum credit limit is 20 RO and maximum credit limit is 250 RO");
                txtNewLimit.focus();
                return false;
            }
        }
    }
    else if(Culture=="Arabic")
    {
    
        if(ddlNumbers!=null && ddlNumbers.selectedIndex==0)
        {
             alert("الرجاء اختيار رقم");
             ddlNumbers.focus();
             return false;
        }
        if(ddlMBBPlan!=null && ddlMBBPlan.selectedIndex==0)
        {
             alert("الرجاء اختيار باقة طيف");
             ddlMBBPlan.focus();
             return false;
        }
//        if(ddlBBPlan!=null && ddlBBPlan.selectedIndex==0)
//        {
//             alert("Please select a Taif Plan");
//             ddlBBPlan.focus();
//             return false;
//        }
        if(txtNewLimit!=null)
        {
           if(txtNewLimit.value=="")
            {
                 alert("الرجاء إدخال حد الإئتمان");
                 txtNewLimit.focus();
                 return false;
            }
            else if(ValidateTopUpAmount(txtNewLimit.value)!=true)
            {
                 alert("يجب أن يكون المبلغ بالأرقام وألا يحتوي على قيم عشرية");
                 txtNewLimit.focus();
                 return false;
            }
            else if(txtNewLimit.value < 20 || txtNewLimit.value > 250)
            {
                alert("حد الإئتمان الأدنى هو 20 (ر.ع) وحد الإئتمان الأقصى هو 250 (ر.ع)");
                txtNewLimit.focus();
                return false;
            } 
        }  
    }
    return true;   
}




function ReplaceAll(Source,stringToFind,stringToReplace){
  var temp = Source;
    var index = temp.indexOf(stringToFind);
        while(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
}



function SinglePayment_AutoCalculateAmount(ClientID,Culture)
{      
    var TotalAmount=document.getElementById(ClientID+"_TotalAmount");        
    var gvAccountDetails=document.getElementById(ClientID+"_gvAccountDetails");
    var amount="0.0";
    var rCount = gvAccountDetails.rows.length;
    
    for(var rowIdx = 0 ; rowIdx< rCount ; rowIdx++ )
    {
       if(rowIdx!=0)
       {
           var rowElement = gvAccountDetails.rows[rowIdx];
           var chkBox = rowElement.cells[3].firstChild;         
           var label = rowElement.cells[2].innerHTML;           
           if(chkBox!=null && chkBox.checked)
           {               
                label=ReplaceAll(label,",","");
                var num = parseFloat(label, 10);                                 
                amount=parseFloat(amount)+parseFloat(num);
                                        
           }
       }          
    }
    if(amount!="0.0")
     amount=amount.toFixed(2);  
    if(TotalAmount!=null)
    {      
        if(Culture =="English")
            TotalAmount.innerHTML= "Total Amount : " + amount + " R.O";
        else 
            TotalAmount.innerHTML= "المبلغ الإجمالي : " + amount + " R.O";
    }
    return true;
}




//corporate provision


function CorpProvservicedetailsonclick_ddl(ClientID,Culture)
{
  
   var Account = document.getElementById(ClientID+"_DlSelectAccount"); 
   var fixedline = document.getElementById(ClientID+"_DdlFixedLineNums"); 
   
//   var Upgrade = document.getElementById(ClientID+"_rdbUpgrade_0");
//   var Downgrade = document.getElementById(ClientID+"_rdbUpgrade_1");  
       
   var ddlconn=document.getElementById(ClientID+"_ddlconntype");    
    
   var trAccount = document.getElementById("trExistingPSTNNum");  
   var trFixedLine = document.getElementById("trExistingPSTNNum2"); 
   var trUpgrade = document.getElementById("trExistingPSTNNum3");   
   
  
    
    if( (ddlconn.selectedIndex==1)||(ddlconn.selectedIndex==3))//Existing & upgrade
    {
         trAccount.style.visibility="visible";
         trFixedLine.style.visibility="visible";
         trUpgrade.style.visibility="hidden";
            
         if(ddlconn.selectedIndex==3)
         {
         
            trUpgrade.style.visibility="visible";
         
         }
    
    } 
    else if( ddlconn.selectedIndex==2)
    {
         trAccount.style.visibility="hidden";
         trFixedLine.style.visibility="hidden";
         trUpgrade.style.visibility="hidden";
    
    }
    

}

function Corp_ValidatePlanOnload(ClientID)
{   

   //alert('hello');
   //var Account = document.getElementById(ClientID+"_DlSelectAccount"); 
   //var fixedline = document.getElementById(ClientID+"_DdlFixedLineNums"); 
   
//   var Upgrade = document.getElementById(ClientID+"_rdbUpgrade_0");
//   var Downgrade = document.getElementById(ClientID+"_rdbUpgrade_1");  
       
   var ddlconn=document.getElementById(ClientID+"_ddlconntype");    
    
   var trAccount = document.getElementById("trExistingPSTNNum");  
   var trFixedLine = document.getElementById("trExistingPSTNNum2"); 
   var trUpgrade = document.getElementById("trExistingPSTNNum3");   
   
   
   //alert(ddlconn.selectedIndex);

    if((ddlconn.selectedIndex==1) || (ddlconn.selectedIndex==3))
    { 
     
         trAccount.style.visibility="visible";
         trFixedLine.style.visibility="visible";
         trUpgrade.style.visibility="hidden";
         
         if(ddlconn.selectedIndex==3)
         {
         
            trUpgrade.style.visibility="visible";
         
         }
     } 
     else 
     {
         trAccount.style.visibility="hidden";
         trFixedLine.style.visibility="hidden";
         trUpgrade.style.visibility="hidden";
     }
     
}


function CorpProv_ValidatePreRequisitesNext(ClientID,Culture)
{  

   var ddlconn=document.getElementById(ClientID+"_ddlconntype");  
      
   //var fixedline = document.getElementById(ClientID+"_txtExistingPSTNNum");  
   
   var Account = document.getElementById(ClientID+"_DlSelectAccount"); 
   var fixedline = document.getElementById(ClientID+"_DdlFixedLineNums"); 
   
   //var Upgrade = document.getElementById(ClientID+"_rdbUpgrade_0");
   //var Downgrade = document.getElementById(ClientID+"_rdbUpgrade_1");  
  
  
   var ExpNumeric =/^[0-9]+$/   
     
    if(Culture =="English")
    {
    
    //dec2013
       if(ddlconn!=null && ddlconn.selectedIndex==0)
        {
         alert('Please select a connection type');
         ddlconn.focus();
         //ddlconn.style.background="#FAA28E"; 
         return false;
        
        }
        //
        
         

    
        if((ddlconn.selectedIndex==1)||(ddlconn.selectedIndex==3))
        {     
            if(Account!=null && Account.selectedIndex==0)
            {
                alert('Please select an account');
                Account.focus();
                //Account.style.background="#FAA28E"; 
                return false;
        
            }
            
            if(fixedline!=null && fixedline.selectedIndex==0)
            {
                alert('Please select a Fixedline number');
                fixedline.focus();
                //Account.style.background="#FAA28E"; 
                return false;
        
            }
        //
        }       


        if(ddlconn.selectedIndex==3)
        {
        
           var isItemChecked = false;
           
             for (var i=0; i<2; i++)
             {     
                 var listItem = document.getElementById(ClientID+"_rdbUpgrade_" + i);         
                 if (listItem.checked )
                 {                        
                    isItemChecked = true;
                }
             }      
             if(isItemChecked==false)
             {
                alert("Please Upgrade/Downgrade option"); 
                return false;
             }     
             
        
        }
                  
       
    
      
    }
    
      
    if(Culture =="Arabic")
    {

     if(ddlconn!=null && ddlconn.selectedIndex==0)
        {
        
                alert('الرجاء تحديد نوع الاتصال');                 
                ddlconn.focus();
                ddlconn.style.background="#FAA28E"; 
                return false;
                
        }
        
        
         if((ddlconn.selectedIndex==1)||(ddlconn.selectedIndex==3))
        {     
            if(Account!=null && Account.selectedIndex==0)
            {
                alert("الرجاء اختيار الحساب");
                Account.focus();
                //Account.style.background="#FAA28E"; 
                return false;
        
            }
            
            if(fixedline!=null && fixedline.selectedIndex==0)
            {
                alert('لرجاء اختيار رقم الخط الثابت  ');
                fixedline.focus();
                //Account.style.background="#FAA28E"; 
                return false;
        
            }
        //
        }       


        if(ddlconn.selectedIndex==3)
        {
        
           var isItemChecked = false;
           
             for (var i=0; i<2; i++)
             {     
                 var listItem = document.getElementById(ClientID+"_rdbUpgrade_" + i);         
                 if (listItem.checked )
                 {                        
                    isItemChecked = true;
                }
             }      
             if(isItemChecked==false)
             {
                alert("يرجى اختيار الترقية / التخفيض  "); 
                return false;
             }     
             
        
        }
    
       
    }    
    
   return true;
}

function Corp_ValidatePlanNext(ClientID,Culture)
{
   //step 1
//    var isAnyChecked=false;   
//    for (i = 0; i < rbtnSelect.length; i++) 
//    {
//         var rb_Visitor = document.getElementById(rbtnSelect[i]);
//         if(rb_Visitor.checked)
//         {
//            isAnyChecked=true;
//         }            
//     }
//   if(!isAnyChecked)
//   {
//     alert('Please select a ADSL plan');
//     return false;
//   }  

 if(Culture =="English")
    {
    
    var ddlpkgType=document.getElementById(ClientID+"_ddlPkgCategory");
    if(ddlpkgType!=null && ddlpkgType.selectedIndex==0)
    {
         alert('Please select a plan type');
         ddlpkgType.focus();
         ddlpkgType.style.background="#FAA28E"; 
        return false;
    }  
    
    var ddlADSLBW=document.getElementById(ClientID+"_ddlADSLBW");
    if(ddlADSLBW!=null && ddlADSLBW.selectedIndex==0)
    {
         alert('Please select a Business Broadband Plan');
         ddlADSLBW.focus();
        ddlADSLBW.style.background="#FAA28E"; 
        return false;
    }               
    
   var FixedPlan = document.getElementById(ClientID+"_rbtnPSTNRateplan_0");          
   var UnlimitedPlan = document.getElementById(ClientID+"_rbtnPSTNRateplan_1"); 
   var isAnyChecked=false;
    if(FixedPlan!=null && FixedPlan.checked)
    {
        isAnyChecked=true;
    }
    if(UnlimitedPlan!=null && UnlimitedPlan.checked)
    {
        isAnyChecked=true;
    }
    if((FixedPlan!=null) && (UnlimitedPlan!=null) && (!isAnyChecked))
    {
        alert('Please select a Fixedline plan'); 
        FixedPlan.focus()       
        return false;
    }
    
    //2015
    if(document.getElementById(ClientID+"_ddlSubPackage")!=null)
    {
      var ddlsubpkg = document.getElementById(ClientID+"_ddlSubPackage"); 
      if(ddlsubpkg!=null && ddlsubpkg.selectedIndex==0)
      {
      
      alert('Please select usage limit');
      ddlsubpkg.focus();
      ddlsubpkg.style.background="#FAA28E"; 
      return false;
      }
    }
    
      //alert('h');
      //alert(document.getElementById(ClientID+"_txtADSLUsername"));
      
      if(document.getElementById(ClientID+"_txtADSLUsername")!=null)
      {
       
    
        var Username1 = document.getElementById(ClientID+"_txtADSLUsername").value;
        if(Username1=="")
        {
         alert('Please enter ADSL login Name option 1');
         document.getElementById(ClientID+"_txtADSLUsername").focus();
         document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
         return false;
        }


        if(Username1!="")
        {
        if(!ValidateADSLUsername(ClientID+"_txtADSLUsername",Culture))
        {
             document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
             return false;
        }      
        }    
        var Username2 = document.getElementById(ClientID+"_txtADSLUsername2").value;
        if(Username2=="")
        {
         alert('Please enter ADSL login Name option 2');
         document.getElementById(ClientID+"_txtADSLUsername2").focus();
         document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
         return false;
        }

        if(Username2!="")
        {
        if(!ValidateADSLUsername(ClientID+"_txtADSLUsername2",Culture))
        {
             document.getElementById(ClientID+"_txtADSLUsername2").focus();
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             return false;
        }       
        }    
        var Username3 = document.getElementById(ClientID+"_txtADSLUsername3").value;
        if(Username3=="")
        {
         alert('Please enter ADSL login Name option 3');
         document.getElementById(ClientID+"_txtADSLUsername3").focus();
         document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
         return false;
        }
        if(Username3!="")
        {
          if(!ValidateADSLUsername(ClientID+"_txtADSLUsername3",Culture))
          {
             document.getElementById(ClientID+"_txtADSLUsername3").focus();
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
          }      
        }  //alert('1');alert(Username1);alert(Username2);alert(Username3);

        if(Username1==Username2)
        {
            alert('Please enter different ADSL login Names');
            document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             return false;
        }
        if(Username1==Username3)
        {
            alert('Please enter different ADSL login Names');
            document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
        }
        if(Username2==Username3)
        {
            alert('Please enter different ADSL login Names');
            document.getElementById(ClientID+"_txtADSLUsername2").focus();
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
        }
     
     
     }
        var ExpNumeric =/^[0-9]+$/
        var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;    
        var  TbEmail=document.getElementById(ClientID+"_txtEmailID");
        if(TbEmail!=null && TbEmail.value=="")
        {
            alert("Please enter E-mail ID");
            TbEmail.focus();
            return false;
        }
        if((TbEmail!=null) && (!TbEmail.value.match(ExpEmail)))
        {
            alert("E-mail is not in standard format (example: abc@xyz.com)");
             TbEmail.focus();
            return false;
        }
           
        var txtContactNumb = document.getElementById(ClientID+"_txtContactNumb");
        if(txtContactNumb!=null && txtContactNumb.value=="")
          {
             alert('Please enter your contact number');
             document.getElementById(ClientID+"_txtContactNumb").focus();
             document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
             return false;
          } 
          
          ///
          
  
        if(txtContactNumb.value.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
            return false;
        }
        if(txtContactNumb.value.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
            return false;
        }
          
          ///
          
          

        if(txtContactNumb!=null && (!txtContactNumb.value.match(ExpNumeric)))
        {
            alert("Contact number should be numeric");
            document.getElementById(ClientID+"_txtContactNumb").focus();
            document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
            return false;
        }
        
        
//         var isItemChecked2 = false;
//         for (var i=0; i<2; i++)
//         {
//             var listItem = document.getElementById(ClientID+"_rbGender_" + i);
//             if (listItem.checked )
//             {                   
//                isItemChecked2 = true;
//             }
//         }     
//         
//         if(isItemChecked2==false)
//         {
//            alert("Please select your Gender");    
//            document.getElementById(ClientID+"_rbGender_0").focus();
//            return false;
//         }  


               
        if(document.getElementById(ClientID+"_drpMonth")!=null 
        && document.getElementById(ClientID+"_drpMonth").selectedIndex==0)
        {
            alert("Please select CR number Expiry");                   
            document.getElementById(ClientID+"_drpMonth").focus();
            return false;
        } 
        if(document.getElementById(ClientID+"_drpDate")!=null 
        && document.getElementById(ClientID+"_drpDate").selectedIndex==0)
        {
              alert("Please select CR number Expiry");   
              document.getElementById(ClientID+"_drpDate").focus();
              return false;
        }         
        if(document.getElementById(ClientID+"_drpYearID")!=null 
        && document.getElementById(ClientID+"_drpYearID").selectedIndex==0)
        {
            alert("Please select CR number Expiry");           
            document.getElementById(ClientID+"_drpYearID").focus();       
            return false;
        }   
    
    ///Validate birthday
    
      var y = document.getElementById(ClientID+"_drpYearID");
      var m = document.getElementById(ClientID+"_drpMonth");
      var d = document.getElementById(ClientID+"_drpDate");
      
      var year=y.options[y.selectedIndex].value;
      var month=m.options[m.selectedIndex].value;
      var date=d.options[d.selectedIndex].value;
      
      //alert(year + month + date);
      if(month=="2")
      {      
        if(isleap(year)=='true')
        {
          if(date>29)
          {
            alert("Please select a valid date for this month");
            document.getElementById(ClientID+"_drpDate").focus();
            return false;
          }
        }
        else 
        {          
           if(date>28)
            {
                alert("Please select a valid date for this month");
                document.getElementById(ClientID+"_drpDate").focus();
                return false;
            }
        }        
      }
      //4,6,9,11
      if( (month==4) || (month==6) || (month==9) || (month==11))
      {
        if(date>30)
        {
             alert("Please select a valid date for this month");
             document.getElementById(ClientID+"_drpDate").focus();
             return false;
        }        
      }    
      
    }  
    
    //Arabic
    
    if(Culture =="Arabic")
    {
    
    var ddlpkgType=document.getElementById(ClientID+"_ddlPkgCategory");
    if(ddlpkgType!=null && ddlpkgType.selectedIndex==0)
    {
         alert('يرجى إختيارنوع الباقه');
         ddlpkgType.focus();
         ddlpkgType.style.background="#FAA28E"; 
        return false;
    }  
    
    var ddlADSLBW=document.getElementById(ClientID+"_ddlADSLBW");
    if(ddlADSLBW!=null && ddlADSLBW.selectedIndex==0)
    {
         alert('يرجى تحديد باقة ADSL');
         ddlADSLBW.focus();
        ddlADSLBW.style.background="#FAA28E"; 
        return false;
    }               
    
   var FixedPlan = document.getElementById(ClientID+"_rbtnPSTNRateplan_0");          
   var UnlimitedPlan = document.getElementById(ClientID+"_rbtnPSTNRateplan_1"); 
   var isAnyChecked=false;
    if(FixedPlan!=null && FixedPlan.checked)
    {
        isAnyChecked=true;
    }
    if(UnlimitedPlan!=null && UnlimitedPlan.checked)
    {
        isAnyChecked=true;
    }
    if((FixedPlan!=null) && (UnlimitedPlan!=null) && (!isAnyChecked))
    {
        alert('يرجى تحديد باقة الهاتف الثابت'); 
        FixedPlan.focus()       
        return false;
    }
    
     //2015
    if(document.getElementById(ClientID+"_ddlSubPackage")!=null)
    {
      var ddlsubpkg = document.getElementById(ClientID+"_ddlSubPackage"); 
      if(ddlsubpkg!=null && ddlsubpkg.selectedIndex==0)
      {
      
      alert('يرجى تحديد الإستخدام');
      ddlsubpkg.focus();
      ddlsubpkg.style.background="#FAA28E"; 
      return false;
      }
    }
    
   if(document.getElementById(ClientID+"_txtADSLUsername")!=null)
   {
    
      var Username1 = document.getElementById(ClientID+"_txtADSLUsername").value;
      if(Username1=="")
      {
         alert('يرجى إدخال اسم الدخول لـ ADSL خيار 1 ');
         document.getElementById(ClientID+"_txtADSLUsername").focus();
         document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
         return false;
       }


     if(Username1!="")
     {
        if(!ValidateADSLUsername(ClientID+"_txtADSLUsername",Culture))
        {
             document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E";       
             return false;
        }         
     }    
     var Username2 = document.getElementById(ClientID+"_txtADSLUsername2").value;
     if(Username2=="")
      {
         alert('يرجى إدخال اسم الدخول لـ ADSL خيار 2 ');
         document.getElementById(ClientID+"_txtADSLUsername2").focus();
         document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
         return false;
      }

     if(Username2!="")
     {
        if(!ValidateADSLUsername(ClientID+"_txtADSLUsername2",Culture))
        {
             document.getElementById(ClientID+"_txtADSLUsername2").focus();
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             return false;
        }       
     }    
     var Username3 = document.getElementById(ClientID+"_txtADSLUsername3").value;
     if(Username3=="")
      {
         alert('يرجى إدخال اسم الدخول لـ ADSL خيار 3 ');
         document.getElementById(ClientID+"_txtADSLUsername3").focus();
         document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
         return false;
      }
      if(Username3!="")
      {
          if(!ValidateADSLUsername(ClientID+"_txtADSLUsername3",Culture))
          {
             document.getElementById(ClientID+"_txtADSLUsername3").focus();
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
          }      
      }  //alert('1');alert(Username1);alert(Username2);alert(Username3);

      if(Username1==Username2)
      {
            alert('الرجاء إدخال أسماء دخول مختلفة لـ ADSL');
            document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             return false;
      }
      if(Username1==Username3)
      {
            alert('الرجاء إدخال أسماء دخول مختلفة لـ ADSL');
            document.getElementById(ClientID+"_txtADSLUsername").focus();
             document.getElementById(ClientID+"_txtADSLUsername").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
      }
        if(Username2==Username3)
       {
            alert('الرجاء إدخال أسماء دخول مختلفة لـ ADSL');
            document.getElementById(ClientID+"_txtADSLUsername2").focus();
             document.getElementById(ClientID+"_txtADSLUsername2").style.background="#FAA28E"; 
             document.getElementById(ClientID+"_txtADSLUsername3").style.background="#FAA28E"; 
             return false;
        }
     
     }
     
       var ExpNumeric =/^[0-9]+$/
        var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;    
       var  TbEmail=document.getElementById(ClientID+"_txtEmailID");
        if(TbEmail!=null && TbEmail.value=="")
        {
            alert("الرجاء إدخال عنوان البريد الإلكتروني");
            TbEmail.focus();
            return false;
        }
        if((TbEmail!=null) && (!TbEmail.value.match(ExpEmail)))
        {
            alert("البريد الإلكتروني ليس في الشكل المعياري (مثال: abc@xyz.com)");
             TbEmail.focus();
            return false;
        }
           
        var txtContactNumb = document.getElementById(ClientID+"_txtContactNumb");
        if(txtContactNumb!=null && txtContactNumb.value=="")
          {
             alert('الرجاء إدخال رقم الاتصال');
             document.getElementById(ClientID+"_txtContactNumb").focus();
             document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
             return false;
          } 
          
          ///
          
        
        if(txtContactNumb.value.charAt(0)!='9')
        {
            alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
            return false;
        }
        if(txtContactNumb.value.length != 8)
        {
            alert("يجب ان يكون الرقم مكون من 8 أرقام");
            return false;
        }
          
          
          ///

        if(txtContactNumb!=null && (!txtContactNumb.value.match(ExpNumeric)))
        {
            alert("يجب أن يكون رقم الاتصال بالأعداد");
            document.getElementById(ClientID+"_txtContactNumb").focus();
            document.getElementById(ClientID+"_txtContactNumb").style.background="#FAA28E"; 
            return false;
        }
//         var isItemChecked2 = false;
//         for (var i=0; i<2; i++)
//         {
//             var listItem = document.getElementById(ClientID+"_rbGender_" + i);
//             if (listItem.checked )
//             {                   
//                isItemChecked2 = true;
//             }
//         }     
//         
//         if(isItemChecked2==false)
//         {
//            alert("الرجاء إختيار الجنس");    
//            document.getElementById(ClientID+"_rbGender_0").focus();
//            return false;
//         }  
               
        if(document.getElementById(ClientID+"_drpMonth")!=null 
        && document.getElementById(ClientID+"_drpMonth").selectedIndex==0)
        {
            alert("إنتهاء السجل التجاري");                   
            document.getElementById(ClientID+"_drpMonth").focus();
            return false;
        } 
        if(document.getElementById(ClientID+"_drpDate")!=null 
        && document.getElementById(ClientID+"_drpDate").selectedIndex==0)
        {
              alert("إنتهاء السجل التجاري");   
              document.getElementById(ClientID+"_drpDate").focus();
              return false;
        }         
        if(document.getElementById(ClientID+"_drpYearID")!=null 
        && document.getElementById(ClientID+"_drpYearID").selectedIndex==0)
        {
            alert("إنتهاء السجل التجاري");           
            document.getElementById(ClientID+"_drpYearID").focus();       
            return false;
        }   
    
    ///Validate birthday
    
      var y = document.getElementById(ClientID+"_drpYearID");
      var m = document.getElementById(ClientID+"_drpMonth");
      var d = document.getElementById(ClientID+"_drpDate");
      
      var year=y.options[y.selectedIndex].value;
      var month=m.options[m.selectedIndex].value;
      var date=d.options[d.selectedIndex].value;
      
      //alert(year + month + date);
      if(month=="2")
      {      
        if(isleap(year)=='true')
        {
          if(date>29)
          {
            alert("التاريخ غير صالح لهذا الشهر");
            document.getElementById(ClientID+"_drpDate").focus();
            return false;
          }
        }
        else 
        {          
           if(date>28)
            {
                alert("التاريخ غير صالح لهذا الشهر");
                document.getElementById(ClientID+"_drpDate").focus();
                return false;
            }
        }        
      }
      //4,6,9,11
      if( (month==4) || (month==6) || (month==9) || (month==11))
      {
        if(date>30)
        {
             alert("التاريخ غير صالح لهذا الشهر");
             document.getElementById(ClientID+"_drpDate").focus();
             return false;
        }        
      }    
      
    }  
    
    //
    
    
    
    
    return true;
}





//End corporate


//Search Validation

function VAS_SearchValidate(ClientId,Culture)
{ 
  var txtSearch= document.getElementById(ClientId+"_txtGSMSearch");
   var ExpNumeric =/^[0-9]+$/;
  if(Culture=="English")
    {
     
      //MNo = document.getElementById(ClientId+"_TbMobileNumber");
        if(txtSearch.value=="")
        {
            alert("Enter GSM Number");
            return false;
        }

        if(!txtSearch.value.match(ExpNumeric))
        {
                alert("GSM number should be numeric");
                return false;
        }

        if(txtSearch.value.length!=8)
         {
                alert("The length of GSM number should be 8 digits");
                return false;
                               
         }
         
         if(txtSearch.value.charAt(0)!='9')
         {
                 alert("GSM Number should start with \'9\'");
                 return false;
         }
        

       
//        if(txtSearch.value.charAt(0)!='9' && txtSearch.value.charAt(0)!='7')
//         {
//                 alert("GSM Number should start with \'9\' or \'7\'");
//                 return false;
//         }
                
    
    }
    else
    {
        if(txtSearch.value=="")
        {
            alert("الرجاء إدخال رقم الهاتف النقال");   
            return false;
        }

        if(!txtSearch.value.match(ExpNumeric))
        {
                alert("رقم الهاتف النقال يجب ان يكون رقمياً");
                return false;
        }

        if(txtSearch.value.length!=8)
         {
                alert("يجب ان يكون الرقم مكون من 8 أرقام");
                return false;
                               
         }
         
         if(txtSearch.value.charAt(0)!='9')
         {
                 alert(" يَجِبُ أَنْ يَبْدأَ  رقم الهاتف النقال بـرقم  9 ");
                 return false;
         }
    
    }
    
}




//------------------------------------------Super User Changes Starting--------------------------------







function ValidateChildUserRegistration(ClientId,Culture)
{
    var DropDownId=document.getElementById(ClientId+"_ddlClientName");
    UserName=document.getElementById(ClientId+"_TxtUserName");
    CompanyName=document.getElementById(ClientId+"_txtCompanyName");
    
    var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;
    var ExpAlpha=/^[a-zA-Z]+$/
 
    var ExpNumeric =/^[0-9]+$/
    var SxpSpecialChar=/^[a-zA-Z0-9!@#$%^&*(),=/";:"]+$/
    var SpecialChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";
    var SpecialCharsComplete="!@#$%^&*()+=-[]\\\'._;,/{}|\":<>?"

    if(Culture=="English")
    {
    
          if(DropDownId.selectedIndex==0)
        {
            alert("Please select an Enterprise");       
            DropDownId.focus();         
            return false;
        }
                
      
         if(CompanyName.value=="")
        {
            alert("Please enter Company name");
            CompanyName.focus();
            return false;
        }
            
              if(UserName.value=="")
        {
            alert("Please enter user name");
                 UserName.focus();
            return false;
        }
            
        if(UserName.value.length<8 || UserName.value.length>16)
        {
            alert("The length of user name should be between 8 to 16 characters");
                UserName.focus();
            return false;
        }
               
        if(UserName.value.match(ExpNumeric))
        {
            alert("User name cannot be numeric");
                UserName.focus();
            return false;
        }
        var count=0;
        var i=0;
        var index=-1;
                
        while(i<UserName.value.length)
        {
            index=SpecialChars.indexOf(UserName.value.charAt(i))
            if(index!=-1)
            {
                alert("User name cannot have special characters other than . and _");
                    UserName.focus();
                return false;
            }
            i++;
        }
        
        TxtGSMNo=document.getElementById(ClientId+"_TxtGSMNo");
        if(TxtGSMNo.value=="")
        {
            alert("Please enter GSM number");
                TxtGSMNo.focus();
            return false;
        }
        if(!TxtGSMNo.value.match(ExpNumeric))
        {
            alert("GSM number should be numeric");
                TxtGSMNo.focus();
            return false;
        }
        if(TxtGSMNo.value.charAt(0)!='9')
        {
            alert("GSM Number should start with \'9\'");
                 TxtGSMNo.focus();
            return false;
        }
                
        if(TxtGSMNo.value.length != 8)
        {
            alert("The length of GSM number should be 8 digits");
                 TxtGSMNo.focus();
            return false;
        }
                
  
        
        if(document.getElementById(ClientId+"_DlSecurityID").selectedIndex==0)
        {
            alert("Select an ID Type");
                 document.getElementById(ClientId+"_DlSecurityID").focus();
            return false;
        }
                
        TxtId=document.getElementById(ClientId+"_TxtId");
        if(TxtId.value=="")
        {
            alert("Please enter the ID");
                document.getElementById(ClientId+"_TxtId").focus();
            return false;
        }
        TxtEmailId=document.getElementById(ClientId+"_TxtEmailId");
        if(TxtEmailId.value=="")
        {
            alert("Please enter E-mail ID");
                     TxtEmailId.focus();
            return false;
        }
                
        if(!TxtEmailId.value.match(ExpEmail))
        {
            alert("E-mail is not in standard format (example: abc@xyz.com)");
              TxtEmailId.focus();
            return false;
        }
        TxtConfirmEmailId=document.getElementById(ClientId+"_TxtConfirmEmailId");
        if(TxtConfirmEmailId.value=="")
        {
            alert("Please confirm the E-mail ID");
            TxtConfirmEmailId.focus();
            return false;
        }
        if(TxtConfirmEmailId.value!=TxtEmailId.value)
        {
            alert("E-mail IDs do not match");
            TxtConfirmEmailId.focus();
            return false;
        }        
     }  
     
     return true;    
}


function SU_ManageUsers_Submit(ClientId,Culture)
{
    var ddlUsers= document.getElementById(ClientId+"_ddlUsers"); 
    var txtGSMNumber= document.getElementById(ClientId+"_txtGSMNumber"); 
    var txtEmailID= document.getElementById(ClientId+"_txtEmailID"); 
     var rbtnUpdate= document.getElementById(ClientId+"_rbtnUpdate");
      var rbtnReset= document.getElementById(ClientId+"_rbtnReset");
     var ExpEmail =/^[a-zA-Z0-9._-]+[@][a-zA-Z0-9-]+([.][a-zA-Z]+)+$/;
   
    if(Culture=="English")
    {    
      if(ddlUsers.selectedIndex==0)
        {
            alert("Please select a User");       
            ddlUsers.focus();         
            return false;
        }
        if(rbtnUpdate.checked)
        {
            if(txtGSMNumber.value=="")
            {
                alert("Please enter a GSM Number");       
                txtGSMNumber.focus();         
                return false;
            }      
             if(txtEmailID.value=="")
            {
                alert("Please enter an E-mail ID");       
                txtEmailID.focus();         
                return false;
            } 
             
            if(!txtEmailID.value.match(ExpEmail))
            {
                alert("E-mail is not in standard format (example: abc@xyz.com)");
                  txtEmailID.focus();
                return false;
            }  
        } 
        else if(rbtnReset.checked)
        {
        
        }
        else        
        {
              alert("Please select an action");
               rbtnUpdate.focus();
               return false;
        }             
     } 
     else      
    {    
      if(ddlUsers.selectedIndex==0)
        {
            alert("Please select a User");       
            ddlUsers.focus();         
            return false;
        }
        if(rbtnUpdate.checked)
        {
            if(txtGSMNumber.value=="")
            {
                alert("الرجاء إدخال رقم الهاتف النقال");
                txtGSMNumber.focus();         
                return false;
            }      
             if(txtEmailID.value=="")
            {
                alert("الرجاء إدخال البريد الإلكتروني");
                txtEmailID.focus();         
                return false;
            } 
             
            if(!txtEmailID.value.match(ExpEmail))
            {
                 alert("البريد الإلكتروني غير صحيح (مثال : abc@xyz.com )");
                  txtEmailID.focus();
                return false;
            }  
        } 
        else if(rbtnReset.checked)
        {
        
        }
        else        
        {
              alert("يرجى إكمال جميع البيانات.");
               rbtnUpdate.focus();
               return false;
        }             
     }        
     
     return true;     
}



function SU_ManageUsers_Map(ClientId,Culture)
{
    var ddlUsers= document.getElementById(ClientId+"_ddlUsers"); 
    var ddlAccountsNumbers= document.getElementById(ClientId+"_ddlAccountsNumbers");      
    if(Culture=="English")
    {    
      if(ddlUsers.selectedIndex==0)
        {
            alert("Please select a User");       
            ddlUsers.focus();         
            return false;
        }
         if(ddlAccountsNumbers.selectedIndex==0)
        {
            alert("Please select an Account Number");       
            ddlAccountsNumbers.focus();         
            return false;
        }        
     }     
     
     return true;     
}



function ValidateMappingOfUsers(ClientId,Culture)
{
    var ddlSuperUserNames= document.getElementById(ClientId+"_ddlSuperUserNames"); 
    var ddlChildUserNames= document.getElementById(ClientId+"_ddlChildUserNames");      
    if(Culture=="English")
    {    
      if(ddlSuperUserNames.selectedIndex==0)
        {
            alert("Please select a Super user");       
            ddlSuperUserNames.focus();         
            return false;
        }
         if(ddlChildUserNames.selectedIndex==0)
        {
            alert("Please select a Child user");       
            ddlChildUserNames.focus();         
            return false;
        }        
     }     
     
     return true;     
}


//------------------------------------------Super User Changes ending--------------------------------






