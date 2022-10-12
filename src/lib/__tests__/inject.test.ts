import { injectData } from '../inject';

it.each([
	[undefined, 'name', 'name'],
	[undefined, '__name__', '__name__'],
	[{ name: 'foo' }, '__name__', 'foo'],
	[{ name: 'foo' }, '__name__.txt', 'foo.txt'],
	[{ name: 'foo' }, '/test/__name__.txt', '/test/foo.txt'],
	[{ name: 'foo', thing: 'bar' }, '__thing__ what __name__', 'bar what foo'],
	[{ name: 'foo', thing: 'bar' }, '<thing> what __name__', 'bar what foo'],
])('injects data %p into %p to produce %p', (data, source, expected) => {
	expect(injectData(source, data)).toBe(expected);
});

it.each([
	[{ name: 'hello world' }, '__name:m__', 'helloWorld'],
	[{ name: 'hello world' }, '__name:M__', 'helloWorld'],
	[{ name: 'hello world' }, '__name:c__', 'Hello World'],
	[{ name: 'hello world' }, '__name:C__', 'Hello World'],
	[{ name: 'hello world' }, '__name:k__', 'hello-world'],
	[{ name: 'hello world' }, '__name:K__', 'hello-world'],
	[{ name: 'hello world' }, '__name:p__', 'HelloWorld'],
	[{ name: 'hello world' }, '__name:P__', 'HelloWorld'],
	[{ name: 'hello world' }, '__name:s__', 'hello_world'],
	[{ name: 'hello world' }, '__name:S__', 'hello_world'],
	[{ name: 'hello world' }, '<name:s>', 'hello_world'],
	[{ name: 'hello world' }, '<name:S>', 'hello_world'],
])('mutates data %p into %p to produce %p', (data, source, expected) => {
	expect(injectData(source, data)).toBe(expected);
});
