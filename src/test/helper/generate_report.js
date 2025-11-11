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
console.log('[generate_report] Looking for cucumber json files in:', jsonDir);
console.log('[generate_report] Found files:', files);

if (files.length === 0) {
  console.error('[generate_report] No cucumber json files found in', jsonDir);
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
      if (Array.isArray(payload)) payload.forEach(feat => console.log('[generate_report] JSON feature:', feat.name, 'uri=', feat.uri));
    } catch (e) {
      console.warn('[generate_report] Failed to parse', p, e.message);
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
  if (fs.existsSync(indexFile)) console.log('[generate_report] HTML report generated at:', indexFile);
  else console.warn('[generate_report] Reporter finished but index.html not found.');

  // Fallback: generate per-feature pages if some features are missing
  try {
    const jsonPayload = JSON.parse(fs.readFileSync(path.join(jsonDir, files[0]), 'utf8'));
    const featuresCount = Array.isArray(jsonPayload) ? jsonPayload.length : 0;
    const featuresDir = path.join(reportPath, 'features');
    const generatedFeatures = fs.existsSync(featuresDir)
      ? fs.readdirSync(featuresDir).filter(f => f.toLowerCase().endsWith('.html'))
      : [];

    if (featuresCount > generatedFeatures.length) {
      console.log('[generate_report] Fallback: generating one-page reports per feature');
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
          console.log(`[generate_report] Generated feature page for: ${feat.name} -> ${singleReportPath}`);
        } catch (e) {
          console.warn(`[generate_report] Failed to generate single feature report for ${feat.name}:`, e.message);
        }
      }

      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) { }
    }
  } catch (e) {
    // non-fatal
  }

} catch (err) {
  console.error('[generate_report] Failed to generate report:', err);
  process.exitCode = 1;
}
