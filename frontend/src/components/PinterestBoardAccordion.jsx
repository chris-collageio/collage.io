import { useState } from "react";

function PinterestBoardAccordion({ boards, onAddSelected }) {
  const [expandedBoardId, setExpandedBoardId] = useState(null);
  const [selectedPins, setSelectedPins] = useState({});

  // Toggle board open/close
  const toggleBoard = (boardId) => {
    setExpandedBoardId(expandedBoardId === boardId ? null : boardId);
  };

  // Toggle selection of individual pin
  const togglePin = (pinId) => {
    setSelectedPins((prev) => ({
      ...prev,
      [pinId]: !prev[pinId],
    }));
  };

  // Toggle all pins in a board
  const toggleAllPinsInBoard = (board) => {
    const allSelected = board.pins.every((pin) => selectedPins[pin.id]);
    const newSelections = { ...selectedPins };
    board.pins.forEach((pin) => {
      newSelections[pin.id] = !allSelected;
    });
    setSelectedPins(newSelections);
  };

  // Get selected pin objects
  const getSelectedPins = () => {
    return boards
      .flatMap((board) => board.pins)
      .filter((pin) => selectedPins[pin.id]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-4 rounded shadow space-y-4">
      {boards.map((board) => (
        <div key={board.id} className="border rounded">
          {/* Board Header */}
          <div
            className="flex items-center justify-between p-3 cursor-pointer bg-gray-100"
            onClick={() => toggleBoard(board.id)}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={board.pins.every((pin) => selectedPins[pin.id])}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAllPinsInBoard(board);
                }}
                onChange={() => {}}
              />
              <span className="font-medium">{board.name}</span>
            </div>
            <span>{expandedBoardId === board.id ? "▲" : "▼"}</span>
          </div>

          {/* Pins Grid */}
          {expandedBoardId === board.id && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {board.pins.map((pin) => (
                <div key={pin.id} className="relative group">
                  <img
                    src={pin.imageUrl}
                    alt={pin.title}
                    className="rounded shadow object-cover w-full h-40"
                  />
                  <input
                    type="checkbox"
                    className="absolute bottom-2 left-2 w-5 h-5"
                    checked={selectedPins[pin.id] || false}
                    onChange={() => togglePin(pin.id)}
                  />
                  <div className="text-sm text-center mt-1 text-gray-700 truncate">
                    {pin.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={() => onAddSelected(getSelectedPins())}
        className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        ➕ Add Selected to Collage
      </button>
    </div>
  );
}

export default PinterestBoardAccordion;