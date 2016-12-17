Restart a script
================

Useful in [Gulp](https://gulpjs.com/) scripts to watch and restart scripts.

```javascript
const WatchHelper = require('watch-helper');

/* Watch, rebuild, restart, ... */
gulp.task('watch', ['less'], function() {

  /* Watch and rebuild LESS fileS */
  gulp.watch('./src/**/*.less', ['less']);

  /* Start our Express server and restart it on changes */
  var server = new WatchHelper('./server/index.js')
                        .verbose(true)
                        .start();
  gulp.watch('./server/**/*', function() {
    server.restart();
  });
});
```



Simple API
----------

### Creation

```javascript
const WatchHelper = require('watch-helper');
const wh = new WatchHelper('./script.js', ['arg1', 'arg2', 'arg3']);
```

Create a `WatchHelper` instance specifying the script name (relative to the
__current__ directory) and optionally an array of string parameters.

### Methods

* `wh.start()`: start the script forking the Node VM and invoking the script
* `wh.stop()`: stop the script, killing the child process forked by `start()`
* `wh.restart()`: forcedly restarts (or starts if not running) the script
* `wh.verbose(true)`: call to set verbosity to `true` or `false`.

All methods return `this` instance for method inlining.

### Properties

* `wh.script`: the script specified at runtime
* `wh.running`: true or false depending on whether a child process is running.
* `wh.child_process`: the child process forked or `null`.



License (MIT)
-------------

Copyright (c) 2015 USRZ.com and Pier Paolo Fumagalli

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
