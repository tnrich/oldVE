package wraps.js;

public class PartWrap {
	/*
     * @param {Number} id Part id
     * @param {Number} veproject_id VectorEditorProject id
     * @param {Number} eugenerule_id EugeneRule id
     * @param {Number} sequencefile_id SequenceFile id
     * @param {Boolean} directionForward Direction forward.
     * @param {String}  name The name of the Part.
     * @param {String}  partSource The source of the Part.
     * @param {Boolean} revComp Reverse Complement.
     * @param {Number}  genbankStartBP Genbank basepair starting index
     * @param {Number}  endBP Genbank basepair ending index
     * @param {String}  iconID Icon id
     */
	
	public String id;
	public String veproject_id;
	public String eugenerule_id;
	public String sequencefile_id;
	public boolean directionForward;
	public String fas;
	public String name;
	public String partSource;
	public boolean revComp;
	public String genbankStartBP; //MAYBE CHANGE TO INT/LONG
	public String endBP; //MAYBE CHANGE TO INT/LONG
	public String iconID;
	public boolean phantom;
	
	public PartWrap() {
		
	}
	
	
	
	
}






