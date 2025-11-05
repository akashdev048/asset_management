import React from 'react';
import { Spinner, Container } from 'react-bootstrap';
import './index.css';

const FullScreenLoader = () => {
  return (
    <div className="full-screen-loader">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Spinner animation="border" role="status"    style={{ 
              width: '4rem', 
              height: '4rem',
            //   width : '10px',
              color: '#092e56' // Custom color added here
            }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <h4 className="mt-3">Loading...</h4>
        </div>
      </Container>
    </div>
  );
};

export default FullScreenLoader;