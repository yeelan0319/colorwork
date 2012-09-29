/*
 * skyang: 2012.7.8
 * 
 */
//var WEB_URL="http://127.0.0.1:10081/colorx";
var WEB_URL="http://59.66.250.103:81/ColorX/";
var WEB_URL="http://colorwork.cc/";
var GID=0;
function getXmlHttpObject(){
	var xmlHttp=null;
	try{ // Firefox, Opera 8.0+, Safari
	xmlHttp=new XMLHttpRequest();
	}catch (e){// Internet Explorer
		try{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}catch (e){
			xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return xmlHttp;
}

function autofill(){
	document.getElementById('mobi-username').value=window.localStorage.getItem("username");
	document.getElementById('mobi-password').value=window.localStorage.getItem("password");
	document.getElementById('login-button').className="default";
	document.getElementById('loginLabel').innerHTML = '登录';
}

function login(){
	var username=document.getElementById('mobi-username').value;
	var password=document.getElementById('mobi-password').value;
	document.getElementById('login-button').className="loading";
	document.getElementById('loginLabel').innerHTML = '登录中..';
	
	$.getJSON(WEB_URL+"/mobile/login.php?callback=?",
	  {
	    "password": password,
	    "username": username,
	  },
	  function(json) {
		  var temp=eval(json);
//		  var test=$.parseJSON(json);
//		  $.each( json, function(index, content){  
//			  alert( "Item #" + index + " its value is: " + content );  
//			}); 
		  if(temp['status']=='1'){
			  window.localStorage.setItem("username", username);
			  window.localStorage.setItem("uid",temp['uid']);
			  window.localStorage.setItem("realname", temp['RealName']);
			  window.localStorage.setItem("token", temp['token']);
			  window.localStorage.setItem("password", password);
			  location.href="./group.html";
		  }
		  else{
			  alert('用户名或密码错误');
			  document.getElementById('login-button').className="default";
			  document.getElementById('loginLabel').innerHTML = '登录';
		  }
	  });
}

function getQueryString(name)
{
    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
    if(location.href.indexOf("?")==-1 || location.href.indexOf(name+'=')==-1)
    {
        return '';
    }
 
    // 获取链接中参数部分
    var queryString = location.href.substring(location.href.indexOf("?")+1);
 
    // 分离参数对 ?key=value&key2=value2
    var parameters = queryString.split("&");
 
    var pos, paraName, paraValue;
    for(var i=0; i<parameters.length; i++)
    {
        // 获取等号位置
        pos = parameters[i].indexOf('=');
        if(pos == -1) { continue; }
 
        // 获取name 和 value
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);
 
        // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
        if(paraName == name)
        {
            return unescape(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
}


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

/*mao version 2.0*/
function init(){
	var width = screen.width;
	var height = screen.height;
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	
	var str=".window-size { width: " + width + "px; height: " + height + "px;} .real-window-size { width: " + width*2 + "px; height: " + height + "px;} .max {height: " + (height-50) + "px;} #msg {width: " + (width-8) + "px;}"
	styleElement.appendChild(document.createTextNode(str));

	document.getElementsByTagName("head")[0].appendChild(styleElement);
	document.getElementById('personal-cloud-name').innerHTML=window.localStorage.getItem('realname');
	mainScroll.refresh();
	MsgScroll.refresh();
	
	
}

function open_new(){
	document.getElementById("msg-add-botton").style.backgroundPosition="0 -235px"
	document.getElementById("msg-add").className="max";
	document.getElementById("new-msg-textarea").focus();
	document.getElementById("new-msg-textarea").value='';
}

function close_new(){
	if(document.getElementById("msg-add").className!="min")
		document.getElementById("msg-add").className="min";
	document.getElementById("msg-add-botton").style.backgroundPosition="0 -210px";
	document.getElementById("new-msg-send").style.backgroundPosition ="0 0";
}

function hasContent(){
	var sendButton = document.getElementById("new-msg-send");
	var content = document.getElementById("new-msg-textarea").value;
	if(content.replace(/^\s+|\s+$/g,"")!='')
		sendButton.style.backgroundPosition ="0 -35px";
	else sendButton.style.backgroundPosition = "0 0";
}

 //回复框自动适应高度
(function($){
	$.fn['autoTextarea'] = function() {
		var defaults={
			minHeight:$(this).css('height')
		};
		var opts = $.extend({},defaults);
		return $(this).each(function() {
			$(this).bind("paste cut keydown keyup",function(){
				this.style.height =  opts.minHeight;
				this.style.height = this.scrollHeight + 'px';
				this.style.overflowY = 'hidden';	
			});
		});
	};
})(jq);

/*for slide*/
/*
 * TODO:1. 根据传入的gid动态获取后台message,并且替换掉my-msg里的内容
 */
function slideTo_msg(gid){
	document.getElementById("my-msg").className="hide";
	document.getElementById("msg-pullUp").className="pullUp hide";
	cover_group();
	mainScroll.scrollToPage(1, 0, 300);
	$.getJSON(WEB_URL+"/mobile/group_news.php?callback=?&token="+window.localStorage.getItem('token')+"&gid="+gid+"&page=1",
			  function(json) {
					temp=eval(json);
					document.getElementById("my-msg").innerHTML=tmpl("message_panel_tmpl",{"item":temp});
					setTimeout(function(){
						document.getElementById("my-msg").className="";
						document.getElementById("msg-pullUp").className="pullUp";
						MsgScroll.refresh();
						MsgScroll.scrollTo(0, -50, 0);
						$(".reply").autoTextarea();   //回复框自动适应高度，见app.js
					},300);
				});
	GID=gid;
	document.getElementById('group-header').innerHTML="<div>"+window.localStorage.getItem("GroupName"+gid)+"</div>";
}

//选择i_message中的内容
function slideTo_i_msg(){
	document.getElementById("my-msg").className="hide";
	document.getElementById("msg-pullUp").className="pullUp hide";
	cover_group();
	mainScroll.scrollToPage(1, 0, 300);
	$.getJSON(WEB_URL+"/mobile/i_get_messages.php?callback=?&token="+window.localStorage.getItem('token')+"&page=1",
			  function(json) {
					var temp=eval(json);
					document.getElementById("my-msg").innerHTML=tmpl("i_message_panel_tmpl",{"item":temp});
					setTimeout(function(){
						document.getElementById("my-msg").className="";
						document.getElementById("msg-pullUp").className="pullUp";
						MsgScroll.refresh();
						MsgScroll.scrollTo(0, -50, 0);
						$(".reply").autoTextarea();   //回复框自动适应高度，见app.js
					},300);
				});
	document.getElementById('group-header').innerHTML="<div>"+window.localStorage.getItem('realname')+"</div>";
}

//页面退回函数
function show_group(){
	document.getElementById('group').className="window-size float";
	document.getElementById("my-msg").innerHTML="";
	close_new();
	GID=0;
	PAGE=2;
}

function cover_group(){
	document.getElementById('group').className="window-size covered";
}


//xuyang
//发送消息到后台
function group_message_send(){
	var content=document.getElementById('new-msg-textarea').value;
	if(content.replace(/^\s+|\s+$/g,"")=='') return;
	var sendButton = document.getElementById("new-msg-send");
	sendButton.style.backgroundPosition ="0 -70px";
	$.getJSON(WEB_URL+"/mobile/group_set_message.php?callback=?&token="+window.localStorage.getItem('token')+
			"&gid="+GID+"&message="+content,
			  function(json) {
					var temp=eval(json);
					if(temp==0){
						close_new();
						slideTo_msg(GID);
					}
				});
}

//回复框输入状态，滚动条滑到正确位置
function avoidKeyboard(replyID, msgID){
	reply = document.getElementById(replyID);
	msg = document.getElementById(msgID);
	replyOffset = reply.offsetTop;
	msgOffset = msg.offsetParent.offsetTop;
	//alert(msgOffset+replyOffset);
	MsgScroll.scrollTo(0, -(msgOffset+replyOffset-150), 500);
}

//发送评论到后台
function comment_reply(id,mid){
	var content=document.getElementById(id).value;
	$.getJSON(WEB_URL+"/mobile/group_set_comment.php?callback=?&token="+window.localStorage.getItem('token')+
			"&mid="+mid+"&comment="+content,
			  function(json) {
					var temp=eval(json);
					if(temp==0){//评论回显
						document.getElementById('comments-echo-area-'+mid).innerHTML+=
						'<div class="message">'+
							'<span class="author"><strong>'+window.localStorage.getItem('realname')+': </strong></span>'+
							'<span>'+content+'</span>'+
							'<div class="date">刚刚更新</div>'+
						'</div>';
					}
					document.getElementById(id).value="";
					document.getElementById(id).style.height="24px";
					document.getElementById(id).blur();
				});		
	
}

