/* 
 * @author Michael Fero
 */

var content = "<p>Test Window</p>"
		+ "<form id=test_vectordraw>"
		+ "<textarea id=txta rows=1 cols=80>"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "</textarea><br><br>"
		+ "<textarea name=txtb rows=2 cols=80>acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "</textarea><br><br>"
		+ "<textarea name=txtc rows=4 cols=80>"
		+ "acgtacgtacgtacgtacgtacgtcgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "</textarea><br><br>"
		+ "<textarea name=txtd rows=8 cols=80>acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "</textarea><br><br>"
		+ "<textarea name=txte rows=16 cols=80>acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "acgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgtacgt"
		+ "</textarea><br><br><hr>"
		+ "<input type=button name=b2 value='Draw Vector' onClick=simulateDigest()></input><br><br>"
		+ "<textarea name=otxta rows=2>output sequence</textarea>"
		+ "<textarea name=otxtb rows=1>sequence length</textarea><br><br>"
		+ "</form>"
		+ "<canvas id='myDigestCanvas' width=400 height=400 style='border:1px solid #c3c3c3;'>"
		+ "Your browser does not support the canvas element." + "</canvas>"
		+ "";

testWindow = window.open('', 'test_window', 'width=800,height=1000');
testWindow.document.write(content);
testWindow.focus();
canvasId = testWindow.document.getElementById("myDigestCanvas");

// Matchers
beforeEach(function () {
  this.addMatchers(imagediff.jasmine);
});

describe("Testing this empty function", function() {
	it("Works?", function() {
		expect(false).toBe(false);
	});
});


//describe("Testing this Drawing Window", function() {
//	it("Works?", function() {
//		testWindow = window.open('', 'test_window', 'width=800,height=1000');
//		testWindow.document.write(content);
//		testWindow.focus();
//		console.log(testWindow.document);
////		vectorDraw(testWindow);
//		// var s = Ext.create('Teselagen.bio.enzymes.simulateDigest');
//		expect(false).toBe(false);
//	});
//});


describe("Testing this image matcher function", function() {
	it('should be the same image', function() {
		var a;
		var b;
		var a = new Image();
//		var b = new Image();
		a.src = './specs/images/1_normal_a.jpg';
//		b.src = './specs/images/1_normal_a.jpg';

		var canvasId = testWindow.document.getElementById("myDigestCanvas");
//		a = simulateDigest(canvasId);
		b = simulateDigest(canvasId);

//		waitsFor(function() {
//			return a.complete & b.complete;
//		}, 'image not loaded.', 2000);

		runs(function() {
			expect(a).toImageDiffEqual(b); // imagediff expects Image, Canvas,
											// CanvasRenderingContext2D or
											// ImageData
		});

	});
});

// describe("Testing enzyme related classes", function() {
//
// it("Works?",function(){
// var s = Ext.create('Teselagen.bio.enzymes.simulateDigest');
//		expect(s).toBeDefined();
//		expect(false).toBe(false);
//	});
//});

