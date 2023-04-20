import { useState, useEffect } from "react";

function GradesForm(isCreate) {

    //> MODULE DATA
    const [modResponse, setModResponse] = useState([]);
    const [modData, setModData] = useState([]);
    const [modError, setModError] = useState(null);
    const [modIsLoading, setModIsLoading] = useState(false);

    const [modules, setModules] = useState([]);
    const [selectedMod, setSelectedMod] = useState(null);

    //> COHORT DATA
    const [cohortResponse, setCohortResponse] = useState([]);
    const [cohortData, setCohortData] = useState(null);
    const [cohortError, setCohortError] = useState(null);
    const [cohortIsLoading, setCohortIsLoading] = useState(false);

    const [cohorts, setCohorts] = useState([]);
    const [selectedCohort, setSelectedCohort] = useState(null);

    //> STUDENT DATA
    const [studentResponse, setStudentResponse] = useState([]);
    const [studentData, setStudentData] = useState(null);
    const [studentError, setStudentError] = useState(null);
    const [studentIsLoading, setStudentIsLoading] = useState(false);

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState([]);

    //> see the searched for or created grade
    const [cohort, setCohort] = useState(null);
    const [module, setModule] = useState(null);
    const [grade, setGrade] = useState(null);

    useEffect(() => {

        let callModules = "http://localhost:8000/api/module/";

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };

        //> MODULES
        if (isCreate) {
            setModIsLoading(true);
            fetch(callModules, requestOptions)
                .then((res) => res.json())
                .then(
                    (result) => {
                        setModResponse(true);
                        setModData(result);
                        setModIsLoading(false);
                    }, 
                    (error) => {
                        setModResponse(true);
                        setModError(error);
                        setModIsLoading(false);
                    }    
                );

            setGrade(false);
        }

        //> COHORTS
        let callCohorts = "http://localhost:8000/api/cohort/";

        const cohortRequestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };

        if (isCreate) {
            setCohortIsLoading(true);
            fetch(callCohorts, cohortRequestOptions)
                .then((res) => res.json())
                .then(
                    (result) => {
                        setCohortResponse(true);
                        setCohortData(result);
                        setCohortIsLoading(false);
                    },
                    (error) => {
                        setCohortResponse(true);
                        setCohortError(error);
                        setCohortIsLoading(false);
                    }
                );
        }

        //> STUDENTS
        let callStudents = "http://localhost:8000/api/student/";

        const studentRequestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };

        if (isCreate) {
            setStudentIsLoading(true);
            fetch(callStudents, studentRequestOptions)
            .then((res) => res.json())
            .then(
                (result) => {
                    setStudentResponse(true);
                    setStudentData(result);
                    setStudentIsLoading(false);
                },
                (error) => {
                    setStudentResponse(true);
                    setStudentError(error);
                    setStudentIsLoading(false);
                }
            );
        }

    }, [isCreate]);

    //> SETTING UP THE MODALS FOR EACH DATA FETCHED
    //> 1. MODULES
    useEffect(() => {
        if (modData !== null) {
            const modMap = modData.map((mod) => (
                <li 
                    key={mod.code}
                    value={mod.code} 
                    onClick={() => handleModSelect(mod.code)}
                    className={selectedMod === mod.code ? "list-group-item active" : "list-group-item"}
                    aria-current={selectedMod === mod.code ? true : false}
                    style={{cursor: 'pointer'}}
                >
                    {mod.full_name}
                </li>
            ));

            setModules(<ul className="list-group"> {modMap} </ul>);
        }
    }, [modData, selectedMod]);

    const handleModSelect = (mod) => {

        if (mod === selectedMod) {
            setSelectedMod(null);
        } else {
            setSelectedMod(mod);
        }
    
    };

    //> 2. COHORTS
    useEffect(() => {
        console.log();
        if (cohortData !== null) {
            const cohortMap = cohortData.map((cohort) => (
                <li
                    key={cohort.id}
                    value={cohort.id}
                    onClick={() => handleCohortSelect(cohort.id)}
                    className={selectedCohort === cohort.id ? "list-group-item active" : "list-group-item"}
                    aria-current={selectedCohort === cohort.id ? true : false}
                    style={{cursor: 'pointer'}}
                >
                    {cohort.name}
                </li>
            ));
            
            setCohorts(<ul className="list-group"> {cohortMap} </ul>);
        }
    }, [cohortData, selectedCohort]);

    const handleCohortSelect = (cohort) => {
        if (cohort === selectedCohort) {
            setSelectedCohort(null);
        } else {
            setSelectedCohort(cohort);
        }
    };

    //> 3. STUDENTS
    useEffect(() => {
        if (studentData !== null) {
          const studentList = studentData.map((student) => (
            <li
              key={student.student_id}
              value={student.student_id}
              onClick={() => handleStudentSelect(student.student_id, student.first_name, student.last_name)}
              className={
                selectedStudent === student.student_id
                  ? 'list-group-item active'
                  : 'list-group-item'
              }
              aria-current={selectedStudent === student.student_id ? true : false}
              style={{ cursor: 'pointer' }}
            >
              {student.first_name} {student.last_name}
            </li>
          ));
          setStudents(<ul className="list-group">{studentList}</ul>);
        }
      }, [studentData, selectedStudent]);      
    
    const handleStudentSelect = (studentId, studentFN, studentLN) => {
        if (selectedStudent.includes(studentId)) {
            setSelectedStudent([]);
        } else {
            setSelectedStudent([studentId, studentFN + " " + studentLN]);
        }
    };

    //> handle submit
    //? grab the cohort of the grade
    const gradeCohort = async(caller) => {

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        }

        const response = await fetch(caller, requestOptions);
        const data = await response.json();

        if (data) {
            console.log(data);
            setCohort(data);
        }

    };

    //? grab the module of the grade
    const  gradeModule = async(caller) => {

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        }

        const response = await fetch(caller, requestOptions);
        const data = await response.json();

        if (data) {
            console.log(data);
            setModule(data);
        }

    };

    //? actual handle submit
    const handleSubmit = async (event, module="", cohort="", student="") => {

        let requestData = null;

        if (event) {
            event.preventDefault();

            let id = event.target.id;
            let caMark = event.target.ca_mark;
            let examMark = event.target.exam_mark;
            let totalMark = event.target.total_grade;
            let studentURL =  `http://localhost:8000/api/student/${student[0]}/`;
            let cohortURL = `http://localhost:8000/api/cohort/${cohort}/`;
            let moduleURL = `http://localhost:8000/api/module/${module}/`;
        
            if (event.nativeEvent.submitter.textContent === "Search") {
                requestData = await singleGrade(id.value);
            } else {
                requestData = await createGrade(id.value, caMark.value, examMark.value, totalMark.value,studentURL, cohortURL, moduleURL);
            }

            if (requestData) {
                console.log(requestData);
                setGrade(requestData);

                //> setting up the 
                gradeCohort(requestData.cohort);
                gradeModule(requestData.module);

            }

        }

    };

    return (
        <div>

            {!isCreate.isCreate ? <h3 className="">Search For Grades</h3> : <h3 className="">Create Grade</h3>}

            {((!modResponse && !cohortResponse && !studentResponse) || (modError && cohortError && studentError)) && isCreate.isCreate ? <div className="text-center"> Please wait until data is being fetched </div> :

                <>
                {!grade ?
                    <form id="gradesForm" onSubmit={(event) => handleSubmit(event, selectedMod, selectedCohort, selectedStudent)}>

                        <div>
                            <label htmlFor="id" />
                            <input type="text" id="id" className="my-3" name="id" placeholder="ID"  style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} required />
                        </div>

                        <div>
                            {isCreate.isCreate ? <label htmlFor="ca_mark" /> : null}
                            {isCreate.isCreate ? <input type="text" id="ca_mark" className="mb-3" name="ca_mark" placeholder="CA Mark" style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} required /> : null}
                        </div>

                        <div>
                            {isCreate.isCreate ? <label htmlFor="exam_mark" /> : null}
                            {isCreate.isCreate ? <input type="text" id="exam_mark" className="mb-3" name="exam_mark" placeholder="Exam Mark" style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} required /> : null}
                        </div>

                        <div>
                            {isCreate.isCreate ? <label htmlFor="total_grade" /> : null}
                            {isCreate.isCreate ? <input type="text" id="total_grade" className="mb-3" name="total_grade" placeholder="Total Grade" style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} required /> : null}
                        </div>

                        {isCreate.isCreate ?
                            <div>
                                {modIsLoading ? 
                                
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                
                                : 
                                    <div>
                                    <button type="button" className="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Choose Module
                                    </button>

                                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modules</h1>
                                            <div className="card border-0 d-inline-block">
                                                {selectedMod  ? <p className="btn btn-sm btn-primary mx-2 modal-title my-2">{selectedMod}</p> : null}
                                            </div>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            {modules}
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            }
                            </div> : null}

                        {isCreate.isCreate ?
                            <div>
                                {cohortIsLoading ?
                                
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                : 
                                    <div>
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#cohortModal">
                                            Choose Cohort
                                        </button>
                                
                                        <div className="modal fade" id="cohortModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="exampleModalLabel">Cohorts</h1>
                                                        <div className="card border-0 d-inline-block">
                                                            {selectedCohort ? <p className="btn btn-sm btn-primary mx-2 modal-title my-2">{selectedCohort}</p> : null}
                                                        </div>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        {cohorts}
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                
                            </div> 
                        : null}

                        {isCreate.isCreate ?
                        <div>
                            {isCreate ? <label htmlFor="student" /> : null}
                                {studentIsLoading ?
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                        : 
                                    <div>
                                        <button type="button" className="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#studentModal">
                                            Choose Student
                                        </button>
                                
                                        <div className="modal fade" id="studentModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="exampleModalLabel">Students</h1>
                                                        <div className="card border-0 d-inline-block">
                                                            {(selectedStudent.length > 0) ? <p className="btn btn-sm btn-primary mx-2 modal-title my-2">{selectedStudent[1]}</p> : null}
                                                        </div>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        {students}
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                        </div> : null}

                        {!isCreate.isCreate ? 
                            <button type="submit" className="btn btn-primary mb-4">Search</button> 
                                            :
                            <button type="submit" className="btn btn-primary mb-4">Create</button>
                        }

                    </form>
                    : 
                    
                    <>
                    {cohort !== null && module !== null && grade !== null ?
                    <>
                    <div className="card border-0 my-4 shadow text-center"
                    style={{cursor: 'pointer'}}
                    onClick={() =>{}} 
                    data-bs-toggle="modal" data-bs-target="#viewGrade">
                            <div className="card-body">
                                <h5 className="card-title">{cohort.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{module.full_name}</h6>
                                <p className="card-text text-primary">View Grade</p>
                            </div> 
                   </div>

                   <div className="modal fade" id="viewGrade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
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
                                            <tr>
                                                <td>{module.full_name}</td>
                                                <td>{grade.ca_mark}</td>
                                                <td>{grade.exam_mark}</td>
                                                <td>{grade.total_grade}</td>
                                                <td>{module.ca_split}</td>
                                            </tr>
                                            </tbody>
                                    </table>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                    </div>
                                    </div>
                                </div>
                            </div>  

                   </>

                   : 

                   <div className="text-center">
                   <div className="spinner-border text-primary text-center" role="status">
                       <span className="visually-hidden">Loading...</span>
                   </div>
                   </div>
                    
                   }
                    </>
                    
                    }
                </>
            }
        </div>
    );
}

//> this will be used for searching for a single degree
async function singleGrade(id) {
    let caller = `http://localhost:8000/api/grade/${id}/`;

    let requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(caller, requestOptions);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
    }

    const data = await response.json();

    if (data) {
        return data;
    } 

}


//> creating grades
async function createGrade(id, caMark, examMark, totalMark, studentURL, cohortURL, moduleURL) {
    let caller = "http://localhost:8000/api/grade/";

    let gradeData = {
        id: id,
        module: moduleURL,
        ca_mark: caMark,
        exam_mark: examMark,
        cohort: cohortURL,
        total_grade: totalMark,
        student: studentURL,
    }

    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeData)
    }

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

export default {singleGrade, createGrade, GradesForm};
