// Libraries
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import GuestOnlyRoute from "../GuestOnlyRoute";
import { useLocation } from "react-router-dom";

// Components
import Sidebar from "../Sidebar/Sidebar";

// Pages
import TaskPage2 from "../../Pages/TaskPage/TaskPage2";
import ContactsPage from "../../Pages/ContactsPage/ContactsPage";
import ProjectListPage from "../../Pages/ProjectListPage/ProjectListPage";
import ProjectPage from "../../Pages/ProjectPage/ProjectPage";
import Login from "../../Pages/Login/Login";
// import Schedule from "../../Pages/Schedule";
import Logout from "../../Pages/Logout/Logout";

// Styles
import "./App.css";
import TestComponent from "../TestComponent/TestComponent";
import refresh from "./RefreshApiCallback";
import { MeetingsPage } from "../../Pages/Meetings/MeetingsPage";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import MySchedule from "../../Pages/MySchedule/MySchedule";
import Header from "../Header/Header";
import Chatbot from "../../Pages/Chatbot/Chatbot";

function SidebarWrapper() {
	const location = useLocation();

	if (location.pathname === "/login") {
		return null;
	}

	return (
		<div className="col-auto">
			<Sidebar />
		</div>
	);
}

function App() {
	// const isAuthenticated = useIsAuthenticated()

	const store = createStore({
		authName: "_auth",
		authType: "localstorage",
		refresh: refresh,
	});

	return (
		<AuthProvider store={store}>
			<ChakraProvider>
				<BrowserRouter>
					<div className="row g-0">
						<SidebarWrapper />
						<div className="col mb-2">
							<Header />
							<Routes>
								{/*Guest routes only*/}
								<Route exact path="/register" element={<GuestOnlyRoute />}>
									<Route exact path="/register" element={<div>Registo</div>} />
								</Route>
								<Route exact path="/login" element={<GuestOnlyRoute />}>
									<Route exact path="/login" element={<Login />} />
								</Route>

								{/*	ProtectedRoutes*/}
								<Route element={<AuthOutlet fallbackPath="/login" />}>
									<Route path="/projects" element={<ProjectListPage />} />
									<Route
										path="/projects/:projectId"
										element={<ProjectPage />}
									/>
									<Route path="/dashboard" exact element={<Dashboard />} />
									<Route path="/schedule" exact element={<MySchedule />} />
									{/*<Route path="/schedule" exact element={<Schedule />} />*/}
									<Route path="/logout" element={<Logout />} />
									<Route path="/meetings" element={<MeetingsPage />} />
									{/*<Route path="/search" element={<SearchResultsPage />} />*/}
									<Route path="/chat" element={<Chatbot />} />

									<Route path="*" element={<Dashboard />} />
								</Route>

								{/*	Public Routes, in practice there will be none*/}
								<Route path="/about" element={<div>Sobre</div>} />
								<Route path="/tasks" element={<TaskPage2 />} />
								<Route path="/contacts" element={<ContactsPage />} />
								<Route path="/misc-test" element={<TestComponent />} />
								{/*<Route path="*" element={<NoPage />} />*/}
							</Routes>
						</div>
					</div>
				</BrowserRouter>
			</ChakraProvider>
		</AuthProvider>
	);
}

export default App;
