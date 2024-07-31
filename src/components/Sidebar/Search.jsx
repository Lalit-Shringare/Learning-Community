import {
    Box,
    Button,
    Flex,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Tooltip,
    useDisclosure,
    VStack,
    Text,
} from "@chakra-ui/react";
import { SearchLogo } from "../../assets/constants";
import useSearchUser from "../../hooks/useSearchUser";
import { useState, useEffect } from "react";
import SuggestedUser from "../SuggestedUsers/SuggestedUser";

const Search = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchTerm, setSearchTerm] = useState("");
    const { users, isLoading, searchUsers } = useSearchUser();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length > 0) {
                searchUsers(searchTerm);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchUsers(searchTerm);
    };

    return (
        <>
            <Tooltip
                hasArrow
                label={"Search"}
                placement='right'
                ml={1}
                openDelay={500}
                display={{ base: "block", md: "none" }}
            >
                <Flex
                    alignItems={"center"}
                    gap={4}
                    _hover={{ bg: "whiteAlpha.400" }}
                    borderRadius={6}
                    p={2}
                    w={{ base: 10, md: "full" }}
                    justifyContent={{ base: "center", md: "flex-start" }}
                    onClick={onOpen}
                >
                    <SearchLogo />
                    <Box display={{ base: "none", md: "block" }}>Search</Box>
                </Flex>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
                <ModalOverlay />
                <ModalContent bg={"white"} border={"1px solid gray"} maxW={"400px"}>
                    <ModalHeader color="black">Search user</ModalHeader>
                    <ModalCloseButton color="black" />
                    <ModalBody pb={6}>
                        <form onSubmit={handleSearchSubmit}>
                            <Flex>
                                <FormControl>
                                    <Input 
                                        placeholder='Search by username or name'
                                        value={searchTerm}
                                        onChange={handleInputChange}
                                        bg="white"
                                        color="black"
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                </FormControl>
                                <Button 
                                    type='submit'
                                    ml={2}
                                    color="black"
                                    bg="gray.200"
                                    _hover={{ bg: "gray.300" }}
                                    isLoading={isLoading}
                                >
                                    Search
                                </Button>
                            </Flex>
                        </form>

                        <VStack mt={4} spacing={2} align="stretch">
                            {isLoading ? (
                                <Box color="black">Loading...</Box>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <SuggestedUser key={user.uid} user={user} setSearchTerm={setSearchTerm} />
                                ))
                            ) : searchTerm.length > 0 ? (
                                <Text color="black">No users found</Text>
                            ) : null}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Search;
// COPY AND PASTE AS THE STARTER CODE FOR THE SEARCH COMPONENT
// import { Box, Flex, Tooltip } from "@chakra-ui/react";
// import { SearchLogo } from "../../assets/constants";

// const Search = () => {
// 	return (
// 		<>
// 			<Tooltip
// 				hasArrow
// 				label={"Search"}
// 				placement='right'
// 				ml={1}
// 				openDelay={500}
// 				display={{ base: "block", md: "none" }}
// 			>
// 				<Flex
// 					alignItems={"center"}
// 					gap={4}
// 					_hover={{ bg: "whiteAlpha.400" }}
// 					borderRadius={6}
// 					p={2}
// 					w={{ base: 10, md: "full" }}
// 					justifyContent={{ base: "center", md: "flex-start" }}
// 				>
// 					<SearchLogo />
// 					<Box display={{ base: "none", md: "block" }}>Search</Box>
// 				</Flex>
// 			</Tooltip>
// 		</>
// 	);
// };

// export default Search;
