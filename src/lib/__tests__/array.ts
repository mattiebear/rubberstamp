import { mapFrom } from '../array';

const fn = (s: string) => s.toUpperCase();

it.each([
	[0, ['you', 'are', 'awesome'], ['YOU', 'ARE', 'AWESOME']],
	[1, ['you', 'are', 'awesome'], ['you', 'ARE', 'AWESOME']],
	[2, ['you', 'are', 'awesome'], ['you', 'are', 'AWESOME']],
])('maps from index %i on %p to produce %p', (index, provided, expected) => {
	expect(mapFrom(index)(provided, fn)).toEqual(expected);
});
