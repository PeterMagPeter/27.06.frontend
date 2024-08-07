import styles from "./Header.module.css";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../ErrorFallback";
import {
  Image,
  Col,
  Container,
  Nav,
  NavDropdown,
  Navbar,
  Row,
  Stack,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Home from "../../assets/pictures/cof_logo_vert.png";
import Pic from "../../assets/pictures/profile_pic_placeholder.png";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { useSelector } from "react-redux";
import { deleteLogin } from "../../backendAPI/loginAPI";
import { useDispatch } from "react-redux";
import { deleteUser } from "../reducer/TestReducer";
import { useNavigate } from "react-router-dom";
import { deleteLobby } from "../reducer/LobbyReducer";
import socket from "../Websocket/socketInstance";

export default function Header() {
  let loggedIn = useSelector((state: any) => state.userReducer.loggedIn);
  let roomId = useSelector((state: any) => state.lobbyReducer.roomId);
  let nick = useSelector((state: any) => state.userReducer.username);
  let guest = useSelector((state: any) => state.userReducer.guest);

  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await deleteLogin();
    dispatch(deleteUser());
    navigate("/");
  };

  function handleHome(): void {
    socket.emit("sendLeaveRoom", roomId);
    dispatch(deleteLobby());
    navigate("/");
  }

  function handleLogin(): void {
    dispatch(deleteUser());
    navigate("/");
  }
  let pathname = window.location.pathname;
  return (
    <div className={styles.header}>
        <div className={styles.logo}>
          <img
            onClick={() => handleHome()}
            className={styles.homeImg}
            src={Home}
            width={"250px"}
          />
        </div>
        <div className={styles.profileContainer}>
          {!guest && (
            <div className={styles.imageContainer}>
              <img
                onClick={() => navigate("/profile")}
                className={styles.profileImg}
                src={Pic}
              />
            </div>
          )}
          <div className={styles.headerDropdown}>
            <nav>
              <NavDropdown title={loggedIn ? nick : "Menu"} align={"end"}>
                {!guest && (
                  <NavDropdown.Item onClick={() => navigate("/profile")}>
                    Profile settings
                  </NavDropdown.Item>
                )}
                {soundOn ? (
                  <NavDropdown.Item onClick={() => setSoundOn(false)}>
                    Sound off
                  </NavDropdown.Item>
                ) : (
                  <NavDropdown.Item onClick={() => setSoundOn(true)}>
                    Sound on
                  </NavDropdown.Item>
                )}
                {musicOn ? (
                  <NavDropdown.Item onClick={() => setMusicOn(false)}>
                    Music off
                  </NavDropdown.Item>
                ) : (
                  <NavDropdown.Item onClick={() => setMusicOn(true)}>
                    Music on
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                {guest ? (
                  <NavDropdown.Item
                    onClick={() => handleLogin()}
                    style={{ backgroundColor: "blue" }}
                  >
                    Login
                  </NavDropdown.Item>
                ) : (
                  <NavDropdown.Item
                    onClick={handleLogout}
                    style={{ backgroundColor: "darkred" }}
                  >
                    Logout
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </nav>
          </div>
        </div>
    </div>
  );
}
