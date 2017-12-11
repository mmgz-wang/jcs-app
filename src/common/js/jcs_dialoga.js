
export default {
	init:function(opt){
		var defaults = {
			msg: "您确认要执行此操作吗？",
			trueCallback:null,
			falseCallback:null,
			btn:['确定','取消'],
			Dom:''
		};
		this.settings = opt;
		this.addDom();
		this.addEvent();
	},
	addDom:function(){
		if(this.settings.Dom != ''){
			this.ele='<div class="jcs_decision">'+this.settings.Dom+
				'<p><button class="jcs_decision_false">'+this.settings.btn[0]+'</button></p>';
		}else{
			console.log(this.settings.msg)
			this.ele='<div class="maskz"><div class="jcs_decision"><p class="jcs_decision_tit">'+this.settings.msg+'</p>'+
				'<p><button class="jcs_decision_true">'+this.settings.btn[0]+'</button></p>'+
				'<p><button class="jcs_decision_false">'+this.settings.btn[1]+'</button></p></div>';
		}
		var that = this;
		if(document.querySelector('.maskz') != null){
			return;
		}else{
			var maskz = document.createElement('div');
			maskz.className="maskz";
			maskz.innerHTML=this.ele;
			document.querySelector('body').appendChild(maskz);
		}
	},
	addEvent:function(){
		var that = this;
		document.querySelector('.jcs_decision').onclick = function(e){
			e.stopPropagation();
			var trg = event.target;
			console.log(trg)
			if(trg.className == 'jcs_decision_true'){
				that.settings.trueCallback();
			}else if(trg.className == 'jcs_decision_false'){
				that.settings.falseCallback();
				that.remoDom();
			}
		}
	},
	remoDom:function(){
		document.querySelector('body').removeChild(document.querySelector('.maskz'));
	}
}