import { RiSearchLine } from "react-icons/ri";

const SearchInput = () => {
	return (
		<div className="flex items-center gap-2 shadow-md SearchInput px-2 py-2 mx-4 bg-white rounded-md">
			<span className="text-blue-link">
				<RiSearchLine />
			</span>
			<input
				className="placeholder-blue-link w-full px-2 py-1 outline-none"
				placeholder="Procurar na Agenda"
			/>
		</div>
	);
};

export { SearchInput };
