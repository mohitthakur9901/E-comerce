import Card from "./Components/Card"

function App() {

  

  return (
    <>
     <Card _id="1" addToCart={() => alert("hello")} productImage="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" productName="t-shirt" productPrice="400" />
    </>
  )
}

export default App
