package wraps.js;

import java.util.List;

public class FeatureWrap {
	
	public String name;
	public String type;
	public long start;
	public long end;
	public long strand;
	public long index;
	public List<FeatureNoteWrap> notes;
	
	public FeatureWrap() {
		
	}
	
	public String toString() {
		return "Feature " + this.name + " of type " + this.type + " from " + 
	            this.start + " to " + this.end;
	}
	
	
}





