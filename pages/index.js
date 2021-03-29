import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import Calendar from "../components/Calendar";

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Awesome TO-DO App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main">
        <h1 className="m-4 text-center">Awesome To-Do App</h1>
        <hr />
        <Calendar className="card m-4" />
      </div>
    </Container>
  );
}
