package wraps.js;

import java.util.List;

public class SequenceFileWrap {
	
	public String id;
	public String project_id;
	public String part_id;
	public String name;
	public String sequenceFileFormat;
	public String sequenceFileContent;
	public String hash;
	public String partSource;
	public String sequenceFileName;
	public boolean firstTimeImported;
	public PartWrap part;
	public ProjectWrap project;
	public List<FeatureWrap> features;
	
	public SequenceFileWrap() {
		
	}
	
	/*public SequenceFileWrap(List<Object> sequenceFile) {
		this.id = (String) sequenceFile.get(0);
		this.project_id = (String) sequenceFile.get(1);
		this.part_id = (String) sequenceFile.get(2);
		this.name = (String) sequenceFile.get(3);
		this.sequenceFileFormat = (String) sequenceFile.get(4);
		this.sequenceFileContent = (String) sequenceFile.get(5);
		this.hash = (String) sequenceFile.get(6);
		this.partSource = (String) sequenceFile.get(7);
		this.sequenceFileName = (String) sequenceFile.get(8);
		this.firstTimeImported = (Boolean) sequenceFile.get(9);
	}*/
	
	
	
}
