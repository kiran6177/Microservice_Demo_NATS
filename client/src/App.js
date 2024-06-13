import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Signup from './components/Signup';
import Landing from './components/Landing';
import Signin from './components/Signin';
import Header from './components/Header';
import CreateTicket from './components/CreateTicket';
import ViewOrders from './components/ViewOrders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header/>}>
          <Route index path='/' element={<Landing/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Signin/>} />
          <Route path='/tickets/create' element={<CreateTicket/>} />
          <Route path='/orders' element={<ViewOrders/>} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
