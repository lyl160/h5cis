/**
 * @author xlsky0713
 * 验证码效果
 * @param {Object} dofun
 */
(function($,dofun){
	var count = 60;
	var _timeCount = null;
	var partten = /^1[2,3,4,5,6,7,8,9]\d{9}$/;
    $.fn.smscode = function(options){
    	if(!options){
    		options = {};
    	}
		var mobile2 = document.getElementById(options.phoneId || 'mobile2');
		var sendCode = this[0];
		sendCode.addEventListener('tap',function(){
			var that = this;
			if(!mobile2.value.length || !partten.test(mobile2.value)){
				DOFUN.toast('请输入11位手机号');
				return;
			}
			if(that.classList.contains('mui-disabled')){
				return;
			}
			that.classList.toggle('mui-disabled');
			_timeCount = setInterval(calInterval,1000);
			calInterval();
			function calInterval(){
				count -- ;
				that.innerText = count + 'S后重试'
				if(count <= 0){
					clearInterval(_timeCount);
					that.classList.toggle('mui-disabled');
					that.innerText = '获取验证码';
					count = 60;
				}
			}
			
			DOFUN.Api.post('common/getSms',{mobile:mobile2.value},function(result){
				DOFUN.toast(result.msg);
			},function(result){
				DOFUN.toast(result.msg);
				clearInterval(_timeCount);
				that.innerText = '获取验证码';
				that.classList.toggle('mui-disabled');
			});
		});
    	
    }
  
})(window.mui,window.DOFUN);