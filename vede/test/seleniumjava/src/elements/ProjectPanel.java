package elements;

import java.util.List;

import org.openqa.selenium.*;

public class ProjectPanel {
	
	WebDriver driver;
	private WebElement projectPanel;
	private WebElement tbody;
	List<WebElement> projects;
	List<String> projectNames;
	
	/**
	 * Must be updated whenever project panel changes.
	 * @param driver
	 */
	public ProjectPanel(WebDriver driver) {
		this.driver = driver;
		/*this.projectPanel = this.driver.findElement(By.id("ProjectPanel"));
		this.tbody = this.projectPanel.findElement(By.xpath(".//tbody"));
		
		List<WebElement> items = this.tbody.findElements(By.xpath(".//div"));
		
		for (WebElement w : items) {
			if(w.findElement(By.xpath("./*")).getAttribute("class")==" x-tree-elbow-img x-tree-elbow-plus x-tree-expander") {
				this.projects.add(w);
				this.projectNames.add(w.findElement(By.xpath("./span")).getText());
			}
		}*/		
	}
	
	/**
	 * Reloads values of project panel and its items.
	 */
	public void reload() {
		this.projectPanel = this.driver.findElement(By.id("ProjectPanel"));
		//this.tbody = this.projectPanel.findElement(By.xpath(".//tbody"));		
		//List<WebElement> items = this.tbody.findElements(By.xpath(".//div"));
		List<WebElement> items = this.projectPanel.findElements(By.xpath(".//tbody//div"));
		
		//System.out.println(items.size());
		
		for (WebElement w : items) {
			String s = w.findElement(By.xpath("./*")).getAttribute("class");
			//System.out.println(s);
			if(s==" x-tree-elbow-img x-tree-elbow-plus x-tree-expander") {
				System.out.println(s);
				//this.projects.add(w);
				this.projectNames.add(w.findElement(By.xpath("./span")).getText());
			}
		}
	}

	public WebElement findProject(String name, boolean reload) {
		if(reload) this.reload();
		for(WebElement w : this.projects) {
			System.out.println("dhgfhdfh");
		}
		for(String s : this.projectNames) {
			System.out.println(s);
		}
		return this.projects.get(this.projectNames.indexOf(name));		
	}
	
	public WebElement findProject(int index, boolean reload) {
		if(reload) this.reload();
		return this.projects.get(index);
	}
}



