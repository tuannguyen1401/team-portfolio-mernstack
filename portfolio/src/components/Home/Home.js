import React, { useEffect, useState } from "react";

import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main.svg";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";
import ProjectCard from "../Projects/ProjectCards";
import chatify from "../../Assets/Projects/chatify.png";
import bitsOfCode from "../../Assets/Projects/blog.png";
import editor from "../../Assets/Projects/codeEditor.png";

import axios from "axios";

function useOptions() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/options`)
      .then((res) => {
        if (res.data && res.data.success) {
          setOptions(res.data.data);
        } else {
          console.log("Không lấy được dữ liệu options");
        }
      })
      .catch((err) => {
        console.log("Lỗi khi gọi API options");
      })
  }, []);

  return { options };
}


function useProjects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/projects`)
      .then((res) => {
        if (res.data && res.data.success) {
          setProjects(res.data.data);
        } else {
          console.log("Không lấy được dữ liệu projects");
        }
      })
  }, []);

  return { projects };
}

function Home() {
  const { options } = useOptions();
  let webTitle = "";
  const { projects } = useProjects();
  console.log("projects", projects);


  if (options) {
    const webTitle = options.find(option => option.name == "web_title");
    if (webTitle) document.title = webTitle.value;
  }

  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <h1 style={{ paddingBottom: 15 }} className="heading">
                Hi There!{" "}
                <span className="wave" role="img" aria-labelledby="wave">
                  👋🏻
                </span>
              </h1>

              <h1 className="heading-name">
                We are
                <strong className="main-name"> {webTitle?.value || "Fiver Team"} </strong>
              </h1>

              <div style={{ padding: 50, textAlign: "left" }}>
                <Type stackName={options.find(option => option.name == "name_stack")} />
              </div>
            </Col>

            <Col md={5} style={{ paddingBottom: 20 }}>
              <img
                src={homeLogo}
                alt="home pic"
                className="img-fluid"
                style={{ maxHeight: "450px" }}
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <Home2 stackName={options.find(option => option.name == "name_stack")}/>

      <Container className="">
        <h1 className="project-heading">My Recent <strong className="purple">Works </strong></h1>
        <p style={{ color: "white" }}>Here are a few projects I've worked on recently.</p>
        <Container className="d-flex justify-content-center">

        {projects && projects.length > 0 && projects.map((project, idx) => (
          <Col md={4} className="project-card" key={project.id || idx}>
            <ProjectCard
              imgPath={project.image_url}
              title={project.title}
              description={project.description}
              ghLink={project.gh_link}
              stack_name={project.stack_name}
            />
          </Col>
        ))}
        </Container>
      </Container>
    </section>
  );
}

export default Home;
