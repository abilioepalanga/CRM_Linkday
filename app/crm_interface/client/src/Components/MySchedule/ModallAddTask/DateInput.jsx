import React, { useState, useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";

const DateInput = () => {
	const [formattedDate, setFormattedDate] = useState("");
	const [showDatePicker, setShowDatePicker] = useState(true);
	const inputRef = useRef(null);

	const updateFormattedDate = (event) => {
		const inputDate = new Date(event.target.value);
		const dayOfWeek = new Intl.DateTimeFormat("pt-BR", {
			weekday: "long",
		}).format(inputDate);
		const month = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
			inputDate,
		);
		const day = inputDate.getDate();
		const year = inputDate.getFullYear();
		setFormattedDate(`${dayOfWeek} ${day} de ${month} de ${year}`);
		setShowDatePicker(false); // Após selecionar a data, oculta o campo de data
	};

	const openDatePicker = () => {
		setShowDatePicker(true);
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	return (
		<div className="flex items-center gap-2 border-b w-full">
			{showDatePicker ? (
				<input
					className="text-xl py-1 px-2 outline-none appearance-none"
					type={`date`}
					onChange={updateFormattedDate}
					ref={inputRef}
				/>
			) : (
				<div className="text-xl">
					{formattedDate}
					<button className="px-2 text-blue-link" onClick={openDatePicker}>
						<MdOutlineEdit />
					</button>
				</div>
			)}
			<div className="flex gap-1">
				<input className="text-xl py-1 px-2 outline-none" type={`time`} />
				<span className="text-xl font-bold">-</span>
				<input className="text-xl py-1 px-2 outline-none" type={`time`} />
			</div>
		</div>
	);
};

export { DateInput };
