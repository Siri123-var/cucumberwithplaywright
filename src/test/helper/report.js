// // // // // const report = require("multiple-cucumber-html-reporter");

// // // // // report.generate({
// // // // //   jsonDir: "test-results",
// // // // //   reportPath: "test-results/html",
// // // // //   metadata: {
// // // // //     browser: {
// // // // //       name: "chrome",
// // // // //       version: "60",
// // // // //     },
// // // // //     // device: "Local test machine",
// // // // //     platform: {
// // // // //       name: "Windows",
// // // // //       version: "10",
// // // // //     },
// // // // //   },
// // // // //   customData: {
// // // // //     title: "Test Info",
// // // // //     data: [
// // // // //       { label: "Project", value: "Custom project" },
// // // // //       { label: "Release", value: "1.2.3" },
// // // // //       { label: "Cycle", value: "B11221.34321" },
// // // // //     //   { label: "Execution Start Time", value: "Nov 19th 2017, 02:31 PM EST" },
// // // // //     //   { label: "Execution End Time", value: "Nov 19th 2017, 02:56 PM EST" },
// // // // //     ],
// // // // //   },
// // // // // });
// // // // const report = require("multiple-cucumber-html-reporter");
// // // // const path = require("path");

// // // // report.generate({
// // // //   // jsonDir: "test-results",
// // // //   // reportPath: "./",
// // // //   jsonDir: path.join(process.cwd(), 'test-results'),
// // // //   reportPath: 'test-results/html',
// // // //   reportName: "Cucumber Playwright Test Report",
// // // //   metadata: {
// // // //     browser: {
// // // //       name: "chrome",
// // // //       version: "120",
// // // //     },
// // // //     device: "Local Test Machine",
// // // //     platform: {
// // // //       name: "Windows",
// // // //       version: "11",
// // // //     },
// // // //   },
// // // //   customData: {
// // // //     title: "Execution Info",
// // // //     data: [
// // // //       { label: "Project", value: "Playwright + Cucumber" },
// // // //       { label: "Release", value: "v1.0.0" },
// // // //       { label: "Cycle", value: "Regression Cycle 1" },
// // // //       {
// // // //         label: "Execution Start Time",
// // // //         value: new Date().toLocaleString(),
// // // //       },
// // // //     ],
// // // //   },
// // // // });
// // // const { generate } = require('multiple-cucumber-html-reporter');
// // // const path = require('path');
// // // const fs = require('fs');
// // // const os = require('os');

// // // const jsonDir = path.join(process.cwd(), 'test-results');
// // // const reportPath = path.join(process.cwd(), 'artifacts', 'cucumber-report');

// // // // ensure jsonDir exists and has files
// // // if (!fs.existsSync(jsonDir) || fs.readdirSync(jsonDir).length === 0) {
// // //   console.error('No cucumber json files found in', jsonDir);
// // //   process.exitCode = 1;
// // // } else {
// // //   try {
// // //     generate({
// // //       jsonDir,
// // //       reportPath,
// // //       openReportInBrowser: false,
// // //       displayDuration: true,
// // //       pageTitle: 'Cucumber Playwright Report',
// // //       metadata: {
// // //         browser: { name: 'playwright-chromium', version: 'unknown' },
// // //         device: 'Local Machine',
// // //         platform: { name: process.platform, version: os.release() || 'unknown' }
// // //       },
// // //       customData: {
// // //         title: 'Run Info',
// // //         data: [
// // //           { label: 'Project', value: 'project2' },
// // //           { label: 'Executed', value: new Date().toLocaleString() }
// // //         ]
// // //       }
// // //     });
// // //     console.log('HTML report generated at:', path.join(reportPath, 'index.html'));
// // //   } catch (err) {
// // //     console.error('Failed to generate report:', err);
// // //     process.exitCode = 1;
// // //   }
// // // }

// // // ...existing code...
// // const { generate } = require('multiple-cucumber-html-reporter');
// // const path = require('path');
// // const fs = require('fs');
// // const os = require('os');

// // const jsonDir = path.join(process.cwd(), 'test-results');
// // const reportPath = path.join(process.cwd(), 'artifacts', 'cucumber-report');

// // function listJsonFiles(dir: string): string[] {
// //   try {
// //     return fs.readdirSync(dir).filter((f: string) => f.toLowerCase().endsWith('.json'));
// //   } catch (e) {
// //     return [];
// //   }
// // }

// // const files = listJsonFiles(jsonDir);
// // console.log('Looking for cucumber json files in:', jsonDir);
// // console.log('Found files:', files);

// // if (files.length === 0) {
// //   console.error('No cucumber json files found in', jsonDir);
// //   console.error('Make sure cucumber-js produced JSON (check your cucumber.json or CLI --format).');
// //   process.exitCode = 1;
// // } else {
// //   try {
// //     fs.mkdirSync(reportPath, { recursive: true });

// //     generate({
// //       jsonDir,
// //       reportPath,
// //       openReportInBrowser: false,
// //       displayDuration: true,
// //       pageTitle: 'Cucumber Playwright Report',
// //       reportName: 'project2 Test Report',
// //       metadata: {
// //         browser: { name: 'playwright-chromium', version: 'unknown' },
// //         device: 'Local Machine',
// //         platform: { name: process.platform, version: os.release() || 'unknown' }
// //       },
// //       customData: {
// //         title: 'Run Info',
// //         data: [
// //           { label: 'Project', value: 'project2' },
// //           { label: 'Executed', value: new Date().toLocaleString() }
// //         ]
// //       }
// //     });

// //     const indexFile = path.join(reportPath, 'index.html');
// //     if (fs.existsSync(indexFile)) {
// //       console.log('HTML report generated at:', indexFile);
// //     } else {
// //       console.warn('Reporter finished but index.html not found. Check reporter output for errors.');
// //     }
// //   } catch (err) {
// //     console.error('Failed to generate report:', err);
// //     process.exitCode = 1;
// //   }
// // }
// // // ...existing code...
// const { generate } = require('multiple-cucumber-html-reporter');
// const path = require('path');
// const fs = require('fs');
// const os = require('os');

// const jsonDir = path.join(process.cwd(), 'test-results');
// const reportPath = path.join(process.cwd(), 'artifacts', 'cucumber-report');

// function listJsonFiles(dir: string): string[] {
//   try { return fs.readdirSync(dir).filter((f: string) => f.toLowerCase().endsWith('.json')); }
//   catch (e) { return []; }
// }

// const files = listJsonFiles(jsonDir);
// console.log('Looking for cucumber json files in:', jsonDir);
// console.log('Found files:', files);

// if (files.length === 0) {
//   console.error('No cucumber json files found in', jsonDir);
//   console.error('Make sure cucumber-js produced JSON (check your cucumber.json or the --format CLI option).');
//   process.exitCode = 1;
// } else {
//   try {
//     fs.mkdirSync(reportPath, { recursive: true });

//     generate({
//       jsonDir,
//       reportPath,
//       openReportInBrowser: false,
//       displayDuration: true,
//       pageTitle: 'Cucumber Playwright Report',
//       reportName: 'project2 Test Report',
//       metadata: {
//         browser: { name: 'playwright-chromium', version: 'unknown' },
//         device: 'Local Machine',
//         platform: { name: process.platform, version: os.release() || 'unknown' }
//       },
//       customData: {
//         title: 'Run Info',
//         data: [
//           { label: 'Project', value: 'project2' },
//           { label: 'Executed', value: new Date().toLocaleString() }
//         ]
//       }
//     });

//     const indexFile = path.join(reportPath, 'index.html');
//     if (fs.existsSync(indexFile)) {
//       console.log('HTML report successfully generated at:', indexFile);
//     } else {
//       console.warn('Reporter finished but index.html not found. Check console for errors above.');
//     }
//   } catch (err) {
//     console.error('Failed to generate report:', err);
//     process.exitCode = 1;
//   }
// }
// Create this file at: src/test/helper/report.js
const report = require('multiple-cucumber-html-reporter');
const path = require('path');
const fs = require('fs');

// Clear and create artifacts directory
const artifactsDir = path.join(process.cwd(), 'artifacts');
const reportDir = path.join(artifactsDir, 'cucumber-report');
if (fs.existsSync(reportDir)) {
    fs.rmSync(reportDir, { recursive: true, force: true });
}
fs.mkdirSync(reportDir, { recursive: true });

// Generate the report
report.generate({
    jsonDir: path.join(process.cwd(), 'test-results'),
    reportPath: reportDir,
    metadata: {
        browser: {
            name: 'chrome',
            version: '120'
        },
        device: 'Local test machine',
        platform: {
            name: 'windows',
            version: '10'
        }
    },
    customData: {
        title: 'Run info',
        data: [
            { label: 'Project', value: 'Project2' },
            { label: 'Release', value: '1.0.0' },
            { label: 'Execution Start Time', value: new Date().toISOString() }
        ]
    }
});