import React from "react";

const DayColumn = ({ day, events }) => {
	return (
		<div className="flex flex-col flex-1 border-r last:border-r-0">
			<div className="p-2 border-b">
				<h3 className="text-center font-semibold">{day.split(" ")[0]}</h3>
				<h3 className="text-center font-semibold">{day.split(" ")[1]}</h3>
			</div>
			<div className="flex-1 p-2">
				{events.map((event, index) => (
					<div key={index} className="bg-blue-100 rounded p-2 mb-2">
						{/*{event.name}*/}
						{event}
					</div>
				))}
			</div>
		</div>
	);
};

export default DayColumn;
