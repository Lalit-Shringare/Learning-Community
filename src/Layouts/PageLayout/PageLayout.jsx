import { Box, Flex, Spinner } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";

// PageLayout Component
const PageLayout = ({ children, totalUnreadCount }) => {
  const { pathname } = useLocation();
  const [user, loading] = useAuthState(auth);
  const canRenderSidebar = pathname !== "/auth" && user;
  const canRenderNavbar = !user && !loading && pathname !== "/auth";
// console.log(totalUnreadCount);
  const checkingUserIsAuth = !user && loading;
  if (checkingUserIsAuth) return <PageLayoutSpinner />;

  return (
    <Flex bg={"whiteAlpha.100"} flexDir={canRenderNavbar ? "column" : "row"}>
      {/* Sidebar on the left */}
      {canRenderSidebar && (
        <Box w={{ base: "70px", md: "240px" }}>
          <Sidebar totalUnreadCount={totalUnreadCount} />
        </Box>
      )}
      {/* Navbar */}
      {canRenderNavbar && <Navbar />}
      {/* The page content on the right */}
      <Box flex={1} w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }} mx={"auto"}>
        {children}
      </Box>
    </Flex>
  );
};

// Spinner Component
const PageLayoutSpinner = () => {
  return (
    <Flex flexDir='column' h='100vh' alignItems='center' justifyContent='center'>
      <Spinner size='xl' />
    </Flex>
  );
};

export default PageLayout;
