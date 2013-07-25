package utils;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.interactions.Actions;

public class DeUtils {
	
	
	public static void clickOnGrid(WebDriver driver, int xIdx, int yIdx) {		
		String s = "//div[starts-with(@id,'DeviceEditorCanvasPanel-') and " +
				"'-body'=substring(@id, string-length(@id)- string-length('-body') +1)" +
				"]/div/span/div/div["+(xIdx+1)+"]//tbody/tr["+(yIdx+1)+"]//div";	
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	public static void clickRowAboveMenuItem(WebDriver driver) {
		String s = "//div[starts-with(@id,'DeviceEditorMenuPanel-')]/div[starts-with(@id,'toolbar-')]" +
				"//a[contains(@class,' insertMenu ')]";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		s = "/html/body/div[starts-with(@id,'menu-')]/div[starts-with(@id,'menu-') and " +
				"'-body'=substring(@id, string-length(@id)- string-length('-body') +1)]" +
				"/div[starts-with(@id,'menu-') and '-innerCt'=substring(@id, string-length(@id)- string-length('-innerCt') +1)]" +
				"/div[starts-with(@id,'menu-') and '-targetEl'=substring(@id, string-length(@id)- string-length('-targetEl') +1)]" +
				"//a/span[text()='Row Above']/parent::*";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	public static void clickRowBelowMenuItem(WebDriver driver) {
		String s = "//div[starts-with(@id,'DeviceEditorMenuPanel-')]/div[starts-with(@id,'toolbar-')]" +
				"//a[contains(@class,' insertMenu ')]";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		s = "/html/body/div[starts-with(@id,'menu-')]/div[starts-with(@id,'menu-') and " +
				"'-body'=substring(@id, string-length(@id)- string-length('-body') +1)]" +
				"/div[starts-with(@id,'menu-') and '-innerCt'=substring(@id, string-length(@id)- string-length('-innerCt') +1)]" +
				"/div[starts-with(@id,'menu-') and '-targetEl'=substring(@id, string-length(@id)- string-length('-targetEl') +1)]" +
				"//a/span[text()='Row Below']/parent::*";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	public static void clickColumnLeftMenuItem(WebDriver driver) {
		String s = "//div[starts-with(@id,'DeviceEditorMenuPanel-')]/div[starts-with(@id,'toolbar-')]" +
				"//a[contains(@class,' insertMenu ')]";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		s = "/html/body/div[starts-with(@id,'menu-')]/div[starts-with(@id,'menu-') and " +
				"'-body'=substring(@id, string-length(@id)- string-length('-body') +1)]" +
				"/div[starts-with(@id,'menu-') and '-innerCt'=substring(@id, string-length(@id)- string-length('-innerCt') +1)]" +
				"/div[starts-with(@id,'menu-') and '-targetEl'=substring(@id, string-length(@id)- string-length('-targetEl') +1)]" +
				"//a/span[text()='Column Left']/parent::*";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	public static void clickColumnRightMenuItem(WebDriver driver) {
		String s = "//div[starts-with(@id,'DeviceEditorMenuPanel-')]/div[starts-with(@id,'toolbar-')]" +
				"//a[contains(@class,' insertMenu ')]";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		s = "/html/body/div[starts-with(@id,'menu-')]/div[starts-with(@id,'menu-') and " +
				"'-body'=substring(@id, string-length(@id)- string-length('-body') +1)]" +
				"/div[starts-with(@id,'menu-') and '-innerCt'=substring(@id, string-length(@id)- string-length('-innerCt') +1)]" +
				"/div[starts-with(@id,'menu-') and '-targetEl'=substring(@id, string-length(@id)- string-length('-targetEl') +1)]" +
				"//a/span[text()='Column Right']/parent::*";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	public static void insertRowAbove(WebDriver driver, int xIdx, int yIdx) {
		DeUtils.clickOnGrid(driver, xIdx, yIdx);
		DeUtils.clickRowAboveMenuItem(driver);
	}
	
	public static void insertRowBelow(WebDriver driver, int xIdx, int yIdx) {
		DeUtils.clickOnGrid(driver, xIdx, yIdx);
		DeUtils.clickRowBelowMenuItem(driver);
	}
	
	public static void insertColumnLeft(WebDriver driver, int xIdx, int yIdx) {
		DeUtils.clickOnGrid(driver, xIdx, yIdx);
		DeUtils.clickColumnLeftMenuItem(driver);
	}
	
	public static void insertColumnRight(WebDriver driver, int xIdx, int yIdx) {
		DeUtils.clickOnGrid(driver, xIdx, yIdx);
		DeUtils.clickColumnRightMenuItem(driver);
	}
	
	public static void clickSaveMenuItem(WebDriver driver) {
		String s = "//div[starts-with(@id,'DeviceEditorMenuPanel-')]/div[starts-with(@id,'toolbar-')]" +
				"//a[contains(@class,' fileMenu ')]";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		s = "/html/body/div[starts-with(@id,'menu-')]/div[starts-with(@id,'menu-') and " +
				"'-body'=substring(@id, string-length(@id)- string-length('-body') +1)]" +
				"/div[starts-with(@id,'menu-') and '-innerCt'=substring(@id, string-length(@id)- string-length('-innerCt') +1)]" +
				"/div[starts-with(@id,'menu-') and '-targetEl'=substring(@id, string-length(@id)- string-length('-targetEl') +1)]" +
				"//a/span[text()='Save Design']/parent::*";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	public static void clickRenameDesignMenuItem(WebDriver driver, String newName) {
		String s = "//div[starts-with(@id,'DeviceEditorMenuPanel-')]/div[starts-with(@id,'toolbar-')]" +
				"//a[contains(@class,' fileMenu ')]";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		s = "/html/body/div[starts-with(@id,'menu-')]/div[starts-with(@id,'menu-') and " +
				"'-body'=substring(@id, string-length(@id)- string-length('-body') +1)]" +
				"/div[starts-with(@id,'menu-') and '-innerCt'=substring(@id, string-length(@id)- string-length('-innerCt') +1)]" +
				"/div[starts-with(@id,'menu-') and '-targetEl'=substring(@id, string-length(@id)- string-length('-targetEl') +1)]" +
				"//a/span[text()='Rename Design']/parent::*";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
		
		
		String msgBoxXPath = "/html/body/div[starts-with(@id,'messagebox-')]/div[starts-with(@id,'messagebox-') and " +
				"'_header'=substring(@id, string-length(@id)- string-length('_header') +1)]" +
				"/div[starts-with(@id,'messagebox-') and '_header-body'=substring(@id, string-length(@id)- string-length('_header-body') +1)]" +
				"/div[starts-with(@id,'messagebox-') and '_header-innerCt'=substring(@id, string-length(@id)- string-length('_header-innerCt') +1)]" +
				"/div[starts-with(@id,'messagebox-') and '_header-targetEl'=substring(@id, string-length(@id)- string-length('_header-targetEl') +1)]" +
				"/div[starts-with(@id,'messagebox-') and '_header_hd'=substring(@id, string-length(@id)- string-length('_header_hd') +1)]" +
				"/span[text()='Rename Design']/parent::*/parent::*/parent::*/parent::*/parent::*/parent::*";
		
		SelUtil.findElement(driver, By.xpath(msgBoxXPath+"//input")).clear();
		SelUtil.findElement(driver, By.xpath(msgBoxXPath+"//input")).sendKeys(newName);
		
		SelUtil.click(SelUtil.findElement(driver, By.xpath(msgBoxXPath+"//*[@class='x-btn-button']/span[text()='OK']/parent::*/span[@role='img']")));
		
		// Add something here for if a design with the same name already exists.
	}
	
	public static void clickPartsBarItem(WebDriver driver, String partType) {
		String s = "//div[contains(@class,' DeviceEditorPartsBar ')]//a[@data-qtip='"+partType+"']";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	public static void clickPartsBarItem(WebDriver driver, int index) {
		String s = "//div[contains(@class,' DeviceEditorPartsBar ')]//a["+(index+1)+"]";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(s)));
	}
	
	public static void doubleClickOnGrid(WebDriver driver, int xIdx, int yIdx) {		
		String s = "//div[starts-with(@id,'DeviceEditorCanvasPanel-') and " +
				"'-body'=substring(@id, string-length(@id)- string-length('-body') +1)" +
				"]/div/span/div/div["+(xIdx+1)+"]//tbody/tr["+(yIdx+1)+"]//div";
		Actions builder = new Actions(driver); 
		builder.doubleClick(SelUtil.findElement(driver, By.xpath(s)));
		builder.perform();
	}
	
	
}













