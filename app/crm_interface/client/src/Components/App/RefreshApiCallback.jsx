import createRefresh from "react-auth-kit/createRefresh";
import axios from "axios";
import { tokenRefreshURL } from "../../apiRoutes";

const refresh = createRefresh({
	interval: 1, // in minutes
	refreshApiCallback: async (param) => {
		try {
			// just send the refresh token to the server
			const response = await axios.post(tokenRefreshURL, {
				refresh: param.refreshToken,
			});
			console.log("Refreshing");
			console.log(response);
			return {
				isSuccess: true,
				newAuthToken: response.data.access,
				newAuthTokenExpireIn: 1, // in minutes
				newRefreshTokenExpiresIn: 1440, // in minutes
			};
		} catch (error) {
			console.error(error);
			return {
				isSuccess: false,
			};
		}
	},
});

export default refresh;
