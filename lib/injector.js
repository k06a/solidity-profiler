const injector = {};

// These functions are used to actually inject the instrumentation events.

injector.callEvent = function injectCallEvent(contract, fileName, injectionPoint) {
  const linecount = (contract.instrumented.slice(0, injectionPoint).match(/\n/g) || []).length + 1;
  contract.runnableLines.push(linecount);
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) +
                          'emit __Profiler' + contract.contractName + '(\'' + fileName + '\',' + linecount + ',gasleft());\n' +
                          contract.instrumented.slice(injectionPoint);
};

injector.callFunctionEvent = function injectCallFunctionEvent(contract, fileName, injectionPoint, injection) {
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) +
    'emit __FunctionProfiler' + contract.contractName + '(\'' + fileName + '\',' + injection.fnId + ',gasleft());\n' +
    contract.instrumented.slice(injectionPoint);
};

injector.callBranchEvent = function injectCallFunctionEvent(contract, fileName, injectionPoint, injection) {
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) +
    (injection.openBracket ? '{' : '') +
    'emit __BranchProfiler' + contract.contractName + '(\'' + fileName + '\',' + injection.branchId + ',' + injection.locationIdx + ',gasleft())' +
    (injection.comma ? ',' : ';') +
    contract.instrumented.slice(injectionPoint);
};

injector.callEmptyBranchEvent = function injectCallEmptyBranchEvent(contract, fileName, injectionPoint, injection) {
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) +
    'else { emit __BranchProfiler' + contract.contractName + '(\'' + fileName + '\',' + injection.branchId + ',' + injection.locationIdx + ',gasleft());}\n' +
    contract.instrumented.slice(injectionPoint);
};


injector.callAssertPreEvent = function callAssertPreEvent(contract, fileName, injectionPoint, injection) {
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) +
  'emit __AssertPreProfiler' + contract.contractName + '(\'' + fileName + '\',' + injection.branchId + ',gasleft());\n' +
  contract.instrumented.slice(injectionPoint);
};

injector.callAssertPostEvent = function callAssertPostEvent(contract, fileName, injectionPoint, injection) {
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) +
  'emit __AssertPostProfiler' + contract.contractName + '(\'' + fileName + '\',' + injection.branchId + ',gasleft());\n' +
  contract.instrumented.slice(injectionPoint);
};

injector.openParen = function injectOpenParen(contract, fileName, injectionPoint, injection) {
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) + '(' + contract.instrumented.slice(injectionPoint);
};

injector.closeParen = function injectCloseParen(contract, fileName, injectionPoint, injection) {
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) + ')' + contract.instrumented.slice(injectionPoint);
};

injector.literal = function injectLiteral(contract, fileName, injectionPoint, injection) {
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) + injection.string + contract.instrumented.slice(injectionPoint);
};

injector.statement = function injectStatement(contract, fileName, injectionPoint, injection) {
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) +
    'emit __StatementProfiler' + contract.contractName + '(\'' + fileName + '\',' + injection.statementId + ',gasleft());\n' +
    contract.instrumented.slice(injectionPoint);
};

injector.eventDefinition = function injectEventDefinition(contract, fileName, injectionPoint, injection) {
  contract.instrumented = contract.instrumented.slice(0, injectionPoint) +
    'event __Profiler' + contract.contractName + '(string fileName, uint256 lineNumber, uint256 _gasleft);\n' +
    'event __FunctionProfiler' + contract.contractName + '(string fileName, uint256 fnId, uint256 _gasleft);\n' +
    'event __StatementProfiler' + contract.contractName + '(string fileName, uint256 statementId, uint256 _gasleft);\n' +
    'event __BranchProfiler' + contract.contractName + '(string fileName, uint256 branchId, uint256 locationIdx, uint256 _gasleft);\n' +
    'event __AssertPreProfiler' + contract.contractName + '(string fileName, uint256 branchId, uint256 _gasleft);\n' +
    'event __AssertPostProfiler' + contract.contractName + '(string fileName, uint256 branchId, uint256 _gasleft);\n' +

     contract.instrumented.slice(injectionPoint);
};


module.exports = injector;
