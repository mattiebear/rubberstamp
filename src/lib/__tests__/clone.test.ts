import { fs, vol } from 'memfs';

import { clone, matcherFn } from '../clone';

jest.mock('fs/promises');

const simpleStructure = {
	'./foo.txt': 'bar',
	'./bar/foo.txt': 'boof',
	'./bar/baz/foo.txt': 'boop',
};

const ignoreStructure = {
	'./foo.txt': 'bar',
	'./bar/foo.txt': 'boof',
	'./baz/bar.txt': 'floof',
};

const existingStructure = {
	...simpleStructure,
	'/tmp/foo.txt': 'boo',
	'/tmp/bar/foo.txt': 'boo',
	'/tmp/bar/baz/foo.txt': 'boo',
};

const injectedStructure = {
	'./__name__.txt': 'bar',
	'./foo.txt': '__name__',
	'./__name__/foo.txt': 'boof',
};

const caseStructure = {
	'./__name$p__.txt': 'bar',
	'./foo.txt': '__name$p__',
	'./__name$p__/foo.txt': 'boof',
};

const templateStructure = {
	'./__name__.txt.template': 'bar',
};

const nestedStructure = {
	'./__name$p__.txt': '__name$p__',
	'./dir/__name$p__.txt': '__name$p__',
};

beforeEach(() => vol.reset());

it('returns a promise', async () => {
	vol.fromJSON(simpleStructure, '/test');

	const result = clone('/test', '/tmp');

	await result;

	expect(result).toBeInstanceOf(Promise);
});

it("creates the destination directory if it doesn't exist", async () => {
	vol.fromJSON(simpleStructure, '/test');

	await clone('/test', '/tmp');

	expect(fs.existsSync('/tmp')).toBe(true);
});

it('creates new directories based on the source structure', async () => {
	vol.fromJSON(simpleStructure, '/test');

	await clone('/test', '/tmp');

	expect(fs.existsSync('/tmp/bar')).toBe(true);
	expect(fs.existsSync('/tmp/bar/baz')).toBe(true);
});

it('copies files to the new directories', async () => {
	vol.fromJSON(simpleStructure, '/test');

	await clone('/test', '/tmp');

	expect(fs.existsSync('/tmp/foo.txt')).toBe(true);
	expect(fs.existsSync('/tmp/bar/foo.txt')).toBe(true);
	expect(fs.existsSync('/tmp/bar/baz/foo.txt')).toBe(true);
});

it('overwrites files if they already exist', async () => {
	vol.fromJSON(existingStructure, '/test');

	await clone('/test', '/tmp');

	expect(fs.readFileSync('/tmp/foo.txt', 'utf8')).toBe('bar');
	expect(fs.readFileSync('/tmp/bar/foo.txt', 'utf8')).toBe('boof');
	expect(fs.readFileSync('/tmp/bar/baz/foo.txt', 'utf8')).toBe('boop');
});

it('populates file names with injected data', async () => {
	vol.fromJSON(injectedStructure, '/test');

	const inject = { name: 'armadillo' };

	await clone('/test', '/tmp', { inject });

	expect(fs.existsSync('/tmp/armadillo.txt')).toBe(true);
});

it('populates file contents with injected data', async () => {
	vol.fromJSON(injectedStructure, '/test');

	const inject = { name: 'armadillo' };

	await clone('/test', '/tmp', { inject });

	expect(fs.readFileSync('/tmp/foo.txt', 'utf8')).toBe('armadillo');
});

it('populates directory names with injected data', async () => {
	vol.fromJSON(injectedStructure, '/test');

	const inject = { name: 'armadillo' };

	await clone('/test', '/tmp', { inject });

	expect(fs.existsSync('/tmp/armadillo/foo.txt')).toBe(true);
});

it('mutates the case of file names', async () => {
	vol.fromJSON(caseStructure, '/test');

	const inject = { name: 'happy badger' };

	await clone('/test', '/tmp', { inject });

	expect(fs.existsSync('/tmp/HappyBadger.txt')).toBe(true);
});

it('mutates the case of file contents', async () => {
	vol.fromJSON(caseStructure, '/test');

	const inject = { name: 'happy badger' };

	await clone('/test', '/tmp', { inject });

	expect(fs.readFileSync('/tmp/foo.txt', 'utf8')).toBe('HappyBadger');
});

it('mutates the case of directory names', async () => {
	vol.fromJSON(caseStructure, '/test');

	const inject = { name: 'happy badger' };

	await clone('/test', '/tmp', { inject });

	expect(fs.existsSync('/tmp/HappyBadger/foo.txt')).toBe(true);
});

it('removes .template from file names', async () => {
	vol.fromJSON(templateStructure, '/test');

	const inject = { name: 'foo' };

	await clone('/test', '/tmp', { inject });

	expect(fs.existsSync('/tmp/foo.txt')).toBe(true);
});

it('injects data through multiple levels', async () => {
	vol.fromJSON(nestedStructure, '/test');

	const inject = { name: 'foo' };

	await clone('/test', '/tmp', { inject });

	expect(fs.existsSync('/tmp/Foo.txt')).toBe(true);
	expect(fs.existsSync('/tmp/dir/Foo.txt')).toBe(true);
});

it.each(['foo'])('ignores specifed file patterns', async (pattern) => {
	vol.fromJSON(ignoreStructure, '/test');

	const result = clone('/test', '/tmp', { ignorePattern: pattern });

	await result;

	expect(fs.existsSync('/tmp/baz/bar.txt')).toBe(true);
	expect(fs.existsSync('/tmp/foo.txt')).toBe(false);
	expect(fs.existsSync('/tmp/bar/foo.txt')).toBe(false);
});

describe('matcherFn()', () => {
	it('returns false if no matcher is provided', () => {
		const matches = matcherFn();

		expect(matches('')).toBe(false);
		expect(matches('test')).toBe(false);
	});

	it.each([
		['foo', 'foo', true],
		['foo', 'bar', false],
		['foo', /foo/, true],
		['foo/bar', /bar/, true],
		['foo/bar', ['baz'], false],
		['foo/bar', ['bar'], true],
		['foo/bar', [/bar/], true],
		['foo/bar', [/flim/, 'flam'], false],
		['foo/bar', [/flim/, 'flam', 'foo'], true],
	])(
		'returns true if no matcher is provided (%s, %p, %p)',
		(name, pattern, expected) => {
			const matches = matcherFn(pattern);

			expect(matches(name)).toBe(expected);
		}
	);
});
