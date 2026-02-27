// ── Minimal Browser Test Framework ─────────────────────────────────────
// Usage: describe('Suite', () => { it('test', () => { expect(x).toBe(y); }); });

const _tests = [];
let _currentSuite = '';

function describe(name, fn) {
  _currentSuite = name;
  fn();
  _currentSuite = '';
}

function beforeEach(fn) {
  // Attach to last describe block — simple approach: store as setup on last group
  const last = _tests[_tests.length - 1];
  if (last && last._suite === _currentSuite) {
    // Retroactively not trivial — instead we store pending setup
    window._pendingSetup = fn;
  }
}

function it(name, fn) {
  _tests.push({ suite: _currentSuite, name, fn, setup: window._pendingSetup || null });
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected)
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected))
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy value but got ${JSON.stringify(actual)}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy value but got ${JSON.stringify(actual)}`);
    },
    toContain(item) {
      if (!actual.includes(item))
        throw new Error(`Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`);
    },
    toBeGreaterThan(n) {
      if (actual <= n) throw new Error(`Expected ${actual} > ${n}`);
    },
    toHaveLength(n) {
      if (actual.length !== n)
        throw new Error(`Expected length ${n} but got ${actual.length}`);
    },
    not: {
      toBe(expected) {
        if (actual === expected)
          throw new Error(`Expected not ${JSON.stringify(expected)}`);
      },
      toContain(item) {
        if (actual.includes(item))
          throw new Error(`Expected ${JSON.stringify(actual)} NOT to contain ${JSON.stringify(item)}`);
      },
    },
  };
}

async function runAllTests() {
  const results = { pass: 0, fail: 0, items: [] };
  window._pendingSetup = null;

  for (const t of _tests) {
    try {
      if (t.setup) t.setup();
      await t.fn();
      results.pass++;
      results.items.push({ suite: t.suite, name: t.name, ok: true });
    } catch(e) {
      results.fail++;
      results.items.push({ suite: t.suite, name: t.name, ok: false, error: e.message });
    }
  }
  return results;
}
