package testing;

import java.awt.event.KeyEvent;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

import com.google.common.collect.Maps;
import com.google.common.io.Files;
import com.thoughtworks.selenium.*;

import elements.*;
import utils.*;
import utils.js.*;
import wraps.js.*;

public class Test01 {
	
	public static void main(String[] args) throws InterruptedException {				
		
		
		
		
		//" x-tree-elbow-img x-tree-elbow-plus x-tree-expander"
		//" x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander"
		
		
    	System.setProperty("webdriver.chrome.driver", "/Users/mmatena/bin/chromedriver");
		WebDriver driver = new ChromeDriver();
    	//WebDriver driver = new CustomChromeDriver();
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.manage().timeouts().setScriptTimeout(30, TimeUnit.SECONDS);
		Runtime.getRuntime().addShutdownHook(new TerminationThread(driver));		
		
		NavUtils.goToLocalSite(driver);
		//NavUtils.goToProductionSite(driver);
		NavUtils.logIn(driver,"testSpam001", "");
		/*javax.swing.SwingUtilities.invokeLater(new Runnable() {
	        public void run() {
	        	FindElementGUI.createAndShowGUI(driver);
	        }
    	});*/
		JsUtils.appendJsErrorToBodyAttr(driver);
		
		
		NavUtils.openSequence(driver, "Project 0", "Seq3");
		
		//PieUtils.clickOnFeature(driver, "hhth", "misc_feature", 38, 167);
		//PieUtils.rightClickOnFeature(driver, "hhth", "misc_feature", 38, 167);
		//PieUtils.rightClickOnFeature(driver, "hhth", "misc_feature", 38, 167);
		//PieUtils.contextMenuClickOnFeature(driver, "ghj");
		//PieUtils.contextMenuClickOnFeature(driver, "ghj");
		Thread.sleep(5000);
		System.out.println(PieUtils.isMapCaretVisible(driver));
		
		
		//String s1 = PieUtils.getPieName(driver);
		//String s2 = PieUtils.getPieBpText(driver);
		//String s3 = NavUtils.getSelectedProjectPanelRowText(driver);
			
		//System.out.println(s1);
		//System.out.println(s2);
		//System.out.println(s3);*
		
		
		//NavUtils.openDesign(driver, "Project 0", "Des2");
		//NavUtils.openDesign(driver, "Project 0", "Des 2");
		//DeUtils.clickOnGrid(driver, 0, 0);
		//DeUtils.insertColumnRight(driver, 0, 0);
		//DeUtils.clickSaveMenuItem(driver);
		//DeUtils.clickRenameDesignMenuItem(driver, "ytty45");
		//DeUtils.clickPartsBarItem(driver, "CDS");
		//DeUtils.clickPartsBarItem(driver, "CDS");
		
		//DeUtils.doubleClickOnGrid(driver, 0, 1);
		//NavUtils.switchTabs(driver, "de", "Des2");
		
		/*List<Long> ls = new ArrayList<Long>();
		for(int i=0;i<30;i++) {
			long start = System.nanoTime();
			//NavUtils.createNewProject(driver, "Project "+i);
			NavUtils.waitForMainAppPanelToUnmask(driver);
			NavUtils.createNewSequence(driver, "Project 1", "q"+i);			
			ls.add(System.nanoTime()-start);
			//NavUtils.createNewSequence(driver, "Project", "q"+i);
		}
		
		for(Long i : ls) {
			System.out.println(i);
		}*/
		
		
		/*for(int i=0;i<100;i++) {
			DeUtils.insertColumnRight(driver, 0, 0);
		}*/
		
		
		//VeUtils.clickAndUseSelectMenuItem(driver, "30", "1000");
		
		
		/*for(int i=0;i<10000;i++) {
			//VeUtils.clickAndUseCreateNewFeatureMenuItem(driver, "dslfjdasjfjklasdjkflkjdsajlfljsdg", -1);			
			SelUtil.click(SelUtil.findElement(driver, By.id("zoomInMenuItem")));
		}*/

		
		/*for(int i=11;i<100;i++) {
			for(int j=0;j<20;j++) {
				NavUtils.waitForMainAppPanelToUnmask(driver);
				NavUtils.createNewSequence(driver, "Project "+i, "Seq"+j);
				NavUtils.waitForMainAppPanelToUnmask(driver);
				NavUtils.createNewSequence(driver, "Project "+i, "Seq "+j);
			}
		}*/
		
		/*List<ProjectWrap> projects = ProjectJs.getProjectTreeOfCurrentUser(driver);
		for(int i=0;i<projects.size();i++) {
			System.out.println(projects.get(i).name);
			for(int j=0;j<projects.get(i).sequences.size();j++) {
				System.out.println("\t"+projects.get(i).sequences.get(j).name);
				for(int k=0;k<projects.get(i).sequences.get(j).features.size();k++) {
					System.out.println("\t\t"+projects.get(i).sequences.get(j).features.get(k).toString());
				}
			}
		}*/
		
		
		
		/*List<SequenceFileWrap> sequences = ProjectJs.getSequencesOfProject(driver, "Teselagen.manager.ProjectManager.currentUser.projects().data.items[4]");
		
		for(int i=0;i<sequences.size();i++) {
			System.out.println(sequences.get(i).name);
		}*/
		
		
		/*List<FeatureWrap> q = ProjectJs.getFeaturesOfSequenceFile(driver, "Teselagen.manager.ProjectManager.workingSequence");
		for(int i=0;i<q.size();i++) {
			System.out.println(q.get(i).toString());
		}*/
		
		
		/*
		NavUtils.openSequence(driver, "Project 0", "Seq3");
		
		Thread.sleep(5000);
		
		
		List<DeviceDesignWrap> designs = ProjectJs.getDesignsOfProject(driver, "Teselagen.manager.ProjectManager.currentUser.projects().data.items[4]");
		for(int i=0;i<designs.size();i++) {
			System.out.println(designs.get(i).name);
		}
		*/
		
		/*List<SequenceFileWrap> sequences = ProjectJs.getSequencesOfProject(driver, "Teselagen.manager.ProjectManager.currentUser.projects().data.items[4]");
		for(int i=0;i<sequences.size();i++) {
			System.out.println(sequences.get(i).name);
		}*/	
		
		/*List<ProjectWrap> projects = ProjectJs.getCurrentUserProjects(driver);
		for(int i=0;i<projects.size();i++) {
			System.out.println(projects.get(i).name);
		}*/
		
		
		
		
		/*
		UserWrap proj = ProjectJs.getCurrentUser(driver);
		System.out.println(proj.id);
		System.out.println(proj.preferences_id);
		System.out.println(proj.username);
		*/
		
		//SequenceFileWrap seq = ProjectJs.getWorkingSequence(driver);
		//System.out.println(seq.name);
		//System.out.println(seq.firstTimeImported);
		
		//System.out.println(ProjectJS.getProjectTree(driver).getClass().toString());
		
		//System.out.println(s.getClass().toString());
		
		
		
		
		
		
		
		//NavUtils.toggleExpansionOfProject(driver, "Project 88");
		//NavUtils.toggleExpansionOfProject(driver, "Project 88");
		//NavUtils.openSequence(driver, "Project 0", "Seq3");
		//NavUtils.openDesign(driver, "Project 0", "Des12");
		//NavUtils.openSequence(driver, "Project 0", "Seq 4");
		//NavUtils.openSequence(driver, "Project 1", "Seq3");
		//Thread.sleep(5000);
		//NavUtils.openDesign(driver, "Project 1", "Seq3");
		
		
		
		
		//NavUtils.toggleExpansionOfProject(driver, "Project 1");
		//NavUtils.createNewSequence(driver, "Project 2", "000000000jdfjdfadf");
		//NavUtils.createNewDesign(driver, "Project 2", "a");
		//NavUtils.createNewProject(driver, "h67gggggg");

		
		/*for(int i=0;i<100;i++) {
			for(int j=0;j<20;j++) {
				NavUtils.createNewSequence(driver, "Project "+i, "Seq"+j);
				NavUtils.createNewSequence(driver, "Project "+i, "Seq "+j);
				NavUtils.createNewDesign(driver, "Project "+i, "Des"+j);
				NavUtils.createNewDesign(driver, "Project "+i, "Des "+j);
				NavUtils.createNewSequence(driver, "Project "+i, "S"+j);
				
			}
		}*/
		
		/*for(int i=0;i<100;i++) {
			for(int j=11;j<20;j++) {
				NavUtils1.createNewSequence(driver, "Project "+i, "Seq"+j);
				NavUtils1.createNewSequence(driver, "Project "+i, "Seq "+j);
				//NavUtils1.createNewDesign(driver, "Project "+i, "Des"+j);
				//NavUtils1.createNewDesign(driver, "Project "+i, "Des "+j);
				NavUtils1.createNewSequence(driver, "Project "+i, "S"+j);
			}
		}*/
		
		
		
		
		/*NavUtils.createNewProject(driver, "452");
		NavUtils.createNewProject(driver, "654g654g756");
		NavUtils.createNewProject(driver, "e67g67f");
		NavUtils.createNewProject(driver, "34");
		
		NavUtils.createNewSequence(driver, "t", "34");*/
		
		
		//driver.findElement(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander']")).click();
		
		
		/*for(int i=0;i<100;i++) {
			//NavUtils.createNewProject(driver, "Project "+i);
			for(int j=0;j<20;j++) {
				NavUtils2.createNewSequence(driver, "Seq"+j, "Project "+i);
				NavUtils2.createNewSequence(driver, "Seq "+j, "Project "+i);
				//NavUtils.createNewDesign(driver, "Des"+j, "Project "+i);
				//NavUtils.createNewDesign(driver, "Des "+j, "Project "+i);
				NavUtils2.createNewSequence(driver, "S"+j, "Project "+i);
				
			}
		}*/
		
		
		
		
		//NavUtils.createNewDesign(driver, "New Design", "34");
		//NavUtils.openSequence(driver, "t", "34");
		//NavUtils.openDesign(driver, "t", "34");
		
		//NavUtils.toggleExpansionOfProject(driver, "a", true);
		//NavUtils.createNewDesign(driver, "New Design", "b");
		
		//NavUtils.openSequence(driver, "s", "e67g67f");
		
		//NavUtils.createNewSequence(driver, "trse", "project_1");
		
		//NavUtils.toggleExpansionOfProject(driver, "New Project", true);
		//NavUtils.toggleExpansionOfProject(driver, "New Project", true);
		
		
		
		
		//driver.findElement(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander']")).click();
		//ProjectPanel projPan = new ProjectPanel(driver);
		//projPan.findProject("project1", true).click();
		
	}

}
