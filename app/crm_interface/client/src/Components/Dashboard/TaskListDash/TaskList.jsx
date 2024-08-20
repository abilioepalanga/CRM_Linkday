import React, { useEffect, useState } from "react";
import { GrTask } from "react-icons/gr";
import { tasksURL } from "../../../apiRoutes";
import axios from "axios";

const TaskList = () => {
	const [selectedWeek, setSelectedWeek] = useState("High");
	// const [tasks, setTasks] = useState([]);
	const [tasksByPriority, setTasksByPriority] = useState({
		High: [],
		Medium: [],
		Low: [],
	});

	const fetchTasks = (status) => {
		axios
			.get(tasksURL)
			.then((response) => {
				console.log(response.data);

				const tasksByPriority = {
					High: [],
					Medium: [],
					Low: [],
				};
				for (let task of response.data) {
					if (task.status === "To Do") {
						tasksByPriority[task.priority].push(task.title);
					}
				}
				// if HIgh has no tasks, set selectedweek to medium
				if (tasksByPriority["High"].length === 0) {
					if (tasksByPriority["Medium"].length === 0) {
						setSelectedWeek("Low");
					} else {
						setSelectedWeek("Medium");
					}
				}

				setTasksByPriority(tasksByPriority);
			})
			.catch((error) => {
				console.error(`Tasks retrieval fail for status ${status}`, error);
			});
	};

	useEffect(() => {
		fetchTasks();
	}, []);


	// Dados de exemplo: tarefas agrupadas por semana
	const tasksByWeek = {
		"Semana 0": [
			"Agendar reunião de vendas",
			"Preparar apresentação do produto",
			"Negociar termos e condições do último projeto",
			"Preparar apresentação para a feira comercial",
			"Realizar pesquisa de mercado",
		],
		"Semana 2": ["Task 4", "Task 5"],
		"Semana 3": ["Task 6", "Task 7", "Task 8"],
	};

	const handleWeekChange = (e) => {
		setSelectedWeek(e.target.value);
	};

	return (
		<div className="bg-white shadow-sm  p-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2 text-blue-600 text-xl">
					<GrTask size={16} />
					<a href={"/tasks"}>
						<h1>Tarefas</h1>
					</a>
				</div>
				<div>
					<select
						className="bg-transparent font-thin text-blue-link text-xl"
						id="weekSelect"
						value={selectedWeek}
						onChange={handleWeekChange}
					>
						{Object.keys(tasksByPriority).map((week) => (
							<option key={week} value={week}>
								{week}
							</option>
						))}
					</select>
				</div>
			</div>
			<ul className="flex flex-col divide-y divide gap-2 mb-6">
				{tasksByPriority[selectedWeek].map((task, index) => (
					<div className="flex items-center gap-3" key={index}>
						<div className="bg-gray-200  w-6 h-6 rounded-md my-2"></div>
						<li key={index}>{task}</li>
					</div>
				))}
			</ul>
		</div>
	);
};

export default TaskList;
