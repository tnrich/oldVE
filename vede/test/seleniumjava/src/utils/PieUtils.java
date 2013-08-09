package utils;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

public class PieUtils {
	
	/*public static void clickOnSelectionLayer(WebDriver driver) {
		Actions builder = new Actions(driver); 
		builder.moveToElement(SelUtil.findElement(driver, By.id("Pie")))
			   .moveByOffset(-10, -200)
			   .clickAndHold()
			   .moveByOffset(400, 400);
		builder.perform();
	}*/
	
	/*public static void test(WebDriver driver) {
		Actions builder = new Actions(driver); 
		builder.moveToElement(SelUtil.findElement(driver, By.id("Pie")))
			   .moveByOffset(-10, -200)
			   .clickAndHold()
			   .moveByOffset(400, 400)
			   .moveByOffset(400, 400)
			   .release();
		builder.perform();
	}*/
	
	public static String getPieName(WebDriver driver) {
		String s = "//*[local-name() = 'g' and @class='pieNameBox']/*[local-name() = 'text'][1]";
		return SelUtil.findElement(driver, By.xpath(s)).getText();
	}
	
	public static String getPieBpText(WebDriver driver) {
		String s = "//*[local-name() = 'g' and @class='pieNameBox']/*[local-name() = 'text'][2]";
		return SelUtil.findElement(driver, By.xpath(s)).getText();
	}
	
	public static void clickOnFeature(WebDriver driver, String name, String type, int start, int end) {
		String xpath = "//*[local-name() = 'g' and @class='pieFeature']" +
				"/*[local-name() = 'path']/*[local-name() = 'title'][text()='"+type+" - "+name+": "+start+".."+end+"']/parent::*";		
		SelUtil.click(SelUtil.findElement(driver, By.xpath(xpath)));
	}
	
	public static void clickOnFeature(WebDriver driver, String name) {
		String xpath = "//*[local-name() = 'g' and @class='pieFeature']" +
				"/*[local-name() = 'path']/*[local-name() = 'title'][contains(text(),' - "+name+": ')]/parent::*";
		SelUtil.click(SelUtil.findElement(driver, By.xpath(xpath)));
	}
	
	/**
	 * Not the same as right click.
	 * @param driver
	 * @param name
	 */
	public static void contextMenuClickOnFeature(WebDriver driver, String name, String type, int start, int end) {
		String xpath = "//*[local-name() = 'g' and @class='pieFeature']" +
				"/*[local-name() = 'path']/*[local-name() = 'title'][text()='"+type+" - "+name+": "+start+".."+end+"']/parent::*";		
		Actions builder = new Actions(driver); 
		builder.contextClick(SelUtil.findElement(driver, By.xpath(xpath)));
		builder.perform();
	}
	
	/**
	 * Not the same as right click.
	 * @param driver
	 * @param name
	 */
	public static void contextMenuClickOnFeature(WebDriver driver, String name) {
		String xpath = "//*[local-name() = 'g' and @class='pieFeature']" +
				"/*[local-name() = 'path']/*[local-name() = 'title'][contains(text(),' - "+name+": ')]/parent::*";		
		Actions builder = new Actions(driver); 
		builder.contextClick(SelUtil.findElement(driver, By.xpath(xpath)));
		builder.perform();
	}
	
	public static boolean isMapCaretVisible(WebDriver driver) {
		String xpath = "//*[local-name() = 'g' and @class='pieParent']" +
				"/*[local-name() = 'line' and @class='pieCaret']";
		driver.manage().timeouts().implicitlyWait(0, TimeUnit.SECONDS);
		boolean ret = true;
		try {
			driver.findElement(By.xpath(xpath));
		} catch ( StaleElementReferenceException ser ) {
			ret = false;
	    } catch ( NoSuchElementException nse ) {
	    	ret = false;
	    } catch (WebDriverException e) {
	    	ret = false;
	    } catch ( Exception e ) {
	    	ret = false;
	    }
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		return ret;
	}
	
	
	
	
	
}

















