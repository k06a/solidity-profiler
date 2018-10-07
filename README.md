# solidity-profiler - Hackathon Submision
Sometimes it could be excruciating to find out most `hungry` lines of solidity code.
It could happen because of wrong loop condition or overflow, and unclear.
We've thought that Solidity profiler is missing part for the Ethereum development eco-system and decided to implement working prototype during hackathon using wide known tools.

## Implementation
We've [forked solidity coverage](https://github.com/k06a/solidity-profiler). And after did following fixes:
- Bulk renaming to save compatibility with the original project.
- Extend code coverage event with `gasleft()` value
- Patch event procession and report generation step, to nicely render it with `Istanbul` code coverage utils that is a part of solidity coverage

## Demo project
To demonstrate how profiler works we take our fork of [ecsol](https://github.com/1Address/ecsol/tree/feature/solidity-profiler) project.
On that fork we apply has gas optimization that was [purposed by Vitalik](https://ethresear.ch/t/you-can-kinda-abuse-ecrecover-to-do-ecmul-in-secp256k1-today/2384).
So, we were really curious to know the details of our gas optimization.

To get solidity profiler output on sample project do the following:

First, you need the following global dependencies installed:
```
npm install -g truffle
npm install -g ganache-cli
```
After clone repositories and perform `npm i` and `npm run profiler`
```
mkdir solidity-profiler-demo
cd solidity-profiler-demo

git clone https://github.com/k06a/solidity-profiler
cd solidity-profiler
npm i
cd ../

git clone -b feature/solidity-profiler https://github.com/1Address/ecsol
cd ecsol
npm i

npm run profiler
```
Discover report file in `ecsol/coverage/index.html` directory


## Further Plans
Our hackathon soltion is just a proof of concept and we think that can improve it in the following way:
- Display min/max/avg/median gas consumption for each line
- Split complex lines to multiple lines with identation
- Make a lot of other improvements and fixes on a long way to the production use ;-)

-------
# Original readme from forked repo:

[![Join the chat at https://gitter.im/k06a/solidity-profiler](https://badges.gitter.im/k06a/solidity-profiler.svg)](https://gitter.im/k06a/solidity-profiler?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/solidity-profiler.svg)](https://badge.fury.io/js/solidity-profiler)
[![CircleCI](https://circleci.com/gh/k06a/solidity-profiler.svg?style=svg)](https://circleci.com/gh/k06a/solidity-profiler)
[![codecov](https://codecov.io/gh/k06a/solidity-profiler/branch/master/graph/badge.svg)](https://codecov.io/gh/k06a/solidity-profiler)
[![Stories in Ready](https://badge.waffle.io/k06a/solidity-profiler.png?label=ready&title=Ready)](https://waffle.io/k06a/solidity-profiler?utm_source=badge)

### Gas profiling for Solidity smart contracts

Let's optimize gas usage!

### Install
```
$ npm install --save-dev solidity-profiler
```

### Run

#### Option 1

```
$ ./node_modules/.bin/solidity-profiler
```

#### Option 2

```
$ $(npm bin)/solidity-profiler
```

Tests run significantly slower while profiler is being working. Your contracts are double-compiled
and a 1 to 2 minute delay between the end of the second compilation and the beginning of test execution
is possible if your test suite is large. Large Solidity files can also take a while to instrument.

+ Solidity fixtures / mocks / tests stored in the `tests/` directory are no longer supported. If your suite uses native Solidity testing or accesses contracts via mocks stored in `tests/` (a la Zeppelin), coverage will trigger test errors because it's unable to rewrite your contract ABIs appropriately. Mocks should be relocated to the root folder's `contracts` directory. More on why this is necessary at issue [146](https://github.com/k06a/solidity-profiler/issues/146)

### Network Configuration

By default, solidity-profiler generates a stub `truffle.js` that accommodates its special gas needs and
connects to a profiler-enabled fork of the ganache-cli client called **testrpc-sc** on port 8555. This special client ships with `solidity-profiler` - there's nothing extra to download. If your tests will run on truffle's development network
using a standard `truffle.js` and ganache-cli instance, you shouldn't have to do any configuration or launch the coverage client separately. If your tests depend on logic or special options added to `truffle.js` you should declare a coverage
network there following the example below.

**Example**
```javascript
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    profiler: {
      host: "localhost",
      network_id: "*",
      port: 8555,         // <-- If you change this, also set the port option in .solprofiler.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    },
    ...etc...
  }
};
```
### Options

You can also create a `.solprofiler.js` config file in the root directory of your project and specify
additional options if necessary:

**Example:**
```javascript
module.exports = {
    port: 6545,
    testrpcOptions: '-p 6545 -u 0x54fd80d6ae7584d8e9a19fe1df43f04e5282cc43',
    testCommand: 'mocha --timeout 5000',
    norpc: true,
    dir: './secretDirectory',
    copyPackages: ['zeppelin-solidity'],
    skipFiles: ['Routers/EtherRouter.sol']
};
```


| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| accounts | *Number* | 35 | Number of accounts to launch testrpc with. |
| port   | *Number* | 8555 | Port to run testrpc on / have truffle connect to |
| norpc | *Boolean* | false | Prevent solidity-profiler from launching its own testrpc. Useful if you are managing a complex test suite with a [shell script](https://github.com/OpenZeppelin/zeppelin-solidity/blob/ed872ca0a11c4926f8bb91dd103bea1378a3384c/scripts/coverage.sh) |
| testCommand | *String* | `truffle test` |  Run an arbitrary test command. ex: `mocha --timeout 5000`. NB: Also set the `port` option to whatever your tests require (probably 8545). |
| testrpcOptions | *String* | `--port 8555` | options to append to a command line invocation of testrpc. NB: Using this overwrites the defaults so always specify a port in this string *and* in the `port` option |
| copyNodeModules | *Boolean* | false | :warning:  **DEPRECATED** use `copyPackages` instead :warning: Copies `node_modules` into the coverage environment. May significantly increase the time for coverage to complete if enabled. Useful if your contracts import solidity files from an npm installed package (and your node_modules is small). |
| copyPackages | *Array* | `[]` | Copies specific `node_modules` packages into the coverage environment. May significantly reduce the time for coverage to complete compared to `copyNodeModules`. Useful if your contracts import solidity files from an npm installed package. |
| skipFiles | *Array* | `['Migrations.sol']` | Array of contracts or folders (with paths expressed relative to the `contracts` directory) that should be skipped when doing instrumentation. `Migrations.sol` is skipped by default, and does not need to be added to this configuration option if it is used. |
| deepSkip | boolean | false | Use this if instrumentation hangs on large, skipped files (like Oraclize). It's faster. |
| dir | *String* | `.` | Solidity-profiler copies all the assets in your root directory (except `node_modules`) to a special folder where it instruments the contracts and executes the tests. `dir` allows you to define a relative path from the root directory to those assets. Useful if your contracts & tests are within their own folder as part of a larger project.|
| buildDirPath | *String* | `/build/contracts` | Build directory path for compiled smart contracts

### FAQ

Solutions to common issues people run into using this tool:

+ [Running out of gas](https://github.com/k06a/solidity-profiler/blob/master/docs/faq.md#running-out-of-gas)
+ [Running out of memory (locally and in CI)](https://github.com/k06a/solidity-profiler/blob/master/docs/faq.md#running-out-of-memory-locally-and-in-ci)
+ [Running out of time (in mocha)](https://github.com/k06a/solidity-profiler/blob/master/docs/faq.md#running-out-of-time-in-mocha)
+ [Running on windows](https://github.com/k06a/solidity-profiler/blob/master/docs/faq.md#running-on-windows)
+ [Running testrpc-sc on its own](https://github.com/k06a/solidity-profiler/blob/master/docs/faq.md#running-testrpc-sc-on-its-own)
+ [Running truffle as a local dependency](https://github.com/k06a/solidity-profiler/blob/master/docs/faq.md#running-truffle-as-a-local-dependency)
+ [Using alongside HDWalletProvider](https://github.com/k06a/solidity-profiler/blob/master/docs/faq.md#using-alongside-hdwalletprovider)
+ [Integrating into CI](https://github.com/k06a/solidity-profiler/blob/master/docs/faq.md#continuous-integration-installing-metacoin-on-travisci-with-coveralls)
+ [Why are asserts and requires highlighted as branch points?](https://github.com/k06a/solidity-profiler/blob/master/docs/faq.md#why-has-my-branch-coverage-decreased-why-is-assert-being-shown-as-a-branch-point)
+ [Why are `send` and `transfer` throwing in my tests?](https://github.com/k06a/solidity-profiler/blob/master/docs/faq.md#why-are-send-and-transfer-throwing)


### Example reports
+ [metacoin](https://sc-forks.github.io/metacoin/) (Istanbul HTML)
+ [zeppelin-solidity](https://coveralls.io/github/OpenZeppelin/zeppelin-solidity?branch=master)  (Coveralls)
+ [gnosis-contracts](https://codecov.io/gh/gnosis/gnosis-contracts/tree/master/contracts)  (Codecov)

### Contribution Guidelines

Contributions are welcome! If you're opening a PR that adds features please consider writing some
[unit tests](https://github.com/k06a/solidity-profiler/tree/master/test) for them. You could
also lint your submission with `npm run lint`. Bugs can be reported in the
[issues](https://github.com/k06a/solidity-profiler/issues).

### Contributors

+ Solidity-profiler

  + [@k06a](https://github.com/k06a)

+ Solidity-coverage (upstream)

  + [@area](https://github.com/area)
  + [@cgewecke](https://github.com/cgewecke)
  + [@adriamb](https://github.com/adriamb)
  + [@cag](https://github.com/cag)
  + [@maurelian](https://github.com/maurelian)
  + [@rudolfix](https://github.com/rudolfix)
  + [@phiferd](https://github.com/phiferd)
  + [@e11io](https://github.com/e11io)
  + [@elenadimitrova](https://github.com/elenadimitrova)
  + [@ukstv](https://github.com/ukstv)
  + [@vdrg](https://github.com/vdrg)
  + [@andresliva](https://github.com/andresilva)
  + [@DimitarSD](https://github.com/DimitarSD)
  + [@sohkai](https://github.com/sohkai)
  + [@bingen](https://github.com/bingen)
