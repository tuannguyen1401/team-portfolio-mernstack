import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Contact() {
  return (
    <Container className="contact-section" style={{ maxWidth: "600px", marginTop: "40px" }}>
      <form>
        <Row className="mb-3">
          <Col>
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" placeholder="Your Name" />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="name@example.com" />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <label htmlFor="message" className="form-label">Message</label>
            <textarea className="form-control" id="message" rows="4" placeholder="Your message"></textarea>
          </Col>
        </Row>
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </Container>
  );
}

export default Contact;
