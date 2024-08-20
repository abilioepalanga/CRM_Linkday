/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"white-link": "#F9F9F9",
				"blue-link": "#1D37C4",
				"green-link": "#07A43C",
				"yellon-link": "#F0D64A",
				"blue-primary": "#0c359e",
			},
		},
	},
	plugins: [],
};
