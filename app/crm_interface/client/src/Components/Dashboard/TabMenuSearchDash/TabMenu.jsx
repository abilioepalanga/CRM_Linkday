import React, { useState } from "react";

const TabMenu = ({ tabs, onSelect }) => {
	const [selectedTab, setSelectedTab] = useState(0);

	const handleTabClick = (index) => {
		setSelectedTab(index);
		onSelect(index);
	};

	return (
		<div className="flex gap-2 mt-2">
			{tabs.map((tab, index) => (
				<button
					key={index}
					className={`border-2 px-4 py-1 rounded-lg  ${
						selectedTab === index
							? "text-white  bg-blue-600 border-blue-600"
							: "text-gray-700 hover:text-gray-500 border-gray-500"
					}`}
					onClick={() => handleTabClick(index)}
				>
					{tab.name}
				</button>
			))}
		</div>
	);
};

export default TabMenu;
