// const report = require("multiple-cucumber-html-reporter");

// report.generate({
//   jsonDir: "test-results",
//   reportPath: "test-results/html",
//   metadata: {
//     browser: {
//       name: "chrome",
//       version: "60",
//     },
//     // device: "Local test machine",
//     platform: {
//       name: "Windows",
//       version: "10",
//     },
//   },
//   customData: {
//     title: "Test Info",
//     data: [
//       { label: "Project", value: "Custom project" },
//       { label: "Release", value: "1.2.3" },
//       { label: "Cycle", value: "B11221.34321" },
//     //   { label: "Execution Start Time", value: "Nov 19th 2017, 02:31 PM EST" },
//     //   { label: "Execution End Time", value: "Nov 19th 2017, 02:56 PM EST" },
//     ],
//   },
// });
const report = require("multiple-cucumber-html-reporter");
const path = require("path");

report.generate({
  // jsonDir: "test-results",
  // reportPath: "./",
  jsonDir: path.join(process.cwd(), 'test-results'),
  reportPath: path.join(process.cwd(), 'artifacts', 'cucumber-report'),
  reportName: "Cucumber Playwright Test Report",
  metadata: {
    browser: {
      name: "chrome",
      version: "120",
    },
    device: "Local Test Machine",
    platform: {
      name: "Windows",
      version: "11",
    },
  },
  customData: {
    title: "Execution Info",
    data: [
      { label: "Project", value: "Playwright + Cucumber" },
      { label: "Release", value: "v1.0.0" },
      { label: "Cycle", value: "Regression Cycle 1" },
      {
        label: "Execution Start Time",
        value: new Date().toLocaleString(),
      },
    ],
  },
});
