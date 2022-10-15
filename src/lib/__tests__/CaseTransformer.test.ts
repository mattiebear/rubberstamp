import { Case, CaseTransformer } from '../CaseTransformer';

it.each([
	['hello world', Case.Camel, 'helloWorld'],
	['hello world', Case.Capital, 'Hello World'],
	['hello world', Case.Kebab, 'hello-world'],
	['hello world', Case.Pascal, 'HelloWorld'],
	['hello world', Case.Snake, 'hello_world'],
])('converts %s to %s case', (provided, caseKey, expected) => {
	const transformer = new CaseTransformer(provided);

	expect(transformer.toCase(caseKey)).toBe(expected);
});
