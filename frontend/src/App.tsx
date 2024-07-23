

function App() {

  async function Hello() {

    const response = await fetch('/api/v1/hello',
      {
        method: 'GET',
      }
    )
    const data = await response.json()
    console.log(data);

  }


  return (
    <>
      <button onClick={() => Hello()}>hello</button>
    </>
  )
}

export default App
