/* $Id$ */


/**
 * Modify from controls when the "NULL" checkbox is selected
 *
 * @param   string   the MySQL field type
 * @param   string   the urlencoded field name
 * @param   string   the md5 hashed field name
 *
 * @return  boolean  always true
 */
function nullify(theType, urlField, md5Field, multi_edit)
{
    var rowForm = document.forms['insertForm'];

    if (typeof(rowForm.elements['funcs' + multi_edit + '[' + urlField + ']']) != 'undefined') {
        rowForm.elements['funcs' + multi_edit + '[' + urlField + ']'].selectedIndex = -1;
    }

    // "SET" field , "ENUM" field with more than 20 characters
    // or foreign key field
    if (theType == 1 || theType == 3 || theType == 4) {
        rowForm.elements['field_' + md5Field + multi_edit + '[]'].selectedIndex = -1;
    }
    // Other "ENUM" field
    else if (theType == 2) {
        var elts     = rowForm.elements['field_' + md5Field + multi_edit + '[]'];
        // when there is just one option in ENUM:
        if (elts.checked) {
            elts.checked = false;
        } else {
            var elts_cnt = elts.length;
            for (var i = 0; i < elts_cnt; i++ ) {
                elts[i].checked = false;
            } // end for

        } // end if
    }
    // Other field types
    else /*if (theType == 5)*/ {
        rowForm.elements['fields' + multi_edit + '[' + urlField + ']'].value = '';
    } // end if... else if... else

    return true;
} // end of the 'nullify()' function


/**
 * Unchecks the "NULL" control when a function has been selected or a value
 * entered
 *
 * @param   string   the urlencoded field name
 *
 * @return  boolean  always true
 */
function unNullify(urlField, multi_edit)
{
    var rowForm = document.forms['insertForm'];

    if (typeof(rowForm.elements['fields_null' + multi_edit + '[' + urlField + ']']) != 'undefined') {
        rowForm.elements['fields_null' + multi_edit + '[' + urlField + ']'].checked = false
    } // end if

    return true;
} // end of the 'unNullify()' function

/**
  * Allows moving around inputs/select by Ctrl+arrows
  *
  * @param   object   event data   
  */
function onKeyDownArrowsHandler(e) {
    e = e||window.event;
    var o = (e.srcElement||e.target);
    if (!o) return;
    if (o.tagName != "TEXTAREA" && o.tagName != "INPUT" && o.tagName != "SELECT") return;
    if (!e.ctrlKey) return;
    if (!o.id) return;

    var pos = o.id.split("_");
    if (pos[0] != "field" || typeof pos[2] == "undefined") return;

    var x = pos[2], y=pos[1];
    
    // skip non existent fields
    for (i=0; i<10; i++)
    {
        switch(e.keyCode) {
            case 38: y--; break; // up
            case 40: y++; break; // down
            case 37: x--; break; // left
            case 39: x++; break; // right
            default: return;
        }

        var id = "field_" + y + "_" + x;
        var nO = document.getElementById(id);
        if (!nO) {
            var id = "field_" + y + "_" + x + "_0";
            var nO = document.getElementById(id);
        }
        if (nO) break;
    }
    
    if (!nO) return;
    nO.focus();
    if (nO.tagName != 'SELECT') {
        nO.select();
    }
    e.returnValue = false;
}


var day;
var month;
var year;

/**
 * Opens calendar window.
 *
 * @param   string      calendar.php parameters
 * @param   string      form name
 * @param   string      field name
 * @param   string      edit type - date/timestamp
 */
function openCalendar(params, form, field, type) {
	window.open("./calendar.php?" + params, "calendar", "width=400,height=200,status=yes");
	dateField = eval("document." + form + "." + field);
    dateType = type;
}

/**
 * Initializes calendar window.
 */
function initCalendar() {
	if (!year && !month && !day) {
        /* Called for first time */
        if (window.opener.dateField.value) {
            value = window.opener.dateField.value;
            if (window.opener.dateType == 'date') {
                date = value.split("-");
                day = parseInt(date[2]);
                month = parseInt(date[1]) - 1;
                year = parseInt(date[0]);
            } else {
                year = parseInt(value.substr(0,4));
                month = parseInt(value.substr(4,2)) - 1;
                day = parseInt(value.substr(6,2));
            }
        }
        if (isNaN(year) || isNaN(month) || isNaN(day) || day == 0) {
            dt = new Date();
            year = dt.getFullYear();
            month = dt.getMonth();
            day = dt.getDate();
        }
	} else {
        /* Moving in calendar */
        if (month > 11) {month = 0; year++;}
        if (month < 0) {month = 11; year--;}
    }
	
	if (document.getElementById) {
		cnt = document.getElementById("calendar_data");
	} else if (document.all) {
		cnt = document.all["calendar_data"];
	}
	
	cnt.innerHTML = "";
	
	str = ""
	
	str += '<table class="calendar"><tr><th><a href="#" onclick="month--; initCalendar();">&laquo;</a> ' + month_names[month] + ' <a href="#" onclick="month++; initCalendar();">&raquo;</a></th><th><a href="#" onclick="year--; initCalendar();">&laquo;</a> ' + year + ' <a href="#" onclick="year++; initCalendar();">&raquo;</a></th></tr></table>';

	str += '<table class="calendar"><tr>';
	for (i = 0; i < 7; i++) {
		str += "<th>" + day_names[i] + "</th>";
	}
	str += "</tr>";
    
	var firstDay = new Date(year, month, 1).getDay();
	var lastDay = new Date(year, month + 1, 0).getDate();

	str += "<tr>";
	
	dayInWeek = 0;	
	for (i = 0; i < firstDay; i++) {
		str += "<td>&nbsp;</td>";
		dayInWeek++;
	}
	for (i = 1; i <= lastDay; i++) {
		if (dayInWeek == 7) {
			str += "</tr><tr>";
			dayInWeek = 0;
		}
        dispmonth = 1 + month;
        if (window.opener.dateType == 'date') {
		    actVal = year + "-" + dispmonth + "-" + i;
        } else {
		    actVal = "" + (year < 1000 ? year < 100 ? year < 10 ? '000' : '00' : '0' : '') + year + (dispmonth < 10 ? '0' : '') + dispmonth + (i < 10 ? '0' : '') + i;
        }
        if (i == day) {
            style = ' class="selected"';
        } else {
            style = '';
        }
		str += "<td" + style + "><a href='#' onclick='returnDate(\"" + actVal + "\");'>" + i + "</a></td>"
		dayInWeek++;
	}
	for (i = dayInWeek; i < 7; i++) {
		str += "<td>&nbsp;</td>";
	}
	
	str += "</tr></table>";

	cnt.innerHTML = str;
}

/**
 * Returns date from calendar.
 *
 * @param   string     date text
 */
function returnDate(d) {
	window.opener.dateField.value = d;
	window.close();
}
