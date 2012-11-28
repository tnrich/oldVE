#!/bin/bash
FILES=*.pdf
for f in $FILES
do
  echo "Processing $f file..."
  inkscape "$f" --export-plain-svg="../SBOLv1.1.0_SymbolsSVG/${f//pdf/svg}"
done