/*!
 * =====================================================
 * tmpl 公用辅助方法
 * LXU
 * 
 * 用法 属性名 | 函数名 ：'参数' 例如 ： {{abc | dictName:'001'}}
 * =====================================================
 */
(function(tpl,dofun){
	
	var dicts = {
		'100':{},
		'200':{},
		'400':{'0':'活鲜','1':'冰冻','2':'冷藏'},
		'500':{'0':'上架','1':'已下架','2':'售罄','3':'有货'}
	}
	
	if(!tpl){
		return;
	}
	/**
	 * 字典名称获取
	 */
	template.helper('dictName', function (val, pcode) {
		var rval = '';
		var dict = dicts[pcode];
		if(dict){
			rval = dict[val];
		}
		return rval||dict[0];
	});
	
	
	/**
	 * 订单状态
	 */
	template.helper('statusFmt', function (val) {
		var rval = '';
		switch (val){
			case '0000':
				rval = '待付款';
				break;
			case '1000':
			case '2000':
			case '3000':
			case '4000':
				rval = '待收货';
				break;
			case '5000':
				rval = '已完成';
				break;
			case '9000':
				rval = '已取消';
				break;
			default:
				break;
		}
		return rval;
	});
	
	/**
	 * 日期转换
	 * val 为时间戳
	 */
	template.helper('dateformat', function (val, pattern) {
		var date = new Date(val);
		return date.toString(pattern||'yyyy-MM-dd')
	});
	
	/**
	 * 日期转换
	 * val 为时间戳
	 */
	template.helper('dateformatHM', function (val) {
		var date = new Date(val);
		return date.toString('yyyy-MM-dd HH:mm')
	});
	/**
	 * 区域格式化
	 * val 区域值
	 */
	template.helper('placeFormat', function (val, type) {
		var result = val.split(',');
		if(result.length > 3){
			return result[0] + '等' + result.length + '个城市';
		}else{
			return result.join(',');
		}
	});
	
		/**
	 * 区域格式化
	 * val 区域值
	 */
	template.helper('substr', function (val, n) {
		return val.substr(n);
	});
	
	
	/**
	 * 图片存储附加默认图片
	 */
	template.helper('defaultImg', function (val, type) {
		if(!val){
			return 'img/3000327-2.jpg';
		}
		return dofun.img_server + val;
	});
	
	/**
	 * 整数转换
	 */
	template.helper('formatInt', function (val) {
		var val = +val;
		if(val){
			val = val.toFixed(0);
		}else{
			val = 0;
		}
		return val;
	});
	
	/**
	 * 数字转换
	 */
	template.helper('formatNumber',function(val,type){
		if(dofun){
			return dofun.formtNumber(val,type);
		}else{
			return val;
		}
	});
	
	/**
	 * 价格转换
	 */
	template.helper('formatPrice',function(val1,val2){
		if(val1){
			return (val1 * val2).toFixed(2);
		}
		return 0;
	});
	
	/**
	 * 时间格式化
	 */
	template.helper('formatSCDate',function(val1){
		if(typeof val1 == 'object'){
			val1 = val1.toString('yyyy-MM-dd HH:mm:ss');
		}
		var dateTimeStamp = Date.parse(val1.replace(/-/gi, "/"));
		var publishTime = dateTimeStamp / 1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime() / 1000),
        d,
 
        date = new Date(publishTime * 1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
        //小于10的在前面补0
        if (M < 10) {
                M = '0' + M;
        }
        if (D < 10) {
                D = '0' + D;
        }
        if (H < 10) {
                H = '0' + H;
        }
        if (m < 10) {
                m = '0' + m;
        }
        if (s < 10) {
                s = '0' + s;
        }
 
        d = timeNow - publishTime;
        d_days = parseInt(d / 86400);
        d_hours = parseInt(d / 3600);
        d_minutes = parseInt(d / 60);
        d_seconds = parseInt(d);
 
        if (d_days > 0 && d_days < 3) {
            return d_days + '天前';
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + '小时前';
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + '分钟前';
        } else if (d_seconds < 60) {
            if (d_seconds <= 0) {
                    return '刚刚';
            } else {
                    return d_seconds + '秒前';
            }
        } else if (d_days >= 3 && d_days < 30) {
            return M + '-' + D + ' ' + H + ':' + m;
        } else if (d_days >= 30) {
            return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
        }
	});
})(window.template,window.DOFUN)