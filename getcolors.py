#!/usr/bin/python

from PIL import Image
import sys

assert len( sys.argv ) == 2

imgfile = sys.argv[1]

img = Image.open( imgfile )

img.thumbnail( [128,128], Image.NEAREST )

for [r,g,b] in img.getdata():
    print( "[%d,%d,%d]," % (r,g,b) )
