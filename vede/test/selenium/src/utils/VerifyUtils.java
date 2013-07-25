package utils;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class VerifyUtils {
	
	public static void test(WebDriver driver) {
		if(SelUtil.findElements(driver, By.xpath("//div[@id='mainAppPanel-body']/div[contains(@style,'display: none;')=false]")).size()!=1) {
			
		}
	}
	
	
	
	
	
}













