Start with GenbankFormat (GF)

GF calls GenbankFileModel (GFM) whose constructor just creates an empty shell that contains our Genbank information.

GFM calls on GenbankKeyword (GK), GenbankLocusKeyword (GLK), GenbankFeatureKeyword (GFK), and GenbankOriginKeyword (GOK) to set up empty classes.

The real work of filling in everything is done in GF.

ISSUES:
- Perhaps we should get rid of the convenient CONFIG from GFM since it makes a number of things public.