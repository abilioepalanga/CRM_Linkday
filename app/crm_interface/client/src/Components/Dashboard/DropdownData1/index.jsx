// src/components/DateDropdown.js

import React from "react";

function DateDropdown1() {
	const dates = [
		"Wed Octorber 30, 2024",
		"Wed Octorber 30, 2024",
		"Wed Octorber 30, 2024",
		// Adicione mais datas conforme necessário
	];

	return (
		<div className="relative inline-block text-left">
			<select className="block w-full p-2 text-gray-800 bg-white  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
				{dates.map((date, index) => (
					<option key={index} value={date}>
						{date}
					</option>
				))}
			</select>
		</div>
	);
}

export default DateDropdown1;
