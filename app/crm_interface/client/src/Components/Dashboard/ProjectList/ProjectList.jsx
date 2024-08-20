import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import axios from "axios";
import { projectsURL } from "../../../apiRoutes";

const ProjectList = () => {
	const authHeader = useAuthHeader();
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		fetchProjects();
	}, []); // Fetch projects when component mounts

	const fetchProjects = () => {
		axios
			.get(projectsURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				const ps = response.data;
				// sort by recent
				ps.sort((a, b) => {
					return new Date(b.start_date) - new Date(a.start_date);
				});
				setProjects(ps);
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	return (
		<div className="bg-white p-3 shadow-sm">
			<div className="flex justify-between items-center border-b">
				<h1 className="text-xl text-blue-600 mb-4">Projetos</h1>
				<a
					href="/projects"
					className=" flex items-center text-md font-thin text-blue-600"
				>
					<span className="mt-[-6px] mr-2">Ver Todos</span>{" "}
					<IoIosArrowForward />
				</a>
			</div>
			<div className="flex flex-col gap-1 divide-y">
				{projects.slice(0, 4).map((project) => (
					<div
						key={project.id}
						className="grid divide-x-2 grid-cols-5 p-2 rounded-lg"
					>
						<div className="col-span-2">
							<a href={`/projects/${project.id}`}>
								<h2 className="text-lg font-bold">{project.name}</h2>
							</a>
							<p className="text-gray-500 mb-2 text-sm">
								Data: {project.start_date}
							</p>
							<p
								className={`font-semibold underline mt-6  ${project.priority === "Alta" ? "text-green-500" : project.priority === "Média" ? "text-yellow-500" : "text-gray-500"}`}
							>
								Prioridade: {project.priority}
							</p>
						</div>
						<div className="col-span-3 pl-4">
							<h2 className="text-lg font-bold">Estado</h2>
							<div className="flex gap-3">
								<div>
									<p className="text-gray-500 mb-2 text-sm">Todas as Tarefas</p>
									<p className="font-bold">{project.total_tasks}</p>
								</div>
								<div>
									<p className="text-gray-500 mb-2 text-sm">Tarefas Ativas</p>
									<p className="font-bold">{project.active_tasks}</p>
								</div>
								{/*
								<div className="flex flex-col">
									<p className="text-gray-500 mb-2 text-sm">Equipa</p>
									<div className="flex items-center px-8">
									</div>
								</div>
								*/}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export { ProjectList };
