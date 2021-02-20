/*!
 * =====================================================
 * DOFUN v1.0.0 ()
 * LXU
 * =====================================================
 */

var _debug = true;
//var _host = 'http://www.whhlj.com:8081/scl_cis';
//var _host = 'http://xunjianserver.dofuntech.cn';
//var _host = 'http://xunchaapi.whhlj.com:26080';
//var _host = 'http://116.255.145.242:8801/scl_cis';  
// var _host = "http://172.30.1.78:8080/scl_cis";
var _host = "http://localhost:8080/scl_cis";
var _mocktoken = 'eyJhbGciOiJIUzI1NiJ9';

window.DOFUN = {
	url: _host + "/api/",
	img_server: _host + '/base/pic/view2.do?picid=',
	version: '1.0',
	appId:'wxfcefe69f12fd2d33', 
	state:'scl_cis', 
	checkCode:1, 
	debug:_debug,
	cache: {
		image: !1
	}, 
	pageCallbacks:[], 
	isPageReady:false, 
	data: {
		nav: [
		]
	},
	ctx:'/h5cis'
};

/******简单封装对象********/
(function($, dofun,doc) {
	$.extend(dofun, {
		error: function(msg) {
			$.alert(msg);
		},
		loginUrl: "/examples/denglu.html",
		accessUrl: "access.html",
		d: function(msg){
			if(console && console.log){
				console.log(msg);
			}
		},
		a: doc.createElement("a"),
		div: doc.createElement("div"),
		decodeRegexp: /\+/g,
		paramRegexp: /([^&=]+)=?([^&]*)/g,
		byId:function(id){
			return doc.getElementById(id); 
		},
		aniShow:(function(){ 
			return 'slide-in-right';
		})(),
		transferTime: (function() {
			return 300;
		})(),
		show:function(webview,callback){
			plus.webview.show(webview,this.aniShow,this.transferTime,callback);
		},
		getPageId:function(){
			var path = location.pathname.replace(dofun.ctx + '/','');
			return path;
		},
		guid:function() {
		  	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			    return v.toString(16);
		  	});
		},
		decode: function(a) {
			return decodeURIComponent(a.replace(this.decodeRegexp, " "))
		},
		parseParams: function(a) {
			var b = {};
			if (a = a && (0 === a.indexOf("?") ? a.replace("?", "") : a))
				for (var c; c = this.paramRegexp.exec(a);) b[this.decode(c[1])] = this.decode(c[2]);
			return b;
		},
		handleOpen: function(data, callback) {
			callback();
		},
		updateTitle:function(title){
			$('title')[0].innerHTML = title;
		},
		createLoading:(function() {
		    dofun.loading = doc.getElementById("DOFUN_LOADING");
		    if(!dofun.loading){
		    	dofun.loading = doc.createElement("div");
		    	dofun.loading.id = "DOFUN_LOADING";
		    	dofun.loading.className = "mui-backdrop";
		    	dofun.loading.innerHTML = '<span class="mui-spinner-dofun">正在加载</span>';
		    }
			return dofun.loading;
		})(),
		showWaiting: function(msg) {
			if($.os.plus){
				plus.nativeUI.showWaiting(msg||'正在加载',{loading:{display:'inline'},round:0,background:'rgba(0,0,0,0.3)'});
			}else{
				doc.body.appendChild(dofun.createLoading);
			}
		},
		closeWaiting: function(){
			if($.os.plus){
				plus.nativeUI.closeWaiting();
			}else{
				dofun.loading && dofun.loading.parentNode && dofun.loading.parentNode.removeChild(dofun.loading);
			}
		},
		alert: function(msg, title, callback) {
			if(!callback){
				callback = title;
				title='提示';
			}
			$.alert(msg, title || "提示", callback);
		},
		prompt: function(msg, title, callback) {
			$.prompt(msg, title, "提示", ["确定", "取消"], function(a) {
				0 === a.index ? callback && callback(a.value) : callback && callback(a.value);
			});
		},
		confirm: function(msg, title, callback) {
			$.isFunction(title) && (callback = title, title = "提示");
			$.confirm(msg, title, ["确认", "取消"], function(a) {
				callback(0 === a.index);
			});
		},
		toast: function(msg) {
			$.toast(msg)
		},
		goHome:function(){
			dofun.Init.goHome();
		},
		open: function(a, c) {
			dofun.Init.open(a, c)
		},
		openNview: function(a, c) {
			dofun.Init.open(a, c,undefined,true);
		},
		getToken:function(){
			return DOFUN.getItem('token');
		},
		setToken:function(token){
			DOFUN.setItem('token',token);
		},
		getRefUrl:function(){
			return DOFUN.getItem('ref_url');
		},
		setRefUrl:function(url){
			DOFUN.setItem('ref_url',url);
		},
		openLogin: function(url) {
			dofun.Init.open(dofun.loginUrl + "?from=" + encodeURIComponent(url || ""));
		},
		checkLogin:function(url,callback,reload){
			$.isFunction(url) && (reload = callback,callback = url);
			if(!dofun.User.isLogin()){
				new dofun.UserLoginModal(callback);
			}else{
				if(reload){
					DOFUN.User.reload(function(user){
						callback && callback(user);
					});
				}else{
					callback && callback(dofun.User.getUser());
				}
			}
		},
		tpl:function(tempId,data,emptytip){
			if(!window.template) return;
			var html = template(tempId, data);
			
			if(html == '{Template Error}'){
				html = '<div class="nodata"><span class="mui-icon mui-icon-extra mui-icon-extra-comment"></span><p class="mui-text-center">数据异常</p></div>';
			}else if(!html.trim().length){
				html = '<div class="nodata"><span class="mui-icon mui-icon-extra mui-icon-extra-comment"></span><p class="mui-text-center">'+(emptytip||'暂无数据')+'</p></div>';
			}
			return html;
		},
		initRefresh:function(selector,pulldownRefresh,pullupRefresh){//封装下拉刷新 上拉加载
			//var options = {'gestureConfig':{tap: true,doubletap: true},swipeBack:true };
			var options = {};
			options.pullRefresh = {
				container: selector,
				down: {
					style: 'circle',
					offset: '0px',
					auto: false,
					callback: function(){
						pulldownRefresh && pulldownRefresh();
						mui(selector).pullRefresh().endPulldownToRefresh(); //refresh completed
					}
				}
			};
			if(pullupRefresh){
				options.pullRefresh.up = {
					contentrefresh: '正在加载...',
					callback: function(){
						pullupRefresh && pullupRefresh();
						mui(selector).pullRefresh().endPullupToRefresh();
					}
				};
			}
			mui.init(options);
		},
		getPay:function(paytype,callback){
			mui.os.plus && plus.payment.getChannels(function(channels){
				for(var i in channels){
					var channel=channels[i];
					if(paytype == 1){
						if(channel.id == 'alipay'){
							callback(channel);
							break;
						}
					}else{
						if(channel.id == 'wxpay'){
							callback(channel);
							break;
						}
					}
				}
			},function(e){
				dofun.toast("获取支付通道失败："+e.message);
			});
		},
		htmlPosition:function(obj){
			var o = obj;
			var t = o.offsetTop;
			var l = o.offsetLeft;
			while(o = o.offsetParent)
			{
				t += o.offsetTop;
				l += o.offsetLeft;
			}
			obj.data_top = t;
			obj.data_left = l;
		},
		debounce:function(func, wait, immediate){
			var timeout;
			return function() {
				clearTimeout(timeout);
				timeout = setTimeout(func, wait);
			};
		},
		pageReady:function(callback){
			if(dofun.isPageReady){
				callback(window.page);
			}else{
				dofun.pageCallbacks.push(callback);
			}
		}, 
		getRad:function(d){
	        return d*Math.PI/180.0;
	    },
		getDistance:function(lat1,lng1,lat2,lng2){
			var radLat1 = DOFUN.getRad(lat1);
	        var radLat2 = DOFUN.getRad(lat2);
	        var a = radLat1 - radLat2;
	        var  b = DOFUN.getRad(lng1) - DOFUN.getRad(lng2);
	        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
	        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
	        s = s *6378.137 ;// EARTH_RADIUS;
	        s = Math.round(s * 10000) / 10000; //输出为公里
	        return s.toFixed(2);
	    },
	    isEventFilter:function(el){
	    	var tagname = el.tagName;
			var classlist = el.classList;
			if ("BUTTON" === tagname){
				return true;
			} 
			if("INPUT" === tagname){
				el.focus();
				return true;
			}
			if(classlist.contains('filter-event')){
				return true;
			}
			if(classlist.contains('mui-numbox')){
				return true;
			}
	    },
	    closeSplash:function(){
	    	if(mui.os.plus){
	    		plus.navigator.closeSplashscreen();
	    	}
	    },
	    updateCartNum:function(){
	    	if(mui.os.plus){
	    		var commodityWebview = plus.webview.getWebviewById('commodity.html');
	    		commodityWebview.evalJS('page.loadCartNum()');
	    	}
	    },
	    openCommodityDetail:function(item){
	    	var detailId = 'commodityDetail.html';
	    	if(!mui.os.plus){
	    		DOFUN.open(detailId,{commodityId:item.id})
	    	}else{
	    		var webview_detail = plus.webview.getWebviewById(detailId);
    			//触发子窗口变更新闻详情
				mui.fire(webview_detail, 'get_detail',item);
				//更改详情页原生导航条信息
				var titleNView = { //详情页原生导航配置
					backgroundColor: '#20C996', //导航栏背景色
					titleText: item.commodityName, //导航栏标题
					titleColor: '#fff', //文字颜色
					type: 'transparent', //透明渐变样式
					autoBackButton: true, //自动绘制返回箭头
					splitLine:null
				}
				webview_detail.setStyle({
					"titleNView": titleNView
				});
				setTimeout(function () {
					webview_detail.show("slide-in-right", 300);
				},150);
	    	}
	    },
	    quit: function(){
	    	var _toast = false;
			$.back = function() {
			    if(!_toast || !_toast.isVisible()) {
			        _toast = mui.toast('再按一次返回键退出', {
			            duration: 'long',
			            type: 'div'
			        });
			    } else {
			        plus.runtime.quit();
			    }
			}
	    }
	});	

	/*********开始初始化**************/
	dofun.Init = $.Class.extend({
		init: function(page,options) {
			this.initConfig();
			this.initEvent();
		 	this.initOs();
		 	var token = DOFUN.getToken();
		 	var pageId = DOFUN.getPageId();
	 		window.page = new dofun[page + "Page"](options);
	 		window.page._handleNEvent = this.initHandleNEvent;
	 		//回调
	 		dofun.isPageReady = true;
	 		var callbacks = dofun.pageCallbacks;
	 		var callback ;
	 		while((callback = callbacks.pop())){
	 			callback(window.page);
	 		}
		},
		initConfig: function(c) {
			dofun.Init = this;
			dofun.Api = new dofun.ApiClass;
			dofun.User = new dofun.UserClass;
			dofun.Global = new dofun.GlobalClass;
		},
		initHandleNEvent:function(e){
			var wid = e.wid;
			var wdata = e.wdata;
			var ws = plus.webview.getWebviewById(wid);
			if(wdata == -1){
				ws.evalJS('mui.back()');
			}else{
				ws.evalJS('page.handleNEvent('+wdata+')');
			}
		},
		initEvent: function() {
			var that = this;
			$(doc.body).on("tap", "a[data-href],a[data-nhref]", function(a) {
				if(dofun.debug){
					dofun.d("tap data href ===>" );
				}
				var target = a.target;
				var tagname = target.tagName;
				var classlist = target.classList;
				if ("BUTTON" === tagname){
					return false;
				} 
				if("INPUT" === tagname){
					target.focus();
					return false;
				}
				if(classlist.contains('filter-event')){
					return false;
				}
				if(classlist.contains('mui-numbox')){
					return false;
				}
				var _this = this;
				var href = _this.getAttribute("data-href");
				var isNview = false;
				if(!href){
					href = _this.getAttribute("data-nhref");
					isNview = true;
				}
				if(dofun.debug){
					dofun.d(href);
				}
				var	needLogin = _this.getAttribute("data-login");
				var tpl = _this.getAttribute('data-tpl');11
				if('true' == needLogin){
					dofun.checkLogin(href,function(){
						that.open(href,undefined,_this);
					});
				}else{
					if(tpl){
						if(href.length > 0){
							var title = this.getAttribute('data-title');
							dofun.openWithTmpl(href,title,tpl);
						}
					}else{
						that.open(href,undefined,_this,isNview);
					}
				}
			});
			//客服按钮监听
			$(doc.body).on('tap','.dial-service',function(){
				location.href = 'tel:4006010196';
			});
		},
		open: function(url, params,target,isNview) {//c d e f g=this
			var that = this;
			var id = url;
			var index = id.indexOf('?');
			var _f = false;
			if(index > -1){
				id = id.substr(0,index);
				_f = true;
			}
			var _v = DOFUN.getItem('version')||(new Date().getTime());
			var _lk = _f ? "&" : "?";
			url += params ?(_lk + $.param(params) + '&_v=' + _v) : (_lk +'_v='+_v);
			dofun.handleOpen({href: url,target:target}, function() {
				if(dofun.debug){
					dofun.d("open window url :" + url);
				}
//				var aniShow = dofun.aniShow();
//				var transtime = dofun.transferTime();
				if(!~url.indexOf('http://') && !~url.indexOf('https://')){
					url = ($.os.plus?'':(DOFUN.ctx + '/'))+url;
				}
				var options = {
					id:id,
					url: url,
					styles: {popGesture: "close",scrollIndicator:'none'},
					waiting: {
						autoShow: false
					}
				}
				if(isNview){
					var titleNView = {
						//titleText:"转入",
				      	titleColor:"#000",
				      	backgroundColor:"#fff",
				      	buttons:[]
					}
					if(target){
						var buttons = target.getAttribute('data-btns');
						if(buttons){
							buttons = eval(buttons);
							titleNView.buttons = buttons.map(function(d,i){return {text:d,fontSrc:'_www/fonts/mui.ttf',wid:id,wdata:i,float:'right',onclick:page._handleNEvent}});
						}
					}
					//绘制返回键
					titleNView.buttons.push({text:'\ue471',fontSrc:'_www/fonts/mui.ttf',wid:id,wdata:'-1',float:'left',onclick: page._handleNEvent});
					options.styles.titleNView = titleNView;
				}
				var webview = $.openWindow(options);
//				webview.addEventListener("titleUpdate", function(){
//					webview.show(aniShow,transtime)
//				}, false);
			});
		},
		goHome:function(){
			var current = $.currentWebview;
			var webview = plus.webview.getLaunchWebview();
			var aniShow = dofun.aniShow();
			var transtime = dofun.transferTime();
			webview.show(aniShow,transtime)
			setTimeout(function(){
				while(current){
					current.close();
					current = current.opener();
				}
			},50);
			
		},
		initOs: function() {
			if(!$.os.plus){
				
				$.each(doc.querySelectorAll(".mui-plus-visible"), function(a, b) {
					b.parentNode.removeChild(b)
				});
				//加入下载app浮层
//				var div = document.createElement('div');
//				div.className = 'Ulife';
//				div.id = 'download_app';
//				div.innerHTML = '<a class="mui-btn" data-href="'+_host + '/v1/link?code=600&os='+($.os.android?2:1)+'" target="_blank">去下载</a><img src="../img/dofun/1.png"/>';
//				document.body.appendChild(div);
				//监听事件
				$('body').on('tap','#download_app img',function(){
					this.parentNode.classList.add('mui-hidden');
				});
			}else{
				plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
			}
		}
	});
})(mui, DOFUN, document);
	
	
/*********初始化缓存策略*********/
(function($, dofun, win) {
	$.extend(dofun, {
		setItem: function(a, b) {
			return win.sessionStorage.setItem(a, b);
		},
		getItem: function(a) {
			return win.sessionStorage.getItem(a);
		},
		removeItem: function(a) {
			return win.sessionStorage.removeItem(a);
		},
		clearCache:function(){
			win.sessionStorage.clear();
		}
	});
	//H5+ 使用缓存
	$.os.plus && $.extend(dofun, {
		setItem: function(a, b) {
			return plus.storage.setItem(a, b);
		},
		getItem: function(a) {
			return plus.storage.getItem(a);
		},
		removeItem: function(a) {
			return plus.storage.removeItem(a);
		},
		clearCache:function(){
			plus.storage.clear();
		}
	});
})(mui, DOFUN, window);

/*********封装ajax请求*********/
(function($, dofun) {
	dofun.ApiClass = $.Class.extend({
		init: function() {
			this.initConfig()
		},
		initConfig: function() {
			this.url = dofun.url;
			//TODO 初始化公用的请求参数
		},
		getRequest: function(url) {
			return $.now();
		},
		getParams: function(params) {
//			var rebuldParams = {};
//			rebuldParams.params = params;
//			rebuldParams.version = dofun.version;
//			rebuldParams.timestamp = $.now();
//			rebuldParams.appId = dofun.appId;
//			if($.os.plus){
//				rebuldParams.clientId = plus.device.uuid;
//				rebuldParams.platform = plus.os.android ? '2':'1';
//			}else{
//				rebuldParams.clientId = 'webtest';
//				rebuldParams.platform = '3';
//			}
//			rebuldParams.token = dofun.getItem('token')||_mocktoken;
			return params;
		},
		success: function(result) {
			if(dofun.debug){
				if(mui.os.plus){
					dofun.d(JSON.stringify(result));
				}else{
					dofun.d(result);
				}
			}
			//失败返回的通用处理
			if(result.rspcod != 200){
				dofun.d($.os.plus?JSON.stringify(result) : result);
				dofun.toast(result.rspmsg);
				dofun.closeWaiting();
				return false;
			}
//			 if(result.rspcod == 200){
//			 	dofun.toast(result.rspmsg);
//			 }
			return true;
		},
		error: function(xhr,type,e) {
//			dofun.toast(e.message||'出错啦');
			console.log(e.message||'出错啦');
			return false;
		},
		get: function(action, params, success, failure,waitting,async){
			this._post('get',action, params, success, failure,waitting,async);
		},
		post:function(action, params, success, failure,waitting,async){
			this._post('post',action, params, success, failure,waitting,async);
		},
		_post: function(type, action, params, success, failure,waitting,async) {
			!$.isFunction(failure) && (waitting = failure,failure = null);
			$.isFunction(params) && (failure = success, success = params, params = {});
			var	that = this;
			params = that.getParams(params);
			var _v = dofun.getItem('version')||(new Date().getTime());
			if(type == 'get'){
				if(!$.isEmptyObject(params)){
					action += ((~action.indexOf('?')?'&':'?')+$.param(params));
				}
				params = '';
			}
			var realUrl = action + '';
			if(!realUrl.startWith('http://') && !realUrl.startWith('https://')){
				realUrl =  that.url + action + (~action.indexOf('?')?'&':'?') + '_v='+_v;
			}
			dofun.d('url = ' + realUrl);
			if(waitting){
				dofun.showWaiting();
			}
			var user = dofun.User.getUser();
			var token = dofun.getToken()||_mocktoken;
			var headers = {};
			user && user.id && (headers.userId = user.id)
			token && (headers.token = token);
			if(async === undefined){
				async = true;
			}
//			if(mui.isEmptyObject(params) && 'get' == type){
//				params = '';
//			}
			dofun.d($.os.plus ? JSON.stringify(params) : params);
			$.ajax({
				type: type,
				url: realUrl,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				headers:headers,
				timeout:30000,
				async:async,
				data: JSON.stringify(params),
				success: function(result,a,b,c) {
					try{
						if(waitting){
							dofun.closeWaiting();
						}
						if(result.rspcod != 200 && $.isFunction(failure)){
							dofun.d($.os.plus?JSON.stringify(result) : result);
							failure(result);
						}else if(result.rspcod == 401){
							dofun.d($.os.plus?JSON.stringify(result) : result);
							dofun.User.logout();
							 $.openWindow({
	                              url: 'login1.html',
	                              id: 'login1',
	                              show: {
	                                  aniShow: false 
	                              }
	                          });
						}else{
							that.success(result) && success && success.call(result,result);
						}
						
					}catch(e){
						dofun.closeWaiting();
						dofun.d('Error:' + e.message);
						if(dofun.debug){
							throw e;
						}
					}
				},
				error: function(xhr,type,e) {
					try{
						if(waitting){
							dofun.closeWaiting();
						}
						if('timeout'==type){
							dofun.toast('请求超时！');
						}else if('abort' == type){
							dofun.toast('服务器无法连接！');
						} else{
							that.error(xhr,type,e) && failure && failure.call(null,xhr,type,e);
						}
						dofun.closeWaiting();
					}catch(e){
						dofun.closeWaiting();
						dofun.d('Error:' + e.message);
						if(dofun.debug){
							throw e;
						}
					}
				}
			})
		}
	});
})(mui, DOFUN);


/*******用户类***********/
(function($, dofun) {
	dofun.UserClass = $.Class.extend({
		cache_key: "_FWUSER",
		cache_key_shppping: "_SPUSER",
		init: function(user) {
			user && dofun.setItem(this.cache_key, JSON.stringify(user));
		},//用户信息放入缓存
		initShoppingUser: function(user) {
			user && dofun.setItem(this.cache_key_shppping, JSON.stringify(user));
		},
		logout: function(callback) {
			dofun.removeItem(this.cache_key);
			dofun.removeItem(this.cache_key_shppping);
			callback && callback();
		},//清除缓存信息
		getUser: function() {
//			if(!mui.os.plus && dofun.debug){
				//模拟用户
				//return {id:11,username:'徐磊',token:'oh1fXw-5RHM74_DZZ22lFH0CQ8f0',username:'18616016103'};
//			}
			var user = dofun.getItem(this.cache_key);
			if(!user) return !!0;
			return JSON.parse(user);
		},
		reload: function(callback){
			var that = this;
			var user = that.getUser();
			if(!user) return;
			dofun.Api.get('userBaseInfo/getuserBaseInfo/'+user.id+',1,10',{},function(msg){
				that.init(msg);
				callback && callback(msg);
			});
		},
		isLogin: function() {
			var user = this.getUser();
			return !!user;
		},
		isSupplier:function(){//是否是资源方
			var user = this.getUser();
			if(user && user.userType.length > 1 && user.userType.charAt(1) == '1'){
				return true;
			}
			return false;
		}
	})
})(mui, DOFUN);


/*******全局类***********/
(function($, dofun) {
	dofun.GlobalClass = $.Class.extend({
		cache_key: "global",
		init: function(data) {
			if(!data) return;
			dofun.setItem(this.cache_key, JSON.stringify(data));
		},
		get: function(key) {
			var rval = dofun.getItem(this.cache_key);
			if(!rval) return false;
			try {
				rval =  JSON.parse(rval)
			} catch (d) {
				return false;
			}
			return rval[key];
		},
		getFee:function(){ //默认邮费
			return this.get('fee')||10;
		},
		getLimitPrice:function(){ //订单起订金额
			return this.get('limitPrice')||1000;
		}
	});
})(mui, DOFUN);

	
/********有用户登录要求的请继承此类**********/	
(function($, dofun) {
	dofun.UserPage = $.Class.extend({
		init: function() {
			var that = this;
			dofun.checkLogin(function(){
				that.initPage();
			});
		},
		initPage: function() {}
	})
})(mui, DOFUN);

/********有导航栏的请继承此类 (会员登录的导航栏)**********/	
(function($, dofun) {
	dofun.NavPage = $.Class.extend({
		init: function(options) {
			this.initNav(options);
			this.initPage();
		},
		initNav: function(options) {
			var nav = dofun.data.nav;
			var navHTML = [];
			var pageId = dofun.getPageId();
			if(!pageId){
				pageId = nav[0].page;
			}
			$.each(nav,function(i,d){
				navHTML.push('<a id="'+d.id+'" class="mui-tab-item '+(pageId==d.page?'mui-active':'')+'" data-href="'+d.page+'">');
				navHTML.push('<span class="mui-icon '+(d.icon)+'"></span>');
				navHTML.push('<span class="mui-tab-label">'+d.name+'</span>');
				navHTML.push('</a>');
			});
			var navEle = document.createElement('nav');
			navEle.className = 'mui-bar mui-bar-tab nav-index';
			navEle.innerHTML = navHTML.join('');
			document.body.appendChild(navEle);
			//查询购物车数量
//			dofun.Api.get('userShopping/getCount',{},function(msg){
//				var num = msg;
//				if(num > 0){
//					mui('#shopcart .mui-icon')[0].innerHTML = '<span class="mui-badge">'+num+'</span>';
//				}
//			});
		},
		addNum:function(num){
			var badge = mui('#shopcart .mui-badge')[0];
			if(!badge && num > 0) {
				mui('#shopcart .mui-icon')[0].innerHTML = '<span class="mui-badge">'+num+'</span>';
				return;
			}
			var oldNum = +badge.innerText;
			if(badge && oldNum + num == 0){
				mui('#shopcart .mui-icon')[0].innerHTML = '';
				return;
			}
			badge.innerText = oldNum + num;
		},
		initPage: function() {}
	})
})(mui, DOFUN);


/********H5+导航栏  (会员登录的导航栏)**********/	
(function($, dofun) {
	if($.os.plus)
	dofun.NavPage = mui.Class.extend({
		init: function(options) {
			if(options && options.navForce){
				this.initNav();
			}
			this.initH5plus();
			this.initPage();
		},
		initNav: function() {
			var nav = dofun.data.nav;
			var navHTML = [];
			var pageId = dofun.getPageId();
			if(!pageId) {
				pageId = nav[0].page;
			}
			$.each(nav, function(i, d) {
				navHTML.push('<a id="' + d.id + '" class="mui-tab-item ' + (i == 0 ? 'mui-active' : '') + '" ' + (mui.os.plus ? 'href' : 'data-href') + '="' + d.page + '">');
				if(!d.itxt){
					navHTML.push('<span class="mui-icon iconfont '+(d.icon)+'"></span>');
				}else{
					navHTML.push('<span class="mui-icon '+(d.icon)+'">'+d.itxt+'</span>');
				}
				navHTML.push('<span class="mui-tab-label">' + d.name + '</span>');
				navHTML.push('</a>');
			});
			var navEle = document.createElement('nav');
			navEle.className = 'mui-bar mui-bar-tab nav-index';
			navEle.innerHTML = navHTML.join('');
			document.body.appendChild(navEle);
		},
		addNum: function(num) {
			var badge = mui('#shopcart .mui-badge')[0];
			if(!badge && num > 0) {
				mui('#shopcart .mui-icon')[0].innerHTML = '<span class="mui-badge">' + num + '</span>';
				return;
			};
			var oldNum = +badge.innerText;
			badge.innerText = oldNum + num;
		},
		initH5plus: function() {},
		initPage: function() {}
	});
})(mui, DOFUN);

/********APP CHECK**********/	
(function($, dofun) {
	dofun.AppCheck = mui.Class.extend({
		init: function(options){},
		check: function() {
			if(!mui.os.plus) return;
			var keyUpdate = 'updateCheck';
			var params = {};
			params.os = plus.os.name;
			params.curVer = plus.runtime.version;
			params.lastUpdated = plus.storage.getItem(keyUpdate);
			dofun.Api.post('globalSettings/app/check',params,function(result){
				var msg = result.obj;
				var updated = msg.updated;
				var updateDesc = msg.updateDesc;
				var isForce = msg.isForce;
				var dowloadUrl = msg.dowloadUrl;
				if(updated != 1) return;
				if(isForce == 1){
					plus.nativeUI.alert(updateDesc,function(i){
						plus.runtime.openURL(dowloadUrl);
						plus.storage.setItem( keyUpdate, (new Date()).getTime().toString() );
					},msg.title,['确定']);
				}else{
					plus.nativeUI.confirm(updateDesc, function(i){
						if ( 0==i.index ) {
							plus.runtime.openURL( dowloadUrl );
							plus.storage.setItem( keyUpdate, (new Date()).getTime().toString() );
						}
					}, msg.title, ["立即更新","取消"]);
				}
			},function(result){
				console.log(result.msg);
			});
		}
	});
})(mui, DOFUN);


/*********重写mui相关方法 以适配非 H5+环境*********/
(function($, dofun, win) {
	//重写 plusready
	var _plusReady = $.plusReady;
	$.plusReady = function(callback){
		if($.os.plus){
			_plusReady(callback);
		}else{
			$.ready(callback);
		}
	}
})(mui, DOFUN, window);


/********扩展方法**********/	
(function($, dofun) {
	String.prototype.toDate = function (format) {
	    var regex = format.replace(/yyyy/, '([0-9]{4})').replace(/yy/, '([0-9]{2})')
	                              .replace(/y/, '([0-9]{1,2})').replace(/MM/, '([0-9]{2})')
	                              .replace(/dd/, '([0-9]{2})').replace(/M/, '([0-9]{1,2})')
	                              .replace(/d/, '([0-9]{1,2})').replace(/HH/, '([0-9]{2}|0)')
	                              .replace(/mm/, '([0-9]{2})').replace(/ss/, '([0-9]{2})')
	                              .replace(/H/, '([0-9]{1,2})').replace(/m/, '([0-9]{1,2})')
	                              .replace(/s/, '([0-9]{1,2})');
	
	    var matchs = this.match(new RegExp('^' + regex + '(.*)'));
	
	    if (!matchs || matchs.length <= 0) //return null;
	        throw ('String.toFormatDate("' + format + '") format error');
	
	    var formatIndex = format.replace(/y+/, 'y').replace(/M+/, 'M').replace(/d+/, 'd')
	                                    .replace(/H+/, 'H').replace(/m+/, 'm').replace(/s+/, 's')
	                                    .replace(/[^a-z]+/ig, '');
	
	    var date = { y: 0, M: 0, d: 0, H: 0, m: 0, s: 0 };
	    for (var i = 0; i < formatIndex.length; i++) {
	        var v = parseInt(matchs[i + 1], 10);
	        if (isNaN(v))
	            return null;
	        date[formatIndex.substr(i, 1)] = v;
	    }
	
	    var ss = new Date();
	
	    var s = new Date(date.y, date.M - 1, date.d, date.H, date.m, date.s);
	    return new Date(date.y, date.M - 1, date.d, date.H, date.m, date.s);
	}
	
	/// <summary>
	/// 左侧字符填充
	/// </summary>
	/// <param name="ch">填充字符</param>
	/// <param name="length">填充后字符串长度</param>
	/// <returns>填充后字符串</returns>
	String.prototype.padLeft = function(ch, length) {
	    var str = this;
	    for(var i=0;i<length - this.length; i++)
	        str = ch + str;
		return str;
	}
	
	/// <summary>
	/// 右侧字符填充
	/// </summary>
	/// <param name="ch">填充字符</param>
	/// <param name="length">填充后字符串长度</param>
	/// <returns>填充后字符串</returns>
	String.prototype.padRight = function(ch, length) {
	    var str = this;
	    for(var i=0; i<length - str.length; i++)
	        str = str + ch;
		return str;
	}
	
	String.prototype.endWith = function(str){
	 	if(str==null || str=="" || this.length == 0 ||str.length > this.length){	
       		return false;
		}
		if(this.substring(this.length - str.length)){
			return true;
		}else{
			return false;
		}
		return true;
	};

 	String.prototype.startWith = function(str){
	  	if(str == null || str== "" || this.length== 0 || str.length > this.length){
			return false;
	  	} 
	  	if(this.substr(0,str.length) == str){
	    	return true;
	  	}else{
	    	return false;
	   	}       
	 	return true; 
	};
	
	/// <summary>
	/// 时间格式化
	/// </summary>
	/// <param name="format">yyyy-MM-dd</param>
	/// <returns>格式化后的字符串</returns>
	Date.prototype.toString = function (format) {
	    if (!format || typeof format != 'string')
	        format = "yyyy-MM-dd";
	
	    format = format.replace(/yyyy/, this.getFullYear())
	                           .replace(/yy/, this.getFullYear().toString().substring(2))
	                           .replace(/y/, this.getFullYear().toString().substring(2).trimLeft("0"))
	                           .replace(/MM/, (this.getMonth() + 1).toString().padLeft('0', 2))
	                           .replace(/dd/, this.getDate().toString().padLeft('0', 2))
	                           .replace(/M/, (this.getMonth() + 1))
	                           .replace(/d/, this.getDate().toString())
	                           .replace(/HH/, this.getHours().toString().padLeft('0', 2))
	                           .replace(/mm/, this.getMinutes().toString().padLeft('0', 2))
	                           .replace(/ss/, this.getSeconds().toString().padLeft('0', 2))
	                           .replace(/H/, this.getHours())
	                           .replace(/m/, this.getMinutes())
	                           .replace(/s/, this.getSeconds());
	    date = null;
	    return format;
	}
	
	//扩展dom元素的方法
	HTMLElement.prototype.appendHTML = function(text) {
		var temp = document.createElement('div');
      	temp.innerHTML = text;
      	// 防止元素太多 进行提速
      	var frag = document.createDocumentFragment();
      	while (temp.firstChild) {
        	frag.appendChild(temp.firstChild);
      	}
      	this.appendChild(frag);
	}
})(mui, DOFUN);

/*其他扩展*/
(function($, dofun,doc) {
	$.extend(dofun, {
		//解析base64数据
		parseBase64Data:function(data){
			var rval = {};
			if(data){
				var data = data.split(',');
				rval.file = data.pop();
				rval.type = data[0].split('/').pop().substr(0,3);
			}
			return rval;
		},
		request:function(strParame) {
			var args = {};
			var query = location.search.substring(1);
		
			var pairs = query.split("&"); // Break at ampersand
			for (var i = 0; i < pairs.length; i++) {
				var pos = pairs[i].indexOf('=');
				if (pos == -1) continue;
				var argname = pairs[i].substring(0, pos);
				var value = pairs[i].substring(pos + 1);
				value = decodeURIComponent(value);
				args[argname] = value;
			}
			return args[strParame];
		},
		formtNumber:function(s,n){
			if(!n) n = 2;
			n = n > 0 && n <= 20 ? n : 2;
			s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
			var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
			t = "";
			for (i = 0; i < l.length; i++) {
				t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
			}
			return t.split("").reverse().join("") + "." + r;
		}
	});
})(mui, DOFUN,window.document);


/********打开单独页面**********/	
(function($, dofun) {
	var openw=null,waiting=null;
	dofun.openPage = function(id,wa,ns,ws){
		if(openw){//避免多次打开同一个页面
			return null;
		}
		if(window.plus){
			wa&&(waiting=plus.nativeUI.showWaiting());
			ws=ws||{};
			ws.scrollIndicator||(ws.scrollIndicator='none');
			ws.scalable||(ws.scalable=false);
			var pre='';
			openw=plus.webview.create(pre+id,id,ws);
			ns||openw.addEventListener('loaded',function(){//页面加载完成后才显示
				openw.show(as);
				closeWaiting();
			},false);
			openw.addEventListener('close',function(){//页面关闭后可再次打开
				openw=null;
			},false);
			return openw;
		}else{
			window.open(id);
		}
		return null;
	}
	
	dofun.openWebPage = function(action){
		mui.openWindow(_host + '/' + action);
	}
	
	window.openPage = dofun.openPage;
})(mui, DOFUN);