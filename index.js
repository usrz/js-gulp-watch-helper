'use strict';

const child_process = require('child_process');

const child = Symbol('child');
const script = Symbol('script');
const restart = Symbol('restart');
const parameters = Symbol('parameters');
const debug = Symbol('debug');

function errorHandler(error) {
  this[child] = null;
  console.log(`Script "${this[script]}" died because of an error (not restarting)`, error);
}

function exitHandler(code, signal) {
  this[child] = null;

  var reason = null;
  if ((signal != null) && (code != null)) {
    reason = `was killed by signal ${signal} and exited with code ${code}`;
  } else if (signal != null) {
    reason = `was killed by signal ${signal}`;
  } else if (code != null) {
    reason = `exited with code ${code}`;
  }
  var action = '[' + (this[restart] ? '' : 'not ') + 'restarting]';
  if (this[debug]) console.log(`Script "${this[script]}" ${reason} ${action}`);

  if (this[restart]) this.start();
}


class WatchHelper {

  constructor(scriptFile, scriptParameters) {
    this[child] = null;
    this[script] = scriptFile;
    this[parameters] = scriptParameters;
    this[restart] = false;
  }

  get script() {
    return this[script];
  }

  get running() {
    return this[child] != null;
  }

  get child_process() {
    return this[child];
  }

  verbose(debugFlag) {
    this[debug] = debugFlag ? true : false; // normalize
    return this;
  }

  start() {
    if (this[child] != null) {
      if (this[debug]) console.log(`Script ${this[script]} already running`);
      return this;
    }

    if (this[debug]) console.log(`About to fork script ${this[script]}`, this[parameters]);

    this[restart] = false;
    this[child] = child_process.fork(this[script], this[parameters]);
    this[child].on('error', errorHandler.bind(this));
    this[child].on('exit', exitHandler.bind(this));
    return this;
  }

  stop() {
    if (this[child] == null) {
      if (this[debug]) console.log(`Script ${this[script]} not running`);
      return this;
    }

    if (this[debug]) console.log(`About to kill script "${this[script]}"`);
    this[restart] = false;
    this[child].kill();
    return this;
  }

  restart() {
    if (this[child] == null) return this.start();

    if (this[debug]) console.log(`About to restart script "${this[script]}"`);
    this[restart] = true;
    this[child].kill();
    return this;
  }
}


module.exports = WatchHelper;

