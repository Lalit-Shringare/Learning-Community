import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Alert, AlertIcon, Button, Input, InputGroup, InputRightElement, Box, Heading, VStack } from "@chakra-ui/react";
import { useState } from "react";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";

const Signup = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const { loading, error, signup } = useSignUpWithEmailAndPassword();

	return (
		<Box 
			w="full" 
			maxW="md" 
			p={6} 
			m="auto" 
			mt={8} 
			borderWidth={1} 
			borderRadius={18} 
			boxShadow="lg"
			
		>
			<Heading as="h1" size="lg" mb={6} textAlign="center">
				Sign Up
			</Heading>
			<VStack spacing={4}>
				<Input 
					placeholder="Enter your email" 
					_placeholder={{ color: 'gray.300' }}
					fontSize={14}
					type="email"
					size="md"
					bg="gray.100"
					value={inputs.email}
					onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
				/>
				<Input
					placeholder="Enter your username"
					_placeholder={{ color: 'gray.300' }}
					fontSize={14}
					type="text"
					size="md"
					bg="gray.100"
					value={inputs.username}
					onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
				/>
				<Input
					placeholder="Enter your full name"
					_placeholder={{ color: 'gray.300' }}
					fontSize={14}
					type="text"
					size="md"
					bg="gray.100"
					value={inputs.fullName}
					onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
				/>
				<InputGroup size="md">
					<Input
						placeholder="Enter your password"
						_placeholder={{ color: 'gray.300' }}
						fontSize={14}
						type={showPassword ? "text" : "password"}
						value={inputs.password}
						bg="gray.100"
						onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
					/>
					<InputRightElement h="full">
						<Button variant={"ghost"} size={"sm"} onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? <ViewIcon /> : <ViewOffIcon />}
						</Button>
					</InputRightElement>
				</InputGroup>

				{error && (
					<Alert status='error' fontSize={13} p={2} borderRadius={4} width="full">
						<AlertIcon fontSize={12} />
						{error.message}
					</Alert>
				)}

				<Button
					w="full"
					colorScheme='blue'
					size="md"
					fontSize={14}
					isLoading={loading}
					onClick={() => signup(inputs)}
				>
					Sign Up
				</Button>
			</VStack>
		</Box>
	);
};

export default Signup;
