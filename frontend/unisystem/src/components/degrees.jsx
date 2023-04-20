import { useState, useEffect } from "react";

function DegreesForm(isCreate) {

    //> part 1 -> show individual degree
    const [degree, setDegree] = useState(null);
    const [cohorts, setCohorts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    //? part 2 -> show all the students within a cohort
    const [studentsCohort, setStudentCohort] = useState(null);
    const [viewSingleCohort, setViewSingleCohort] = useState(false);
    const [indivCohort, setIndivCohort] = useState(null);

    //? part 3 -> see the grades of that student aka view indivudal student
    const [grades, setGrades] = useState(null);
    const [modules, setModules] = useState([]);
    const [studentName, setStudentName] = useState(null);
    const [viewSingle, setViewSingle] = useState(false);

    //? part 4 -> view all degrees
    const [viewAllDegrees, setViewAllDegrees] = useState(false);
    const [degrees, setDegrees] = useState([]);

    //? part 5 -> view cohorts in the module...
    //! note that in here we also must see the modules in the specific cohort...

    //> this also creates the degrees
    const handleSubmit = async (event) => {

        let returnedData = null;

        if (event) {
            event.preventDefault();

            const full_name = event.target.full_name;
            const shortcode = event.target.shortcode;
        
            if (event.nativeEvent.submitter.textContent === "Search") {
                returnedData = await singleDegree(String(shortcode.value).toUpperCase());
            } else {
                returnedData = await createDegree(full_name.value, String(shortcode.value).toUpperCase());
            }
        }

        if (returnedData) {
            setDegree(returnedData);
            console.log(degree);
        }

    };

    //> resets the search
    useEffect(() => {
        setDegree(null);
    }, [isCreate.isCreate]);


    //> show the cohorts inside a degree
    const cohortsInDegree = async (id) => {
        let caller = `http://localhost:8000/api/cohort/?degree=${id}`;

        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };
        const response = await fetch(caller, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Response is not in JSON format");
        }
    
        const data = await response.json();
        if (data) {
            setCohorts(data);
            setIsFetching(false);
            setViewAllDegrees(false);
        }

    };

      //> we need to show all the students within a cohort
      const handleIndiv = async (event, id) => {

        if (event) {
            event.preventDefault();

            let caller = `http://localhost:8000/api/student/?cohort=${id}`;

            const requestOptions = {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
            };

            const response = await fetch(caller, requestOptions);
            const data = await response.json();

            setStudentCohort(data);

            console.log("This is data", data);

            if (data) {
                setIsFetching(false);
                setViewSingleCohort(true);
            }
            
        }

    };

    //> view single student
    const viewSingleStudent = async (id, first_name, last_name) => {
        let studentGradeCaller = `http://127.0.0.1:8000/api/grade/?student=${id}`;
      
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };
      
        const gradeResponse = await fetch(studentGradeCaller, requestOptions);
        const gradeData = await gradeResponse.json();
      
        console.log(gradeData);
      
        if (gradeData) {
            console.log("grade data", gradeData);
          setGrades(gradeData);
      
          let newModules = [];
      
          for (const grade of gradeData) {
            const moduleResponse = await fetch(grade.module, requestOptions);
            const moduleData = await moduleResponse.json();
            console.log("module data", moduleData);
      
            if (moduleData) {
              newModules.push(moduleData);
            }
          }
      
          setModules(newModules);
      
          if (newModules) {
            console.log("this is modules", newModules);
            setIsFetching(false);
            setViewSingle(true);
            setStudentName(`${first_name} ${last_name}`);
          }
        }
      };

    //> view all degrees
    const allDegrees = async () => {

        let caller = "http://localhost:8000/api/degree/";

        const requestOptions = {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        };

        const response = await fetch(caller, requestOptions)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Response is not in JSON format");
        }
    
        const data = await response.json();
        if (data) {
            setIsFetching(false);
            setViewAllDegrees(true);
            setDegrees(data);
        }

    };

    return (
        <div>

                <>

                <form id="degreesForm" onSubmit={handleSubmit} style={degree !== null ? {display: 'none'} : {display: 'contents'} }>

                    {!isCreate.isCreate ? <h3 className="text-center mb-5">Search for a degree</h3> : <h3 className="text-center">Create a degree</h3>}

                    <div>
                        {isCreate.isCreate ? <label htmlFor="full_name" /> : null}
                        {isCreate.isCreate ? <input type="text" id="full_name"  className="my-3" name="full_name" placeholder="Full Name" style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}}  required/> : null}
                    </div>
                    <div>
                        <label htmlFor="shortcode" />
                        <input type="text" id="shortcode" className="mb-4" name="shortcode" placeholder="Short Code" style={{border: 'none', borderBottom: 1 + 'px solid lightgray', textTransform: 'uppercase'}}  required />
                    </div>

                    {!isCreate.isCreate ? <button type="submit" className="btn btn-primary mb-4">Search</button> : <button type="submit" className="btn btn-primary mb-4">Create</button>}<br/>

                    <p className="btn btn-light mb-4"  data-bs-toggle="modal" data-bs-target="#seeAllCohortsDegrees" onClick={() => {setIsFetching(true); allDegrees(); setViewAllDegrees(true)}}>View All Degrees</p>

                </form>

                </>

            {  degree !== null ?
                <div className="card mb-4 border-0 rounded-2 shadow" style={{cursor: 'pointer'}}>
                    <div className="card-body">
                        <h5 className="card-title">{degree.full_name}</h5> 
                        <h6 className="card-subtitle mb-2 text-muted">{degree.shortcode}</h6>
                        <p className="card-text text-primary" data-bs-toggle="modal" data-bs-target="#seeAllCohortsDegrees" onClick={() => {cohortsInDegree(degree.shortcode); setIsFetching(true);}}>View All Cohorts</p>
                    </div>
                </div> : null}
                
                <div className="modal fade modal-fullscreen" id="seeAllCohortsDegrees" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="staticBackdropLabel">Degrees</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body d-flex flex-wrap d-inline text-center justify-content-center align-items-center">

                      {isFetching ? 
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div> : 

                        <>

                        {viewAllDegrees ?

                            <>
                            {degrees.map((degree) => {
                                return(
                                    <div className="card mx-1 border-0 rounded-2 shadow" style={{cursor: 'pointer'}} key={degree.id}>
                                        <div className="card-body">
                                            <h5 className="card-title">{degree.full_name}</h5>
                                            <h6 className="card-subtitle mb-2 text-muted">{degree.shortcode}</h6>
                                            <p className="card-text text-primary"  onClick={() => {cohortsInDegree(degree.shortcode); setIsFetching(true);}}>View All Cohorts</p>
                                        </div>
                                    </div>
                            )})}
                            </>
                        :

                        <>

                        {!viewSingleCohort ?
                            <>
                            {cohorts.length > 0 ?
                            <>
                            {cohorts.map((cohort) => {
                                return(
                                <div className="card mx-1 border-0 rounded-2 shadow" style={{cursor: 'pointer'}} key={cohort.id}>
                                    <div className="card-body">
                                    <h5 className="card-title">{cohort.name}</h5>
                                    <p className="card-text text-primary" onClick={(event) => {setIsFetching(true); handleIndiv(event, cohort.id); setIndivCohort(cohort.name)}}>View Cohort</p>
                                    </div>
                                </div>
                            )})}
                            </>
                            :
                            <div className="card mx-1 border-0 rounded-2 shadow">
                                <div className="card-body">
                                    <h5 className="card-title text-danger">No Cohorts</h5>
                                </div>
                            </div>
                            }
                            </>

                        : 
                        <>
                                {!viewSingle ?
                                    <>
                                    { studentsCohort.length > 0 ?
                                        studentsCohort.map((students) => (
                                            <div className="card text-center border-0 shadow rounded-2 w-25 mx-2 my-2" style={{cursor: 'pointer'}} onClick={() => {setIsFetching(true);viewSingleStudent(students.student_id, students.first_name, students.last_name)}}>
                                                <div className="card-body">
                                                    <h5 className="card-title">{students.first_name} {students.last_name}</h5>
                                                    <p className="card-text btn btn-sm btn-secondary">{students.email}</p>
                                                    <p className="text-primary">View Student</p>
                                                </div>
                                            </div>
                                        ))
                                    : 
                                        <div className="card text-center border-0 shadow rounded-2 w-25 my-2">
                                            <div className="card-body text-danger">
                                                <h5 className="card-title">No Students</h5>
                                            </div>
                                        </div>
                                    }
                                    </> 
                                :
                                <div className="card text-center border-0 shadow rounded-2 my-1 mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">{studentName}</h5>
                                    <h6 className="card-title">{indivCohort.name}</h6>
                                </div>

                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Module</th>
                                        <th>CA Mark</th>
                                        <th>Exam Mark</th>
                                        <th>Total Grade</th>
                                        <th>CA Split</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {modules.map((module) => {
                                        const grade = grades.find((g) => g.module.includes(module.code));
                                        return (
                                        <tr key={`module-${module.code}`}>
                                            <td>{module.full_name}</td>
                                            <td>{grade ? Math.round(grade.ca_mark) : "None"}</td>
                                            <td>{grade ? Math.round(grade.exam_mark) : "None"}</td>
                                            <td>{grade ? Math.round(grade.total_grade) : "None"}</td>
                                            <td>{Math.round(module.ca_split)}</td>
                                        </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>}
                            </>
                            
                        }
                        </>

                      }

                        </>}

                    </div>
                        <div className="modal-footer">
                            {viewAllDegrees ? <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button> 
                            :
                            !viewAllDegrees && !viewSingle && !viewSingleCohort ?  <button type="button" className="btn btn-danger" onClick={() => {setViewAllDegrees(true)}} >Back</button> : null
                            }

                            {viewSingleCohort && !viewSingle ? <button type="button" className="btn btn-danger" onClick={() => {setViewSingleCohort(false);}} >Back</button> : null}
                            {viewSingle ? <button type="button" className="btn btn-danger" onClick={() => {setViewSingle(false);}} >Back</button> : null}
                        </div>
                  </div>
                </div>
              </div>

        </div>
    );
}

//> this searches for a degree
async function singleDegree(id) {
    
    const caller = `http://localhost:8000/api/degree/${id}`;

    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(caller, requestOptions);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Response is not in JSON format");
    }

    const data = await response.json();
    if (data) {
        return data;
    }
}

//> this creates a new degree
async function createDegree(full_name, shortcode) {
    const caller = "http://localhost:8000/api/degree/";

    const degreeData = {
        full_name: String(full_name),
        shortcode: String(shortcode)
    };

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(degreeData),
    };

    const response = await fetch(caller, requestOptions);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Response is not in JSON format");
    }

    const data = await response.json();
    if (data) {
        return data;
    }
}

export default {singleDegree, DegreesForm, createDegree};
