export type Injection = Record<string, string | number>;

export interface CloneConfig {
	inject?: Injection;
}

export const clone = (
	source: string,
	destination: string,
	config: CloneConfig = {}
) => {
	return null;
};
