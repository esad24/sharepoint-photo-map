'use strict';

const build = require('@microsoft/sp-build-web');

// SASS suppressions
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Generic suppressions using regex patterns - covers all instances
build.addSuppression(/Warning - lint - .*: error @typescript-eslint\/no-explicit-any: Unexpected any\./);
build.addSuppression(/Warning - lint - .*: error @typescript-eslint\/no-floating-promises: Promises must be awaited/);
build.addSuppression(/Warning - lint - .*: error @typescript-eslint\/no-unused-vars: .* is defined but never used\./);
build.addSuppression(/Warning - lint - .*: error @rushstack\/no-new-null: Usage of "null" is deprecated/);
build.addSuppression(/Warning - lint - .*: error no-useless-escape: Unnecessary escape character/);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(require('gulp'));