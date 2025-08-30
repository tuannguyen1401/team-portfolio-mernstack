import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
// Đã bỏ import FaPlay vì nút CHPlay không phải icon FA
import { BsGooglePlay } from 'react-icons/bs';
function ProjectCards(props) {
  return (
    <Card className="project-card-view">
      <Card.Img variant="top" src={props.imgPath} alt="card-img" />
      {props.stack_name && (
        <div style={{ padding: "0.5rem", textAlign: "center", fontWeight: "bold", color: "#6c63ff" }}>
          {props.stack_name.split(",").map((stack, idx, arr) => (
            <span key={idx} style={{ marginRight: idx < arr.length - 1 ? "8px" : "0" }}>
              {stack.trim()}
              {idx < arr.length - 1 && <span>,</span>}
            </span>
          ))}
        </div>
      )}
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>
          <div dangerouslySetInnerHTML={{ __html: props.description }} />
        </Card.Text>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <Button variant="primary" href={props.ghLink} target="_blank">
            <BsGithub /> &nbsp;
            {props.isBlog ? "Blog" : "GitHub"}
          </Button>
          <Button variant="primary" href={props.chplay_link} target="_blank">
            <BsGooglePlay /> &nbsp;
            CH Play
          </Button>
        </div>
        {"\n"}
        {"\n"}

        {/* If the component contains Demo link and if it's not a Blog then, it will render the below component  */}
      </Card.Body>
    </Card>
  );
}
export default ProjectCards;
