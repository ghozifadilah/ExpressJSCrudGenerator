function capitalizeLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function viewAdmin() {

    // get local storage of table
    let data = JSON.parse(localStorage.getItem("dataCRUd_2"));
    let dataTable = data.dataTable;
   

    var useStateTemplate = "";
    var useSetState  = [];
    var useSetStateEdit  = [];
    var axiosBody = '';
    var formInputAdd = '';
    var formInputedit = '';
    var tableTh = '';
    var tableTr = '';
    for (let i = 0; i < dataTable.field.length; i++) {
    
        

       useStateTemplate += "const ["+dataTable.field[i]+", set"+capitalizeLetter(dataTable.field[i])+"] = useState(''); \n";
       useSetState += "set"+capitalizeLetter(dataTable.field[i])+"('');\n";
       useSetStateEdit += "set"+capitalizeLetter(dataTable.field[i])+"(data."+dataTable.field[i]+");\n";
       axiosBody += `${dataTable.field[i]} : ${dataTable.field[i]}, \n`
       formInputAdd += `
       <label>${dataTable.field[i]} </label>
       <InputGroup className="mb-3 ">
         <Form.Control
           className="searchInput"
           placeholder="${dataTable.field[i]}"
           aria-label="${dataTable.field[i]}"
           aria-describedby="basic-addon2"
           value={${dataTable.field[i]}}
           onChange={(e) => set${capitalizeLetter(dataTable.field[i])}(e.target.value)}
         />
       </InputGroup>
       `;

       formInputedit += `
       <label>${dataTable.field[i]}</label>
       <InputGroup className="mb-3 ">
         <Form.Control
           className="searchInput"
           placeholder="${dataTable.field[i]}"
           aria-label="${dataTable.field[i]}"
           aria-describedby="basic-addon2"
           value={${dataTable.field[i]}}
           onChange={(e) => set${capitalizeLetter(dataTable.field[i])}(e.target.value)}
         />
       </InputGroup>
       `
       tableTh += '<th  scope="col">'+dataTable.field[i]+'</th> \n'
       tableTr += '<td>{item.'+dataTable.field[i]+'}</td> \n'
   

    }

    console.log(
        data.dataTable.primary
    );


    var routeName = 'sending_log';

    var routeLink = '`/'+routeName+'/`';
   
    var getUrl = '`/'+capitalizeLetter(data.table)+'?page=${pages}&limit=${limit}`';
    var putUrl = '`/'+capitalizeLetter(data.table)+'/${'+data.dataTable.primary+'}`';

    // Search function 
    var searchUrl = '`/'+capitalizeLetter(data.table)+'/pencarian?page=${pages}&limit=${limit}&key=${key}`';
    var searchUrlResponse = '`/'+routeName+'/search/${key}`';

    // pagination
    var paginationLink = '`/'+routeName+'/page/${page}`';
    var paginationNavigation = '`/'+routeName+'/page/${i}`';


    var viewCode = `
            import React, { useEffect, useState } from 'react';
            import { useParams } from 'react-router-dom';
            import { Form, Button,InputGroup, Modal   } from "react-bootstrap";
            import axios from "axios";
            import { Link ,useNavigate } from 'react-router-dom';
      

            import Header from '../layout/Header';
            import Menu from '../layout/Menu';
            import Footer from '../layout/Footer';

            function ${capitalizeLetter(routeName)}() {
            
            
            const [${data.dataTable.primary}, set${data.dataTable.primary}] = useState('');

            const [DataResponse, setDataResponse] = useState([]);
            
            const [Total, setTotal] = useState(1); // total halaman
            const [currentPage, setCurrentPage] = useState(1); // halaman yang aktif
            const limit = 10; // jumlah item per halaman
            const [key, setKey] = useState('');

            const navigate = useNavigate();

            // Access the URL parameters
            const { pageNumber } = useParams();

            // Now you can use pageNumber in your component logic
            // For example, you can convert it to a number
            const currentPageNumber = parseInt(pageNumber);


            useEffect(() => {
                document.title = "MerapiKoding Dashboard | ${routeName}";
            }, []);


            
            useEffect(() => {
                get${capitalizeLetter(data.table)}();
            }, [currentPage]);

                // Variable Input
                ${useStateTemplate}


                // dapatkan data ${capitalizeLetter(data.table)} 
                const get${capitalizeLetter(data.table)} = async () => {
                    
                    var pages = currentPageNumber;

                    if (isNaN(currentPageNumber)) {
                        pages = currentPage; // Use currentPage if currentPageNumber is NaN
                    }

                    const response = await axios.get(${getUrl});

                    if (response.data.length) {
                    setDataResponse(response.data[0]);
                    setTotal(Math.ceil(response.data[1].jumlah / limit));

                    }
                }

                    //Add new ${capitalizeLetter(data.table)}
                    const [new${capitalizeLetter(data.table)}Modal, setnew${capitalizeLetter(data.table)}] = useState(false);
                    const new${capitalizeLetter(data.table)}ModalClose = () => setnew${capitalizeLetter(data.table)}(false);
                    const new${capitalizeLetter(data.table)}ModalShow = () => {
                    setnew${capitalizeLetter(data.table)}(true);
                    
                    set${data.dataTable.primary}('');
                    ${useSetState}
                    }
                    // tambah ${capitalizeLetter(data.table)}
                    const Tambah = async (e) => {

                    
                    e.preventDefault();
                    await axios.post('/${data.table}', {
                       ${axiosBody}
                      });
                    get${capitalizeLetter(data.table)}();
                    new${capitalizeLetter(data.table)}ModalClose();
                    }

                // Edit ${capitalizeLetter(data.table)} 
                const [edit${capitalizeLetter(data.table)}Modal, setedit${capitalizeLetter(data.table)}] = useState(false);
                const editClose = () => {
                    setedit${capitalizeLetter(data.table)}(false);
                    set${data.dataTable.primary}('');
                    ${useSetState}
                }

                const editShow = (data) => {

                    console.log(data);

                    setedit${capitalizeLetter(data.table)}(true);
                    console.log(data);
                    set${data.dataTable.primary}(data.${data.dataTable.primary});
                    ${useSetStateEdit}

                }

                const Edit = async (e) => {
                    e.preventDefault();
                    await axios.put(${putUrl}, {
                    ${data.dataTable.primary}:${data.dataTable.primary},
                     ${axiosBody}
                    });
                    get${capitalizeLetter(data.table)}();
                    editClose();
                }


                // hapus data ${capitalizeLetter(data.table)} 
                // Modal
                const [deleteModal, setdetele] = useState(false);
                const deleteModalClose = () => {
                setdetele(false);
                set${data.dataTable.primary}('');
                }
                
                const deleteModalShow = (${data.dataTable.primary}) => {
                setdetele(true);
                set${data.dataTable.primary}(${data.dataTable.primary});
                }

                const Hapus = async (e) => {
                e.preventDefault();
                await axios.delete('/${capitalizeLetter(data.table)}/' + ${data.dataTable.primary});
                get${capitalizeLetter(data.table)}();
                setdetele(false);
                }

            // filter data dalam pencarian
            const filter = async (e) => {
                e.preventDefault();

                var pages = currentPageNumber;
                if (isNaN(currentPageNumber)) {
                pages = currentPage; // Use currentPage if currentPageNumber is NaN
                }


                if (key !== '') {
                const response = await axios.get(${searchUrl});
                if (response.data.length) {
                    setDataResponse(response.data[0]);
                    setTotal(Math.ceil(response.data[1].jumlah / limit));

                    // to link route

                
                    navigate(${searchUrlResponse});

                }
                } else {
                    navigate(${routeLink});
                const response = await axios.get(${getUrl});
                if (response.data.length) {
                    setDataResponse(response.data[0]);
                    setTotal(Math.ceil(response.data[1].jumlah / limit));
                }
                }
            }
                    
            // handle pagination

            const Pagination = (page) => {
            setCurrentPage(page);
            navigate(${paginationLink});
            };

            // membuat list item pagination
     
              const generatePageNumbers = (currentPage, totalPages) => {
              const pageNumbers = [];
              const maxPagesToShow = 5;
              const startPage = Math.floor((currentPage - 1) / maxPagesToShow) * maxPagesToShow + 1;
              const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
          
              for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                      // NameRoute
                      <Link key={i} to={${paginationNavigation}} onClick={() => Pagination(i)} className={currentPage === i ? 'active' : ''}>{i}</Link>
                  );
              }
          
              return pageNumbers;
            };


            const formatDate = (timestamp) => {
              const date = new Date(timestamp);
              const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              };
              return date.toLocaleString('en-US', options);  // Customize locale and options as needed
            };


            return (
                // <div className='wrapper'>
                <div className="wrapper">

              {/* Side Bar */}
              <Menu />

              <div className="main">

              {/* Navbar */}
              <Header />

                  
            
                    {/* Main Content */}
                   <main className="content" style={{backgroundColor: '#101726'}}>
                          <div className="container-fluid p-0">
                  
            <h1 className=" mb-3 text-white" > <strong>${capitalizeLetter(data.table)} </strong> </h1>
                  
                            <div className="row">
                              <div className="col-12">
                               <div style={{padding: '20px',borderRadius: '10px',backgroundColor: '#222E3C'}}  className="card">
                                 
                                  <div className="card-body">
            
                                      {/* Start Content Table */}
                
                                  <div className="row justifty-content-center">
                                    <div className="col-12 MenuContainerLog ps-3">


                        <div className="row">
                          <div className="col-lg-12 d-flex justify-content-between align-items-center">
                            {/* Add User button aligned to the left */}
                            <button type="button" className="btn btn-primary  me-3"  onClick={new${capitalizeLetter(data.table)}ModalShow} ><i className='fa fa-plus'></i> Add ${capitalizeLetter(data.table)} </button>

                            {/* Search form aligned to the right */}
                            <Form onSubmit={filter} className="d-flex">
                              <InputGroup className="mb-1">
                                <Form.Control
                                  style={{ borderRadius: '5px' }}
                                  className="CrudSearch"
                                  placeholder="Search ..."
                                  aria-label="Cari"
                                  aria-describedby="basic-addon2"
                                  value={key}
                                  onChange={(e) => setKey(e.target.value)}
                                />
                                <Button
                                  style={{ borderRadius: '5px' }}
                                  className="btn btn-primary ms-2 btnSearch"
                                  type="submit"
                                >
                                  Search
                                </Button>
                              </InputGroup>
                            </Form>
                          </div>
                        </div>

                                    



                                      <div className="card mt-2 " style={{background: '#16202b',color: '#fff'}}>
                                        <div className="card-body">
                                        <div className="table-responsive">
                                          <table className="table text-center">
                                            <thead>
                                                  <tr>
                                                    <th scope="col">No</th>
                                                    ${tableTh}
                                                    <th scope="col">Action</th>
                                                  </tr>
                                            </thead>
                                            <tbody>
            
                                            {!!DataResponse && DataResponse ? (
                                                DataResponse.map((item, i) => (                   
                                              <tr>
                                                
                                                <th key={item.${data.dataTable.primary}} width="150" scope="row">{(currentPage - 1) * limit + i + 1}</th>
            
                                                ${tableTr}
                                              
                                                <td className='text-center'  >
                                                  <button type="button" className="btn btn-success me-1"  onClick={() => editShow(item)}>Edit</button>
                                                  <button type="button" className="btn btn-danger me-1"  onClick={() => deleteModalShow(item.${data.dataTable.primary})}>Delete</button>
                                                </td>
                                                
                                              </tr>
                                              ))) : (<div>Tidak ada data</div>)}
                                            </tbody>
                                          </table>
                                          </div>
                                        </div>
                                      </div>        

                                        <div className="pagination ms-2">
                                          <a className={currentPage === 1 ? 'disabled paginationNav' : 'paginationNav'} onClick={() => Pagination(currentPage - 1)}>&laquo;</a>
                                          {generatePageNumbers(currentPage, Total)}
                                          <a className={currentPage === Total ? 'disabled paginationNav' : 'paginationNav'} onClick={() => Pagination(currentPage + 1)}>&raquo;</a>
                                        </div>
                                       
                                      </div>
                                  </div>
                           
            
                                      {/* End Content Table */}
            
            
                                  </div>
                                </div>
                              </div>
                            </div>
                  
                          </div>
                    </main>
                    {/* End Content */}
                    
                    {/* Footer */}
                    <Footer />
                  </div>
            
            {/* Modal */}
            {/* ----------------------------------------------------------------------------------------------- */}
            
            <Modal show={deleteModal} onHide={deleteModalClose} size="sm">
                        <Form className="form-box" onSubmit={Hapus}>
                          <Modal.Header closeButton>
                            <Modal.Title> Delete ${capitalizeLetter(data.table)}</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
            
                          <h5 className='textDeleteModal'>
                            Are you sure to delete ${capitalizeLetter(data.table)} data ?
                          </h5>
            
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={deleteModalClose}>
                              Cancel
                            </Button>
                            <Button variant="danger" type="submit">
                              Delete
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal>
            
                      {/* Add Modal */}
                      <Modal show={new${capitalizeLetter(data.table)}Modal} onHide={new${capitalizeLetter(data.table)}ModalClose} size="lg">
                        <Form className="form-box" onSubmit={Tambah}>
                          <Modal.Header closeButton>
                            <Modal.Title>Add New ${capitalizeLetter(data.table)} Data</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                          <div className="card ">
                            <div className="card-body p-4">
                            <div className="form-group">
                            
                        
                           ${formInputAdd};
                          
            
                          </div>
                            </div>
                          </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={new${capitalizeLetter(data.table)}ModalClose}>
                              Cancel
                            </Button>
                            <Button variant="success" type="submit">
                              Add New ${capitalizeLetter(data.table)}
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal>
            
                      {/* Edit Modal */}
                      <Modal show={edit${capitalizeLetter(data.table)}Modal} onHide={editClose} size="lg">
                        <Form className="form-box" onSubmit={Edit}>
                          <Modal.Header closeButton>
                            <Modal.Title>Edit ${capitalizeLetter(data.table)} Data</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                          <div className="card ">
                            <div className="card-body p-4">
                            <div className="form-group">
            
                       
                               
                               ${formInputedit};
                            
                           
                            
                         
            
                          </div>
                            </div>
                          </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={editClose}>
                              Cancel
                            </Button>
                            <Button variant="success" type="submit">
                              Edit ${capitalizeLetter(data.table)} Data
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal>
                  
            {/* ----------------------------------------------------------------------------------------------- */}
            {/* end Modal */}
                </div>
              );
            }
            
            export default ${capitalizeLetter(routeName)};
            

    `;



    return viewCode;
    
}