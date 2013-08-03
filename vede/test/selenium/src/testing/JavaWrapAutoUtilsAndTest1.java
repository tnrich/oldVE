package testing;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class JavaWrapAutoUtilsAndTest1 {

	public static String deserializeString(File file) throws IOException {
		int len;
		char[] chr = new char[4096];
		final StringBuffer buffer = new StringBuffer();
		final FileReader reader = new FileReader(file);
		try {
		    while ((len = reader.read(chr)) > 0) {
		        buffer.append(chr, 0, len);
		    }
		} finally {
		    reader.close();
		}
		return buffer.toString();
    }
	
	public static String process01(String s) {
		String w = s;	    
		
		
		String regex = "(?m)^\\Q{name: \"\\E";
		s = s.replaceAll(regex, "");
		
		regex = "(?m)\\Q\",\\E.*$";
		s = s.replaceAll(regex, ";");
		String[] as = s.split("\n");
	    
	    
	    regex = "(?m)^.*?\\Qtype: \"\\E";
		w = w.replaceAll(regex, "");
		
		regex = "(?m)\\Q\",\\E.*$";
		w = w.replaceAll(regex, "");
		String[] aw = w.split("\n");        
        
		String r = "";
		for(int i=0;i<as.length;i++) {
			String x = aw[i];
			if(x.equals("Float")) x="double";
			else if(x.equals("Boolean")) x="boolean";
			else if(x.equals("string")) x="String";
			r += "public "+x+" "+as[i]+"\n";	
		}
		
		return r;
	}
	
	public static String process02(String s) {		
		
		String regex = "(?m)^\\s*?\\Qname: \"\\E";
		s = s.replaceAll(regex, "#");
		
		regex = "(?m)\\Q\",\\E.*$";
		s = s.replaceAll(regex, ";");
		
		String[] as = s.split("\n");
	    
		String r = "";
		for(int i=0;i<as.length;i++) {
			String x = as[i];
			if(x.startsWith("#")) {
				r += "public double "+x.substring(1)+"\n";
			}
		}
		
		return r;
	}
	
	public static String process03(String s, String jsExecutorVarName, String scriptVarName, String javaAnalogVarName, String jsAnalogVarName) {		
		String r = "";
		String w = s;
		//System.out.print(s);

		
		String regex = "(?m)^public ";
		s = s.replaceAll(regex, "");
		
		regex = "(?m)\\s{1}?\\S+?\\Q;\\E$";
		s = s.replaceAll(regex, "");
		String[] as = s.split("\n");
		
		
		regex = "(?m)^public \\S+? ";
		w = w.replaceAll(regex, "");
		
		regex = "(?m);$";
		w = w.replaceAll(regex, "");		
		String[] aw = w.split("\n");     
		
		
		for(int i=0;i<as.length;i++) {
			String x = as[i];
			if(x.equals("double")) x="Double";
			else if(x.equals("boolean")) x="Boolean";
			else if(x.equals("int")) x="Integer";
			else if(x.equals("float")) x="Float";
			
			r += scriptVarName+" = \"return "+jsAnalogVarName+"."+aw[i]+"\";\n";
			r += javaAnalogVarName+"."+aw[i]+" = ("+x+") "+jsExecutorVarName+".executeScript("+scriptVarName+");\n";
		}
		
		return r;
	}

	public static void main(String[] args) throws InterruptedException {
		File file = new File("/Users/mmatena/Desktop/delLater001.txt");
	    String s = "";
	    try {s = JavaWrapAutoUtilsAndTest1.deserializeString(file);}
	    catch (IOException e) {e.printStackTrace();} 
	    //System.out.println(s);
		
	    System.out.println(s.replaceAll("\n", ", "));
	    
	    //System.out.print(JavaWrapAutoUtilsAndTest1.process03(s,"js","script","user","Teselagen.manager.ProjectManager.currentUser.data"));
		
		s = "";
		for(int i=1;i<=100;i++) {
			s+=i+", ";
		}
		System.out.println(s);
		
		
		
	}
	
	
	
	
}

















