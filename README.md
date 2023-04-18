# Type It Quick

Online typing contest!

## Installation

Via git (or downloaded tarball):

```bash
$ git clone git@github.com:gevorg/typeitquick.git
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

## License

The MIT License (MIT)
