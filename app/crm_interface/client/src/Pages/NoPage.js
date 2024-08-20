import logo from "../logo.svg";
function NoPage() {
	return (
		<div className="NoPage">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Nothing here. Go back to <code>Home</code>.
				</p>
			</header>
		</div>
	);
}

export default NoPage;
