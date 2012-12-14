#!/bin/bash
git pull origin master
rm -Rf /var/www/webroot/dev.teselagen.com/docs
/usr/local/bin/jsduck --verbose /var/www/webroot/dev.teselagen.com/ve/vede/app/teselagen/ /var/www/webroot/dev.teselagen.com/ve/biojs/src/ --output /var/www/webroot/dev.teselagen.com/docs
