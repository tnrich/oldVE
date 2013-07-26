package utils;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.*;

/**
 * Most (if not all) of the methods here were developed for the 
 * production site (http://production.teselagen.com/) and may or 
 * may not work on other sites. Additionally most (if not all) of
 * the methods here were developed for the Chrome driver.
 * @author Michael Matena
 *
 */
public class NavUtils0 {
	
	private final static String NEW_SEQUENCE_ALREADY_EXISTS_TXT = "A sequence with this name already exists in this project. Please enter another name:";
	private final static String NEW_DESIGN_ALREADY_EXISTS_TXT = "A design with this name already exists in this project. Please enter another name:";
	
	/**
	 * Goes to "http://production.teselagen.com/".
	 * Requires manual login.
	 */
	public static void goToProductionSite(WebDriver driver) {
		driver.get("http://production.teselagen.com/");
	}
	
	/**
	 * Goes to "http://teselagen.production/".
	 */
	public static void goToLocalProductionSite(WebDriver driver) {
		driver.get("http://teselagen.production/");
	}
	
	/**
	 * Goes to "http://teselagen.local/".
	 */
	public static void goToLocalSite(WebDriver driver) {
		driver.get("http://teselagen.local/");
	}
	
	/**
	 * Logs in once site has been loaded.
	 * (Not the Username=dev Password=dev#rocks login)
	 * @param driver WebDriver.
	 * @param username Username.
	 * @param password Password.
	 */
	public static void logIn(WebDriver driver, String username, String password) {
		driver.findElement(By.id("auth-username-field-inputEl")).clear();
		driver.findElement(By.id("auth-username-field-inputEl")).sendKeys(username);
		
		driver.findElement(By.id("auth-password-field-inputEl")).clear();
		driver.findElement(By.id("auth-password-field-inputEl")).sendKeys(password);
		
		driver.findElement(By.id("auth-login-btn-btnIconEl")).click();
	}
	
	/**
	 * Expands projects in project panel by name.
	 * @param driver WebDriver.
	 * @param name Name of project.
	 * @param all Whether or not to open all projects by that name or just the first.
	 */
	public static void toggleExpansionOfProject(WebDriver driver, String name, boolean all) {
		List<WebElement> items = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander']"));
		items.addAll(driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']")));
		for (WebElement w : items) {
			if(w.findElement(By.xpath("../span")).getAttribute("innerHTML").equals(name)) {			
				w.click();
				if(!all) return;
			}
		}
	}
	
	/**
	 * Expands projects in project panel by index.
	 * @param driver WebDriver.
	 * @param index Index of project.
	 */
	public static void toggleExpansionOfProject(WebDriver driver, int index) {
		List<WebElement> items = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander']"));
		items.addAll(driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']")));
		int i = 0;
		for (WebElement w : items) {		
			if(i==index) w.click();
			i++;
		}
	}
	
	/**
	 * Creates new project with name.
	 * @param driver WebDriver.
	 * @param name What to name new project.
	 */
	public static void createNewProject(WebDriver driver, String name) {
		driver.findElement(By.xpath("//div[@id='ProjectPanel']//tr")).click();	
		
		WebElement window = driver.findElement(By.cssSelector(".x-window.x-message-box.x-layer"));
		
		window.findElement(By.xpath("//input")).clear();
		window.findElement(By.xpath("//input")).sendKeys(name);
		
		List<WebElement> items = window.findElements(By.cssSelector(".x-btn-button"));
		for (WebElement w : items) {
			if(w.findElement(By.xpath("./span")).getAttribute("innerHTML").equals("OK")) {
				w.findElement(By.xpath("./span[@role='img']")).click();
			}
		}
	}
	
	/*
	 * Maybe add open "create new project window" and then hit "cancel button" and/or "close button".
	 */
	
	/**
	 * Attempts to create a new sequence. If a sequence with the
	 * name already exists in the chosen project, this method hits the
	 * cancel button in the window that shows up.
	 * @param driver WebDriver.
	 * @param sequenceName What to name sequence.
	 * @param projectName Under what project to create the new sequence.
	 */
	public static void createNewSequence(WebDriver driver, String sequenceName, String projectName) {		
		List<WebElement> projectPanelItems = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div"));
		List<WebElement> projectPanelProjects = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander']"));
		projectPanelProjects.addAll(driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']")));
		int oldProjectPanelLength = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		int idx = -99;
		for (WebElement w : projectPanelProjects) {
			if(w.findElement(By.xpath("../span")).getAttribute("innerHTML").equals(projectName)) {			
				int wIdx = projectPanelItems.indexOf(w.findElement(By.xpath("..")));
				if (wIdx!=-1) {
					idx = wIdx;
					w.click();			
					break;
				}
			}
		}		
		if(idx<0) {
			System.err.println("ERROR: No project with the name '"+projectName+"' found.");
			return;
		}
				
		int newProjectPanelLength = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		if(newProjectPanelLength<oldProjectPanelLength) NavUtils0.toggleExpansionOfProject(driver, projectName, false);
		
		
		driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).get(idx+2).click();
		
		WebElement window = driver.findElement(By.cssSelector(".x-window.x-message-box.x-layer"));
		window.findElement(By.xpath("//input")).clear();
		window.findElement(By.xpath("//input")).sendKeys(sequenceName);
		
		List<WebElement> items = window.findElements(By.cssSelector(".x-btn-button"));
		for (WebElement w : items) {
			if(w.findElement(By.xpath("./span")).getAttribute("innerHTML").equals("OK")) {
				w.findElement(By.xpath("./span[@role='img']")).click();
			}
		}
		
		if (driver.findElement(By.cssSelector(".x-window.x-message-box.x-layer")).getText().contains(NavUtils0.NEW_SEQUENCE_ALREADY_EXISTS_TXT)) {
			window = driver.findElement(By.cssSelector(".x-window.x-message-box.x-layer"));
			items = window.findElements(By.cssSelector(".x-btn-button"));
			for (WebElement w : items) {
				if(w.findElement(By.xpath("./span")).getAttribute("innerHTML").equals("Cancel")) {
					w.findElement(By.xpath("./span[@role='img']")).click();
				}
			}
		}
	}
	
	/**
	 * Attempts to create a new design. If a design with the
	 * name already exists in the chosen project, this method hits the
	 * cancel button in the window that shows up.
	 * @param driver WebDriver.
	 * @param designName What to name design.
	 * @param projectName Under what project to create the new design.
	 */
	public static void createNewDesign(WebDriver driver, String designName, String projectName) {		
		List<WebElement> projectPanelItems = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div"));
		List<WebElement> projectPanelProjects = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander']"));
		projectPanelProjects.addAll(driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']")));
		int oldProjectPanelLength = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		int idx = -99;
		for (WebElement w : projectPanelProjects) {
			if(w.findElement(By.xpath("../span")).getAttribute("innerHTML").equals(projectName)) {			
				int wIdx = projectPanelItems.indexOf(w.findElement(By.xpath("..")));
				if (wIdx!=-1) {
					idx = wIdx;
					w.click();			
					break;
				}
			}
		}		
		if(idx<0) {
			System.err.println("ERROR: No project with the name '"+projectName+"' found.");
			return;
		}
				
		int newProjectPanelLength = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		if(newProjectPanelLength<oldProjectPanelLength) NavUtils0.toggleExpansionOfProject(driver, projectName, false);
		
		
		driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).get(idx+1).click();
		
		WebElement window = driver.findElement(By.cssSelector(".x-window.x-message-box.x-layer"));
		window.findElement(By.xpath("//input")).clear();
		window.findElement(By.xpath("//input")).sendKeys(designName);
		
		List<WebElement> items = window.findElements(By.cssSelector(".x-btn-button"));
		for (WebElement w : items) {
			if(w.findElement(By.xpath("./span")).getAttribute("innerHTML").equals("OK")) {
				w.findElement(By.xpath("./span[@role='img']")).click();
			}
		}
		
		if (driver.findElement(By.cssSelector(".x-window.x-message-box.x-layer")).getText().contains(NavUtils0.NEW_DESIGN_ALREADY_EXISTS_TXT)) {
			window = driver.findElement(By.cssSelector(".x-window.x-message-box.x-layer"));
			items = window.findElements(By.cssSelector(".x-btn-button"));
			for (WebElement w : items) {
				if(w.findElement(By.xpath("./span")).getAttribute("innerHTML").equals("Cancel")) {
					w.findElement(By.xpath("./span[@role='img']")).click();
				}
			}
		}
	}
	
	public static void openSequence(WebDriver driver, String sequenceName, String projectName) {
		List<WebElement> projectPanelItems = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div"));
		List<WebElement> projectPanelProjects = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander']"));
		projectPanelProjects.addAll(driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']")));
		int oldProjectPanelLength = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		int idx = -99;
		for (WebElement w : projectPanelProjects) {
			if(w.findElement(By.xpath("../span")).getAttribute("innerHTML").equals(projectName)) {			
				int wIdx = projectPanelItems.indexOf(w.findElement(By.xpath("..")));
				if (wIdx!=-1) {
					idx = wIdx;
					w.click();			
					break;
				}
			}
		}		
		if(idx<0) {
			System.err.println("ERROR: No project with the name '"+projectName+"' found.");
			return;
		}
		
		int newProjectPanelLength = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		if(newProjectPanelLength<oldProjectPanelLength) NavUtils0.toggleExpansionOfProject(driver, projectName, false);
		
		int numOfItmsInProj = Math.abs(newProjectPanelLength-oldProjectPanelLength)-2;
		if(numOfItmsInProj<=0) {
			System.err.println("ERROR: No sequences in the project '"+projectName+"' found.");
			return;
		}
		List<WebElement> seqAndDes = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).subList(idx+3, idx+3+numOfItmsInProj);
		System.out.println(seqAndDes.size());			
		for (WebElement w : seqAndDes) {
			if(w.findElement(By.xpath("./span")).getAttribute("innerHTML").equals(sequenceName) &&
					!w.findElement(By.xpath("./img[2]")).getAttribute("class").equals(" x-tree-elbow-img x-tree-elbow-plus x-tree-expander") &&
					!w.findElement(By.xpath("./img[2]")).getAttribute("class").equals(" x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander")) {
				w.click();
				return;
			}
		}
		System.err.println("ERROR: No sequence with the name '"+sequenceName+"' found in project '"+projectName+"'.");		
	}
	
	public static void openDesign(WebDriver driver, String designName, String projectName) {
		List<WebElement> projectPanelItems = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div"));
		List<WebElement> projectPanelProjects = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander']"));
		projectPanelProjects.addAll(driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']")));
		int oldProjectPanelLength = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		int idx = -99;
		for (WebElement w : projectPanelProjects) {
			if(w.findElement(By.xpath("../span")).getAttribute("innerHTML").equals(projectName)) {			
				int wIdx = projectPanelItems.indexOf(w.findElement(By.xpath("..")));
				if (wIdx!=-1) {
					idx = wIdx;
					w.click();			
					break;
				}
			}
		}		
		if(idx<0) {
			System.err.println("ERROR: No project with the name '"+projectName+"' found.");
			return;
		}
		
		int newProjectPanelLength = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		if(newProjectPanelLength<oldProjectPanelLength) NavUtils0.toggleExpansionOfProject(driver, projectName, false);
		
		int numOfItmsInProj = Math.abs(newProjectPanelLength-oldProjectPanelLength)-2;
		if(numOfItmsInProj<=0) {
			System.err.println("ERROR: No designs in the project '"+projectName+"' found.");
			return;
		}
		List<WebElement> seqAndDes = driver.findElements(By.xpath("//div[@id='ProjectPanel']//tbody//div")).subList(idx+3, idx+3+numOfItmsInProj);
		System.out.println(seqAndDes.size());			
		for (WebElement w : seqAndDes) {
			if(w.findElement(By.xpath("./span")).getAttribute("innerHTML").equals(designName) &&
					(w.findElement(By.xpath("./img[2]")).getAttribute("class").equals(" x-tree-elbow-img x-tree-elbow-plus x-tree-expander") ||
					w.findElement(By.xpath("./img[2]")).getAttribute("class").equals(" x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander"))) {
				w.click();
				return;
			}
		}
		System.err.println("ERROR: No design with the name '"+designName+"' found in project '"+projectName+"'.");		
	}
	
	
	
	
	
	
	
	
}// END OF CLASS














