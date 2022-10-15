import { capitalize } from '../string';

it.each([
	['', ''],
	['A', 'A'],
	['1asd', '1asd'],
	['foo', 'Foo'],
	['z', 'Z'],
])('converts %s to %s', (provided, expected) => {
	expect(capitalize(provided)).toBe(expected);
});
