import React from "react";
import { Col, Row } from "react-bootstrap";
import { CgCPlusPlus } from "react-icons/cg";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiJava,
} from "react-icons/di";
import {
  SiRedis,
  SiFirebase,
  SiNextdotjs,
  SiSolidity,
  SiPostgresql,
} from "react-icons/si";
import { SiReact } from "react-icons/si";
import { SiReactNative } from "react-icons/si";
import { SiFlutter } from "react-icons/si";
import { TbBrandGolang } from "react-icons/tb";

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons cursor-pointer">
        <SiFlutter />
      </Col>
      <Col xs={4} md={2} className="tech-icons cursor-pointer">
        <DiJavascript1 />
      </Col>
      <Col xs={4} md={2} className="tech-icons cursor-pointer">
        <DiNodejs />
      </Col>
      <Col xs={4} md={2} className="tech-icons cursor-pointer">
        <DiReact />
      </Col>
      <Col xs={4} md={2} className="tech-icons cursor-pointer">
        <DiMongodb />
      </Col>
      <Col xs={4} md={2} className="tech-icons cursor-pointer">
        <SiFirebase />
      </Col>
      <Col xs={4} md={2} className="tech-icons cursor-pointer">
        <SiRedis />
      </Col>
      <Col xs={4} md={2} className="tech-icons cursor-pointer">
        <SiPostgresql />
      </Col>
    </Row>
  );
}

export default Techstack;
