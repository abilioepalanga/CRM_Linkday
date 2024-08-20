import "./ContactsPage.css";
import randomGuy from "../../assets/random_guy.jfif";
import { Icon } from "@chakra-ui/icon";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { VscExport } from "react-icons/vsc";
import { HiOutlinePlus } from "react-icons/hi2";

export default function ContactsPage() {
	return (
		<div className="container">
			<div className="row bg-light p-2">
				<div className="col d-flex align-items-center">
					<button className="btn" type="button">
						<Icon as={HiOutlinePlus} />
					</button>
					<span className="fw-semibold">Novo Contacto</span>
					<button className="btn" type="button">
						<Icon as={VscExport} />
					</button>
					<span className="fw-semibold">Exportar</span>
				</div>
			</div>
			<div className="row mb-3">
				{[...Array(8)].map((_, i) => (
					<div className="col-3 d-flex align-items-stretch pt-3" key={i}>
						<div className="card h-100 position-relative border-0 pt-3">
							<button
								className="btn position-absolute top-0 end-0"
								type="button"
							>
								<Icon viewBox="0 0 24 24" w={20} h={20}>
									<circle cx="12" cy="4" r="2" />
									<circle cx="12" cy="12" r="2" />
									<circle cx="12" cy="20" r="2" />
								</Icon>
							</button>
							<img
								src={randomGuy}
								className="card-img-top mx-auto d-block profile-image"
								alt="Profile"
							/>
							<div className="card-body text-center">
								<h5 className="card-title fw-semibold">Ahmad Zayn</h5>
								<p className="card-subtitle text-body-tertiary">
									Photographer at
								</p>
								<p className="card-subtitle mb-3 fw-semibold">
									Audio Video Teams
								</p>
								<div className="d-flex align-items-center">
									<div className="card-text icon-container">
										<Icon as={FaPhoneAlt} style={{ color: "#616161" }} />
									</div>
									<span
										className="fw-semibold"
										style={{ position: "relative", top: "-7px" }}
									>
										+12 345 6789 0
									</span>
								</div>
								<div className="d-flex align-items-center">
									<div className="card-text icon-container">
										<Icon as={FaEnvelope} style={{ color: "#616161" }} />
									</div>
									<span
										className="fw-semibold"
										style={{ position: "relative", top: "-8px" }}
									>
										ahmadzayn@mail.com
									</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
