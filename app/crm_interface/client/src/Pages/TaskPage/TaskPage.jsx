import "./TaskPage.css";
import { Icon } from "@chakra-ui/icon";
import { FaBars } from "react-icons/fa6";
import { LuBarChartBig } from "react-icons/lu";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import axios from "axios";
import randomGuy from "../../assets/random_guy.jfif";
import { tasksURL } from "../../apiRoutes";

export default function TaskPage() {
	const [tasks, setTasks] = useState([]);
	const [lastClickedStatus, setLastClickedStatus] = useState(null);

	const fetchTasks = (status) => {
		let url = tasksURL;
		if (status && status !== lastClickedStatus) {
			url = `${tasksURL}/${status}`;
			setLastClickedStatus(status);
		} else {
			setLastClickedStatus(null);
		}

		axios
			.get(url)
			.then((response) => {
				setTasks(response.data);
			})
			.catch((error) => {
				console.error(`Tasks retrieval fail for status ${status}`, error);
			});
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	return (
		<div className="container text-center m-0">
			<div className="row align-items-start">
				<div className="col">
					<div className="row align-items-start bg-light-blue p-3">
						<div className="col">
							<h1 className="text-start font-color-blue fw-bold">
								Gerenciador de Tarefas
							</h1>
						</div>
					</div>
					<div className="row align-items-start p-3">
						<div className="col-4">
							<h4 className="text-start font-color-blue fw-bold">Tarefas</h4>
						</div>
						<div className="col-4">
							<button
								type="button"
								className="bg-transparent border-0 rounded-4 me-3 d-inline-block"
								style={{ width: "50px", height: "50px" }}
								onClick={() => (window.location.href = "/tasks2")}
							>
								<Icon
									as={FaBars}
									style={{ color: "#001CAF", fontSize: "24px" }}
								/>
							</button>
							<button
								type="button"
								className="bg-transparent border border-primary rounded-4 d-inline-block"
								style={{ width: "50px", height: "50px" }}
							>
								<Icon
									as={LuBarChartBig}
									style={{ color: "#001CAF", fontSize: "24px" }}
								/>
							</button>
						</div>
					</div>
					<div className="row">
						<div className="col-3">
							<button
								type="button"
								className={`btn bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 ${lastClickedStatus === "To Do" ? "active-button" : ""}`}
								onClick={() => fetchTasks("To Do")}
							>
								A fazer
							</button>
						</div>
						<div className="col-3">
							<button
								type="button"
								className={`btn bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 ${lastClickedStatus === "In Progress" ? "active-button" : ""}`}
								onClick={() => fetchTasks("In Progress")}
							>
								Em progresso
							</button>
						</div>
						<div className="col-3">
							<button
								type="button"
								className={`btn bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 ${lastClickedStatus === "In Review" ? "active-button" : ""}`}
								onClick={() => fetchTasks("In Review")}
							>
								Revisão
							</button>
						</div>
						<div className="col-3">
							<button
								type="button"
								className={`btn bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 ${lastClickedStatus === "Done" ? "active-button" : ""}`}
								onClick={() => fetchTasks("Done")}
							>
								Feitas
							</button>
						</div>
					</div>
					<div className="bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 mt-4 text-center">
						Ativas
					</div>
					<div className="row align-items-start m-4">
						{tasks.map((task) => (
							<div className="col-3" key={task.id}>
								<div className="rounded-5 p-4 card-shadow">
									<div className="card-body">
										<h6 className="card-subtitle mb-2 text-muted text-start">
											TS{String(task.id).padStart(7, "0")}
										</h6>
										<h5 className="card-title text-start">{task.title}</h5>
									</div>
									<div className="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center mt-3">
										<div className="d-flex align-items-center">
											<span className="badge rounded-pill bg-light text-dark me-4">
												{task.estimated_time}
											</span>
											{task.priority === "Medium" ? (
												<Icon
													as={FaArrowUpLong}
													style={{ color: "#FFBD21", fontSize: "20px" }}
												/>
											) : task.priority === "High" ? (
												<Icon
													as={FaArrowUpLong}
													style={{ color: "#FF2121", fontSize: "20px" }}
												/>
											) : (
												<Icon
													as={FaArrowDownLong}
													style={{ color: "#0AC947", fontSize: "20px" }}
												/>
											)}
										</div>
										<img
											src={randomGuy}
											className="rounded-circle"
											alt="User"
											style={{ width: "30px", height: "30px" }}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 mt-4 text-center">
						Backlog
						<div className="row align-items-start m-4">
							{Array.from({ length: 3 }).map((_, index) => (
								<div className="col-4" key={index}>
									<div className=" bg-card rounded-5 p-4 card-shadow bg-white">
										<div className="card-body">
											<h6 className="card-subtitle mb-2 text-muted text-start">
												TS0001245
											</h6>
											<h5 className="card-title text-start text-black">
												UX sketches
											</h5>
										</div>
										<div className="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center mt-3">
											<div className="d-flex align-items-center">
												<span className="badge rounded-pill bg-light text-dark me-4">
													4d
												</span>
												<Icon
													as={FaArrowUpLong}
													style={{ color: "#FFBD21", fontSize: "20px" }}
												/>
											</div>
											<img
												src={randomGuy}
												className="rounded-circle"
												alt="User"
												style={{ width: "30px", height: "30px" }}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
