import "./Header.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import {
	FaBriefcase,
	FaPhone,
	FaUserFriends,
	FaHandshake,
	FaAt,
	FaRocketchat,
} from "react-icons/fa";
import { searchURL } from "../../apiRoutes";
import { Button } from "@chakra-ui/react";
import { colorsRGBString } from "../../utils";
import { useNavigate } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

export default function Header() {
	const authHeader = useAuthHeader();
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const location = useLocation();
	const [filters, setFilters] = useState({
		Projects: false,
		Meetings: false,
		Users: false,
		Partners: false,
		Emails: false,
		Messages: false,
	});

	useEffect(() => {
		if (location.pathname !== "/search") {
			setSearchQuery("");
			setFilters({
				Projects: false,
				Meetings: false,
				Users: false,
				Partners: false,
				Emails: false,
				Messages: false,
			});
			setSearchResults([]);
		}
	}, [location]);

	useEffect(() => {
		handleSearch(searchQuery);
	}, [filters]);

	const handleSearch = async (query) => {
		try {
			const activeFilters = Object.keys(filters).filter((key) => filters[key]);
			activeFilters.forEach((filter, index) => {
				activeFilters[index] = filter.toLowerCase();
			});

			const response = await axios.get(
				`${searchURL}?q=${query}&filters=${activeFilters.join(",")}`,
				{
					headers: {
						Authorization: authHeader,
					},
				},
			);
			console.log(response.data);
			setSearchResults(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		handleSearch(searchQuery);
	};

	const toggleFilter = (filter) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[filter]: !prevFilters[filter],
		}));
	};

	const filterIcons = {
		Projects: <FaBriefcase />,
		Meetings: <FaPhone />,
		Users: <FaUserFriends />,
		Partners: <FaHandshake />,
		Emails: <FaAt />,
		Messages: <FaRocketchat />,
	};

	const categories = {
		users: "Utilizadores",
		emails: "Emails",
		meetings: "Reuniões",
		customers: "Clientes",
		partner_companies: "Empresas Parceiras",
		teams_messages: "Mensagens",
		projects: "Projetos",
	};

	const ResultComponent = ({ category, item }) => {
		switch (category) {
			case "meetings":
				return (
					<div className="result-item">
						<a href={`/meetings`} className="result-item  m-0 p-0">
							<h4>{item.name}</h4>
							<p>{item.description}</p>
							<p>{item.place}</p>
						</a>
					</div>
				);
			case "users":
				return (
					<div className="result-item">
						<h4>{item.name}</h4>
						<p>{item.email}</p>
					</div>
				);
			case "emails":
				return (
					<div className="result-item">
						<p className={"email-sender"}>De: {item.sender}</p>
						<h4>{item.subject}</h4>
						<p>{item.message}</p>
						<p className={"email-date"}>Recebido a: {item.date_sent}</p>
					</div>
				);
			case "customers":
				return (
					<div className="result-item">
						<h4>{item.name}</h4>
						<p>{item.email}</p>
					</div>
				);
			case "partner_companies":
				return (
					<div className="result-item">
						<h4>{item.name}</h4>
					</div>
				);
			case "teams_messages":
				return (
					<div className="result-item">
						<h4>{item.subject}</h4>
						<p>{item.summary}</p>
					</div>
				);
			case "projects":
				return (
					<div className="result-item">
						<a href={`/projects/${item.id}`} className="result-item  m-0 p-0">
							<h4>{item.name}</h4>
						</a>
					</div>
				);
			default:
				return null;
		}
	};
	const signOut = useSignOut();
	const navigate = useNavigate();
	const isAuthenticated = useIsAuthenticated();

	const handleLogout = () => {
		signOut();
		navigate("/login", { replace: true });
	};

	return (
		isAuthenticated && (
			<div className="  z-40  border-b  border-gray-400 py-3 right-0 sticky blue-background">
				<div className="px-4 pl-20">
					<div className="flex items-center justify-between">
						<div
							className={`search d-flex bg-gray-50 flex-column gap-3 rounded-rect ${searchQuery ? "p-2" : ""} ms-4`}
							style={{ position: "relative" }}
						>
							<form
								onSubmit={handleSubmit}
								className="d-flex align-items-center bg-gray-50 border border-gray-300 rounded-rect px-3 py-2"
							>
								<div className="input-group">
									<span className="input-group-text border-0">
										<RiSearchLine className="text-gray-400" />
									</span>
									<input
										type="text"
										value={searchQuery}
										onChange={(event) => {
											setSearchQuery(event.target.value);
											handleSearch(event.target.value);
										}}
										onInput={(event) => {
											if (!event.target.value) {
												setSearchResults([]);
											}
										}}
										placeholder="Search..."
										className="form-control shadow-none bg-transparent border-0 pl-2 pr-2 py-1"
									/>
								</div>
							</form>

							{searchQuery && (
								<div
									id={"filters"}
									className="flex items-center gap-2 bg-gray-50 rounded-rect"
								>
									<span>Filter by: </span>
									{Object.keys(filters).map((filter) => (
										<Button
											id={filter + "-button"}
											key={filter}
											className={
												"filter-button " + (filters[filter] ? "selected" : "")
											}
											variant={filters[filter] ? "solid" : "outline"}
											style={{
												backgroundColor: filters[filter]
													? colorsRGBString.persianBlue
													: "transparent",
												color: filters[filter] ? "white" : "",
												borderColor: filters[filter]
													? colorsRGBString.stratos
													: "",
												display: "flex",
												alignItems: "center",
												gap: "0.5rem",
											}}
											border="1px"
											size="sm"
											mr={2}
											onClick={() => toggleFilter(filter)}
											_hover={{
												backgroundColor: colorsRGBString.persianBlue,
												color: colorsRGBString.persianBlue,
											}}
											sx={{
												"&:hover svg": {
													color: filters[filter]
														? "white"
														: colorsRGBString.persianBlue,
												},
											}}
										>
											{filterIcons[filter]}
											{filter}
										</Button>
									))}
								</div>
							)}
							{Object.values(searchResults).some((list) => list.length !== 0) &&
								searchQuery && (
									<div className="search-results">
										{Object.entries(searchResults).map(
											([category, items]) =>
												items.length > 0 && (
													<div key={category}>
														<h3>{categories[category]}</h3>
														{items.map((item, index) => (
															<ResultComponent
																key={index}
																category={category}
																item={item}
															/>
														))}
													</div>
												),
										)}
									</div>
								)}
							{searchQuery &&
								Object.values(searchResults).every(
									(list) => list.length === 0,
								) && (
									<div className="search-results">
										<h3>Nenhum resultado encontrado</h3>
									</div>
								)}
						</div>
						<div className="row">
							<div className="col">
								<div className="bg-gray-400 w-8 h-8 rounded-full"></div>
							</div>
							<div className="col">
								<button
									className="btn btn-outline-light"
									onClick={handleLogout}
								>
									Logout
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	);
}
