# MacResourceFork
A JavaScript class which interprets a Macintosh Classic MacOS resource fork into a useful object.


##usage
To use, you must download and include:
- [KaitaiStream](https://github.com/kaitai-io/kaitai_struct_javascript_runtime)
- [BytesWithIO](https://formats.kaitai.io/bytes_with_io/javascript.html)
- [ResourceFork](https://formats.kaitai.io/resource_fork/javascript.html)

and from this repository:
- `MacQuirks.js`
- `MacResource.js`

`MacResource` will load `forkTmpl.json` automatically.

Then load you `data` as an `ArrayBuffer` and use:
```
const fork = new MacResource(data)
```

`fork` can then be explored as a javascript object.


`MacQuirks.js` is useful for mac to ascii encoding, it just replaces the mac extended encoding with the closest ascii match I could think of.
`forkTmpl.json` contains a JSON object of the implied TMPL resource found in a resource fork (builtin to ResEdit, etc).
