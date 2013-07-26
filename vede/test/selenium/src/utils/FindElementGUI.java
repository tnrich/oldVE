
package utils;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.concurrent.TimeUnit;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JTextArea;
import javax.swing.JTextField;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class FindElementGUI {
    final static boolean RIGHT_TO_LEFT = false;
    
    private static JButton findButton;
    private static JTextField findField;
    private static JTextArea outArea;
    private static JButton closeDriverButton;
    
    static WebDriver driver;
    
    public static void addComponentsToPane(Container pane) {

        findButton = new JButton("Find");
        findField = new JTextField();
        outArea = new JTextArea();
        closeDriverButton = new JButton("Close Driver");
        
        findButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
            	findButtonActionPerformed(evt);
            }
        });
        
        closeDriverButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
            	closeDriverButtonActionPerformed(evt);
            }
        });
        
		pane.setLayout(new GridBagLayout());
		GridBagConstraints c = new GridBagConstraints();
		c.fill = GridBagConstraints.BOTH;
	
		c.weightx = 0.5;
		c.weighty = 0;
		c.fill = GridBagConstraints.BOTH;
		c.gridx = 0;
		c.gridy = 0;
		pane.add(findField, c);
	
		c.fill = GridBagConstraints.BOTH;
		c.weightx = 0;
		c.weighty = 0;
		c.gridx = 1;
		c.gridy = 0;
		pane.add(findButton, c);
		
		c.fill = GridBagConstraints.BOTH;
		c.ipady = 40;
		c.weightx = 0.0;
		c.weighty = 1;
		c.gridwidth = 2;
		c.gridx = 0;
		c.gridy = 1;
		pane.add(outArea, c);
		
		c.fill = GridBagConstraints.BOTH;
		c.weightx = 0;
		c.weighty = 0;
		c.gridwidth = 1;
		c.gridx = 1;
		c.gridy = 2;
		pane.add(closeDriverButton, c);
    }
    
    public static void highlightElement(WebElement element) { 
    	for (int i = 0; i < 2; i++) { 
    		JavascriptExecutor js = (JavascriptExecutor) driver;
    		js.executeScript("arguments[0].setAttribute('style', arguments[1]);", element, "color: yellow; border: 2px solid yellow;");
    		js.executeScript("arguments[0].setAttribute('style', arguments[1]);", element, ""); 
		} 
	} 
    
    private static void findButtonActionPerformed(ActionEvent evt) {
    	driver.manage().timeouts().implicitlyWait(0, TimeUnit.SECONDS);
    	String txt = findField.getText();
        WebElement w = null;
    	boolean hasElement = true;
        if(txt.startsWith("xpath=")) {
        	txt = txt.replaceFirst("xpath=", "");
        	try {
        		w = driver.findElement(By.xpath(txt));
        	} catch(NoSuchElementException e) {
        		hasElement = false;
        	} finally {
        		
        	}
        } else if(txt.startsWith("//")) {
        	try {
        		w = driver.findElement(By.xpath(txt));
        	} catch(NoSuchElementException e) {
        		hasElement = false;
        	} finally {
        		
        	}
        } else if(txt.startsWith("css=")) {
        	txt = txt.replaceFirst("css=", "");
        	try {
        		w = driver.findElement(By.cssSelector(txt));
        	} catch(NoSuchElementException e) {
        		hasElement = false;
        	} finally {
        		
        	}
        } else if(txt.startsWith("id=")) {
        	txt = txt.replaceFirst("id=", "");
        	try {
        		w = driver.findElement(By.id(txt));
        	} catch(NoSuchElementException e) {
        		hasElement = false;
        	} finally {
        		
        	}
        }
        if(hasElement) {
        	//outArea.append("\n"+w.getAttribute("innerHTML"));
        	FindElementGUI.highlightElement(w);
        } else {
        	outArea.append("\nNo such element found.");
        }
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
    }
    
    private static void closeDriverButtonActionPerformed(ActionEvent evt) {
        driver.quit();
    }
    
    /**
     * Create the GUI and show it.  For thread safety,
     * this method should be invoked from the
     * event-dispatching thread.
     */
    public static void createAndShowGUI(WebDriver driver) {
    	
    	//System.setProperty("webdriver.chrome.driver", "/Users/mmatena/bin/chromedriver");
    	FindElementGUI.driver = driver;
    	//FindElementGUI.driver = new ChromeDriver();
		//driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		
		//driver.get("http://production.teselagen.com/");
		
    	//Create and set up the window.
        JFrame frame = new JFrame("FindElementGUI");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        
        //Set up the content pane.
        addComponentsToPane(frame.getContentPane());

        //Display the window.
        frame.pack();
        frame.setVisible(true);
    }

    /*public static void main(String[] args) {
        //Schedule a job for the event-dispatching thread:
        //creating and showing this application's GUI.
        javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                createAndShowGUI();
            }
        });
    }*/
}








