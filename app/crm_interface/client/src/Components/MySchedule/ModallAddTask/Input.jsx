const Input = ({ placeholder, type }) => {
	return (
		<input
			className="text-xl border-b w-full py-1 px-2 outline-none"
			placeholder={`${placeholder}`}
			type={`${type}`}
		/>
	);
};

export { Input };
