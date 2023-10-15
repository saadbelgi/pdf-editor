import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import {
  Divider,
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import logo from "../assets/3d-file-pdf-format-icon-illustration_148391-995.avif";
import { useState, MouseEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
// import Cookies from "js-cookie";

const pages = ["MERGE PDF", "SPLIT PDF", "COMPRESS PDF", "EDIT PDF"];
const settings = ["Your files", "Logout"];
const drawerWidth = 150;

type Props = {
  window: Window;
  styles?: React.CSSProperties;
};

type LogoProps = {
  styles?: React.CSSProperties;
  insideDrawer?: boolean;
};

function Logo({ styles, insideDrawer }: LogoProps) {
  return (
    <Icon
      sx={{
        width: "50px",
        height: insideDrawer ? "auto" : "100%",
        flexGrow: { xs: "1", md: "0" },
        display: "flex",
        placeItems: "center",
        justifyContent: "left",
        ...styles,
      }}
    >
      <img src={logo} style={{ width: "50px" }} />
    </Icon>
  );
}

function getCookie(key: string) {
  const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

// function deleteCookie(key: string) {
//   document.cookie = key + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
// }

function ResponsiveAppBar({ window, styles }: Props) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    getCookie("token") !== undefined && getCookie("token") !== ""
  );

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function handleYourFilesClick() {
    navigate("/yourfiles");
    setAnchorElUser(null);
  }

  function handleLogout() {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setAnchorElUser(null);
  }

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const navigate = useNavigate();

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Logo insideDrawer={true} styles={{ paddingBottom: "5px" }} />
      <Divider />
      <List>
        {pages.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              onClick={() => navigate("/" + item.split(" ")[0].toLowerCase())}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <>
      <AppBar position='sticky' sx={{ width: "100%", ...styles }}>
        <Container sx={{ backgroundColor: "whitesmoke", minWidth: "100%" }}>
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>

              <Box component='nav'>
                <Drawer
                  container={container}
                  variant='temporary'
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                  }}
                  sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                      boxSizing: "border-box",
                      width: drawerWidth,
                    },
                  }}
                >
                  {drawer}
                </Drawer>
              </Box>
            </Box>

            <Box sx={{ flexGrow: { xs: 1, md: 0 } }}>
              <Link to='/'>
                <Logo styles={{ marginRight: "3%" }} />
              </Link>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() =>
                    navigate("/" + page.split(" ")[0].toLowerCase())
                  }
                  sx={{
                    my: 2,
                    color: "secondary.main",
                    display: "block",
                    fontWeight: "600",
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            {isLoggedIn && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title='Open settings'>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt='Remy Sharp'
                      src='/static/images/avatar/2.jpg'
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id='menu-appbar'
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleYourFilesClick}>
                    <Typography textAlign='center'>{settings[0]}</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign='center'>{settings[1]}</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
            {!isLoggedIn && (
              <Box sx={{ flexGrow: 0, display: "flex" }}>
                <Button
                  onClick={() => navigate("/signup")}
                  sx={{
                    my: 2,
                    color: "secondary.main",
                    display: "block",
                    fontWeight: "600",
                  }}
                >
                  SIGN UP
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  sx={{
                    my: 2,
                    color: "secondary.main",
                    display: "block",
                    fontWeight: "600",
                  }}
                >
                  LOGIN
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default ResponsiveAppBar;
