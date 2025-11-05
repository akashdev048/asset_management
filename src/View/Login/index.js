import React, { useState, useEffect } from 'react';
import './style.css';
import stageLogo from '../../assets/images/logo-brand-w.svg';
import ssoLogo from '../../assets/images/lockIcon.svg'
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from "react-router";
import FullScreenLoader from '../../Component/Loader';
import { Loading } from 'react-fullscreen-loading';
import { useDispatch } from "react-redux"
import { getUserInfo } from "../../Services/auth";
import { setAuth } from "../../Redux/Slice/authSlice"



function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showLoader, setShowLoader] = useState(false);


    useEffect(() => {
        if (window.location.href.includes('access_token')) {
            const token = getAccessToken(window.location.href);
            getUserData(token)
        }
    }, []);

    let getAccessToken = (url) => {
        try {
            const parsedUrl = new URL(url);
            const accessToken = new URLSearchParams(parsedUrl.search).get('access_token');
            return accessToken;
        } catch (error) {
            console.error('Invalid URL:', error);
            return null;
        }
    }

    let getUserData = async (token) => {
        setShowLoader(true)
        let data = await getUserInfo(token)
        if (data.data) {
            dispatch(setAuth({ isAuthenticated: true, token: token, loginType: 'sso' }))
            localStorage.setItem('access_token', token)
            localStorage.setItem('firstName', data?.data?.FirstName)
            localStorage.setItem('lastName', data?.data?.LastName)
            localStorage.setItem('userName', data?.data?.Username)
            localStorage.setItem('email', data?.data?.Email)
            localStorage.setItem('UserId', data.data.UserId)
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('loginType', 'sso')
            localStorage.setItem('role', JSON.stringify(data?.data?.Role))
            navigate("/home")

        }
        setShowLoader(false)
    }

    let handleSsoClick = (e) => {
        // localStorage.setItem('isLoggedIn', true)
        // navigate('/home')
        // return
        e.preventDefault()
        let url = window.location.href.includes("prod") ? process.env.REACT_APP_PROD_SSO_REDIRECTION_URL :  window.location.href.includes("local") ?  process.env.REACT_APP__LOCAL__SSO_REDIRECTION_URL  : process.env.REACT_APP_SSO_REDIRECTION_URL
        window.location.href = url;
    }
    return (
        <>
            {
                Loading ?
                    <FullScreenLoader></FullScreenLoader>
                    :

                    null

            }
            <div className="login-wrapper-body">
                <Container fluid>
                    <Row className='justify-content-center'>
                        <Col xs={12} md={5} lg={4}>
                            <div className="login-contact-wrapper login_left_panel corner-border">
                                <div className="container-style">
                                    <div className="d-flex justify-content-center">
                                        <img src={stageLogo} className="logo-brand-wth" />
                                    </div>

                                    <div className="wap-formcontact pt-4">
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <p style={{ color: 'white' }}>
                                                Asset management
                                            </p>
                                        </div>
                                        <Form>
                                            <Form.Group className="mb-3" controlId="">
                                                <Form.Control type="email" placeholder="Enter email" className='input-item-fill' />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="">
                                                <Form.Control type="password" placeholder="Enter Password" className='input-item-fill' />
                                            </Form.Group>
                                            <Form.Group>
                                                <button disabled type="submit" className="btn w-100 btn-submit-web btn-submit-login">Login</button>
                                            </Form.Group>
                                            <Form.Group className='my-3'>
                                                <div class="divider-container">
                                                    <div class="divider-line"></div>
                                                    <div class="divider-text">or</div>
                                                    <div class="divider-line"></div>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <button onClick={(e) => handleSsoClick(e)} className="btn w-100 btn-submit-web btn-submit-login">
                                                    <span className="form-label-text-btn"><img src={ssoLogo} className="image-gap me-2" />SSO</span>
                                                </button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}
export default Login;