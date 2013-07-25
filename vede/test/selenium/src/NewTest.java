
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;


public class NewTest {
	
	public static void main(String[] args) {
		System.setProperty("webdriver.chrome.driver", "/Users/mmatena/bin/chromedriver");
        WebDriver driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        
        driver.get("http://production.teselagen.com/");
        //driver.get("http://teselagen.production/");
        //http://production.teselagen.com/
        
        driver.findElement(By.id("auth-username-field-inputEl")).clear();
        driver.findElement(By.id("auth-username-field-inputEl")).sendKeys("test");        
        driver.findElement(By.id("auth-login-btn-btnIconEl")).click();
        
        
        
        
        driver.findElement(By.cssSelector("span.x-tree-node-text")).click();
        driver.findElement(By.cssSelector("input.x-form-text")).clear();
        driver.findElement(By.cssSelector("input.x-form-text")).sendKeys("project1");
                
        //driver.findElement(By.id("button-1005-btnIconEl")).click();
        WebElement w = driver.findElement(By.xpath("//span[@class='x-btn-inner x-btn-inner-center'][text()='OK']"));
        w = w.findElement(By.xpath("./.."));
        w.findElement(By.xpath("./span[@class='x-btn-icon-el  ']")).click();
        
        
        
        //driver.findElement(By.xpath("//span[@class=\"x-btn-icon-el\" and @role=\"img\"] and //span../span[@class=\"x-btn-inner x-btn-inner-center\"][text()=\"OK\"]")).click();
        //driver.findElement(By.xpath("//span[@class=\"x-btn-inner x-btn-inner-center\"][text()=\"OK\"]")).click();
    
        /*WebElement element = driver.findElement(By.name("q"));
		
        element.sendKeys("Cheese!");
		
        element.submit();
	
        System.out.println("Page title is: " + driver.getTitle());*/
	}

}
