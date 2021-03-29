import React, { useState, useEffect } from "react";
import { startOfWeek, lastDayOfWeek, format, addDays } from "date-fns";

import { Col, Row } from "react-bootstrap";

export default function Days({ currentWeek }) {
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

  return (
    <>
      <Row>
        {displayDays &&
          displayDays.map((item) => (
            <Col
              className="card p-3 text-center"
              key={format(item, formatDefault)}
            >
              <div className="month-name">{format(item, formatMonth)}</div>
              <div className="day-name">
                <strong>{format(item, formatDayName)}</strong>
              </div>
              {format(today, formatDefault) === format(item, formatDefault) ? (
                <div className="active day">
                  <span>{format(item, formatDate)}</span>
                </div>
              ) : (
                <div className="day">
                  <span>{format(item, formatDate)}</span>
                </div>
              )}
            </Col>
          ))}
      </Row>
    </>
  );
}
