import './App.css';
import React from 'react';
import { useState } from 'react';
import Cohort from './components/cohorts.jsx';
import Degrees from './components/degrees.jsx';
import Modules from './components/modules.jsx';
import Students from './components/students.jsx';
import Grades from './components/grades.jsx';

//? notes: 
//> when something needs to be patched, it needs to search for the element first, thus, URIs will have to be implemented...
//>      further on, the way we will search for the element will by using filter...

//> the create will not need any search, it will just create a new element...

function App() {

  const [isCohord, setCohord] = useState(false);
  const [isDegrees, setDegrees] = useState(false);
  const [isModules, setModules] = useState(false);
  const [isStudents, setStudents] = useState(false);
  const [isGrades, setGrades] = useState(false);
  const [isCreate, setCreate] = useState(true);

  const handleCreate = () => {
    setCreate(!isCreate);
  };

  return (

    <div className="card mx-auto border-0 shadow-lg rounded-3 text-center">
    <div className="card-body" style={{maxWidth:500 + 'px', margin:'auto'}}>

      {(isCohord === true || isDegrees === true || isModules === true || isStudents === true || isGrades === true) ? (

      <div className="form-check form-switch flwx-column d-inline-flex align-items-center justify-content-center my-3 p-0">
        <p className="mr-2 mb-0 mx-2">Search</p>
        <div className="form-check form-switch mb-0">
          <input type="checkbox" className="form-check-input" role="switch" id="flexSwitchCheckDefault" onChange={() => handleCreate()}/>
          <label htmlFor="flexSwitchCheckDefault" className="form-check-label"></label>
        </div><br/>
        <p className="ml-2 mb-0" htmlFor="flexSwitchCheck">Create</p>
      </div>

      ) : null}


      {isCohord && <Cohort.CohortForm isCreate={!isCreate} />}
      {isDegrees && <Degrees.DegreesForm isCreate={!isCreate} />}
      {isModules && <Modules.ModulesForm isCreate={!isCreate} />}
      {isStudents && <Students.StudentsForm isCreate={!isCreate} />}
      {isGrades && <Grades.GradesForm isCreate={!isCreate} />}

      <div className="card d-inline-block border-0">
        {isCohord === false ? (
          <button type="submit" className="btn btn-outline-primary mx-1" onClick={() => { setCohord(true); setDegrees(false); setModules(false); setStudents(false); setGrades(false)}}>
            Cohort
          </button>
        ) : (
          <button type="submit" className="btn btn-outline-success mx-1">
            Cohort
          </button>
        )}

        {isDegrees === false ? (
          <button type="submit" className="btn btn-outline-primary mx-1" 
            onClick={() => { setCohord(false); setDegrees(true); setModules(false); setStudents(false); setGrades(false)}}> Degrees </button>
        ) : (
          <button type="submit" className="btn btn-outline-success mx-1"> Degrees </button>
        )}

        {isModules === false ? (
          <button type="submit" className="btn btn-outline-primary mx-1"
            onClick={() => { setCohord(false); setDegrees(false); setModules(true); setStudents(false); setGrades(false)}}> Modules </button>
        ) : (
          <button type="submit" className="btn btn-outline-success mx-1"> Modules </button>
        )}

        {isStudents === false ? (
          <button type="submit" className="btn btn-outline-primary mx-1" 
            onClick={() => { setCohord(false); setDegrees(false); setModules(false); setStudents(true); setGrades(false)}}> Students </button>
        ) : (
          <button type="submit" className="btn btn-outline-success mx-1">Students </button>
        )}

        {isGrades === false ? (
          <button type="submit" className="btn btn-outline-primary mx-1" 
            onClick={() => { setCohord(false); setDegrees(false); setModules(false); setStudents(false); setGrades(true)}}> Grades </button>
        ) : (
          <button type="submit" className="btn btn-outline-success mx-1"> Grades </button>
        )}
      </div>

    </div>
    </div>

  );
}

export default App;
