import { CalendarWeek } from "../../Components/Dashboard/CalendarWeek/CalendarWeek";
import { ProjectList } from "../../Components/Dashboard/ProjectList/ProjectList";
import TaskList from "../../Components/Dashboard/TaskListDash/TaskList";
//import Header from "../../Components/Header/Header";

const Dashboard = () => {
	return (
		<div className="bg-gray-50 pb-5">
			<div className="flex flex-col mb-4">
				<div className="p-3 ml-10 mt-20">
					<div className="mb-7">
						<h1 className="text-blue-link text-4xl font-semibold">Dashboard</h1>
					</div>
					<div className="grid grid-cols-6 gap-3">
						<div className="flex flex-col col-span-4 gap-4">
							<div>
								<CalendarWeek />
							</div>
							<ProjectList />
						</div>
						<div className="col-span-2 ">
							<TaskList />
							{/*<ListComunications />*/}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
