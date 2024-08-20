import { IoOptions } from "react-icons/io5";
import { FiPhone } from "react-icons/fi";
import img from "../../../assets/ps.jpg";

const ListComunications = () => {
	const communications = [
		{
			id: 1,
			user: { name: "Natália Fernandes", photo: "../../../assets/verify.png" },
			message: "Hello there!",
		},
		{
			id: 2,
			user: { name: "Isabel Nunes", photo: "../../../assets/verify.png" },
			message: "Hello there!",
		},
		{
			id: 3,
			user: { name: "Jane Smith", photo: "url_da_foto_jane" },
			message: "Hi! How are you?",
		},
		{
			id: 4,
			user: { name: "Tom Brown", photo: "url_da_foto_tom" },
			message: "Good morning!",
		},
	];

	return (
		<div className="bg-white shadow-sm p-4 mt-4">
			<div className="flex flex-col">
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center gap-2 text-blue-600 text-xl">
						<FiPhone size={18} /> <h1 className="">Comunicações</h1>
					</div>
					<div className="text-blue-600">
						<IoOptions size={20} />
					</div>
				</div>
				<div>
					<ul>
						{communications.map((communication) => (
							<li
								className="flex gap-3 items-center"
								key={communication.id}
								style={{ marginBottom: "20px" }}
							>
								<div>
									<img
										height={200}
										width={500}
										className="h-[60px] w-[60px] rounded-full bg-gray-400"
										src={img}
										alt={communication.user.name}
									/>
								</div>
								<div>
									<strong>{communication.user.name}</strong>
									<p>{communication.message}</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export { ListComunications };
