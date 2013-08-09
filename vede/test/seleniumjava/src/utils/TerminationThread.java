package utils;

import org.openqa.selenium.WebDriver;

public class TerminationThread extends Thread {
	WebDriver driver;
    public TerminationThread(WebDriver driver) {
        this.driver = driver;
    }

    public void run() {
    	driver.quit();
    }
}
