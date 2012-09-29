/*from msg*/


var MsgScroll,
	MsgPullDown, MsgPullDownOffset,
	MsgPullUp, MsgPullUpOffset,
	MsgAdd,
	generatedCount = 0;

//TODO:当页面滑动回来的时候，page要重新置为2
var PAGE=2;
/*
 * TODO:xuyang
 * pullDown禁止掉，pullUP动态更新页面
 * pullDown和pullUP是被页面共享的，所以我需要判断加载i_message还是加载group_news里面的内容
 */

function pullUpAction () {
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		var el, li, i;
		el = document.getElementById('msg-list');
		
		MsgScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!

	//一页最多70条信息
	if(PAGE%10>=7)document.getElementById("my-msg").innerHTML="";
	if(GID==0){//加载个人页面
		$.getJSON(WEB_URL+"/mobile/i_get_messages.php?callback=?&token="+window.localStorage.getItem('token')+"&page="+PAGE,
				  function(json) {
					  var temp=eval(json);
					  if(temp=="") return;
					  document.getElementById("my-msg").innerHTML+=tmpl("i_message_panel_tmpl",{"item":temp});
					  cover_group();
					  MsgScroll.refresh();
					  mainScroll.scrollToPage(1, 0, 500);
					  PAGE=PAGE+1;
				  });		
	}
	else{
		$.getJSON(WEB_URL+"/mobile/group_news.php?callback=?&token="+window.localStorage.getItem('token')+"&gid="+GID+"&page="+PAGE,
				  function(json) {
					  var temp=eval(json);
					  if(temp=="") return;
					  document.getElementById("my-msg").innerHTML+=tmpl("message_panel_tmpl",{"item":temp});
					  cover_group();
					  MsgScroll.refresh();
					  mainScroll.scrollToPage(1, 0, 500);
					  PAGE=PAGE+1;
				  });
	}
}

function msg_loaded() {
	MsgPullDown = document.getElementById('msg-pullDown');
	MsgPullDownOffset = MsgPullDown.offsetHeight-1;
	MsgPullUp = document.getElementById('msg-pullUp');	
	MsgPullUpOffset = MsgPullUp.offsetHeight-1;
	MsgAdd = document.getElementById('msg-add-botton');
	  	
	MsgScroll = new iScroll('msg-wrapper', {
		hScroll: false, 
		vScrollbar: false,
		useTransition: true,
		topOffset: MsgPullDownOffset,
		onRefresh: function () {
			if (MsgPullUp.className.match('loading')) {
				MsgPullUp.className = 'pullUp';
				MsgPullUp.querySelector('#msg-pullUpLabel').innerHTML = 'Pull up to load more...';
			}
		},
		onScrollMove: function () {
			if (this.y > 5) {
				this.minScrollY = -MsgPullDownOffset;
			} else if (this.y < (this.maxScrollY - 30) && !MsgPullUp.className.match('flip')) {
				MsgPullUp.className = 'pullUp flip';
				MsgPullUp.querySelector('#msg-pullUpLabel').innerHTML = 'Release to refresh...';
			} else if (this.y > (this.maxScrollY - 30) && MsgPullUp.className.match('flip')) {
				MsgPullUp.className = 'pullUp';
				MsgPullUp.querySelector('#msg-pullUpLabel').innerHTML = 'Pull up to load more...';
			}
			
			if(this.y < (this.maxScrollY + 40) && !MsgAdd.className.match('hide')){
				MsgAdd.className = 'new-msg hide';
			}
			else if(this.y > (this.maxScrollY + 40) && MsgAdd.className.match('hide')){
				MsgAdd.className = 'new-msg';
			}
		},
		onScrollEnd: function () {
			if (MsgPullUp.className.match('flip')) {
				MsgPullUp.className = 'pullUp loading';
				MsgPullUp.querySelector('#msg-pullUpLabel').innerHTML = 'Loading...';				
				pullUpAction();	// Execute custom function (ajax call?)
			}
		}
	});
	
	setTimeout(function () { document.getElementById('msg-wrapper').style.left = '0'; }, 800);
}