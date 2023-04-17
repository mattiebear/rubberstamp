import { copyPattern } from '../constants';
import { matcherFn } from '../clone';

it.each(['gif', 'jpg', 'jpeg', 'png'])('matches %s', (extension) => {
	expect(matcherFn(copyPattern)(`file.${extension}`)).toBe(true);
});

it.each(['json', 'js', 'ts', 'template', 'jsx'])(
	'does not match %s',
	(extension) => {
		expect(matcherFn(copyPattern)(`file.${extension}`)).toBe(false);
	}
);
