import React, { useState, useEffect } from "react";
import { addDays, subDays } from "date-fns";

import { Row, Col, Button } from "react-bootstrap";
import Days from "./Days";
import Columns from "./Columns";

export default function Calendar({}) {
  const [dataTodo, setDataTodo] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const nextWeek = () => {
    const next = addDays(currentWeek, 7);
    setCurrentWeek(next);
  };

  const prevWeek = () => {
    const prev = subDays(currentWeek, 7);
    setCurrentWeek(prev);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const pageRequest = `/api/todo`;
    const res = await fetch(pageRequest, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const result = await res.json();
    if (result) {
      setDataTodo(result.data);
    }
  };

  return (
    <div className="calendar">
      <Row className="mb-4">
        <Col>
          <Button onClick={() => prevWeek()} variant="light">
            &laquo; Prev Week
          </Button>
        </Col>
        <Col className="text-center">
          <Button onClick={() => setCurrentWeek(new Date())} variant="light">
            This Week
          </Button>
        </Col>
        <Col className="text-right">
          <Button onClick={() => nextWeek()} variant="light">
            &raquo; Next Week
          </Button>
        </Col>
      </Row>
      <Days currentWeek={currentWeek} />
      <Columns
        currentWeek={currentWeek}
        data={dataTodo}
        refreshData={() => fetchData()}
      />
    </div>
  );
}
