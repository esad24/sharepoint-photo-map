'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Add the specific suppressions that are still showing
build.addSuppression(`Warning - lint - src\\webparts\\webmap\\WebmapWebPart.ts(352,38): error no-useless-escape: Unnecessary escape character: \\/.`);
build.addSuppression(`Warning - lint - src\\webparts\\webmap\\WebmapWebPart.ts(379,42): error no-useless-escape: Unnecessary escape character: \\/.`);

// Use wildcard suppression for all no-useless-escape warnings
build.addSuppression(`Warning - lint - src/webparts/webmap/**/*.ts(*,*): error no-useless-escape: Unnecessary escape character: /*.`);

// Add lint suppressions for ship builds
build.addSuppression(`Warning - lint - src/webparts/webmap/WebmapWebPart.ts(322,5): error @typescript-eslint/no-floating-promises: Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the \`void\` operator.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/WebmapWebPart.ts(352,38): error no-useless-escape: Unnecessary escape character: /.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/WebmapWebPart.ts(379,42): error no-useless-escape: Unnecessary escape character: /.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(136,58): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(145,49): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(154,21): error @typescript-eslint/no-floating-promises: Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the \`void\` operator.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(161,17): error @typescript-eslint/no-floating-promises: Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the \`void\` operator.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(176,62): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(228,66): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(266,44): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(266,60): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(266,68): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(268,22): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(297,69): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(333,51): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(333,57): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(334,18): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(401,53): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(432,26): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(488,18): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(551,49): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/ArcgisMap.ts(563,45): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/services/DataService.ts(217,29): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
build.addSuppression(`Warning - lint - src/webparts/webmap/utils/security.ts(68,58): error @rushstack/no-new-null: Usage of "null" is deprecated except when describing legacy APIs; use "undefined" instead`);

// Alternative: Suppress all lint warnings with wildcards (less specific but cleaner)
// build.addSuppression(`Warning - lint - src/webparts/webmap/**/*.ts(*,*): error @typescript-eslint/no-explicit-any: Unexpected any. Specify a different type.`);
// build.addSuppression(`Warning - lint - src/webparts/webmap/**/*.ts(*,*): error @typescript-eslint/no-floating-promises: Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the \`void\` operator.`);
// build.addSuppression(`Warning - lint - src/webparts/webmap/**/*.ts(*,*): error no-useless-escape: Unnecessary escape character: /*.`);
// build.addSuppression(`Warning - lint - src/webparts/webmap/**/*.ts(*,*): error @rushstack/no-new-null: Usage of "null" is deprecated except when describing legacy APIs; use "undefined" instead`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(require('gulp'));