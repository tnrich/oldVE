package utils;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.InvalidElementStateException;
import org.openqa.selenium.Point;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;

public class CustomWebElement implements WebElement {
	
	private final WebElement element;
	public long sleepMilis = 200;
	
	public CustomWebElement(final WebElement element) {
		this.element = element;
    }
	 
	@Override
	public void click() {
		boolean error = false;
		try {
			element.click();
		} catch (StaleElementReferenceException e) {
			error = true;
			try {
				Thread.sleep(this.sleepMilis);
			} catch (InterruptedException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		} finally {
			if(error) element.click();
		}
	}

	@Override
	public void submit() {
		element.submit();
	}

	@Override
	public void sendKeys(CharSequence... keysToSend) {
		element.sendKeys(keysToSend);
	}

	@Override
	public void clear() {
		while (true) {
			boolean error = false;
			try {
				element.clear();
			} catch (StaleElementReferenceException e) {
				error = true;
				try {
					Thread.sleep(this.sleepMilis);
				} catch (InterruptedException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			} catch (InvalidElementStateException e) {
				error = true;
				try {
					Thread.sleep(this.sleepMilis);
				} catch (InterruptedException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			} finally {
				if(!error) return;
			}
		}
		//element.clear();
	}

	@Override
	public String getTagName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getAttribute(String name) {
		return element.getAttribute(name);
	}

	@Override
	public boolean isSelected() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String getText() {
		return element.getText();
	}

	
	public List<CustomWebElement> findElementsC(By by) {
		while (true) {
			boolean error = false;
			List<WebElement> ret = null;
			List<CustomWebElement> ret2 = null;
			try {
				ret = element.findElements(by);
				ret2 = new ArrayList<CustomWebElement>();
				for (WebElement w : ret) {
					ret2.add(new CustomWebElement(w));
				}
			} catch (StaleElementReferenceException e) {
				error = true;
				try {
					Thread.sleep(this.sleepMilis);
				} catch (InterruptedException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			} catch (InvalidElementStateException e) {
				error = true;
				try {
					Thread.sleep(this.sleepMilis);
				} catch (InterruptedException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			} finally {
				if(!error) return ret2;
			}
		}
		//return element.findElements(by);
	}
	
	//InvalidElementStateException
	@Override
	public CustomWebElement findElement(By by) {
		while (true) {
			boolean error = false;
			CustomWebElement ret = null;
			try {
				ret = new CustomWebElement(element.findElement(by));
			} catch (StaleElementReferenceException e) {
				error = true;
				try {
					Thread.sleep(this.sleepMilis);
				} catch (InterruptedException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			} catch (InvalidElementStateException e) {
				error = true;
				try {
					Thread.sleep(this.sleepMilis);
				} catch (InterruptedException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			} finally {
				if(!error) return ret;
			}
		}
		
		//return element.findElement(by);
	}

	@Override
	public boolean isDisplayed() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Point getLocation() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dimension getSize() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getCssValue(String propertyName) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<WebElement> findElements(By by) {
		// TODO Auto-generated method stub
		return null;
	}

}
