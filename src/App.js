// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     4.xx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Form from 'react-bootstrap/Form';
import { PlusCircleFill } from 'react-bootstrap-icons';
import Country from './components/Country';
import './App.css';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [medals, setMedals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [newCountryName, setNewCountryName] = useState("");
  const apiEndPoint = "https://medals-api-6.azurewebsites.net/api/country";
  
  //const handleChange = (e) => this.setState({ [e.target.name]: e.target.value});
  const handleAdd = async () => {
    if (newCountryName.length > 0) {
      const {data: post} = await axios.post(apiEndPoint, {name: newCountryName, bronze: 0, silver: 0, gold: 0});
      setCountries(countries.concat(post));
    }
    else{
      handleShowToast();
    }
    handleClose();
  }
  const handleDelete = async (countryId) => {
    const originalCountries = countries;
    setCountries(countries.filter(c => c.id !== countryId));
    try{
      await axios.delete(`${apiEndPoint}/${countryId}`);
    }
    catch(e){
      if(e.response && e.response.status === 404){
        console.log("Country already deleted");
      }
      else{
        alert("Error when deleting country");
        setCountries(originalCountries);
      }
    }
  }
  const handleIncrement = (countryId, medalName) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName] += 1;
    setCountries(mutableCountries);
  }
  const handleDecrement = (countryId, medalName) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName] -= 1;
    setCountries(mutableCountries);
  }
  const getAllMedalsTotal = () => {
    let sum = 0;
    medals.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name], 0); });
    return sum;
  }

  const handleClose = () => setShowForm(false);
  const handleCloseToast = () => setShowToast(false);
  const handleShow = () => {
    setNewCountryName("");
    setShowForm(true);
    console.log(countries);
  }
  const handleShowToast = () => setShowToast(true);
  const keyPress = (e) => {
    (e.keyCode ? e.keyCode : e.which) === '13' && handleAdd();
  }

  useEffect(() => {
    async function fetchData(){
      const {data: fetchedCountries} = await axios.get(apiEndPoint);
      setCountries(fetchedCountries);
    }
    let mutableMedals = [
      { id: 1, name: 'gold' },
      { id: 2, name: 'silver' },
      { id: 3, name: 'bronze' },
    ];
    setMedals(mutableMedals);
    fetchData();
  }, []);
    return (
      <React.Fragment>
        <ToastContainer
          className="p-3"
          position="top-start"
        >
          <Toast show={showToast} className="position end">
          <Toast.Body>
          <h3><b>Error</b></h3>
          <hr></hr>
          <p>Country name must be at least one character.</p>
          <Button variant="primary" onClick={handleCloseToast}>Dismiss</Button>
          </Toast.Body>
      </Toast>
        </ToastContainer>
      <Modal onKeyPress={ keyPress } show={showForm} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Country Name</Form.Label>
            <Form.Control
              type="text"
              name="newCountryName"
              onChange={ (e) => setNewCountryName(e.target.value) }
              value={ newCountryName }
              autoComplete='off'
              placeholder="enter name"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Navbar className="navbar-dark bg-dark">
          <Container fluid>
            <Navbar.Brand>
              Olympic Medals
              <Badge className="ml-2" bg="light" text="dark" pill>{ getAllMedalsTotal() }</Badge>
            </Navbar.Brand>
            <Button variant="outline-success" onClick={ handleShow }><PlusCircleFill /></Button>{' '}
          </Container>
      </Navbar>
      <Container fluid>
        <Row>
        { countries.map(country => 
          <Col className="mt-3" key={ country.id }>
            <Country  
              country={ country } 
              medals={ medals }
              onDelete={ handleDelete }
              onIncrement={ handleIncrement } 
              onDecrement={ handleDecrement } />
          </Col>
        )}
        </Row>
      </Container>
      </React.Fragment>
    );
  }
 
export default App;