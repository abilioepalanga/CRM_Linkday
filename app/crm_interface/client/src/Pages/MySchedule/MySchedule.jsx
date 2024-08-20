import { BsPlus } from "react-icons/bs";
import { SearchInput } from "../../Components/MySchedule/SearchInput";
import ModalAddTask from "../../Components/MySchedule/ModallAddTask/ModalAddTask";
import { useState } from "react";
import WeeklyAgenda from "../../Components/MySchedule/WeeklyAgenda/WeeklyAgenda";

const MySchedule = () => {
	const [isModalOpen, setModalOpen] = useState(false);

	const openModal = () => setModalOpen(true);
	const closeModal = () => setModalOpen(false);

	return (
		<div className="bg-gray-50 pb-5 min-h-screen">
			<div className="flex flex-col mb-4">
				<div className="flex justify-between items-center p-3 ml-10 mt-20">
					<div className="flex items-center flex-row gap-4">
						<h1 className="text-blue-link text-4xl font-semibold">
							Minha Agenda
						</h1>
						<button
							onClick={openModal}
							className="flex justify-center items-center gap-2 bg-blue-link  rounded-md text-gray-200 h-10 px-3 hover:bg-blue-700"
						>
							<BsPlus size={24} />
							Criar
						</button>
					</div>
					<SearchInput />
				</div>
				<div className="ml-14  mr-8 bg-gray-50">
					<WeeklyAgenda />
				</div>
			</div>
			<ModalAddTask isOpen={isModalOpen} onClose={closeModal} />
		</div>
	);
};

export default MySchedule;
