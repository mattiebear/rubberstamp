export const mapFrom =
	(from: number) => (array: string[], fn: (string: string) => string) =>
		array.map((el, index) => (index >= from ? fn(el) : el));
