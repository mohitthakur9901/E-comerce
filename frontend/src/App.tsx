import Card from "./Components/Card"

function App() {

  async function talkToBackend(){
    const response = await fetch('/api/v1/hello' , {
      method: "GET",
      headers :{
        "Content-Type" : "application/json"
      }
      // body: JSON.stringify({}) // if we want to send data to backend
    })
    console.log(response);
    
    
  }

  return (
    <>
    <button onClick={talkToBackend}>hello</button>
     <Card _id="1" addToCart={() => alert("hello")} productImage="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" productName="t-shirt" productPrice="400" />
    </>
  )
}

export default App
