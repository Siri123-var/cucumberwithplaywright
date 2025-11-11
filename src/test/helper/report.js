// canonical report generator - copied from generate_report.js
const { generate } = require('multiple-cucumber-html-reporter');
const path = require('path');
const fs = require('fs');
const os = require('os');

const jsonDir = path.join(process.cwd(), 'test-results');
const reportPath = path.join(process.cwd(), 'artifacts', 'cucumber-report');

function listJsonFiles(dir) {
  try { return fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.json')); }
  catch (e) { return []; }
}

const files = listJsonFiles(jsonDir);
console.log('[report.js] Looking for cucumber json files in:', jsonDir);
console.log('[report.js] Found files:', files);

if (files.length === 0) {
  console.error('[report.js] No cucumber json files found in', jsonDir);
  process.exitCode = 1;
  return;
}

try {
  // ensure we start from a clean report directory to avoid stale assets
  if (fs.existsSync(reportPath)) {
    try { fs.rmSync(reportPath, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  }
  fs.mkdirSync(reportPath, { recursive: true });

  // Diagnostics: print feature names and URIs inside JSON files
  files.forEach(f => {
    const p = path.join(jsonDir, f);
    try {
      const payload = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (Array.isArray(payload)) payload.forEach(feat => console.log('[report.js] JSON feature:', feat.name, 'uri=', feat.uri));
    } catch (e) {
      console.warn('[report.js] Failed to parse', p, e.message);
    }
  });

  // Generate main report
  generate({
    jsonDir,
    reportPath,
    openReportInBrowser: false,
    displayDuration: true,
    pageTitle: 'Cucumber Playwright Report',
    reportName: 'project2 Test Report',
    metadata: {
      browser: { name: 'playwright-chromium', version: 'unknown' },
      device: 'Local Machine',
      platform: { name: process.platform, version: os.release() || 'unknown' }
    },
    customData: {
      title: 'Run Info',
      data: [
        { label: 'Project', value: 'project2' },
        { label: 'Executed', value: new Date().toLocaleString() }
      ]
    }
  });

  const indexFile = path.join(reportPath, 'index.html');
  if (fs.existsSync(indexFile)) console.log('[report.js] HTML report generated at:', indexFile);
  else console.warn('[report.js] Reporter finished but index.html not found.');

  // Fallback: generate per-feature pages if some features are missing
  try {
    const jsonPayload = JSON.parse(fs.readFileSync(path.join(jsonDir, files[0]), 'utf8'));
    const featuresCount = Array.isArray(jsonPayload) ? jsonPayload.length : 0;
    const featuresDir = path.join(reportPath, 'features');
    const generatedFeatures = fs.existsSync(featuresDir)
      ? fs.readdirSync(featuresDir).filter(f => f.toLowerCase().endsWith('.html'))
      : [];

    if (featuresCount > generatedFeatures.length) {
      console.log('[report.js] Fallback: generating one-page reports per feature');
      const tmpDir = path.join(process.cwd(), 'test-results', '._tmp_features');
      if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
      fs.mkdirSync(tmpDir, { recursive: true });

      const slugify = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);

      for (let i = 0; i < jsonPayload.length; i++) {
        const feat = jsonPayload[i];
        const single = [feat];
        const fname = `feature-${i + 1}.json`;
        fs.writeFileSync(path.join(tmpDir, fname), JSON.stringify(single, null, 2), 'utf8');

        const singleReportPath = path.join(featuresDir, slugify(feat.name || `feature-${i + 1}`));
        fs.mkdirSync(singleReportPath, { recursive: true });

        try {
          generate({ jsonDir: tmpDir, reportPath: singleReportPath, openReportInBrowser: false, displayDuration: true,
            pageTitle: `Feature: ${feat.name}`, reportName: feat.name || `Feature ${i + 1}` });
          console.log(`[report.js] Generated feature page for: ${feat.name} -> ${singleReportPath}`);
        } catch (e) {
          console.warn(`[report.js] Failed to generate single feature report for ${feat.name}:`, e.message);
        }
      }

      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) { }
    }
  } catch (e) {
    // non-fatal
  }

} catch (err) {
  console.error('[report.js] Failed to generate report:', err);
  process.exitCode = 1;
}
// const { generate } = require('multiple-cucumber-html-reporter');
// const path = require('path');
// const fs = require('fs');

// const jsonDir = path.join(process.cwd(), 'test-results');
// const reportPath = path.join(process.cwd(), 'artifacts', 'cucumber-report');

// function listJsonFiles(dir) {
//   try {
//     return fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.json'));
//   } catch (e) {
//     return [];
//   }
// }

// const files = listJsonFiles(jsonDir);
// console.log('Looking for cucumber json files in:', jsonDir);
// console.log('Found files:', files);

// if (files.length === 0) {
//     return;
//   console.error('No cucumber json files found in', jsonDir);
//   process.exitCode = 1;
// } else {
//   try {
//     fs.mkdirSync(reportPath, { recursive: true });

//     // Diagnostics: list feature names and URIs found in JSON files
//     try {
//       files.forEach(f => {
//         const p = path.join(jsonDir, f);
//         try {
//           const payload = JSON.parse(fs.readFileSync(p, 'utf8'));
//           if (Array.isArray(payload)) {
//             payload.forEach(feat => console.log('[report.js] JSON feature:', feat.name, 'uri=', feat.uri));
//           }
//         } catch (e) {
//           console.warn('[report.js] Failed to parse', p, e.message);
//         }
//       });
//     } catch (e) {
//       console.warn('[report.js] Diagnostics failed:', e.message);
//     }

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
//         platform: { name: process.platform, version: process.getSystemVersion?.() || 'unknown' }
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
//       console.log('HTML report generated at:', indexFile);
//     } else {
//       console.warn('Reporter finished but index.html not found.');
//     }
//   } catch (err) {
//     console.error('Failed to generate report:', err);
//     process.exitCode = 1;
//   }
// }

// // Fallback: ensure there's one feature HTML file per feature in the JSON
// try {
//   const jsonPayload = JSON.parse(fs.readFileSync(path.join(jsonDir, files[0]), 'utf8'));
//   const featuresCount = Array.isArray(jsonPayload) ? jsonPayload.length : 0;
//   const generatedFeatures = fs.existsSync(path.join(reportPath, 'features'))
//     ? fs.readdirSync(path.join(reportPath, 'features')).filter(f => f.toLowerCase().endsWith('.html'))
//     : [];

//   if (featuresCount > generatedFeatures.length) {
//     console.log('[report.js] Fallback: generating one-page reports per feature');
//     // create temp dir
//     const tmpDir = path.join(process.cwd(), 'test-results', '._tmp_features');
//     if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
//     fs.mkdirSync(tmpDir, { recursive: true });

//     const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);

//     const payload = jsonPayload;
//     for (let i = 0; i < payload.length; i++) {
//       const feat = payload[i];
//       const single = [feat];
//       const fname = `feature-${i + 1}.json`;
//       const filePath = path.join(tmpDir, fname);
//       fs.writeFileSync(filePath, JSON.stringify(single, null, 2), 'utf8');

//       const singleReportPath = path.join(reportPath, 'features', slugify(feat.name || `feature-${i + 1}`));
//       fs.mkdirSync(singleReportPath, { recursive: true });

//       try {
//         generate({
//           jsonDir: tmpDir,
//           reportPath: singleReportPath,
//           openReportInBrowser: false,
//           displayDuration: true,
//           pageTitle: `Feature: ${feat.name}`,
//           reportName: feat.name || `Feature ${i + 1}`,
//           metadata: {
//             browser: { name: 'playwright-chromium', version: 'unknown' },
//             device: 'Local Machine',
//             platform: { name: process.platform, version: process.getSystemVersion?.() || 'unknown' }
//           }
//         });
//         console.log(`[report.js] Generated feature page for: ${feat.name} -> ${singleReportPath}`);
//       } catch (e) {
//         console.warn(`[report.js] Failed to generate single feature report for ${feat.name}:`, e.message);
//       }
//     }

//     // cleanup tmp
//     try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) { /* ignore */ }
//   }
// } catch (e) {
//   // non-fatal
// }
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
// Thin wrapper for backwards compatibility.
// The real, cleaned report generator lives in generate_report.js.
// Requiring it here will execute it when running `node src/test/helper/report.js`.
require('./generate_report');