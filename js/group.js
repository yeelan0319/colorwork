
/*from group*
 * Function : print_r()
 * Arguments: The data - array,hash(associative array),object
 *    The level - OPTIONAL
 * Returns  : The textual representation of the array.
 * This function was inspired by the print_r function of PHP.
 * This will accept some data as the argument and return a
 * text that will be a more readable version of the
 * array/hash/object that is given.
 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
 */
function print_r(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += print_r(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

var groupScroll;
/*
 * dynamically load list
 */
function group_loaded() {
	groupScroll = new iScroll('group-wrapper', { hScroll: false, checkDOMChanges: true, vScrollbar: false});
	$.getJSON(WEB_URL+"/mobile/group_get_groups.php?callback=?&token="+window.localStorage.getItem('token'),
			  function(json) {
				  var temp=eval(json);
//				  print_r(json);
			  $.each( json, function(index, content){  

				  document.getElementById('group-list').innerHTML+="<li id='group-li-"+content['GroupID']+"' class='group-panel'>"
				  +'<div onclick="slideTo_msg('+content['GroupID']+')">'+content['GroupName']+'</div></li>';
				  
				  window.localStorage.setItem("GroupName"+content['GroupID'], content['GroupName']);
				}); 
						  
				  
			  });	
	
}

function open(gid){
	location.href="./group_message.html?gid="+gid;
}