import { mapFrom } from './array';
import { capitalize } from './string';

export enum Case {
	None = 'none',
	Camel = 'camel',
	Capital = 'capital',
	Kebab = 'kebab',
	Pascal = 'pascal',
	Snake = 'snake',
}

type Joinable = Case.Capital | Case.Kebab | Case.Snake;

const JoinCharacter: Record<Joinable, string> = {
	[Case.Capital]: ' ',
	[Case.Kebab]: '-',
	[Case.Snake]: '_',
};

const isJoinableType = (key: string): key is Joinable => key in JoinCharacter;

export class CaseTransformer {
	private segments: string[];

	constructor(private source: string) {
		this.segments = this.splitSegments(this.source);
	}

	public toCase(key: Case): string {
		if (key === Case.None) {
			return this.source;
		}

		return isJoinableType(key)
			? (key === Case.Capital ? this.segments.map(capitalize) : this.segments)
					// Prettier converts next line to spaces rather than tabs
					// eslint-disable-next-line
					.join(JoinCharacter[key])
			: mapFrom(Number(key === Case.Camel))(this.segments, capitalize).join('');
	}

	private splitSegments(string: string): string[] {
		for (const delimiter of [' ', '_', '-']) {
			const split = string.split(delimiter);

			if (split.length > 1) {
				return split.map((segment) => segment.toLowerCase());
			}
		}

		const split = string.replace(/([a-z])([A-Z])/, '$1 $2').split(' ');

		return split;
	}
}
