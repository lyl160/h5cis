var _v = window.sessionStorage.getItem('version') || (new Date().getTime());
document.write(
	'<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">'+
	'<meta name="apple-mobile-web-app-capable" content="yes">'+
	'<meta name="apple-mobile-web-app-status-bar-style" content="black">'+
	'<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />'+
	'<meta name="format-detection"  content="telephone=no">'+
	'<meta  http-equiv="x-rim-auto-match" content="none">'+
	'<meta http-equiv="Pragma" content="no-cache" />'+
	'<meta http-equiv="Expires" content="0" />'+
	'<link rel="stylesheet" href="css/mui.min.css">'+
	'<link rel="stylesheet" href="css/icons-extra.css">'+
	'<link rel="stylesheet" href="css/main.css?_v='+_v+'">'
);
document.getElementsByTagName("html")[0].style.fontSize=document.documentElement.clientWidth/20+'px';