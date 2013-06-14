rm -r resources
sencha ant clean
mkdir resources
sencha app build
cp -r ../vede/resources/ resources/
cp -r ../vede/resources/ build/Vede/production/resources/
