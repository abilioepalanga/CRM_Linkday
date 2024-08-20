// utils/dateUtils.js
export const getWeekDays = (currentDate) => {
	const startOfWeek = currentDate.getDate() - currentDate.getDay() + 1; // Get Monday of the current week
	const weekDays = [];

	for (let i = 0; i < 7; i++) {
		const date = new Date(currentDate);
		date.setDate(startOfWeek + i);
		weekDays.push(date);
	}

	return weekDays;
};
