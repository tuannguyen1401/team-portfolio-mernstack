import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import leaf from "../../Assets/Projects/leaf.png";
import emotion from "../../Assets/Projects/emotion.png";
import editor from "../../Assets/Projects/codeEditor.png";
import chatify from "../../Assets/Projects/chatify.png";
import suicide from "../../Assets/Projects/suicide.png";
import bitsOfCode from "../../Assets/Projects/blog.png";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}api/projects`)
      .then(res => res.json())
      .then(data => setProjects(data.data));
  }, []);
  return projects;
}

function Projects() {
   const projects = useProjects();
   console.log("projects", projects);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {projects && projects.map((project, idx) => (
            <Col md={4} className="project-card" key={project.id || idx}>
              <ProjectCard
                imgPath={project.image_url}
                isBlog={false}
                title={project.title}
                description={project.description}
                ghLink={project.github_link}
                chplay_link={project.chplay_link}
                stack_name={project.stack_name}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
