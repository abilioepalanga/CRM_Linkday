import { useNavigate } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
const Logout = () => {
	const signOut = useSignOut();
	const navigate = useNavigate();

	const handleLogout = () => {
		signOut();
		navigate("/", { replace: true });
	};

	setTimeout(() => {
		handleLogout();
	}, 1500);

	return <>Logout Page</>;
};

export default Logout;
