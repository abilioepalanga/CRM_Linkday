import React from "react";
import { RiSearchLine, RiArrowDropDownLine } from "react-icons/ri";
import logo from "../../assets/Shape.png";

export default function Header() {
	return (
		<div className="pl-[250px] border-b bg-gray-50 z-40 border-gray-400 py-3 right-0 fixed w-full ">
			<div className="px-4 pl-20">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="relative flex items-center">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<RiSearchLine className="text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search"
								className="pl-8 pr-3 py-1 rounded-lg border-t border-l border-r  border-b-2 border-b-gray-500 border-l-gray-300"
							/>
						</div>
						<div className="relative border-2 border-gray-400 rounded">
							<select className="px-4 py-1 border-none text-center  bg-white text-gray-700 rounded-lg cursor-pointer appearance-none">
								<option>Filter</option>
								<option>Opção 1</option>
								<option>Opção 2</option>
								<option>Opção 3</option>
							</select>

							<div className="absolute right-0 top-0 mt-2 mr-2">
								<RiArrowDropDownLine className="text-gray-700" />
							</div>
							<div className="absolute left-0 top-0 mt-[12px] ml-2">
								<img height={13} width={13} src={logo} />
							</div>
						</div>
					</div>
					<div className="bg-gray-400 w-8 h-8 rounded-full"></div>
				</div>
			</div>
		</div>
	);
}
