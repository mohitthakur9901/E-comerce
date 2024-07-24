import Cookies from 'js-cookie';
import ProductPage from './Pages/ProductPage';

function App() {

  Cookies.set('access_token', 'your_token_value', { expires: 7 });
  

  return (
    <>

      <ProductPage/>
    </>
  )
}

export default App
