import React, { useState } from "react";
import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";

// Chakra imports
import {
	Box,
	Image,
	Flex,
	Button,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	//Switch,
	Text,
	useColorModeValue,
	FormErrorMessage,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { loginURL } from "../../apiRoutes";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import logo from "../../assets/logo2.png";

// Assets

// const signInImage = <Link to="/">
// 	<img src={"https://picsum.photos/200"} alt="logo"></img>
// </Link>
function Login() {
	const signIn = useSignIn();

	// Chakra color mode
	const galpColor = useColorModeValue("fa551e", "fa551e");
	const titleColor = useColorModeValue("#1D37C4", "white");
	const textColor = useColorModeValue("gray.400", "white");

	//const [username, setUsername] = useState("");
	//const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	return (
		<Flex position="relative" bg="#F9F9F9" h="100vh">
			<Box position="absolute" top={5} left={5}>
				<Image src={logo} alt="Logo" w={"100px"} />
			</Box>
			<Flex
				h={{ sm: "initial", md: "75vh", lg: "85vh" }}
				w="100%"
				mx="auto"
				alignItems="center"
				justifyContent="center"
				mb="30px"
				pt={{ sm: "100px", md: "0px" }}
			>
				<Flex
					alignItems="center"
					justifyContent="center"
					style={{ userSelect: "none" }}
					w={{ base: "100%", md: "100%", lg: "100%" }}
				>
					<Flex
						direction="column"
						w="100%"
						background="transparent"
						p="48px"
						mt={{ md: "150px", lg: "80px" }}
					>
						<Heading
							color={titleColor}
							fontSize="30px"
							mb="10px"
							textAlign="center"
							fontWeight="700"
						>
							Bem-vindo!
						</Heading>
						<Text
							mb="80px"
							ms="4px"
							color={titleColor}
							fontWeight="400"
							fontSize="20px"
							textAlign="center"
						>
							Digite o seu email e palavra-passe para entrar
						</Text>
						<Formik
							initialValues={{ email: "", password: "" }}
							validationSchema={Yup.object({
								password: Yup.string().required("Required"),
								email: Yup.string()
									.email("Invalid email address")
									.required("Required"),
							})}
							onSubmit={async (values) => {
								try {
									const response = await axios.post(loginURL, {
										email: values.email,
										password: values.password,
									});
									console.log(response);

									if (
										signIn({
											auth: {
												token: response.data.access,
												type: "Bearer",
											},
											refresh: response.data.refresh,
											userState: {
												name: response.data.name,
												email: response.data.email,
												id: response.data.id,
											},
											isUsingRefreshToken: true,
										})
									) {
										console.log(response);
										console.log("Login successful.");

										setError(null); // Clear any previous errors on successful login
										navigate("/home", { replace: true });
									} else {
										console.log("Login failed.");
										setError("Login failed.");
									}
								} catch (error) {
									setError(error.response.data.error || "Login failed."); // Handle errors gracefully
								}
							}}
						>
							{(props) => (
								<Flex direction="column" alignItems="center">
									<Form>
										<Field name="email" type="email">
											{({ field, form }) => (
												<FormControl
													isInvalid={form.errors.email && form.touched.email}
													mb="30px"
												>
													<FormLabel
														ms="-50%"
														fontSize="16px"
														fontWeight="400"
														color="#1D37C4"
													>
														Email
													</FormLabel>
													<Input
														borderRadius="6px"
														mb="10px"
														fontSize="sm"
														type="email"
														placeholder="Endereço de email"
														size="lg"
														w="200%"
														ms={"-50%"}
														border="none"
														boxShadow="0px 4px 10px 0px #0008311A"
														{...field}
													/>
													<FormErrorMessage mt="0px" mb="30px" ms={"-50%"}>
														{form.errors.email}
													</FormErrorMessage>
												</FormControl>
											)}
										</Field>

										<Field name="password" type="password" mb="30px">
											{({ field, form }) => (
												<FormControl
													isInvalid={
														form.errors.password && form.touched.password
													}
													mb="30px"
												>
													<FormLabel
														ms="-50%"
														fontSize="16px"
														fontWeight="400"
														color="#1D37C4"
													>
														Palavra-passe
													</FormLabel>
													<Input
														borderRadius="6px"
														mb="10px"
														fontSize="sm"
														type="password"
														placeholder="Palavra-passe"
														size="lg"
														w="200%"
														ms={"-50%"}
														border="none"
														boxShadow="0px 4px 10px 0px #0008311A"
														{...field}
													/>
													<FormErrorMessage mt="0px" ms={"-50%"}>
														{form.errors.password}
													</FormErrorMessage>
												</FormControl>
											)}
										</Field>

										{/*
								<FormControl display="flex" alignItems="center">
									<Switch id="remember-login" colorScheme="teal" me="10px" />
									<FormLabel
										htmlFor="remember-login"
										mb="0"
										ms="1"
										fontWeight="normal">
										Remember me
									</FormLabel>
								</FormControl>
								*/}
										<Button
											isLoading={props.isSubmitting}
											fontSize="16px"
											fontWeight="400"
											lineHeight="39px"
											textAlign="center"
											type="submit"
											bg="#1D37C4"
											w="100%"
											h="45"
											mb="20px"
											color="white"
											mt="20px"
											_hover={{
												bg: "#3857d8",
											}}
											_active={{
												bg: "#0b1f8a",
											}}
										>
											Entrar
										</Button>

										{error && <Text color="red.500">{error}</Text>}
									</Form>
								</Flex>
							)}
						</Formik>

						<Flex
							flexDirection="column"
							justifyContent="center"
							alignItems="center"
							maxW="100%"
							mt="0px"
						>
							<Text color={textColor} fontWeight="medium">
								Don&#39;t have an account?
								<Link color={galpColor} as="span" ms="5px" fontWeight="bold">
									Sign Up
								</Link>
							</Text>
						</Flex>
					</Flex>
				</Flex>
				{/*
				<Box
					display={{ base: "none", md: "block" }}
					overflowX="hidden"
					h="100%"
					w="100%"
					position="absolute"
					right="0px"
				>
					<Box
						bgImage="https://picsum.photos/200"
						w="100%"
						h="100%"
						bgSize="cover"
						bgPosition="50%"
						position="absolute"
						hidden={true}
						borderBottomLeftRadius="20px"
					></Box>
				</Box>
				*/}
			</Flex>
		</Flex>
	);
}
export default Login;
