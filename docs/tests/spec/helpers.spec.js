// ── Helpers tests ───────────────────────────────────────────────────────
describe('Helpers.escHtml', () => {
  it('escapes ampersands', () => {
    expect(Helpers.escHtml('a & b')).toBe('a &amp; b');
  });

  it('escapes less-than', () => {
    expect(Helpers.escHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes double quotes', () => {
    expect(Helpers.escHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(Helpers.escHtml("it's")).toBe("it&#39;s");
  });

  it('handles null/undefined gracefully', () => {
    expect(Helpers.escHtml(null)).toBe('');
    expect(Helpers.escHtml(undefined)).toBe('');
  });

  it('returns plain string unchanged', () => {
    expect(Helpers.escHtml('hello world')).toBe('hello world');
  });
});

describe('SearchEngine.highlight', () => {
  it('wraps matching text in <mark>', () => {
    const result = SearchEngine.highlight('hello world', 'world');
    expect(result).toContain('<mark>world</mark>');
  });

  it('is case-insensitive', () => {
    const result = SearchEngine.highlight('Hello World', 'world');
    expect(result).toContain('<mark>');
  });

  it('escapes HTML in non-matching parts', () => {
    const result = SearchEngine.highlight('<b>hello</b>', 'hello');
    expect(result).toContain('&lt;b&gt;');
  });
});
