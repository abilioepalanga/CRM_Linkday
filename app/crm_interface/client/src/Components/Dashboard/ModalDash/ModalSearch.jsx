import React, { useState } from "react";
import TabMenu from "../TabMenuSearchDash/TabMenu";
import { RiSearchLine } from "react-icons/ri";
import { IoCloseCircleOutline } from "react-icons/io5";

const ModalSearch = ({ isOpen, onClose }) => {
	const [selectedTab, setSelectedTab] = useState(0);
	const [selectedOptions, setSelectedOptions] = useState([]);

	const tabs = [
		{
			name: "Projetos",
			subOptions: [{ name: "Projeto 1" }, { name: "Projeto 2" }],
		},
		{
			name: "Comunicações",
			subOptions: [{ name: "Comunicação 1" }, { name: "Comunicação 2" }],
		},
		{
			name: "Tarefas",
			subOptions: [{ name: "Tarefa 1" }, { name: "Tarefa 2" }],
		},
		{ name: "Outros", subOptions: [{ name: "Outro 1" }, { name: "Outro 2" }] },
	];

	const handleTabSelect = (index) => {
		setSelectedTab(index);
		setSelectedOptions([]); // Limpa as seleções ao mudar de aba
	};

	const handleOptionSelect = (optionName) => {
		if (selectedOptions.includes(optionName)) {
			setSelectedOptions(
				selectedOptions.filter((option) => option !== optionName),
			);
		} else {
			setSelectedOptions([...selectedOptions, optionName]);
		}
	};

	return (
		<div
			className={`fixed right-0 top-0 left-0 w-full h-full z-50 bg-black bg-opacity-50 flex justify-center ${isOpen ? "block" : "hidden"}`}
		>
			<div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg p-6 min-w-[800px]">
				<div className="w-full flex justify-between items-center mb-4">
					<div className="relative flex items-center">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<RiSearchLine size={20} className="text-gray-400" />
						</div>
						<input
							type="text"
							placeholder="Pesquisar"
							className="pl-12 pr-3 py-1 border-b outline-none w-[300px]  border-b-gray-400 border-l-gray-300"
						/>
					</div>
					<button onClick={onClose}>
						<IoCloseCircleOutline size={24} />
					</button>
				</div>
				<div className="">
					<h1 className="text-gray-600">Filtrar por...</h1>
					<div>
						<TabMenu tabs={tabs} onSelect={handleTabSelect} />
						{/* Conteúdo da aba selecionada */}
						<div className="p-4">
							{tabs[selectedTab]?.subOptions?.map((subOption, index) => (
								<div key={index} className="py-2 flex gap-2 items-center">
									<input
										type="checkbox"
										id={subOption.name}
										checked={selectedOptions.includes(subOption.name)}
										onChange={() => handleOptionSelect(subOption.name)}
										className="appearance-none hover:cursor-pointer h-5 w-5 border-2 border-gray-800 rounded-md checked:bg-blue-500 checked:border-transparent focus:outline-none"
									/>
									<label
										htmlFor={subOption.name}
										className="select-none hover:cursor-pointer"
									>
										{subOption.name}
									</label>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export { ModalSearch };
