#!/bin/bash
FILES=*.png
for f in $FILES
do
  echo "Processing $f file..."
if [ ! -f "./$f.bak" ];
then
   cp "$f" "$f.bak"
fi
   convert "$f".bak -background red -flatten "$f"
   convert "$f" -fill black +opaque red "$f"
   convert "$f" -transparent red "$f"
done