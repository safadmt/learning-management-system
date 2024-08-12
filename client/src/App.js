
import './App.css';
import NavbarCom from './component/navbar/NavbarCom';
import {BrowserRouter} from 'react-router-dom'
import Naviagation from './routes/Naviagation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
     <Naviagation/>
    </BrowserRouter>
    <ToastContainer/>
    </div>
  );
}

export default App;
