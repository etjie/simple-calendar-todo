import React, { useState, useEffect } from "react";
import {
  startOfWeek,
  lastDayOfWeek,
  format,
  addDays,
  isPast,
  isToday,
} from "date-fns";

import {
  Col,
  Row,
  Button,
  ButtonGroup,
  Modal,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { faTrashAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Days({ currentWeek, data, refreshData }) {
  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState(null);
  const [date, setDate] = useState(null);

  const startWeek = startOfWeek(currentWeek);
  const endWeek = lastDayOfWeek(currentWeek);
  const today = new Date();

  const displayDays = [];
  const formatDefault = "dd-MM-yyyy";
  const formatDate = "d";
  const formatDayName = "EEE";
  const formatMonth = "MMMM";

  for (let i = 0; i < 7; i++) {
    displayDays.push(addDays(startWeek, i));
  }

  const addTodo = async (obj) => {
    const pageRequest = `/api/todo`;
    const payload = {
      title,
      date,
    };

    const res = await fetch(pageRequest, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result) {
      refreshData();
    }
  };

  const completeTodo = async (obj) => {
    const pageRequest = `/api/todo/${obj.id}`;
    const payload = { ...obj, done: 1 };

    const res = await fetch(pageRequest, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result) {
      refreshData();
    }
  };

  const deleteTodo = async (obj) => {
    const pageRequest = `/api/todo/${obj.id}`;
    const res = await fetch(pageRequest, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
    const result = await res.json();
    if (result) {
      refreshData();
    }
  };

  const handleComplete = (obj) => {
    if (confirm("Do you want to complete this?")) {
      completeTodo(obj);
    }
  };

  const handleDelete = (obj) => {
    if (confirm("Are you sure to delete this?")) {
      deleteTodo(obj);
    }
  };

  const handleSubmit = () => {
    addTodo();
    setModalShow(false);
    setTitle(null);
    setDate(null);
  };

  return (
    <>
      <Row>
        {displayDays &&
          data &&
          displayDays.map((item) => {
            const columnDate = format(item, formatDefault);
            const matchTodo = data
              .filter((obj) => obj.date === columnDate)
              .sort((a, b) => b.done - a.done);

            return (
              <Col
                className="card p-2 text-center"
                key={format(item, formatDefault)}
              >
                {matchTodo.map((item) => (
                  <div key={item.id}>
                    {item.done == 1 ? (
                      <>
                        <Button variant="success" disabled block>
                          {item.title}
                        </Button>
                        <hr />
                      </>
                    ) : (
                      <>
                        <Button disabled block variant="light">
                          {item.title}
                        </Button>
                        <ButtonGroup className="w-100">
                          <Button
                            variant="light"
                            onClick={() => handleComplete(item)}
                          >
                            <FontAwesomeIcon
                              className="check-icon"
                              icon={faCheckCircle}
                            />
                          </Button>
                          <Button
                            variant="light"
                            onClick={() => handleDelete(item)}
                          >
                            <FontAwesomeIcon
                              className="delete-icon"
                              icon={faTrashAlt}
                            />
                          </Button>
                        </ButtonGroup>
                        <hr />
                      </>
                    )}
                  </div>
                ))}
                {(!isPast(item) || isToday(item)) && (
                  <div>
                    <Button
                      variant="warning"
                      size="sm"
                      block
                      onClick={() => {
                        setDate(columnDate);
                        setModalShow(true);
                      }}
                    >
                      + Add
                    </Button>
                  </div>
                )}
              </Col>
            );
          })}
      </Row>

      <Modal size="sm" show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add To Do</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Todo Title..."
              onChange={(e) => setTitle(e.target.value)}
            />
            <InputGroup.Append>
              <Button variant="primary" onClick={() => handleSubmit()}>
                Submit
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Modal.Body>
      </Modal>
    </>
  );
}
