#!/bin/bash
convert servicetag.jpg -fuzz 50% \
-fill black \
-opaque black \
-bordercolor white \
-border 2 \
-fill black \
-draw color 0,0 floodfill \
-alpha off \
-negate \
-units pixelsperinch \
-density 72 \
 output.jpg

