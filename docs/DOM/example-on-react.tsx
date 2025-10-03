export default function App() {
  function handleClick() {
    console.log("Clicked!");
  }

  return (
    <button id="myBtn" onClick={handleClick}>
      Click me
    </button>
  );
}

/*
 *   {
 *      "devDependencies": {
 *          "@types/react": "^19.2.0"
 *      }
 *   }
 */
