import React from "react";

export default function DateDropdown({ getSelectedDate, selectedDate }) {
	// the dates should be today and the next two days

	const dates = [
		selectedDate.toLocaleDateString(),
		new Date(selectedDate.getTime() + 86400000).toLocaleDateString(),
		new Date(selectedDate.getTime() + 2 * 86400000).toLocaleDateString(),
	];

	return (
		<div className="relative inline-block text-left">
			<select
				className="block w-full p-1 text-gray-500 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
				onChange={getSelectedDate}
			>
				{dates.map((date, index) => (
					<option key={index} value={date}>
						{date}
					</option>
				))}
			</select>
		</div>
	);
}
