These are parsers which can take the raw data of the resource after it has been parsed by MacResource().

Be sure to include `ResourceScanner.js`

used something like:
```
const fork = new MacResource(some_resource_fork);
const picture = new PICT(fork.PICT[128].raw);
const img = document.createElement('img');
img.src = picture.dataURL;
document.body.append(img);
```

see ../reference/ImagingWithQuickDraw.pdf for reference
