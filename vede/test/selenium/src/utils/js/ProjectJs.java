package utils.js;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

import wraps.js.DNAFeatureWrap;
import wraps.js.DeviceDesignWrap;
import wraps.js.FeatureNoteWrap;
import wraps.js.FeatureWrap;
import wraps.js.ProjectWrap;
import wraps.js.SequenceFileWrap;
import wraps.js.UserWrap;

public class ProjectJs {
	
	/*public static Object getProjectTree(WebDriver driver) {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		String script = "var rawProjects = Teselagen.manager.ProjectManager.projects.data.items;" +
				"for(var i=0;i<rawProjects.length;i++) {" +
					"var rawDesigns = rawProjects[i].designs();" +
				"}"; //sequences
		String script = "var seq = Teselagen.manager.ProjectManager.workingSequence.data;" +
				"var a = new Array();" +
				"var i=0;" +
				"for(x in seq) {" +
					"a[i]=seq[x];" +
					"i++;" +
				"}" +
				"return a;";
		//String script = "return Teselagen.manager.ProjectManager.workingSequence.data;";
		Object s = js.executeScript(script);
		return s;
	}*/
	
	public static SequenceFileWrap getWorkingSequence(WebDriver driver) {
		SequenceFileWrap seq = new SequenceFileWrap();
		JavascriptExecutor js = (JavascriptExecutor) driver;
		String script = "return Teselagen.manager.ProjectManager.workingSequence.data.id";
		seq.id = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingSequence.data.project_id";
		seq.project_id = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingSequence.data.part_id";
		seq.part_id = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingSequence.data.name";
		seq.name = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingSequence.data.sequenceFileFormat";
		seq.sequenceFileFormat = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingSequence.data.sequenceFileContent";
		seq.sequenceFileContent = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingSequence.data.hash";
		seq.hash = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingSequence.data.partSource";
		seq.partSource = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingSequence.data.sequenceFileName";
		seq.sequenceFileName = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingSequence.data.firstTimeImported";
		seq.firstTimeImported = (Boolean) js.executeScript(script);
		return seq;
	}
	
	public static ProjectWrap getWorkingProject(WebDriver driver) {
		ProjectWrap proj = new ProjectWrap();
		JavascriptExecutor js = (JavascriptExecutor) driver;	
		String script = "return Teselagen.manager.ProjectManager.workingProject.data.id";
		proj.id = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingProject.data.user_id";
		proj.user_id = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingProject.data.name";
		proj.name = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingProject.data.dateCreated.toString()";
		proj.dateCreated = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.workingProject.data.dateModified.toString()";
		proj.dateModified = (String) js.executeScript(script);		
		return proj;
	}
	
	public static UserWrap getCurrentUser(WebDriver driver) {
		UserWrap user = new UserWrap();
		JavascriptExecutor js = (JavascriptExecutor) driver;	
		String script = "return Teselagen.manager.ProjectManager.currentUser.data.id";
		user.id = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.currentUser.data.preferences_id";
		user.preferences_id = (String) js.executeScript(script);
		script = "return Teselagen.manager.ProjectManager.currentUser.data.username";
		user.username = (String) js.executeScript(script);
		
		return user;
	}
	
	public static List<ProjectWrap> getCurrentUserProjects(WebDriver driver) {
		List<ProjectWrap> p = new ArrayList<ProjectWrap>();
		JavascriptExecutor js = (JavascriptExecutor) driver;
		String script = "return Teselagen.manager.ProjectManager.currentUser.projects().data.items.length";
		long length = (Long) js.executeScript(script);
		
		for(long i=0;i<length;i++) {
			ProjectWrap proj = new ProjectWrap();
			script = "return Teselagen.manager.ProjectManager.currentUser.projects().data.items["+i+"].data.id";
			proj.id = (String) js.executeScript(script);
			script = "return Teselagen.manager.ProjectManager.currentUser.projects().data.items["+i+"].data.user_id";
			proj.user_id = (String) js.executeScript(script);
			script = "return Teselagen.manager.ProjectManager.currentUser.projects().data.items["+i+"].data.name";
			proj.name = (String) js.executeScript(script);
			script = "return Teselagen.manager.ProjectManager.currentUser.projects().data.items["+i+"].data.dateCreated.toString()";
			proj.dateCreated = (String) js.executeScript(script);
			script = "return Teselagen.manager.ProjectManager.currentUser.projects().data.items["+i+"].data.dateModified.toString()";
			proj.dateModified = (String) js.executeScript(script);
			
			p.add(proj);
		}
		
		return p;
	}
	
	public static List<SequenceFileWrap> getSequencesOfProject(WebDriver driver, String jsProjVarName) {
		List<SequenceFileWrap> p = new ArrayList<SequenceFileWrap>();
		JavascriptExecutor js = (JavascriptExecutor) driver;
		String script = "return "+jsProjVarName+".sequencesStore.data.items.length";
		long length = (Long) js.executeScript(script);
		
		for(long i=0;i<length;i++) {
			SequenceFileWrap seq = new SequenceFileWrap();
			script = "return "+jsProjVarName+".sequencesStore.data.items["+i+"].data.id";
			seq.id = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".sequencesStore.data.items["+i+"].data.project_id";
			seq.project_id = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".sequencesStore.data.items["+i+"].data.part_id";
			seq.part_id = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".sequencesStore.data.items["+i+"].data.name";
			seq.name = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".sequencesStore.data.items["+i+"].data.sequenceFileFormat";
			seq.sequenceFileFormat = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".sequencesStore.data.items["+i+"].data.sequenceFileContent";
			seq.sequenceFileContent = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".sequencesStore.data.items["+i+"].data.hash";
			seq.hash = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".sequencesStore.data.items["+i+"].data.partSource";
			seq.partSource = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".sequencesStore.data.items["+i+"].data.sequenceFileName";
			seq.sequenceFileName = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".sequencesStore.data.items["+i+"].data.firstTimeImported";
			seq.firstTimeImported = (Boolean) js.executeScript(script);
			
			p.add(seq);
		}
		
		return p;
	}
	
	public static List<DeviceDesignWrap> getDesignsOfProject(WebDriver driver, String jsProjVarName) {
		List<DeviceDesignWrap> p = new ArrayList<DeviceDesignWrap>();
		JavascriptExecutor js = (JavascriptExecutor) driver;
		String script = "return "+jsProjVarName+".designsStore.data.items.length";
		long length = (Long) js.executeScript(script);
		
		for(long i=0;i<length;i++) {
			DeviceDesignWrap des = new DeviceDesignWrap();
			script = "return "+jsProjVarName+".designsStore.data.items["+i+"].data.id";
			des.id = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".designsStore.data.items["+i+"].data.project_id";
			des.project_id = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".designsStore.data.items["+i+"].data.name";
			des.name = (String) js.executeScript(script);
			
			p.add(des);
		}
				
		return p;
	}
	
	public static List<FeatureWrap> getFeaturesOfSequenceFile(WebDriver driver, String jsSeqVarName) {
		List<FeatureWrap> p = new ArrayList<FeatureWrap>();
		JavascriptExecutor js = (JavascriptExecutor) driver;
		String script = "var gb = Teselagen.bio.parsers.GenbankManager.parseGenbankFile("+jsSeqVarName+".data.sequenceFileContent);" +
				"var seqMgr = Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);" +
				"var features = seqMgr.config.features;" +
				"var a = new Array();" +
				"for(var i=0;i<features.length;i++) {" +
					"a[i] = new Array();" +
					"a[i][0] = features[i].getName();" +
					"a[i][1] = features[i].getType();" +
					"a[i][2] = features[i].getStart();" +
					"a[i][3] = features[i].getEnd();" +
					"a[i][4] = features[i].getStrand();" +
					"a[i][5] = features[i].getIndex();" +
					"a[i][6] = new Array();" +
					"a[i][7] = new Array();" +
					"a[i][8] = new Array();" +
					"var c = features[i].getNotes();" +
					"for(var j=0;j<c.length;j++) {" +
						"a[i][6][j] = c[j].getName();" +
						"a[i][7][j] = c[j].getValue();" +
						"a[i][8][j] = c[j].getQuoted();" +
					"}" +
				"}" +
				"return a;";
		List<Object> r = (List<Object>) js.executeScript(script);
		for(int i=0;i<r.size();i++) {
			FeatureWrap f = new FeatureWrap();
			List<Object> w = (List<Object>) r.get(i);
			f.name = (String) w.get(0);
			f.type = (String) w.get(1);
			f.start = (Long) w.get(2);
			f.end = (Long) w.get(3);
			f.strand = (Long) w.get(4);
			f.index = (Long) w.get(5);
			
			List<Object> u1 = (List<Object>) w.get(6);
			List<Object> u2 = (List<Object>) w.get(7);
			List<Object> u3 = (List<Object>) w.get(8);
			int nl = u1.size();
			for(int j=0;j<nl;j++) {
				FeatureNoteWrap n = new FeatureNoteWrap();
				n.name = (String) u1.get(j);
				n.value = (String) u2.get(j);
				n.quoted = (Boolean) u3.get(j);
				f.notes.add(n);
			}
			p.add(f);
		}
		
		return p;
	}
	
	public static List<ProjectWrap> getProjectTreeOfCurrentUser(WebDriver driver) {
		List<ProjectWrap> p = new ArrayList<ProjectWrap>();
		JavascriptExecutor js = (JavascriptExecutor) driver;
		String script = "return Teselagen.manager.ProjectManager.currentUser.projects().data.items.length";
		long length = (Long) js.executeScript(script);
		
		for(long i=0;i<length;i++) {
			ProjectWrap proj = new ProjectWrap();
			String jsProjVarName = "Teselagen.manager.ProjectManager.currentUser.projects().data.items["+i+"]";
			script = "return "+jsProjVarName+".data.id";
			proj.id = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".data.user_id";
			proj.user_id = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".data.name";
			proj.name = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".data.dateCreated.toString()";
			proj.dateCreated = (String) js.executeScript(script);
			script = "return "+jsProjVarName+".data.dateModified.toString()";
			proj.dateModified = (String) js.executeScript(script);
			
			proj.designs = ProjectJs.getDesignsOfProject(driver, jsProjVarName);
			
			proj.sequences = ProjectJs.getSequencesOfProject(driver, jsProjVarName);
			for(int j=0;j<proj.sequences.size();j++) {
				String jsSeqVarName = jsProjVarName+".sequencesStore.data.items["+j+"]";
				proj.sequences.get(j).features = ProjectJs.getFeaturesOfSequenceFile(driver, jsSeqVarName);
			}
			
			p.add(proj);
		}
		
		return p;
	}
	
	
	
	
	
	
	
}// END OF CLASS















