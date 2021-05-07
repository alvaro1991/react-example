import React from "react";

const GAME_STATUS_TEXT = {
    inProgress: () => null,
    success: turn => `${turn} won!`,
  }

  function Game() {
    const [state, dispatch] = React.useReducer(reducer, getInitialState())
    const { grid, status, turn } = state
  
    const handleClick = (x, y) => {
      dispatch({ type: 'CLICK', payload: { x, y } })
    }
  
    const reset = () => {
      dispatch({ type: 'RESET' })
    }
  
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Next up: {turn}</div>
          <div>{GAME_STATUS_TEXT[status](turn)}</div>
          <button onClick={reset} type="button">
            Reset
          </button>
        </div>
        <Grid  grid={grid} handleClick={handleClick} />
      </div>
    )
  }
function generateGrid(rows, columns, mapper) {
    return Array(rows)
      .fill()
      .map(() =>
        Array(columns)
          .fill()
          .map(mapper)
      )
}

const newTicTacToeGrid = () => generateGrid(3, 3, () => null)

function Grid({ grid }) {
    return (
      // Wrapping the grid with a div of inline-block means that the grid
      // takes up only the space defined by the size of the cells, while
      // still allowing us to use fractional values for the grid-template-*
      // properties
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            // We set a background color to be revealed as the lines
            // of the board with the `grid-gap` property
            backgroundColor: '#000',
            display: 'grid',
            // Our rows are equal to the length of our grid
            gridTemplateRows: `repeat(${grid.length}, 1fr)`,
            // Our columns are equal to the length of a row
            gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
            gridGap: 2,
          }}
        >
          {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              // We put the colIdx first because that is our X-axis value
              // and the rowIdx second because that is our Y-axis value
              // Getting in the habit makes using 2d grids much easier
              <Cell key={`${colIdx}-${rowIdx}`} cell={cell} />
            ))
          )}
        </div>
      </div>
    )
  }
  
  const cellStyle = {
    backgroundColor: '#fff',
    height: 75,
    width: 75,
  }

  const buttonStyle = {
    backgroundColor: '#fff',
    height: 75,
    width: 75,
  }
  
  function Cell({ cell, handleClick }) {
  return (
    <div style={cellStyle}>
      <button style={buttonStyle} type="button" onClick={handleClick}>
        {cell}
      </button>
    </div>
  )
}

const clone = x => JSON.parse(JSON.stringify(x))

// An enum for the next turn in our game
const NEXT_TURN = {
  O: 'X',
  X: 'O',
}

const getInitialState = () => ({
    grid: newTicTacToeGrid(),
    status: 'inProgress',
    turn: 'X',
  })

const reducer = (state, action) => {
    if (state.status === 'success' && action.type !== 'RESET') {
        return state
      }
  switch (action.type) {
    case 'CLICK': {
        const { x, y } = action.payload
        const nextState = clone(state)
        const { grid, turn } = nextState
  
        if (grid[y][x]) {
          return state
        }
  
        grid[y][x] = turn
  
        const flatGrid = flatten(grid)
  
        if (checkForWin(flatGrid)) {
          nextState.status = 'success'
          return nextState
        }
  
        if (checkForDraw(flatGrid)) {
          return getInitialState()
        }
  
        nextState.turn = NEXT_TURN[turn]
  
        return nextState
      }
  
    case 'RESET':
        return getInitialState()
  

    default:
      return state
  }
}

const checkThree = (a, b, c) => {
    // If any of the values are null, return false
    if (!a || !b || !c) return false
    return a === b && b === c
}

// Depending on your JavaScript environment, you can potentially
// use Array.prototype.flat to do this
const flatten = array => array.reduce((acc, cur) => [...acc, ...cur], [])

function checkForWin(flatGrid) {
  // Because our grid is flat, we can use array destructuring to
  // define variables for each square, I will use the points on a
  // compass as my variable names
  const [nw, n, ne, w, c, e, sw, s, se] = flatGrid

  // Then we simply run `checkThree` on each row, column and diagonal
  // If it's true for any of them, the game has been won!
  return (
    checkThree(nw, n, ne) ||
    checkThree(w, c, e) ||
    checkThree(sw, s, se) ||
    checkThree(nw, w, sw) ||
    checkThree(n, c, s) ||
    checkThree(ne, e, se) ||
    checkThree(nw, c, se) ||
    checkThree(ne, c, sw)
  )
}

function checkForDraw(flatGrid) {
    return (
      !checkForWin(flatGrid) &&
      flatGrid.filter(Boolean).length === flatGrid.length
    )
  }


export default Game;