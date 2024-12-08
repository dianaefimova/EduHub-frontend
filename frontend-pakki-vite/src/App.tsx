import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Stack,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Curricula from "./pages/Curricula";
import Grades from "./pages/Grades";
import Enrollments from "./pages/Enrollments";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Explore from "./pages/Degrees.tsx";
import ThemeToggleButton from "./components/ThemeToggleButton";
import { UserProvider } from "./context/UserContext";
import Reservations from "./pages/reservations";

function App() {
  const { colorMode } = useColorMode();
  const bgColor = { light: "white", dark: "gray.900" };
  const navBgColor = bgColor[colorMode];

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const navigate = useNavigate();
  const location = useLocation();

  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Update sidebar state on screen size change
  useEffect(() => {
    setIsSidebarOpen(!isSmallScreen); // Expand on larger screens, collapse on small screens
  }, [isSmallScreen]);

  // Redirect to login if not logged in and not already on login page
  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [isLoggedIn, location, navigate]);

  const isLoginPage = location.pathname === "/login";

  return (
    <UserProvider>
      {!isLoginPage && isSidebarOpen && isSmallScreen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="rgba(0,0,0,0.7)"
          zIndex={1}
          onClick={toggleSidebar}
        />
      )}
      <Box display="flex" minHeight="100vh" bg={bgColor[colorMode]}>
        {!isLoginPage && (
          <Flex
            as="nav"
            position="fixed"
            left="0"
            top="0"
            height="100vh"
            width={isSidebarOpen ? "200px" : "60px"} // Wider width when open, narrower when closed
            bg={navBgColor}
            p={4}
            boxShadow="md"
            flexDirection="column"
            justifyContent="space-between"
            transition="width 0.3s ease"
            zIndex="2"
          >
            {/* Sidebar Toggle Button Inside the Sidebar */}
            <IconButton
              icon={<HamburgerIcon />}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              size="md"
              variant="ghost"
              position="absolute"
              top="1rem"
              left="1rem"
              zIndex="3"
            />

            {isSidebarOpen && ( // Show only if the sidebar is open
              <Flex direction="column" alignItems="flex-start" mt="3rem">
                <Heading size="md" mb={4} color="brand">
                  TAMK
                </Heading>
                <Stack direction="column" spacing={4}>
                  <Button
                    as={Link}
                    to="/"
                    colorScheme="brand"
                    variant="ghost"
                    justifyContent="flex-start"
                    w="100%"
                  >
                    Home
                  </Button>
                  <Button
                    as={Link}
                    to="/curricula"
                    colorScheme="brand"
                    variant="ghost"
                    justifyContent="flex-start"
                    w="100%"
                  >
                    Curricula
                  </Button>
                  <Button
                    as={Link}
                    to="/grades"
                    colorScheme="brand"
                    variant="ghost"
                    justifyContent="flex-start"
                    w="100%"
                  >
                    Grades
                  </Button>
                  <Button
                    as={Link}
                    to="/enrollments"
                    colorScheme="brand"
                    variant="ghost"
                    justifyContent="flex-start"
                    w="100%"
                  >
                    Enrollments
                  </Button>
                  <Button
                    as={Link}
                    to="/profile"
                    colorScheme="brand"
                    variant="ghost"
                    justifyContent="flex-start"
                    w="100%"
                  >
                    Profile
                  </Button>
                  <Button
                    as={Link}
                    to="/reservations"
                    colorScheme="brand"
                    variant="ghost"
                    justifyContent="flex-start"
                    w="100%"
                  >
                    Reservations
                  </Button>
                  <Button
                      as={Link}
                      to="/explore"
                      colorScheme="brand"
                      variant="ghost"
                      justifyContent="flex-start"
                      w="100%"
                  >
                    Explore
                  </Button>
                </Stack>
              </Flex>
            )}
            {isSidebarOpen && <Box mt={4}><ThemeToggleButton /></Box>}
          </Flex>
        )}

        <Box 
          flex="1" 
          ml={!isLoginPage && isSidebarOpen && !isSmallScreen ? "200px" : "60px"} 
          mt={!isLoginPage ? "4rem" : "0"}
          p={4} 
          transition="margin-left 0.3s ease"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Login onLogin={() => setIsLoggedIn(true)} />}
            />
            <Route path="/curricula" element={<Curricula />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/enrollments" element={<Enrollments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/explore" element={<Explore />} />
          </Routes>
        </Box>
      </Box>
    </UserProvider>
  );
}

export default App;
