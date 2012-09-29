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

function dump_pic(data) {
    var viewport = document.getElementById('viewport');
    viewport.style.display = "";
    viewport.style.position = "absolute";
    viewport.style.top = "10px";
    viewport.style.left = "10px";
    document.getElementById("test_img").src = "data:image/jpeg;base64," + data;
    alert(data);
}

function fail(msg) {
    alert(msg);
}

function show_pic() {
//    navigator.camera.getPicture(uploadPhoto, fail, {
//        quality : 50,
////		destinationType:Camera.DestinationType.DATA_URL
//		destinationType:Camera.DestinationType.FILE_URL,
//		sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
//    });
    
    navigator.camera.getPicture(uploadPhoto,
            function(message) { alert('get picture failed'); },
            { quality: 50, 
            destinationType: navigator.camera.DestinationType.FILE_URI}
            );
}

function show_pic2() {
  navigator.camera.getPicture(uploadPhoto,
          function(message) { alert('get picture failed'); },
          { quality: 50, 
          destinationType: navigator.camera.DestinationType.FILE_URI,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }
          );
}

function close() {
    var viewport = document.getElementById('viewport');
    viewport.style.position = "relative";
    viewport.style.display = "none";
}

function init() {
    // the next line makes it impossible to see Contacts on the HTC Evo since it
    // doesn't have a scroll button
    // document.addEventListener("touchmove", preventBehavior, false);
//    setTimeout(function() {
//            document.addEventListener("deviceready", deviceInfo, true);
//        }, 1000);
    
	document.getElementById("test_img").innerHTML =
		'<img style="width:120px;height:120px" src="'+window.localStorage.getItem("avatar") + '" />';   
}

function uploadPhoto(imageURI) {
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";

    var params = new Object();
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
    alert(imageURI);
    ft.upload(imageURI, "http://colorwork.cc/mobile/set_avatar.php?token="+window.localStorage.getItem("token"), win, fail, options);
}

function win(r) {
	alert("upload success. "+decodeURI(r.response));
	temp=decodeURI(r.response).split("\"");
	src="http://colorwork.cc/app/avatar_face/image/"+temp[1];
	window.localStorage.setItem("avatar",src);
	window.location.reload(true);
//    console.log("Code = " + r.responseCode);
//    console.log("Response = " + r.response);
//    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    alert("failed: Code = " + print_r(error));
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}
