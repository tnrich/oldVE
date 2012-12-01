#!/bin/bash

# Make sure you install jsduck this way!
#> sudo gem install jsduck

jsduck --verbose ../app/teselagen/ ../../biojs/src/ --output compiledDoc

