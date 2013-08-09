package utils;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;

public class SelUtil {
	
	public static long timeOutMilis = 30000;
	
	public static WebElement findElement(WebDriver driver, By by) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			try {
				return driver.findElement(by);
			} catch ( StaleElementReferenceException ser ) {						
		    } catch ( NoSuchElementException nse ) {
		    } catch (WebDriverException e) {
		    } catch ( Exception e ) {
		    }
			currentTime = System.currentTimeMillis();
		}
		
		return driver.findElement(by);
	}
	
	public static WebElement findElement(WebElement w, By by) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			try {
				return w.findElement(by);
			} catch ( StaleElementReferenceException ser ) {						
		    } catch ( NoSuchElementException nse ) {
		    } catch (WebDriverException e) {
		    } catch ( Exception e ) {
		    }
			currentTime = System.currentTimeMillis();
		}
		
		return w.findElement(by);
	}
	
	public static List<WebElement> findElements(WebDriver driver, By by) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			try {
				return driver.findElements(by);
			} catch ( StaleElementReferenceException ser ) {						
		    } catch ( NoSuchElementException nse ) {	
		    } catch (WebDriverException e) {
		    } catch ( Exception e ) {
		    }
			currentTime = System.currentTimeMillis();
		}
		
		return driver.findElements(by);
	}
	
	public static List<WebElement> findElements(WebElement w, By by) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			try {
				return w.findElements(by);
			} catch ( StaleElementReferenceException ser ) {						
		    } catch ( NoSuchElementException nse ) {	
		    } catch (WebDriverException e) {
		    } catch ( Exception e ) {
		    }
			currentTime = System.currentTimeMillis();
		}
		
		return w.findElements(by);
	}
	
	public static void click(WebElement w) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			boolean error = false;
			try {
				w.click();
			} catch ( StaleElementReferenceException ser ) {
				error = true;
		    } catch ( NoSuchElementException nse ) {
		    	error = true;
		    } catch (WebDriverException e) {
		    	error = true;
		    } catch ( Exception e ) {
		    	error = true;
		    } finally {
		    	if(!error) return;
		    }
			currentTime = System.currentTimeMillis();
		}
	}
	
	public static void clear(WebElement w) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			boolean error = false;
			try {
				w.clear();
			} catch ( StaleElementReferenceException ser ) {
				error = true;
		    } catch ( NoSuchElementException nse ) {
		    	error = true;
		    } catch (WebDriverException e) {
		    	error = true;
		    } catch ( Exception e ) {
		    	error = true;
		    } finally {
		    	if(!error) return;
		    }
			currentTime = System.currentTimeMillis();
		}
	}
	
	public static void sendKeys(WebElement w, CharSequence... keysToSend) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			boolean error = false;
			try {
				w.sendKeys(keysToSend);
			} catch ( StaleElementReferenceException ser ) {
				error = true;
		    } catch ( NoSuchElementException nse ) {
		    	error = true;
		    } catch (WebDriverException e) {
		    	error = true;
		    } catch ( Exception e ) {
		    	error = true;
		    } finally {
		    	if(!error) return;
		    }
			currentTime = System.currentTimeMillis();
		}
	}
	
	public static WebElement findElement(WebDriver driver, By by, boolean quit) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			try {
				return driver.findElement(by);
			} catch ( StaleElementReferenceException ser ) {						
		    } catch ( NoSuchElementException nse ) {
		    } catch (WebDriverException e) {
		    } catch ( Exception e ) {
		    }
			currentTime = System.currentTimeMillis();
		}
		
		return driver.findElement(by);
	}
	
	public static WebElement findElement(WebElement w, By by, boolean quit) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			try {
				return w.findElement(by);
			} catch ( StaleElementReferenceException ser ) {
				if(quit) return null;
		    } catch ( NoSuchElementException nse ) {
		    	if(quit) return null;
		    } catch (WebDriverException e) {
		    	if(quit) return null;
		    } catch ( Exception e ) {
		    	if(quit) return null;
		    }
			currentTime = System.currentTimeMillis();
		}
		
		return w.findElement(by);
	}
	
	public static List<WebElement> findElements(WebDriver driver, By by, boolean quit) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			try {
				return driver.findElements(by);
			} catch ( StaleElementReferenceException ser ) {
				if(quit) return null;
		    } catch ( NoSuchElementException nse ) {
		    	if(quit) return null;
		    } catch (WebDriverException e) {
		    	if(quit) return null;
		    } catch ( Exception e ) {
		    	if(quit) return null;
		    }
			currentTime = System.currentTimeMillis();
		}
		
		return driver.findElements(by);
	}
	
	public static List<WebElement> findElements(WebElement w, By by, boolean quit) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			try {
				return w.findElements(by);
			} catch ( StaleElementReferenceException ser ) {
				if(quit) return null;
		    } catch ( NoSuchElementException nse ) {
		    	if(quit) return null;
		    } catch (WebDriverException e) {
		    	if(quit) return null;
		    } catch ( Exception e ) {
		    	if(quit) return null;
		    }
			currentTime = System.currentTimeMillis();
		}
		
		return w.findElements(by);
	}
	
	public static void click(WebElement w, boolean quit) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			boolean error = false;
			try {
				w.click();
			} catch ( StaleElementReferenceException ser ) {
				if(quit) return;
				error = true;
		    } catch ( NoSuchElementException nse ) {
		    	if(quit) return;
		    	error = true;
		    } catch (WebDriverException e) {
		    	if(quit) return;
		    	error = true;
		    } catch ( Exception e ) {
		    	if(quit) return;
		    	error = true;
		    } finally {
		    	if(!error) return;
		    }
			currentTime = System.currentTimeMillis();
		}
	}
	
	public static void clear(WebElement w, boolean quit) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			boolean error = false;
			try {
				w.clear();
			} catch ( StaleElementReferenceException ser ) {
				if(quit) return;
				error = true;
		    } catch ( NoSuchElementException nse ) {
		    	if(quit) return;
		    	error = true;
		    } catch (WebDriverException e) {
		    	if(quit) return;
		    	error = true;
		    } catch ( Exception e ) {
		    	if(quit) return;
		    	error = true;
		    } finally {
		    	if(!error) return;
		    }
			currentTime = System.currentTimeMillis();
		}
	}
	
	public static void sendKeys(WebElement w, boolean quit, CharSequence... keysToSend) {
		long startTime = System.currentTimeMillis();
		long currentTime = System.currentTimeMillis();
		while((currentTime-startTime)<SelUtil.timeOutMilis) {
			boolean error = false;
			try {
				w.sendKeys(keysToSend);
			} catch ( StaleElementReferenceException ser ) {
				if(quit) return;
				error = true;
		    } catch ( NoSuchElementException nse ) {
		    	if(quit) return;
		    	error = true;
		    } catch (WebDriverException e) {
		    	if(quit) return;
		    	error = true;
		    } catch ( Exception e ) {
		    	if(quit) return;
		    	error = true;
		    } finally {
		    	if(!error) return;
		    }
			currentTime = System.currentTimeMillis();
		}
	}
}





