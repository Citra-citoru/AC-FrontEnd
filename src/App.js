import './App.css';
import Header from './components/header/index';
import Footer from './components/footer/index';
import HorizontalLinearStepper from './components/stepper/index';

function App() {
  return (
    <div className="App">
      <Header/>
      <HorizontalLinearStepper/>
      <Footer/>
    </div>
  );
}

export default App;
