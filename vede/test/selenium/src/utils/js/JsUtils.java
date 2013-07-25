package utils.js;

import java.util.List;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;

public class JsUtils {
	
	
	public static void appendJsErrorToBodyAttr(WebDriver driver) {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		String innerScript = "" +
				"window.onerror=function(msg){" +
					"document.body.setAttribute('JsError',msg);" +
					"if(document.body.getAttribute('JsErrorLog'))" +
						"document.body.setAttribute('JsErrorLog',document.body.getAttribute('JsErrorLog')+msg+'\\n');" +
					"else document.body.setAttribute('JsErrorLog',msg+'\\n');" +
				"}";
		
		String addScriptToDoc = "var se = document.createElement('script');" +
				"se.setAttribute('type', 'text/javascript');" +
				"se.appendChild(document.createTextNode("+innerScript+"));" +
				"document.getElementsByTagName('head').item(0).appendChild(se);";
		js.executeScript(addScriptToDoc);
	}
	
	public static String[] getJsErrorLog(WebDriver driver) {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		String s = (String) js.executeScript("return document.body.getAttribute('JsErrorLog')");
		return s.split("\n");
	}
	
	public static String getLastJsError(WebDriver driver) {
		JavascriptExecutor js = (JavascriptExecutor) driver;
		return (String) js.executeScript("return document.body.getAttribute('JsError')");
	}
	
	
	
}







