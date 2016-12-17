'use strict';

const WatchHelper = require('../index.js');
const expect = require('chai').expect;
const debug = false;

describe('WatchHelper', () => {

  it('should construct an instance (1)', () => {
    var wh = new WatchHelper('./test/sample.js', ['1']).verbose(debug);
    expect(wh).to.not.be.null;
    expect(wh.script).to.equal('./test/sample.js');
    expect(wh.running).to.be.false;
  });

  it('should run a simple script (2)', () => {
    var wh = new WatchHelper('./test/sample.js', ['2']).verbose(debug);
    expect(wh.running).to.be.false;
    wh.start();
    expect(wh.running).to.be.true;

    // Must be running in 250 ms
    var p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        wh.running ? resolve() : reject();
      }, 250);
    });

    // Must not be running in 750 ms
    var p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        wh.running ? reject() : resolve();
      }, 750);
    });

    return Promise.all([p1, p2]);
  });

  it('should stop a simple script (3)', () => {
    var wh = new WatchHelper('./test/sample.js', ['3']).verbose(debug);
    expect(wh.running).to.be.false;
    wh.start();
    expect(wh.running).to.be.true;

    // Must be running in 250 ms (and stop)
    var p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        wh.running ? resolve() : reject("Not running at 250");
        wh.stop();
      }, 250);
    });

    // Must NOT be running in 350 ms
    var p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        wh.running ? reject("Still running at 350") : resolve();
      }, 350);
    });

    return Promise.all([p1, p2]);
  });

  it('should restart a simple script (4)', () => {
    var wh = new WatchHelper('./test/sample.js', ['4']).verbose(debug);
    expect(wh.running).to.be.false;
    wh.start();
    expect(wh.running).to.be.true;

    // Must be running in 400 ms (and restart)
    var p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        wh.running ? resolve() : reject("Not running at 400");
        wh.restart();
      }, 400);
    });

    // Must STILL be running in 700 ms
    var p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        wh.running ? resolve() : reject("Not running at 700");
      }, 700);
    });

    // Must NOT be running in 1000 ms
    var p3 = new Promise((resolve, reject) => {
      setTimeout(() => {
        wh.running ? reject("Still running at 1000") : resolve();
      }, 1200);
    });

    return Promise.all([p1, p2, p3]);
  });

});
