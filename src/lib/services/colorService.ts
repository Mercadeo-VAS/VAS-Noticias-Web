type RGB = { r: number; g: number; b: number }; // 0..255

const colorMapping: Record<number, string> = {
	30: '#5A39A7', // Purple
	60: '#802999', // Magenta
	90: '#BC1D58', // Crimson
	120: '#EB1D17', // Red
	150: '#F24A21', // Coral
	180: '#E57A26', // Orange
	210: '#D8AA2B', // Yellow
	240: '#6CAD40', // Yellow-Green
	270: '#00AF54', // Green
	300: '#009699', // Cyan
	330: '#0772A1', // Cyan-Blue
	360: '#1D5EB3', // Blue
};

const STEP = 30;

class ColorService {
	private _getClosestStops(d: number): { leftDeg: number; rightDeg: number } {
		const i = Math.floor(d / STEP);
		const leftDeg = i * STEP;
		const rightDeg = (leftDeg + STEP) % 360;
		return { leftDeg, rightDeg };
	}

	private _hexToRgb(hex: string): RGB {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return { r, g, b };
	}

	getHexColorFromDeg(deg: number): string {
		// Throw error if deg is greater than 360 or less than 0
		if (deg <= 0 || deg > 360) {
			throw new Error('Degree must be between 0 and 360');
		}

		let { leftDeg, rightDeg } = this._getClosestStops(deg);
		const leftColor = this._hexToRgb(colorMapping[leftDeg]);
		const rightColor = this._hexToRgb(colorMapping[rightDeg]);

		// Handle the wrap-around case for degrees
		if (leftDeg > rightDeg) {
			rightDeg += 360;
		}

		const weightedAverage: RGB = {
			r: (leftColor.r * (rightDeg - deg) + rightColor.r * (deg - leftDeg)) / STEP,
			g: (leftColor.g * (rightDeg - deg) + rightColor.g * (deg - leftDeg)) / STEP,
			b: (leftColor.b * (rightDeg - deg) + rightColor.b * (deg - leftDeg)) / STEP,
		};

		const r = Math.round(weightedAverage.r);
		const g = Math.round(weightedAverage.g);
		const b = Math.round(weightedAverage.b);

		const toHex = (x: number) => x.toString(16).padStart(2, '0').toUpperCase();

		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}
}

export default new ColorService();
