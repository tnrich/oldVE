

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class Ddaf {
  private WebDriver driver;
  private String baseUrl;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();

  @Before
  public void setUp() throws Exception {
	System.setProperty("webdriver.chrome.driver", "/Users/mmatena/bin/chromedriver");
	driver = new ChromeDriver();
    baseUrl = "http://teselagen.production/";
    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
  }

  @Test
  public void testDdaf() throws Exception {
    driver.get(baseUrl + "/");
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
    
  }

  @After
  public void tearDown() throws Exception {
    driver.quit();
    String verificationErrorString = verificationErrors.toString();
    if (!"".equals(verificationErrorString)) {
      fail(verificationErrorString);
    }
  }

  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }

  private boolean isAlertPresent() {
    try {
      driver.switchTo().alert();
      return true;
    } catch (NoAlertPresentException e) {
      return false;
    }
  }

  private String closeAlertAndGetItsText() {
    try {
      Alert alert = driver.switchTo().alert();
      String alertText = alert.getText();
      if (acceptNextAlert) {
        alert.accept();
      } else {
        alert.dismiss();
      }
      return alertText;
    } finally {
      acceptNextAlert = true;
    }
  }
}
