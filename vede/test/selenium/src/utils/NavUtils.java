package utils;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.*;

/**
 * Most (if not all) of the methods here were developed for the 
 * production site (http://production.teselagen.com/) and may or 
 * may not work on other sites. Additionally most (if not all) of
 * the methods here were developed for the Chrome driver.
 * @author Michael Matena
 *
 */
public class NavUtils {
	
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
		SelUtil.findElement(driver, By.id("auth-username-field-inputEl")).clear();
		SelUtil.findElement(driver, By.id("auth-username-field-inputEl")).sendKeys(username);
		
		SelUtil.findElement(driver, By.id("auth-password-field-inputEl")).clear();
		SelUtil.findElement(driver, By.id("auth-password-field-inputEl")).sendKeys(password);
		
		SelUtil.click(SelUtil.findElement(driver, By.id("auth-login-btn-btnIconEl")));
	}
	
	/**
	 * Expands the first project in the project panel by name.
	 * @param driver WebDriver.
	 * @param name Name of project.
	 */
	public static void toggleExpansionOfProject(WebDriver driver, String name) {
		String s = "//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander' or" +
				"@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']/parent::*/span[text()='"+name+"']";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	/* * 	$$$ NEEDS REFACTOR $$$
	 * Expands projects in project panel by index.
	 * @param driver WebDriver.
	 * @param index Index of project.
	 */
	/*public static void toggleExpansionOfProject(WebDriver driver, int index) {
		List<WebElement> items = SelUtil.findElements(driver, By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander']"));
		items.addAll(SelUtil.findElements(driver, By.xpath("//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']")));
		int i = 0;
		for (WebElement w : items) {		
			if(i==index) w.click();
			i++;
		}
	}*/
	
	/**
	 * Creates new project with name.
	 * @param driver WebDriver.
	 * @param name What to name new project.
	 */
	public static void createNewProject(WebDriver driver, String name) {
		SelUtil.click(SelUtil.findElement(driver, By.xpath("//div[@id='ProjectPanel']//tr")));	
		
		String windowStr = "//div[@class='x-window x-message-box x-layer x-window-default x-closable x-window-closable x-window-default-closable x-border-box']";
		SelUtil.findElement(driver, By.xpath(windowStr+"//input")).clear();
		SelUtil.findElement(driver, By.xpath(windowStr+"//input")).sendKeys(name);
		
		SelUtil.click(SelUtil.findElement(driver, By.xpath(windowStr+"//*[@class='x-btn-button']/span[text()='OK']/parent::*/span[@role='img']")));
	}
	/*
	 * Maybe add open "create new project window" and then hit "cancel button" and/or "close button".
	 */
	
	/**
	 * Attempts to create a new sequence. If a sequence with the
	 * name already exists in the chosen project, this method hits the
	 * cancel button in the window that shows up.
	 * @param driver WebDriver.
	 * @param projectName Under what project to create the new sequence.
	 * @param sequenceName What to name sequence.
	 */
	public static void createNewSequence(WebDriver driver, String projectName, String sequenceName) {	
		// Figure out if the project is expanded and expand it if necessary.
		int oldProjectPanelLength = SelUtil.findElements(driver, By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		NavUtils.toggleExpansionOfProject(driver, projectName);
		int newProjectPanelLength = SelUtil.findElements(driver, By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		if(newProjectPanelLength<oldProjectPanelLength) NavUtils.toggleExpansionOfProject(driver, projectName);
			
		String newSeqBtnStr = "//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander' or" +
				"@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']/parent::*/span[text()='"+projectName+"']" +
				"/parent::*/parent::*/parent::*/following-sibling::*[2]";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(newSeqBtnStr)));
		
		String windowStr = "//div[@class='x-window x-message-box x-layer x-window-default x-closable x-window-closable x-window-default-closable x-border-box']";
		SelUtil.findElement(driver, By.xpath(windowStr+"//input")).clear();
		SelUtil.findElement(driver, By.xpath(windowStr+"//input")).sendKeys(sequenceName);
		
		SelUtil.click(SelUtil.findElement(driver, By.xpath(windowStr+"//*[@class='x-btn-button']/span[text()='OK']/parent::*/span[@role='img']")));
		
		if (SelUtil.findElement(driver, By.cssSelector(".x-window.x-message-box.x-layer")).getText().contains(NavUtils.NEW_SEQUENCE_ALREADY_EXISTS_TXT)) {
			SelUtil.click(SelUtil.findElement(driver, By.xpath(windowStr+"//*[@class='x-btn-button']/span[text()='Cancel']/parent::*/span[@role='img']")));
		}
	}
	
	/**
	 * Attempts to create a new design. If a design with the
	 * name already exists in the chosen project, this method hits the
	 * cancel button in the window that shows up.
	 * @param driver WebDriver.
	 * @param projectName Under what project to create the new design.
	 * @param designName What to name design.
	 */
	public static void createNewDesign(WebDriver driver, String projectName, String designName) {		
		// Figure out if the project is expanded and expand it if necessary.
		int oldProjectPanelLength = SelUtil.findElements(driver, By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		NavUtils.toggleExpansionOfProject(driver, projectName);
		int newProjectPanelLength = SelUtil.findElements(driver, By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		if(newProjectPanelLength<oldProjectPanelLength) NavUtils.toggleExpansionOfProject(driver, projectName);
			
		String newDesBtnStr = "//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander' or" +
				"@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']/parent::*/span[text()='"+projectName+"']" +
				"/parent::*/parent::*/parent::*/following-sibling::*[1]";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(newDesBtnStr)));
		
		String windowStr = "//div[@class='x-window x-message-box x-layer x-window-default x-closable x-window-closable x-window-default-closable x-border-box']";
		SelUtil.findElement(driver, By.xpath(windowStr+"//input")).clear();
		SelUtil.findElement(driver, By.xpath(windowStr+"//input")).sendKeys(designName);
		//SelUtil.clear(SelUtil.findElement(driver, By.xpath(windowStr+"//input")));
		//SelUtil.sendKeys(SelUtil.findElement(driver, By.xpath(windowStr+"//input")), designName);
		
		SelUtil.click(SelUtil.findElement(driver, By.xpath(windowStr+"//*[@class='x-btn-button']/span[text()='OK']/parent::*/span[@role='img']")));
		
		if (SelUtil.findElement(driver, By.cssSelector(".x-window.x-message-box.x-layer")).getText().contains(NavUtils.NEW_DESIGN_ALREADY_EXISTS_TXT)) {
			SelUtil.click(SelUtil.findElement(driver, By.xpath(windowStr+"//*[@class='x-btn-button']/span[text()='Cancel']/parent::*/span[@role='img']")));
		}
	}
	
	public static void openSequence(WebDriver driver, String projectName, String sequenceName) {		
		int oldProjectPanelLength = SelUtil.findElements(driver, By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		NavUtils.toggleExpansionOfProject(driver, projectName);
		int newProjectPanelLength = SelUtil.findElements(driver, By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		if(newProjectPanelLength<oldProjectPanelLength) NavUtils.toggleExpansionOfProject(driver, projectName);
		int numOfItmsInProj = Math.abs(newProjectPanelLength-oldProjectPanelLength);
		
		String s = "//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander' or" +
				"@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']/parent::*/span[text()='"+projectName+"']" +
				"/parent::*/parent::*/parent::*/following-sibling::*[position()<"+numOfItmsInProj+"]//div/span[text()='"+sequenceName+"']" +
				"/parent::*/img[position()=2 and @class!=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander' and " +
				"@class!=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));	
	}
	
	public static void openDesign(WebDriver driver, String projectName, String designName) {
		int oldProjectPanelLength = SelUtil.findElements(driver, By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		NavUtils.toggleExpansionOfProject(driver, projectName);
		int newProjectPanelLength = SelUtil.findElements(driver, By.xpath("//div[@id='ProjectPanel']//tbody//div")).size();
		if(newProjectPanelLength<oldProjectPanelLength) NavUtils.toggleExpansionOfProject(driver, projectName);
		int numOfItmsInProj = Math.abs(newProjectPanelLength-oldProjectPanelLength);
		
		String s = "//div[@id='ProjectPanel']//tbody//div/img[@class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander' or" +
				"@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']/parent::*/span[text()='"+projectName+"']" +
				"/parent::*/parent::*/parent::*/following-sibling::*[position()<"+numOfItmsInProj+"]//div" +
				"/img[position()=2 and @class=' x-tree-elbow-img x-tree-elbow-plus x-tree-expander' or " +
				"@class=' x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander']/parent::*/span[text()='"+designName+"']";
		//System.out.println(s);
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	public static void waitForMainAppPanelToUnmask(WebDriver driver) {
		driver.manage().timeouts().implicitlyWait(0, TimeUnit.SECONDS);
		driver.manage().timeouts().setScriptTimeout(0, TimeUnit.SECONDS);
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		boolean b = true;
		while(b&&(currentTime-startTime)<SelUtil.timeOutMilis) {
			String s = "#mainAppPanel-body>.x-masked.x-tabpanel-child";
			boolean c = false;
			try {
				driver.findElement(By.cssSelector(s));
			} catch ( StaleElementReferenceException ser ) {
				c = true;
		    } catch ( NoSuchElementException nse ) {
		    	c = true;
		    } catch (WebDriverException e) {
		    	c = true;
		    } catch ( Exception e ) {
		    	c = true;
		    } finally {
	    	if(c) break;
		    }
			/*JavascriptExecutor js = (JavascriptExecutor) driver;
			String script = "return Ext.getCmp('mainAppPanel').getActiveTab().el.isMasked();";
			b = (Boolean) js.executeScript(script);*/
			currentTime = System.currentTimeMillis();
		}
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.manage().timeouts().setScriptTimeout(30, TimeUnit.SECONDS);
	}
	
	/**
	 * 
	 * @param driver
	 * @param name Either name of design or "Vector Editor"
	 */
	public static void switchTabs(WebDriver driver, String type, String name) {
		String s = "";
		if(type=="Vector Editor"||type=="ve"||type=="VE"||type=="Ve") {
			s = "//div[@id='mainAppPanel']/div[starts-with(@id,'tabbar-')]" +
					"//span[text()='Vector Editor']";
		} else if(type=="Device Editor"||type=="de"||type=="DE"||type=="De") {
			s = "//div[@id='mainAppPanel']/div[starts-with(@id,'tabbar-')]" +
					"//span[text()='Device Editor | "+name+"']";
		} else if (type=="j5"||type=="J5") {
			s = "//div[@id='mainAppPanel']/div[starts-with(@id,'tabbar-')]" +
					"//span[text()='"+name+" j5 Report']";
		}
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	public static String getSelectedProjectPanelRowText(WebDriver driver) {
		String s = "#ProjectPanel tbody>tr.x-grid-row-selected span.x-tree-node-text";
		return SelUtil.findElement(driver, By.cssSelector(s)).getText();
	}
	
	
	
	
}// END OF CLASS














