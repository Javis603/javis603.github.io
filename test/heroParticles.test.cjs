const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
    computePointerDisplacement,
    createDepthFieldTargets,
    getMonogramMaskLayout,
    sampleParticleTargetsFromMask,
    resolveHeroParticleCount,
} = require('../js/hero-particles.js');

function setPixel(data, width, x, y, rgba) {
    const i = (y * width + x) * 4;
    data[i] = rgba[0];
    data[i + 1] = rgba[1];
    data[i + 2] = rgba[2];
    data[i + 3] = rgba[3];
}

test('samples deterministic particle targets from visible mask pixels', () => {
    const width = 6;
    const height = 4;
    const data = new Uint8ClampedArray(width * height * 4);
    const visiblePixels = [
        [1, 1, [230, 230, 238, 255]],
        [2, 1, [205, 214, 228, 255]],
        [3, 1, [228, 229, 236, 255]],
        [2, 2, [180, 196, 222, 255]],
    ];

    visiblePixels.forEach(([x, y, rgba]) => setPixel(data, width, x, y, rgba));

    const targets = sampleParticleTargetsFromMask({
        data,
        width,
        height,
        count: 12,
        seed: 7,
        jitter: 0,
    });

    assert.equal(targets.length, 12);
    assert.deepEqual(
        targets.map(target => [target.x, target.y, target.accent]),
        sampleParticleTargetsFromMask({ data, width, height, count: 12, seed: 7, jitter: 0 })
            .map(target => [target.x, target.y, target.accent])
    );

    const allowed = new Set(visiblePixels.map(([x, y]) => `${x},${y}`));
    assert.ok(targets.every(target => allowed.has(`${target.x},${target.y}`)));
    assert.ok(targets.every(target => !target.accent));
    assert.ok(targets.every(target => target.depth >= 0 && target.depth <= 1));
});

test('resolves smaller particle budgets for compact or reduced-motion contexts', () => {
    assert.equal(resolveHeroParticleCount({ width: 1400, reduceMotion: false }), 3600);
    assert.equal(resolveHeroParticleCount({ width: 900, reduceMotion: false }), 2800);
    assert.equal(resolveHeroParticleCount({ width: 700, reduceMotion: false }), 1700);
    assert.equal(resolveHeroParticleCount({ width: 390, reduceMotion: false }), 0);
    assert.equal(resolveHeroParticleCount({ width: 900, reduceMotion: true }), 760);
});

test('computes a local pointer field that affects nearby particles only', () => {
    const near = computePointerDisplacement({
        x: 120,
        y: 100,
        pointerX: 100,
        pointerY: 100,
        radius: 90,
        strength: 28,
    });
    const far = computePointerDisplacement({
        x: 260,
        y: 100,
        pointerX: 100,
        pointerY: 100,
        radius: 90,
        strength: 28,
    });

    assert.ok(near.x > 10);
    assert.ok(Math.abs(near.y) < 0.001);
    assert.deepEqual(far, { x: 0, y: 0, alpha: 0 });
});

test('computes a broad soft pointer field with subtle tangential refraction', () => {
    const middle = computePointerDisplacement({
        x: 155,
        y: 100,
        pointerX: 100,
        pointerY: 100,
        radius: 120,
        strength: 60,
        swirlStrength: 10,
    });

    assert.ok(middle.x > 24);
    assert.ok(middle.y > 4);
    assert.ok(middle.alpha > 0.5);
});

test('keeps the monogram mask upright and readable', () => {
    const layout = getMonogramMaskLayout(480);

    assert.ok(Math.abs(layout.rotation) < 0.04);
    assert.ok(layout.scaleX >= 0.96 && layout.scaleX <= 1.04);
    assert.ok(layout.scaleY >= 0.96 && layout.scaleY <= 1.04);
    assert.ok(layout.fontScale >= 0.5);
});

test('creates a restrained cool-toned depth field around the monogram', () => {
    const targets = createDepthFieldTargets({
        width: 500,
        height: 420,
        count: 120,
        seed: 11,
    });

    assert.equal(targets.length, 120);
    assert.ok(targets.every(target => target.x > 500 * 0.1 && target.x < 500 * 0.9));
    assert.ok(targets.every(target => target.y > 420 * 0.18 && target.y < 420 * 0.82));
    assert.ok(targets.every(target => !target.accent));
    assert.ok(targets.every(target => target.alpha <= 0.26));
    assert.ok(targets.some(target => target.field));
});

test('does not draw visible pointer halo or canvas drop-shadow that exposes the canvas box', () => {
    const script = fs.readFileSync(path.join(__dirname, '..', 'js', 'hero-particles.js'), 'utf8');
    const styles = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

    assert.ok(!script.includes('createRadialGradient(pointer.x'));
    assert.ok(!script.includes('halo.addColorStop'));
    assert.ok(!styles.includes('drop-shadow(0 0 18px'));
    assert.ok(!styles.includes('.hero-mark::before'));
    assert.ok(!styles.includes('.hero-mark::after'));
});

test('keeps the hero particle renderer on a single animation frame loop', () => {
    const script = fs.readFileSync(path.join(__dirname, '..', 'js', 'hero-particles.js'), 'utf8');

    assert.ok(!script.includes('if (!reduceMotion && particles.length) frameId = requestAnimationFrame(paint);'));
    assert.ok(script.includes('if (!particles.length) return;'));
});
