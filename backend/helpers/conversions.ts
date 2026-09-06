// converts raw to int, throwing if it can't be converted
export class ErrBadInput extends Error {}

export function safeInt(raw: string): number {
	const val = Number.parseInt(raw, 10);
	if (isNaN(val)) {
		throw new ErrBadInput(`can't convert ${raw} to int`);
	}
	if (val.toString() !== raw) {
		throw new ErrBadInput(`input contains garbage: '${raw}'`);
	}
	return val;
}
