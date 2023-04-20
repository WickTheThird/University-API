import { useState, useEffect } from "react";

//? this is the form that searches or creates the cohort
function CohortForm(isCreate) {
    console.log("isCreate: " + isCreate.isCreate);

    //? part 1 --> create the cohort and toggle the create also search for an individual cohort
    const [response, setResponse] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    //? part 2 --> show all the students within a cohort
    const [isFetching, setIsFetching] = useState(false);
    const [studentsCohort, setStudentCohort] = useState(null);
    const [postFetch, setPostFetch] = useState(null);

    //? part 3 --> see the grades of that student aka view indivudal student
    const [grades, setGrades] = useState(null);
    const [modules, setModules] = useState([]);
    const [studentName, setStudentName] = useState(null);
    const [viewSingle, setViewSingle] = useState(false);

    //? part 4 --> see all the cohorts
    const [allCohorts, setAllCohorts] = useState([]);
    const [indivCohort, setIndivCohort] = useState(null);
    const [viewSingleCohort, setViewSingleCohort] = useState(false);

    //? part 5 --> show all the modules 
    //? part 5.1 --> show the modules in a specific cohort
    const [toggle, setToggle] = useState(false);
    const [allModules, setAllModules] = useState(null);
    const [indivModule, setIndivModule] = useState(null);

    //? grab all the degrees
    useEffect(() => {
        let caller = "http://localhost:8000/api/degree/";

        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        };

        if (isCreate) {
          fetch(caller, requestOptions)
            .then((res) => res.json())
            .then(
              (result) => {
                console.log(result);
                setResponse(true);
                setData(result);
                setIsLoading(false);
              },
              (error) => {
                setResponse(true);
                setError(error);
                setIsLoading(false);
              }
            );
        }
        console.log(postFetch);
      }, []);

    //> handle submit and setting the form to a post state
    const handleSubmit = async (event, isCreate) => {
        if (event) {
            event.preventDefault();
    
            const id = event.target.id;
    
            let year = null;
            let degree = null;
            let cohortName = null;

            let postData = null;
    
            if (isCreate) {
                year = event.target.year;
                degree = event.target.degree;
                cohortName = event.target.name;
            }
    
            if (!isCreate) {
                postData = await singleCohort(String(id.value).toUpperCase());
            } else {
                postData = await createCohort(String(id.value).toUpperCase(), year.value, degree, cohortName.value);
            }

            console.log(postData);
            setPostFetch(postData);

        }
    };

    //> toggle is fetching
    const handleWaitFetch = (state) => {
       setIsFetching(state);
       console.log(isFetching);
    };

    //> reset the postFetch to default aka null (we will have a hendler in order to be pressable)
    useEffect(() => {
        setPostFetch(null);
    }, [isCreate]);

    //> we need to show all the students within a cohort
    const handleIndiv = async (event, id) => {

        if (event) {

            console.log(id);

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
      
          handleWaitFetch(false);
      
          if (newModules) {
            console.log("this is modules", newModules);
            setViewSingle(true);
            setStudentName(`${first_name} ${last_name}`);
          }
        }
      };
    
    //> fetch all the cohorts and assign it to the setAllCohorts
    const fetchAllCohorts = async () => {
        let caller = "http://localhost:8000/api/cohort/";

        const requestOptions = {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
        };

        const response = await fetch(caller, requestOptions);
        const data = await response.json();

        if (data) {
            console.log(data);
            setAllCohorts(data);
            setIsFetching(false);
        }
    };

    //> fetch all the modules
    const fetchAllModules = async () => {

        let caller = "http://localhost:8000/api/module/";

        const requestOptions = {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
        };

        const response = await fetch(caller, requestOptions);
        const data = await response.json();

        if (data) {
            console.log(data);
            setAllModules(data);
            setIsFetching(false);
            setToggle(true);
            setStudentCohort(null);
        }

    };

    //> view individual module
    const viewIndividualModule = async (id) => {

        let caller = `http://localhost:8000/api/module/${id}`;

        const requestOptions = {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
        };

        const response = await fetch(caller, requestOptions);
        const data = await response.json();

        if (data) {
            console.log(data);
            setIndivModule(data);
            setIsFetching(false);
            setToggle(true);
            setStudentCohort(null);
        }
    };

    //> view modules for a specific cohort (this will still be using view all modules)
    const viewCohortModule = async (id) => {

        console.log(id);

        let caller = `http://127.0.0.1:8000/api/module/?delivered_to=${id}`;

        const requestOptions = {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
        };

        const response = await fetch(caller, requestOptions);
        const data = await response.json();

        if (data) {
            console.log(data);
            setAllModules(data);
            setIsFetching(false);
            setToggle(true);
            setStudentCohort(null);
        }

    };

    return (

        <div>

            {postFetch === null ? (

            <div>
                {!isCreate.isCreate ? <h3 className="">Search For Cohort</h3> : <h3 className="mb-3">Create Cohort</h3>}

                {((!response || error) && isCreate.isCreate )  ? (
                    <p>Please wait until degree data is fetched!</p>
                    ) : (
                    <form id="cohortsForm" className="text-center my-4 p-0" onSubmit={(event) => handleSubmit(event, isCreate.isCreate)} autoComplete="false">
                    <div>
                        <label htmlFor="id" />
                        <input type="text" id="id" className="mb-3" style={{border: 'none', borderBottom: 1 + 'px solid lightgray', textTransform: 'uppercase'}} name="id" placeholder="ID" required/>
                    </div>

                    <div>
                        {isCreate.isCreate ? <label htmlFor="year" /> : null}
                        {isCreate.isCreate ? <input type="number" id="year" className="mb-3" style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} name="year" placeholder="Year" required /> : null}
                    </div>

                    <div>
                        {isCreate.isCreate ? <label htmlFor="name" /> : null}
                        {isCreate.isCreate ? <input type="text" id="students"  className="" style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} name="name"  placeholder="Name" required/> : null}
                    </div>

                    <div className="text-center">
                        {isCreate.isCreate ? <label htmlFor="degree" /> : null}
                        {isCreate.isCreate && response ? 
                            <div className="text-center d-flex justify-content-center align-items-center">
                            {isLoading ? (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <select id="degree" className="form-select w-50 mb-2 mx-auto" name="degree" required>
                                    {data.map((degree) => (
                                        <option key={degree.id} value={degree.shortcode} >{degree.full_name}</option>
                                    ))}
                                </select>
                            )}
                            </div>
                        : null}
                    </div>

                        <button type="submit" className="btn btn-primary my-3">Submit</button><br/>
                        <button type="button" className="btn btn-light my-3 mx-2" data-bs-toggle="modal" data-bs-target="#seeAllCohorts" onClick={() => {fetchAllCohorts(); setIsFetching(true)}}>See All Cohorts</button>

                    </form>
                )}

                <div className="modal fade modal-fullscreen" id="seeAllCohorts" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Cohorts</h1>
                                <div className="card border-0 d-inline">
                                    {!toggle ? <p className="btn btn-sm btn-success mx-2 modal-title my-2" style={{cursor: 'pointer'}}>{viewSingleCohort ? <> {indivCohort !== null ? indivCohort.name : <>Cohorts</>} </> : <>Cohorts</>}</p> 
                                        : <p className="btn btn-sm btn-primary mx-2 modal-title my-2" style={{cursor: 'pointer'}} 
                                                onClick={(event) => {{indivCohort !== null ? handleIndiv(event, indivCohort.id) : fetchAllCohorts();}; setIsFetching(true); setToggle(false);}} >
                                                    
                                                    {viewSingleCohort ?<> {indivCohort !== null ? indivCohort.name : <>Cohorts</>} </>: <>Cohorts</>}
                                                
                                                </p>
                                    }

                                    {toggle ?
                                         <p className="btn btn-sm btn-success mx-2 modal-title my-2" style={{cursor: 'pointer'}}>
                                                Modules
                                                </p> 


                                        : <p className="btn btn-sm btn-primary mx-2 modal-title my-2" style={ viewSingleCohort ? {cursor: 'pointer'} : {cursor: 'pointer', display: 'none'}}
                                                onClick={() => {!viewSingleCohort ? fetchAllModules() : viewCohortModule(indivCohort.id); setIsFetching(true); setStudentCohort(null); setViewSingleCohort(true); setToggle(true)}} >
                                                     {viewSingleCohort ? <>Modules</> : null}
                                                </p>
                                    }

                                </div>

                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body d-flex flex-wrap d-inline text-center justify-content-center align-items-center">
                                {!isFetching ? 
                                    <>
                                    {!viewSingleCohort ?
                                        allCohorts.map((cohort) => (
                                            <div className="card text-center border-0 shadow rounded-2 w-25 mx-2" style={{cursor: 'pointer'}} onClick={(event) => {setViewSingleCohort(true); handleIndiv(event, cohort.id); setIndivCohort(cohort); setIsFetching(true)}}>
                                                <div className="card-body">
                                                    {cohort.name ? <h5 className="card-title">{cohort.name}</h5> : <h5 className="card-title">{cohort.id}</h5>}
                                                    {!cohort.name ? <h5 className="card-title">{cohort.year}</h5> : null}
                                                    {!cohort.name ? <h5 className="card-title">{cohort.degree}</h5> : null}
                                                </div>
                                            </div>
                                        )) 
                                        :
                                        <>
                                                {studentsCohort !== null ?
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
                                                :

                                                <>

                                                        {toggle && indivModule === null ? 

                                                            <>
                                                            {allModules.length > 0 ? 
                                                                allModules.map((module) => (
                                                                    <div className="card text-center border-0 shadow rounded-2 w-25 mx-2 my-2" style={{cursor: 'pointer'}} onClick={() => {setIsFetching(true);viewIndividualModule(module.code)}}>
                                                                        <div className="card-body">
                                                                            <h5 className="card-title">{module.full_name}</h5>
                                                                            <p className="card-text btn btn-sm btn-secondary">{module.code}</p>
                                                                            <p className="text-primary">View Module</p>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            :
                                                                <div className="card text-center border-0 shadow rounded-2 w-25 my-2">
                                                                    <div className="card-body text-danger">
                                                                        <h5 className="card-title">No Modules</h5>
                                                                    </div>
                                                                </div>
                                                            }
                                                            </> 

                                                        : 
                                                        
                                                            <div className="card text-center border-0 shadow rounded-2 w-25 mx-2 my-2" style={{cursor: 'pointer'}} onClick={() => {setIsFetching(true);viewIndividualModule(module.id)}}>
                                                                    <div className="card-body">
                                                                        <h5 className="card-title">{indivModule.full_name}</h5>
                                                                        <p className="card-text btn btn-sm btn-secondary">{indivModule.code}</p>
                                                                    </div>
                                                            </div>
                                                        
                                                        }

                                                </>
                                                
                                                }
                                        </>
                                    }
                                    </>
                                    : 
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                }
                            </div>
                            <div className="modal-footer">
                                {!viewSingleCohort && !viewSingle ? <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button> : 
                                    <>
                                        {!viewSingle ? <button type="button" className="btn btn-danger" onClick={() => {setViewSingleCohort(false); setToggle(false); setIndivModule(null); setIndivCohort(null); setAllModules(null); }} >Back</button>
                                        :
                                        <button type="button" className="btn btn-danger" onClick={() => {setViewSingle(false); setIndivModule(null); setIndivCohort(null); setAllModules(null);}} >Back</button>
                                        }
                                    </>
                                    }
                            </div>
                        </div>
                    </div>
                </div>


            </div>) 
            : 
            <>
                <div className="text-center d-flex justify-content-center align-items-center">
                    <div
                            className="card text-center border-0 shadow rounded-2 w-75 my-4 mb-5"
                            data-bs-toggle={postFetch.name ? "modal" : null}
                            data-bs-target= {postFetch.name ? "#data" : null} 
                            style={{ cursor: "pointer" }}
                            onClick={
                                
                                postFetch.name ? 
                                
                                    (event) => {

                                    handleIndiv(event, postFetch.id);
                                    setIsFetching(true);}
                            
                                : null
                            }>
                            <div className="card-body">
                                {postFetch.name ? <h5 className="card-title">{postFetch.name}</h5> : null}
                                {!postFetch.name && postFetch.id ? <p className="card-text btn btn-sm btn-danger">{postFetch.id}</p> : null}
                                {!postFetch.name && postFetch.year ? <p className="card-text btn btn-sm btn-danger">{postFetch.year}</p> : null}
                                {!postFetch.name && postFetch.degree ? <p className="card-text btn btn-sm btn-danger">{postFetch.degree}</p> : null}
                                {postFetch.detail ? <p className="card-text btn btn-sm btn-danger">{postFetch.detail}</p> : null}
                            </div>
                    </div>

                        <div className="modal fade" id="data" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                                        Students in Cohort
                                    </h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="text-center">

                                    {isFetching ? (
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (

                                            <div className="modal-body text-center d-flex justify-content-center align-items-center">

                                                {studentsCohort ?

                                                    <div>
                                                        {!viewSingle ? 
                                                            <div className="text-center"> {
                                                                studentsCohort.map((students) => 
                                                                        <div key={students.student_id} className="card text-center border-0 shadow rounded-2 my-1 mb-4">
                                                                            <div className="card-body">
                                                                                <h5 className="card-title">{students.first_name} {students.last_name}</h5>
                                                                                <p className="card-text btn btn-sm btn-secondary">{students.email}</p><br/>
                                                                                <p className="card-text link-opacity-100 text-primary" 
                                                                                    style={{cursor:'pointer'}} 
                                                                                    onClick={() => {handleWaitFetch(true);
                                                                                            viewSingleStudent(students.student_id, students.first_name, students.last_name)
                                                                                            }}>See Student</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        : <div className="card text-center border-0 shadow rounded-2 my-1 mb-4">
                                                                <div className="card-body">
                                                                    <h5 className="card-title">{studentName}</h5>
                                                                    <h6 className="card-title">{postFetch.name}</h6>
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
                                                            </div>
                                                          }
                                                    </div>
                                                : null} 
                                            </div>
                                        )}
                                    </div>

                                    <div className="modal-footer">

                                        {!viewSingle ?
                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                                            Close
                                        </button> : 
                                        <button type="button" className="btn btn-danger" onClick={() => setViewSingle(false)}>
                                            Back
                                        </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

//? this will be used for searching for a single degree
async function singleCohort(id) {
    let caller = "http://localhost:8000/api/cohort/" + String(id) + "/";

    const requestOptions = {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    }

    const response = await fetch(caller, requestOptions);
    const data = await response.json();

    if (data) {
        return data;
    }

}

//? this creates the cohort
async function createCohort(id, year, degree, name) {
    const caller = "http://localhost:8000/api/cohort/";

    const cohortData = {
      id: String(id),
      year: parseInt(year),
      degree: "http://localhost:8000/api/degree/" + String(degree[degree.selectedIndex].value) + "/", 
      name: String(name),
    };
  
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cohortData),
    };

    const response = await fetch(caller, requestOptions)
    const data = await response.json();
  
    if (data) {
        return data;
    }
}
  
export default {singleCohort, createCohort, CohortForm};
