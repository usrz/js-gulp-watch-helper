'use strict';

const msg = '        ' + process.argv[2];

console.log(msg, '>>> child started');
setTimeout(function() {
  console.log(msg, '>>> child exiting');
}, 500);
process.on('SIGTERM', function() {
  console.log(msg, '>>> child killed');
  process.exit();
})
