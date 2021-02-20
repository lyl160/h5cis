/**
 * lxu
 * mui 上传组件封装 支持图片压缩
 */
(function($, window) {
	$.JUpload = function(element, options) {
		var jupload = this;
		var f1 = [];
		jupload.options = $.extend($.JUpload.defaults, options);
		jupload.hdom = element;
		
		jupload.init = function() {
			//自动启用
			jupload.initEvents();
		};

		jupload.initEvents = function() {
			//点击当前元素弹出原生选择栏
			element.querySelector('input').addEventListener('change',function(){
//				var btnArray = [{title:"拍照"},{title:"相册选择"}];
//				plus.nativeUI.actionSheet( {
//					cancel:"取消",
//					buttons:btnArray
//				}, function(e){
//					var index = e.index;
//					switch (index){
//						case 0:
//							break;
//						case 1:
//							jupload.cameraImg();
//							break;
//						case 2:
//							jupload.galleryImg();
//							break;
//					}
//				});
				
				var files = this.files;  
				if(files.length > 30){
					DOFUN.toast("最多只能上传30张");
					return;
				}
				var that = jupload;
				var successCallback = jupload.options.success;
				for(var i = 0;i < files.length;i++){  
					var file = files[i];
					var reader = new FileReader(); 
					reader.readAsDataURL(file);
					reader.onload=function(e){
	                    var speech = e.target.result;//base64图片          
	                    if(successCallback){
	                    	successCallback.call(null,speech);
	                    }else{
	                    	var imgWraper = document.createElement('span');
		                    imgWraper.className = 'section-images-added'+(jupload.options.muti == 0 ? ' nmuti':'');
		                    imgWraper.style.backgroundImage = 'url("'+speech+'")';
		                    imgWraper.setAttribute('data-img',speech);
		                    imgWraper.innerHTML = '<i class="alifont icon-shanchu del">x</i>';
		                    var _div_ = that.hdom.parentNode.querySelector('.' + jupload.options.showImg);
		                    _div_.append(imgWraper);
	                    }
				   };
	            }  
				
				
//					     
//					      reader.onload=function(e){
////					     $("input[type='radio']").each(function (){
////						  	if($(this).is(':checked')){
//						  		$(".moreImg").get(0).src = e.target.result; 
//						  	}
////						  });
////						    	$(".file-update").each(function(){
////						    		
////					        		console.log(e.target.result); 
////						    	})
//				        	
////					      }
//					    })
				
				
			});
		};
		
		//相册选择
		jupload.galleryImg = function(){
			f1.length && f1.splice(0,f1.length);
		  	plus.gallery.pick(function(path) {
                jupload.showImg(path);
            }, function(e) {
                //mui.toast("取消选择图片");
            }, {
                filter: "image",
                multiple: false
            });
		};
		
		//拍照
		jupload.cameraImg = function(){
			f1.length && f1.splice(0,f1.length);
		 	var cmr = plus.camera.getCamera();
            cmr.captureImage(function(p) {
            plus.io.resolveLocalFileSystemURL(p, function(entry) {
	                var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径，例如file:///........之类的。
	                jupload.showImg(localurl);
	            });
            }, function(e) {
                mui.toast("Got Failed ",  e);
            });
		};
		
		jupload.showImg = function(url){
			var that = this;
			//先对文件进行压缩 方向纠错
            ~url.indexOf("file:") ? url : url = "file:///" + url;
            plus.zip.compressImage({
                src: url,
                dst: url,
                overwrite: true,
                quality:50,
                rotate: 0 // 不管有没有被旋转，统一旋转0度
            }, function(e) {
            	var reader = new plus.io.FileReader();
            	//成功回调
            	if (mui.os.ios){
					plus.io.resolveLocalFileSystemURL(url, function(entry){
						entry.file(function(file){
							reader.readAsDataURL(file);
						},function(e){
							mui.toast("读写出现异常: " + e.message );
						});
					});
				}else {
					reader.readAsDataURL(e.target);
				}
				var successCallback = jupload.options.success;
				reader.onloadend = function (e) {
                    var speech = e.target.result;//base64图片          
                    if(successCallback){
                    	successCallback.call(null,speech);
                    }else{
                    	var imgWraper = document.createElement('span');
	                    imgWraper.className = 'section-images-added'+(jupload.options.muti == 0 ? ' nmuti':'');
	                    imgWraper.style.backgroundImage = 'url("'+speech+'")';
	                    imgWraper.setAttribute('data-img',speech);
	                    imgWraper.innerHTML = '<i class="alifont icon-shanchu del">x</i>';
	                    var _div_ = that.hdom.parentNode.querySelector('.' + jupload.options.showImg);
	                    _div_.append(imgWraper);
                    }
                };
            }, function(error) {
                mui.toast("图片旋转时发生错误!");
            });
		};
		
		jupload.renderImages = function(urls){
			if(!urls) return;
			var that = this;
			var images = urls.split(',')||[];
			var _div_ = that.hdom.parentNode.querySelector('.' + jupload.options.showImg);
			images.forEach(function(d){
				console.log(" imag >>>>>>" +d);
				var imgWraper = document.createElement('span');
                imgWraper.className = 'section-images-added'+(jupload.options.muti == 0 ? ' nmuti':'');
                imgWraper.style.backgroundImage = 'url("'+DOFUN.img_server + d+'")';
                imgWraper.setAttribute('data-img',d);
                imgWraper.innerHTML = '<i class="alifont icon-shanchu del">x</i>';
                _div_.append(imgWraper);
			});
		};
		
		jupload.destory = function() {
			element.removeEventListener('tap');
			delete $.data[element.getAttribute('data-jupload')];
			element.setAttribute('data-jupload', '');
		};
		jupload.init();
		return jupload;
	};
	$.JUpload.defaults = {
		showImg:'showImg'
	};
	$.fn.JUpload = function(options) {
		var JUploadApis = [];
		//全局监听
		mui('body').on('tap','.del',function(e){
            e.stopPropagation();
			this.parentNode.remove();
//			this.parentNode.parentNode.removeChild(this.parentNode);
		});
		this.each(function() {
			var JUploadApi = null;
			var self = this;
			var id = self.getAttribute('data-jupload');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = JUploadApi = new $.JUpload(self, options);
				self.setAttribute('data-jupload', id);
			} else {
				JUploadApi = $.data[id];
			}
			JUploadApis.push(JUploadApi);
		});
		return JUploadApis.length === 1 ? JUploadApis[0] : JUploadApis;
	};
})(mui, window);