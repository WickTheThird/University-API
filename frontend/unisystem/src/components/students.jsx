import { useState, useEffect } from "react";

function StudentsForm(isCreate) {
    //> part 1: make create and search applicable
    const [response, setResponse] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [degrees, setDegrees] = useState(null);
    const [selected, setSelected] = useState([]);

    //> part 2: make the search and create appear
    const [student, setStudent] = useState(null);

    //> part 3: view individual student
    const [viewSingle, setViewSingle] = useState(false);
    const [studentName, setStudentName] = useState(null);
    const [grades, setGrades] = useState([]);
    const [modules, setModules] = useState([]);
    const [waitFetch, handleWaitFetch] = useState(true);

    //> part 4: view all the students
    const [students, setStudents] = useState([]);

    //> fetch the all the degrees --> works
    useEffect(() => {
        let caller = "http://localhost:8000/api/cohort/";

        const requestOptions = {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
        };

        if (isCreate) {
            setIsLoading(true);
            fetch(caller, requestOptions)
                .then((res) => res.json())
                .then(
                    (result) => {
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

        setStudent(null);

    }, [isCreate]);

    //> adds items to the selected array in order to change the style and then pass those who are selected to the create function when handling submit
    useEffect(() => {
        if (data !== null) {
        const degreeMap = data.map((item) => (
            <li
            key={item.id}
            value={item.name}
            className={(selected[0] === item.id)  ? 'list-group-item active' : 'list-group-item'}
            htmlFor="cohorts"
            onClick={() => handlerChecker(item.id, item.degree)}
            aria-current={(selected === item.degree) ? 'true' : 'false'}
            style={{ cursor: 'pointer' }}
            >
            {item.name}
            </li>
        ));
        setDegrees(<ul className="list-group">{degreeMap}</ul>);
        }
    }, [data, selected]);
    
    //> removes and adds selected items to the selected array
    const handlerChecker = (id, degree) => {
        if (selected.includes(id)) {
            setSelected([]);
        } else {
            setSelected([id, degree]);
        }
    };

    //> handles submit
    const handleSubmit = async (event, selectedCohort=[]) => {
        
        if (event) {
            event.preventDefault();

            console.log("something happened");

            const id = event.target.student_id;
            const first_name = event.target.first_name;
            const last_name = event.target.last_name;
            const email = event.target.email;

            let returnedData = null;

            if (event.nativeEvent.submitter.textContent === "Search") {
                returnedData = await singleStudent(id.value);
            } else {
                returnedData = await createStudent(id.value, first_name.value, last_name.value, email.value, `http://localhost:8000/api/cohort/${selectedCohort[0]}/`);
            }

            if (returnedData) {
                console.log(returnedData);
                setStudent(returnedData);
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

    //> view all the students
    const viewAllStudents = async () => {
        let caller = "http://localhost:8000/api/student/";

        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };

        const response = await fetch(caller, requestOptions);
        const data = await response.json();

        if (data) {
            console.log(data);
            setStudents(data);
            setViewSingle(false);
            handleWaitFetch(false);
        }

    };


    return (

        <div>

            {!isCreate.isCreate ? <h3 className="">Search For Students</h3> : <h3 className="">Create Student</h3>}

            {(!response || error) && isCreate.isCreate ? (<p>Please wait until cohort data has been fetched!</p>) : 

            <>

            {student === null ?


                <>
            <form id="studentsForm" onSubmit={(event) => handleSubmit(event, selected)}>

                <div>
                    <label htmlFor="student_id" />
                    <input type="text" id="student_id" className="my-3"  name="student_id"  placeholder="Student ID" style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} maxLength="8" minLength="8"  required />
                </div>

                <div>
                    {isCreate.isCreate ? <label htmlFor="first_name" /> : null}
                    {isCreate.isCreate ? <input type="text" id="first_name"className="mb-3"  name="first_name"  placeholder="First Name" required style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} /> : null}
                </div>

                <div>
                    {isCreate.isCreate ? <label htmlFor="last_name" /> : null}
                    {isCreate.isCreate ? <input type="text" id="last_name" className="mb-3" name="last_name"  placeholder="Last Name" required  style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} /> : null}
                </div>

                <div>
                    {isCreate.isCreate ? <label htmlFor="email" /> : null}
                    {isCreate.isCreate ? <input type="text" id="email" className="mb-3" name="email"  placeholder="Email" required style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} /> : null}
                </div>

                <div>
                    {isCreate.isCreate ? <label htmlFor="cohort" /> : null}
                    {isCreate.isCreate ? 
                        <div>
                            {isLoading ? 
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                    </div>  
                                      :
                                    <div>
                                        <button type="button" className="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#viewSingleStudent">
                                            Choose Cohorts
                                        </button>

                                        <div className="modal fade" id="viewSingleStudent" tabIndex="-1" aria-labelledby="viewSingleStudentLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="viewSingleStudentLabel">Cohorts</h1>
                                                <div className="card border-0 d-inline-block">
                                                    {selected.length > 0 ? <p className="btn btn-sm btn-primary mx-2 modal-title my-2">{selected[0]}</p> : null}
                                                </div>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                {degrees}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-danger mb-4" data-bs-dismiss="modal">Close</button>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div> 
                            } 
                        </div>
                    : null}
                </div>

                {!isCreate.isCreate ? <button type="submit" className="btn btn-primary mb-4">Search</button> : <button type="submit" className="btn btn-primary mb-4">Create</button>}

            </form>

            <p className="btn btn-light mb-4"  data-bs-toggle="modal" data-bs-target="#seeAllStudents" onClick={() => {handleWaitFetch(true); viewAllStudents()}}>View All Modules</p>


            
            <div className="modal fade modal-fullscreen" id="seeAllStudents" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Cohorts</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body d-flex flex-wrap text-center justify-content-center align-items-center">

                            {!viewSingle ?

                            <>
                            {students.map((student) => (
                                <div className="card text-center d-inline border-0 shadow rounded-2 w-25 mx-2 my-2" style={{cursor: 'pointer'}} onClick={() => {handleWaitFetch(true); viewSingleStudent(student.student_id, student.first_name, student.last_name); setViewSingle(true)}}>
                                    <div className="card-body">
                                        <h5 className="card-title">{student.first_name} {student.last_name}</h5>
                                        <p className="card-text btn btn-sm btn-secondary">{student.email}</p>
                                        <p className="text-primary">View Student</p>
                                    </div>
                                </div>
                            ))}
                            </>

                            : 
                            <>
                                {!waitFetch ?
                                    <table className="table text-center">
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
                                    : 
                                    <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    </div>
                                }

                            </>

                            }
                        </div>

                        <div className="modal-footer">
                            {!viewSingle ? 
                                <button type="button" className="btn btn-danger mb-4" data-bs-dismiss="modal">Close</button> 
                                         :
                                <button type="button" className="btn btn-danger mb-4" onClick={() => {setViewSingle(false)}}>Back</button>
                            }
                        </div>
                    </div>
                </div>
            </div>



            </>

            : 
                
              <>
                <div className="card border-0 my-4 shadow"
                 style={{cursor: 'pointer'}}
                 onClick={() => {viewSingleStudent(student.student_id, student.first_name, student.last_name); handleWaitFetch(true);}} 
                 data-bs-toggle="modal" data-bs-target="#viewSingleStudent">
                    <div className="card-body">
                        <h5 className="card-title">{student.first_name} {student.last_name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{student.student_id}</h6>
                        <p className="card-text text-primary">View Student</p>
                    </div>
                </div>

                <div className="modal fade text-center" id="viewSingleStudent" tabIndex="-1" aria-labelledby="viewSingleStudentLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="viewSingleStudentLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">

                            <div className="card text-center border-0 shadow rounded-2 my-1 mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">{studentName}</h5>
                                </div>
                                    {!waitFetch ?
                                <table className="table text-center">
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
                                : 
                                <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                </div>
                            }
                            </div>

                        </div>

                        </div>
                    </div>
                    </div>

                

               </>
            
            }

            </>
        }

        </div>

    );
}

//? this will be used for searching for a single degree
async function singleStudent(student_id) {

    let caller = `http://localhost:8000/api/student/${student_id}`;

    const requestOptions = {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    };

    const response = await fetch(caller, requestOptions);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Response is not JSON");
    }

    const data = await response.json();
    if (data) {
        return data;
    }

}

async function createStudent(id, first_name, last_name, email, cohort) {
    
    let caller = "http://localhost:8000/api/student/";

    console.log(cohort);

    const studentData = {
        student_id: String(id),
        first_name: String(first_name),
        last_name: String(last_name),
        email: String(email),
        cohort: String(cohort),
    }

    const requestOptions = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(studentData)
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

export default {createStudent, singleStudent, StudentsForm};

