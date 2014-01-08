if [ "$(whoami)" == 'tim98210' ]; then
	source /Users/tim98210/.rvm/scripts/rvm
	rvm reload
	rvm use 1.9.3 --default
fi

rm -r resources
sencha ant clean
mkdir resources
sencha app build
cp -r ../vede/resources/ resources/
cp -r ../vede/resources/ build/Vede/production/resources/