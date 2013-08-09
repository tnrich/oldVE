package utils;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;

public class VeUtils {
	
	/**
	 * Clicks on the import button in the VE main menu toolbar.
	 * @param driver WebDriver.
	 */
	public static void clickImportBtn(WebDriver driver) {				
		SelUtil.click(SelUtil.findElement(driver, By.id("importBtn-button")));
	}
	
	/**
	 * Clicks on the circular view button in the VE main menu toolbar.
	 * @param driver WebDriver.
	 */
	public static void clickCircViewBtn(WebDriver driver) {		
		SelUtil.click(SelUtil.findElement(driver, By.id("circularViewBtn")));
	}
	
	/**
	 * Clicks on the linear view button in the VE main menu toolbar.
	 * @param driver WebDriver.
	 */
	public static void clickLinViewBtn(WebDriver driver) {		
		SelUtil.click(SelUtil.findElement(driver, By.id("linearViewBtn")));
	}
	
	/**
	 * Types the base pair abbreviations of the sequence into the annotate container.
	 * The sequence begins getting entered at the caret's current location. (I think.)
	 * @param driver WebDriver.
	 * @param sequence Base pair abbreviations of the sequence to by typed.
	 */
	public static void typeSequence(WebDriver driver, String sequence) {
		SelUtil.findElement(driver, By.id("AnnotateContainer")).sendKeys(sequence);
	}
	
	/**
	 * Clicks on the save button in the VE main menu toolbar.
	 * @param driver WebDriver.
	 */
	public static void clickSaveBtn(WebDriver driver) {
		String s = "//*[@id='VectorEditorMainMenuPanel']//a[contains(@class,' saveSequenceBtn ')]";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	/**
	 * Clicks on the "New Blank Vector Editor" menu item under the VE "File" menu.
	 * @param driver WebDriver.
	 */
	public static void clickNewBlankVectorEditorMenuItem(WebDriver driver) {		
		
		String s = "//*[@id='VectorEditorMainMenuPanel']//span[text()='File']/ancestor::a";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		SelUtil.click(SelUtil.findElement(driver, By.id("newBlankVectorEditorMenuItem")));
	}
	
	/**
	 * Clicks on the "Save As" menu item under the VE "File" menu.
	 * @param driver WebDriver.
	 */
	public static void clickSaveAsMenuItem(WebDriver driver) {		
		
		String s = "//*[@id='VectorEditorMainMenuPanel']//span[text()='File']/ancestor::a";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		SelUtil.click(SelUtil.findElement(driver, By.id("saveAsMenuItem")));
	}
	
	/**
	 * Clicks on the "Select..." menu item under the VE "Edit" menu.
	 * @param driver WebDriver.
	 */
	public static void clickSelectMenuItem(WebDriver driver) {
		String s = "//*[@id='VectorEditorMainMenuPanel']//span[text()='Edit']/ancestor::a";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		SelUtil.click(SelUtil.findElement(driver, By.id("selectMenuItem")));
	}
	
	/**
	 * Clicks on the "Select..." menu item under the VE "Edit" menu.
	 * @param driver WebDriver.
	 * @param from 
	 * @param to
	 */
	public static void clickAndUseSelectMenuItem(WebDriver driver, String from, String to) {
		String s = "//*[@id='VectorEditorMainMenuPanel']//span[text()='Edit']/ancestor::a";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		SelUtil.click(SelUtil.findElement(driver, By.id("selectMenuItem")));
		
		s = "//*[@id='selectWindowFromField']//input";
		SelUtil.findElement(driver, By.xpath(s)).clear();
		SelUtil.findElement(driver, By.xpath(s)).sendKeys(from);
		
		s = "//*[@id='selectWindowToField']//input";
		SelUtil.findElement(driver, By.xpath(s)).clear();
		SelUtil.findElement(driver, By.xpath(s)).sendKeys(to);
		
		SelUtil.click(SelUtil.findElement(driver, By.id("selectWindowOKButton")));
	}
	
	/**
	 * Clicks on the "Annotate as New Sequence Feature" menu item under the VE "Edit" menu.
	 * @param driver WebDriver.
	 */
	public static void clickAndUseCreateNewFeatureMenuItem(WebDriver driver, String name, int strand) {
		String s = "//*[@id='VectorEditorMainMenuPanel']//span[text()='Edit']/ancestor::a";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		SelUtil.click(SelUtil.findElement(driver, By.id("createNewFeatureMenuItem")));
		
		SelUtil.findElement(driver, By.id("createNewFeatureWindowNameField-inputEl")).clear();
		SelUtil.findElement(driver, By.id("createNewFeatureWindowNameField-inputEl")).sendKeys(name);
		
		if(strand>0) SelUtil.click(SelUtil.findElement(driver, By.id("createNewFeatureWindowPositiveCheckBox-inputEl")));
		else if(strand<0) SelUtil.click(SelUtil.findElement(driver, By.id("createNewFeatureWindowNegativeCheckBox-inputEl")));
		
		
		SelUtil.click(SelUtil.findElement(driver, By.id("createNewFeatureWindowOKButton")));
	}
	
	
	
}// END OF CLASS















