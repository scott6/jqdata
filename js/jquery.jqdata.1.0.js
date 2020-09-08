/*! jQData v1.0 | (c) 2015, 2016 Ary Pambudi W | MIT license */
(function($){
	$.fn.jqdata = function(options){
		var cfg = $.extend({
			dataAttr:'jqdata',
            json: null,
			beforeBind :function(){},
			afterBind:function(){},
			dataChanged:function(){}
        }, options );
		var _obj = this, _json = jQuery.extend(true, {}, cfg.json), _da = cfg.dataAttr, _trTraversing = false;
		_obj.data('templates',{});
		var _setValFunc = function(e){ 
			var o = $(e.target), k = o.attr('data-'+_da), vv=o.val();
			if (o.is('[data-'+_da+'-format]')) vv = vv.replace(new RegExp(o.attr('data-'+_da+'-format').replace('{value}','|'),"ig"),'');
			_setVal(k,vv); _process(_obj,k,vv);//_obj.rebind(); 
		}
		var _removeFmtFunc = function(e){ 
			var o = $(e.target), f = o.attr('data-'+_da+'-format');
			o.val(o.val().replace(new RegExp(f.replace('{value}','|'),"ig"),''));	
		}
		var _process = function(scope,key,value) {
			if (!scope) scope = $('body');
			var tgt = $('[data-'+_da+'="'+key+'"]',scope);
			if ((value!=null) && (typeof(value) == 'object') && value.hasOwnProperty(0)) {
				var tloop = $('[data-'+_da+'="'+key+'.{n}"]',scope);
				if (tloop.length>0) {
					var tp = _obj.data('templates')[key+'.{n}'],tprt = tloop.parent();
					if (typeof tp == 'undefined') { 
						tp = _obj.data('templates')[key+'.{n}'] = {'ref':tloop.clone(),'html':tloop.prop('outerHTML'),'prt':tprt}; 
						tloop.remove(); 
					}
					for(var i=0; i<value.length; i++) {
						tprt.append(tp['html'].replace(new RegExp('"'+key+'.{n}', 'g'),'"'+key+'.'+i));
					}
				}
			}
			tgt.each(function(){
				if (typeof(value) != 'object') {
					var vv = value;
					if ($(this).is('[data-'+_da+'-format]')) vv = $(this).attr('data-'+_da+'-format').replace('\\','').replace('{value}',vv);
					if ($(this).is(':input[type="radio"], :input[type="checkbox"]')) {
						if ($(this).is('[value="'+vv+'"]'))$(this).prop('checked',true);
					} else if ($(this).is(':input')) {
						if (!$(this).is(':focus')) $(this).val(vv);
					}
					else $(this).html(vv);
				}
				if ($(this).is('[data-'+_da+'-databind]')) {
					var fname = $(this).attr('data-'+_da+'-databind');
					if (typeof window[fname] == 'function') {
						window[fname].apply(this,[$(this),value,cfg.json,key]);
					}
				}
				if ($(this).is('[data-'+_da+'-format]')) {
					var fmt = $(this).attr('data-'+_da+'-format');
					$(this).off('focus',_removeFmtFunc).on('focus',_removeFmtFunc);
				}
				if ($(this).is('[data-'+_da+'-bindevent]')) {
					var act = $(this).attr('data-'+_da+'-bindevent');
					$(this).off(act,_setValFunc).on(act,_setValFunc);
				}
			});
		}
		var _traverse = function(sc,o,func,p) {
			for (var i in o) {
				var ix = (typeof p != 'undefined')? p+'.'+i : i;
				func.apply(this,[sc,ix,o[i]]);  
				if (o[i] !== null && typeof(o[i])=="object") {
					_traverse(sc,o[i],func,ix);
				}
			}
		}
		var _setVal = function(sect,val){
			var ar = sect.split('.'),tdata = cfg.json,oldv='';
			for (var x=0; x<ar.length; x++) {
				if (typeof tdata[ar[x]] == 'undefined') {
					tdata[ar[x]] = null; break;
				} else if (typeof tdata[ar[x]] == 'object') {
					tdata = tdata[ar[x]];
				} else {
					oldv = tdata[ar[x]];
					tdata[ar[x]] = val;
				}
			}
			cfg.dataChanged(_obj,sect,oldv,val);
		}
		var _cleanEmptyTemplate = function(){
			$('[data-'+_da+'$=".{n}"]',_obj).remove();
		}
		var _startTraverse = function(){
			cfg.beforeBind(_obj);
			_traverse(_obj,cfg.json,_process);
			_cleanEmptyTemplate();
			cfg.afterBind(_obj);
		}
		_obj.rebind = function(){ _startTraverse();}
		_obj.getData = function(){return cfg.json;}
		_obj.getOriginalData = function(){return _json;}
		_obj.reset = function(){cfg.json = jQuery.extend(true, {}, _json);_startTraverse();}
		_startTraverse();
		return _obj;
	}
}(jQuery));