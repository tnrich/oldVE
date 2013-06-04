module.exports = function(app){

    app.constants = {};
    var defaultEmptyPart;

    var Part = app.db.model("part");

    Part.findOne({phantom:true},function(err,blank){
        if(err||blank===null)
        {
            defaultEmptyPart = new Part({name:"",phantom:true});
            defaultEmptyPart.save(function(){
            	app.constants.defaultEmptyPart = defaultEmptyPart;
            });
        }
        else 
        {
            defaultEmptyPart = blank;
            app.constants.defaultEmptyPart = defaultEmptyPart;
        }
    });

    app.constants.emptyGenbank = '"LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//"';
}