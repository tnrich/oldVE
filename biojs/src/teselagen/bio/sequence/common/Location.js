Ext.define("Teselagen.bio.sequence.common.Location", {
	constructor: function(data){
		var start = data.start;
		var end = data.end;

		this.getStart = function (){
			return start;
		}

		this.setStart = function(pStart){
			start = pStart;
		}

		this.getEnd = function(){
			return end;
		}

		this.setEnd = function(pEnd){
			end = pEnd;
		}

		this.clone = function(){
			return Ext.create("Teselagen.bio.sequence.common.Location",{
				start: start,
				end: end
			});
		}

		this.getLength = function (){
			return Math.abs(end -start);
		}
	}
});