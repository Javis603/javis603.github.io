const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('presents Token Monitor as a product with a separate source link', () => {
    assert.match(html, /A local-first desktop widget for real-time token, cost, AI Tool Limits, session, and trend monitoring/);
    assert.match(html, /href="https:\/\/javis-ai\.com\/token-monitor\/"[^>]*>\s*Visit Product Page/);
    assert.match(html, /href="https:\/\/github\.com\/Javis603\/token-monitor"[^>]*>\s*GitHub/);
});

test('summarizes current Token Monitor coverage and sync surface', () => {
    assert.match(html, /<strong>Coverage<\/strong> Multi-tool tracking/);
    assert.match(html, /<strong>Insight<\/strong> Limits \+ trends/);
    assert.match(html, /<strong>Sync<\/strong> Local-first hub/);
    assert.doesNotMatch(html, /Claude Code · Codex · OpenCode · Cursor · More/);
});
