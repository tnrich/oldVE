package utils;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

public class CustomChromeDriver extends ChromeDriver {
	
	public long sleepMilis = 200;
	
	public CustomChromeDriver() {
		
	}
	
	public void setSleepMilis(long milis) {
		this.sleepMilis = milis;
	}
	
	public CustomWebElement findElement(By by) {
		boolean error = false;
		try {
			return new CustomWebElement(super.findElement(by));
		} catch(NoSuchElementException e) {
			error = true;
			try {
				Thread.sleep(this.sleepMilis);
			} catch (InterruptedException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		} catch(StaleElementReferenceException e) {
			error = true;
			try {
				Thread.sleep(this.sleepMilis);
			} catch (InterruptedException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		} finally {
			if (error) return new CustomWebElement(super.findElement(by));
		}
		return new CustomWebElement(super.findElement(by));
	}
	
	public List<CustomWebElement> findElementsC(By by) {
		boolean error = false;
		try {
			List<WebElement> ret = super.findElements(by);
			List<CustomWebElement> ret2 = new ArrayList<CustomWebElement>();
			for (WebElement w : ret) {
				ret2.add(new CustomWebElement(w));
			}
			return ret2;
		} catch(NoSuchElementException e) {
			error = true;
			try {
				Thread.sleep(this.sleepMilis);
			} catch (InterruptedException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		} catch(StaleElementReferenceException e) {
			error = true;
			try {
				Thread.sleep(this.sleepMilis);
			} catch (InterruptedException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		} finally {
			if (error) {
				List<WebElement> ret = super.findElements(by);
				List<CustomWebElement> ret2 = new ArrayList<CustomWebElement>();
				for (WebElement w : ret) {
					ret2.add(new CustomWebElement(w));
				}
				return ret2;
			}
		}
		List<WebElement> ret = super.findElements(by);
		List<CustomWebElement> ret2 = new ArrayList<CustomWebElement>();
		for (WebElement w : ret) {
			ret2.add(new CustomWebElement(w));
		}
		return ret2;
	}
	
}






