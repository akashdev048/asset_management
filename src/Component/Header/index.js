
import { Navbar, Container, Offcanvas, Dropdown } from "react-bootstrap";
import { ssoLogOut } from "../../Services/auth";
import logo from '../../assets/images/s3sLogo.png';
import bellIcon from '../../assets/images/bell-icon.svg';
import toggleMenuIcon from '../../assets/images/toggle-menu-icon.svg';
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux"
import { setAuth } from "../../Redux/Slice/authSlice"

const Header = () => {
    const dispatch = useDispatch();
    let navigate = useNavigate();


    let handleLogout = async () => {
        let res = await ssoLogOut(localStorage?.access_token)
        if (res && res.status == '200') {
            localStorage.clear()
            dispatch(setAuth({ isAuthenticated: false, token: '', loginType: '' }))
            navigate('/login')
        }
    }

    let getInitials = () => {
        const firstName = localStorage?.firstName?.charAt(0) || "";
        const surname = localStorage?.lastName?.charAt(0) || "";
        if (firstName.length > 0 && surname.length > 0) {
            return firstName[0] + surname[0];
        } else if (firstName.length > 0 && surname.length <= 0) {
            return firstName[0];
        } else {
            return "";
        }
    }

    return (
        <header className="header-layout">
            <Navbar expand="lg" className="bg-tranparent">
                <Container fluid>
                    <Navbar.Brand href="#home"><span className="logo-brand-wt"><img src={logo} alt="logo" /></span></Navbar.Brand>
                    <Navbar.Offcanvas
                        id="offcanvasNavbar-expand-lg"
                        aria-labelledby="offcanvasNavbarLabel-expand-lg"
                        placement="start"
                        className="sidemenu-canvas ms-lg-auto"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                                <span className="logo-brand-wt"><img src={logo} alt="logo" /></span>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <div className="right-side-menu ms-auto">
                                <ul className="d-flex align-items-center mb-0 menu-itm-web">
                                    {/* <li><button type="button" className="btn btn-dashbtn">Dashboard</button></li> */}
                                    <li><button type="button" className="btn btn-home">Home</button></li>
                                </ul>
                            </div>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                    <div className="right-side-menu">
                        <ul className="d-flex align-items-center mb-0 menu-itm-web">
                            <li className="bell-icon-button"><button type="button" className="btn btn-notific-bell p-0 mx-3"><img src={bellIcon} alt="" /></button></li>
                            <li>
                                <Dropdown>
                                    <Dropdown.Toggle variant="btn-profile-drop" className="p-0" id="dropdown-basic">{getInitials()}</Dropdown.Toggle>

                                    <Dropdown.Menu align="end" className="profile-dropdown-menu">
                                        <div className="full-profile-body">
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <h3 className="title-br-nm">S3S</h3>
                                                <div className="side-profile-sgn">
                                                    <button onClick={handleLogout} type="button" className="btn p-0 border-0 btn-sign-out">Sign Out</button>
                                                </div>
                                            </div>
                                            <div className="flx-info-profile">
                                                <div className="left-circle-nm">
                                                    <div className="nm-short-cont"><span className="round-txt-content">{getInitials()}</span></div>
                                                </div>
                                                <div className="side-profile--info">
                                                    <h3 className="title-user-nm">{localStorage?.userName}</h3>
                                                    <div className="eml-content-wts"><span className="txt-email-wt">{localStorage?.email}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </ul>
                    </div>
                    <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" className="border-0 p-0 menu-side-toggle ms-2 shadow-none"><img src={toggleMenuIcon} alt="icon" /></Navbar.Toggle>
                </Container>
            </Navbar>
        </header>

    )
}
export default Header;