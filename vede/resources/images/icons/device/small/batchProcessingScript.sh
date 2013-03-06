#!/bin/bash
FILES=*.png
for f in $FILES
do
  echo "Processing $f file..."
  cp "$f" "$f.bak"
  convert "$f".bak -fill black +opaque white "$f"
  convert "$f" -transparent white "$f"
done