#!/usr/bin/env node
const App = require('./../lib/app.js');
const reqCwd = require('req-cwd');
const death = require('death');

const log = console.log;

const config = reqCwd.silent('./.solprofiler.js') || {};
const app = new App(config);

death((signal, err) => app.cleanUp(err));

app.generateProfilerEnvironment();
app.instrumentTarget();
app.launchTestrpc()
  .then(() => {
    app.runTestCommand();
    app.generateReport();
  })
  .catch(err => log(err));



