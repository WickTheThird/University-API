import { useState, useEffect } from "react";


//title: this is the main form fpr MODULES
function ModulesForm(isCreate) {
    //> part 1: make create, search and choose cohorts work
    const [response, setResponse] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [degrees, setDegrees] = useState(null);
    const [selected, setSelected] = useState([]);

    //> part 2: we need to make the view all modules work
    const [module, setModule] = useState(null);
    const [seeAll, setSeeAll] = useState(false);
    const [modules, setAllModules] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    //> part 3: we need to view a single cohort

    //> fetch the all the degrees and reset module in case the person wants to create one
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

        setModule(null);
    }, [isCreate]);

    //> adds items to the selected array in order to change the style and then pass those who are selected to the create function when handling submit
    useEffect(() => {
        if (data !== null) {
          const degreeMap = data.map((item) => (
            <li
              key={item.id}
              value={item.name}
              className={selected.includes(item.id)  ? 'list-group-item active' : 'list-group-item'}
              htmlFor="cohorts"
              onClick={() => handlerChecker(item.id)}
              aria-current={selected.includes(item.id) ? true : false}

              style={{ cursor: 'pointer' }}
            >
              {item.name}
            </li>
          ));
          setDegrees(<ul className="list-group">{degreeMap}</ul>);
        }
      }, [data, selected]);

    //> removes and adds selected items to the selected array
    const handlerChecker = (data) => {
        console.log(data, selected);
        if (selected.includes(data)) {
          setSelected(selected.filter((item) => item !== data));
        } else {
          setSelected([...selected, data]);
        }
    };

    //> handle submit from the form
    const handleSubmit = async (event, selected, create) => {

        let responseData = null;

        if (event) {
            event.preventDefault();

            const code = event.target.code;
            const full_name = event.target.full_name;
            const ca_split = event.target.ca_split;
            const delivered = selected.map((item) => `http://localhost:8000/api/cohort/${item}/`);

            if (!create) {
                responseData = await singleModule(code.value);
            } else {
                responseData = await createModule(code.value, full_name.value, delivered, ca_split.value);
            }

            if (responseData) {
                console.log(responseData);
                setModule(responseData);
            }

        }

    };

    //> fetch all the modules
    const allModules = async () => {
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
            setSeeAll(true);
            setIsFetching(false);
        }
    };


    return (
        <div>
            {!isCreate.isCreate ? <h3 className="text-center">Search For Modules</h3> : <h3 className="">Create Module</h3>} 

            {((!response || error) && isCreate.isCreate) ? (
                <p>Please wait until cohort data is fetched!</p>
            ) : ( 
                <>
                {module === null ? 
                <form id="modulesForm" onSubmit={(event) =>{ handleSubmit(event, selected, isCreate.isCreate);}}>
                    <div>
                        <label htmlFor="code" />
                        <input type="text" id="code" className="my-4" name="code" placeholder="Code" style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}}  required/>
                    </div>
                    {isCreate.isCreate && (
                        <div className="">
                            <label htmlFor="full_name" />
                            <input type="text" id="full_name" className="mb-4" name="full_name" placeholder="Full Name" style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}}  required/>
                        </div>
                    )}
                    
                    {isCreate.isCreate && (
                        <div>
                            <label htmlFor="ca_split" />
                            <input type= "text" id="ca_split" className="mb-4" name="ca_split" style={{border: 'none', borderBottom: 1 + 'px solid lightgray'}} placeholder="CA Split" required/>
                        </div>
                    )}

                    {isCreate.isCreate ? 
                        <div>
                            {isLoading ? (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <div>
                                    <button type="button" className="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Choose Cohorts
                                    </button>

                                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Cohorts</h1>
                                            <div className="card border-0 d-inline-block">
                                            {selected.map((item) => (
                                                    <p className="btn btn-sm btn-primary mx-2 modal-title my-2">{item}</p>
                                                ))}
                                            </div>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            {degrees}
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            )}


                        </div>

                        : 
                        
                       null
                        
                        }

                    <button type="" className="btn btn-primary mb-4">{isCreate.isCreate ? "Create" : "Search"}</button><br/>

                    <p className="btn btn-light mb-4"  data-bs-toggle="modal" data-bs-target="#seeAllModules" onClick={() => {setIsFetching(true); allModules()}}>View All Modules</p>



                    <div className="modal fade modal-fullscreen" id="seeAllModules" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-fullscreen">
                            <div className="modal-content">
                                <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Cohorts</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex flex-wrap d-inline text-center justify-content-center align-items-center">
                                    
                                    {seeAll && !isFetching  ? modules.map((item) => (
                                        <div className="card border-0 shadow my-3 mx-2">
                                            <div className="card-body">
                                                <h5 className="card-title">{item.code}</h5>
                                                <h6 className="card-subtitle mb-2 text-muted">{item.full_name}</h6>
                                                <p className="card-text">CA Split {item.ca_split}</p>
                                                <p className="card-text">{item.delivered_to.map((item) => (
                                                    <>
                                                    <p className="btn btn-sm btn-secondary mx-2 modal-title my-2">{item}</p><br/>
                                                    </>
                                                ))}</p>

                                                </div>
                                            </div>
                                    )) : 
                                    
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>

                                    }


                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                : 
                        <div className="card border-0 shadow my-3">
                            <div className="card-body">
                                <h5 className="card-title">{module.code}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{module.full_name}</h6>
                                <p className="card-text">CA Split {module.ca_split}</p>
                                {module.length >  0 ? <p className="card-text">{module.delivered_to.map((item) => (
                                    <p className="btn btn-sm btn-primary mx-2 modal-title my-2">{item}</p>
                                ))}</p> : null}
                            </div>
                        </div>
                }

                </>
            )}
        </div>
    );
}

//? this will be used for searching for a single degree
async function singleModule(code) {
    
    let caller = `http://localhost:8000/api/module/${code}/`;

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


//> this creates the modules given a certain specification
async function createModule(code, full_name, delivered, ca_split) {
    let caller = "http://localhost:8000/api/module/";

    console.log("DELIVERED:" + delivered);

    const moduleData = {
        code: String(code),
        full_name: String(full_name),
        delivered_to: delivered,
        ca_split: parseInt(ca_split)
    };

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(moduleData),
    };

    const response = await fetch(caller, requestOptions)
    if (!response.ok) {
        return response;
        // throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        return contentType;
        // throw new TypeError("Response is not in JSON format");
    }

        const data = await response.json();
        if (data) {
            return data;
        }

}

//? exporting to app!
export default {singleModule, createModule, ModulesForm};
