# Type It Quick

Online typing contest!

## Installation

Via git (or downloaded tarball):

```bash
$ git clone git://github.com/gevorg/typeitquick.git
```

## Running

```bash
$ cd typeitquick
$ npm install
$ npm start

> node web.js

Listening on 5000
...
```

## Adding new text
Just add new file into [texts folder](https://github.com/gevorg/typeitquick/tree/master/server/texts)

## Configuration
There are few environment variables that you must set

- **PORT** - server port to run, by default it is 5000
- **CAPTCHA_APP_KEY** - application key used by captcha
- **CAPTCHA_APP_SEC** - application secret used by captcha

## Dependencies
 - Look [package.json](https://github.com/gevorg/typeitquick/blob/master/package.json)

## License

The MIT License (MIT)

Copyright (c) 2016 Gevorg Harutyunyan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.