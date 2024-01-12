import './App.css';
import TableComponent from './Components/TableComponent';

function App() {
  return (
    <>
    <div style={{height:"100vh"}}>  
      <div style={{backgroundColor:"#D8D2DE", height:"50px"}}></div>
    <div style={{  display: 'flex', flexDirection: 'row'}}>
      <div style={{backgroundColor:"#391E5A", width:"70px",marginTop:"-50px"}}></div>
     
    <div className="container-fluid my-3">
   
  <TableComponent/>
  </div>
    </div>
    </div>

    </>
  );
}

export default App;

