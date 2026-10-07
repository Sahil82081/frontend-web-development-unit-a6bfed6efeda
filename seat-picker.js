// Seat picker for the Riverside Community Theatre main hall.
// The browser loads this with a <script> tag (React is already a global);
// the tests load it with require() (React comes from node_modules).
(function (root) {
  const React = root.React || require("react");
  const h = React.createElement;

  // Rows A, B, C with seats 1 to 6. These seats are already booked.
  const BOOKED = ["A3", "A4", "B2", "C5", "C6"];

  function createSeats() {
    const seats = [];

    ["A", "B", "C"].forEach(function (row) {
      for (let number = 1; number <= 6; number++) {
        seats.push({
          row: row,
          number: number,
          booked: BOOKED.includes(row + number)
        });
      }
    });

    return seats;
  }

  function seatLabel(seat) {
    return seat.row + seat.number;
  }

  // Returns a NEW array.
  function toggleSeat(selected, seat) {
    if (seat.booked) {
      return selected;
    }

    const label = seatLabel(seat);

    if (selected.includes(label)) {
      return selected.filter(function (l) {
        return l !== label;
      });
    }

    return selected.concat(label);
  }

  function seatStatus(seat, selected) {
    if (seat.booked) {
      return "Taken";
    }

    return selected.includes(seatLabel(seat))
      ? "Selected"
      : "Free";
  }

  // Labels follow seat-map order.
  function selectionMessage(seats, selected) {
    const labels = seats
      .map(seatLabel)
      .filter(function (l) {
        return selected.includes(l);
      });

    if (labels.length === 0) {
      return "No seats selected";
    }

    return "Selected: " + labels.join(", ");
  }

  function SeatMap(props) {
    return h(
      "ul",
      { className: "seat-map" },
      props.seats.map(function (seat) {
        const label = seatLabel(seat);
        const status = seatStatus(seat, props.selected);

        return h(
          "li",
          { key: label },
          h(
            "button",
            {
              className: status.toLowerCase(),
              disabled: seat.booked,
              onClick: function () {
                props.onToggle(seat);
              }
            },
            label + " " + status
          )
        );
      })
    );
  }

  function SeatPicker() {
    const seats = createSeats();
    const [selected, setSelected] = React.useState([]);

    return h(
      "div",
      null,
      h(
        "h1",
        null,
        "Riverside Community Theatre - Main Hall"
      ),

      h(SeatMap, {
        seats: seats,
        selected: selected,
        onToggle: function (seat) {
          setSelected(toggleSeat(selected, seat));
        }
      }),

      h(
        "p",
        { className: "message" },
        selectionMessage(seats, selected)
      ),

      h(
        "button",
        {
          onClick: function () {
            setSelected([]);
          }
        },
        "Clear selection"
      )
    );
  }

  const api = {
    createSeats: createSeats,
    seatLabel: seatLabel,
    toggleSeat: toggleSeat,
    seatStatus: seatStatus,
    selectionMessage: selectionMessage,
    SeatMap: SeatMap,
    SeatPicker: SeatPicker
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.SeatPickerApp = api;
  }
})(typeof window !== "undefined" ? window : globalThis);