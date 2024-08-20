const baseURL = "http://127.0.0.1:8000/api";

// The presence or absence of a trailing slash must match the backend url

export const loginURL = `${baseURL}/auth/token`;
export const tokenRefreshURL = `${baseURL}/auth/token/refresh/`;
export const testAuthURL = `${baseURL}/auth/test/`;

export const meetingsURL = `${baseURL}/meetings`;
export const createMeetingURL = `${baseURL}/meetings/create`;
export const deleteMeetingURL = `${baseURL}/meetings/delete`;
export const editMeetingURL = `${baseURL}/meetings/edit`;
export const tasksURL = `${baseURL}/tasks`;
export const projectsURL = `${baseURL}/projects`;
export const projectDetailsURL = (projectId) =>
	`${baseURL}/projects/${projectId}`;

export const participantsURL = `${baseURL}/other-users`;

export const searchURL = `${baseURL}/search`;
export const chatURL = `${baseURL}/chat`;
