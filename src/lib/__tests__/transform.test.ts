import { getTransformer, toString } from '../transform';

describe('toString()', () => {
	it.each([
		['foo', 'foo'],
		[10, '10'],
	])('converts %p to %s', (provided, expected) => {
		expect(toString(provided)).toBe(expected);
	});
});

describe('getTransformer()', () => {
	it.each([
		['$c', 'Hello World'],
		['$C', 'Hello World'],
		['c', 'Hello World'],
		['C', 'Hello World'],
		['z', 'hello world'],
		['k', 'hello-world'],
		['m', 'helloWorld'],
		['p', 'HelloWorld'],
		['s', 'hello_world'],
	])('converts tag %p into %s', (tag, expected) => {
		const transform = getTransformer(tag);
		expect(transform('hello world')).toBe(expected);
	});
});
