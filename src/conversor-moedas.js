import './conversor-moedas.css';
import { Jumbotron, 
  Button, 
  Form, 
  Col, 
  Modal,
  Spinner, 
  Alert } from 'react-bootstrap';
import  {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import ListarMoedas from './listar-moedas'
import React, { useState } from 'react'
import axios from 'axios'

function ConversorMoedas() {

  const FIXER_URL = 'http://data.fixer.io/api/latest?access_key=877c9cbc68cc29b0cba2e5bb70416dbb';

  const [valor, setValor] = useState('1');
  const [moedaDe, setMoedaDe] = useState('BRL');
  const [moedaPara, setMoedaPara] = useState('USD');
  const [exibirSpinner, setExibirSpinner] = useState(false);
  const [exibirModal, setExibirModal] = useState(false);
  const [resultadoConversao, setResultadoConversao] = useState('');
  const [formValidado, setFormValidado] = useState(false);
  const [exibirMsgErro, setExibirMsgErro] = useState(false)

  function handleValor(event) {
    setValor(event.target.value.replace(/\D/g, ''));
  }

  function handleMoedaDe(event) {
    setMoedaDe(event.target.value);
  }
  function handleMoedaPara(event) {
    setMoedaPara(event.target.value);
  }
  function handleFecharModal(event) {
    setValor(1);
    setMoedaPara('USD');
    setMoedaDe('BRL');
    setFormValidado(false);
    setExibirModal(false);
  }

  function obterCotacao(dadosCotacao) {
    if(!dadosCotacao || dadosCotacao.success !== true) {
      return false;
    }else{
      const cotacaoDe = dadosCotacao.rates[moedaDe];
      const cotacaoPara = dadosCotacao.rates[moedaPara];
      const cotacao = (1 / cotacaoDe * cotacaoPara) * valor;
      return cotacao.toFixed(2);
    }
  }

  function exibirErro() {
    setExibirSpinner(false)
    setExibirMsgErro(true)
  }


  function converter(event) {
    event.preventDefault();
    setFormValidado(true)
    if(event.currentTarget.checkValidity() === true){
      setExibirSpinner(true)
      axios.get(FIXER_URL).then( res => {
        const cotacao = obterCotacao(res.data)
        if(cotacao) {
          setResultadoConversao(`${valor} ${moedaDe} = ${cotacao} ${moedaPara}`);
          setExibirSpinner(false)
          setExibirModal(true)
        }else{
          exibirErro()
        }
      }
      ).catch(err => exibirErro())
    }
  }

  return (
    <div data-testid='conversor' className="App">
      <h1>Conversor de moedas</h1>
      <Alert variant='danger' show={exibirMsgErro}>
        Erro obtendo dados de conversão, teste novamente.
      </Alert>
      <Jumbotron >
        <Form onSubmit={converter} noValidate validated={formValidado}>
          <Form.Row>
            <Col sm='3'>
              <Form.Control 
                required
                placeholder='0' 
                onChange={handleValor}
                value={valor}/>
            </Col>

            <Col sm='3'>
              <Form.Control 
                value={moedaDe}
                onChange={handleMoedaDe}
                as='select'>
                <ListarMoedas/>
              </Form.Control>
            </Col>

            <Col sm='1' className="text-center" style={{paddingTop: '5px'}}>
              <FontAwesomeIcon icon={faAngleDoubleRight}/>
            </Col>

            <Col sm='3'>
              <Form.Control 
                value={moedaPara}
                onChange={handleMoedaPara}
                as='select'>
                <ListarMoedas/>
              </Form.Control>
            </Col>

            <Col sm='2'>
              <Button
                variant='success'
                data-testid='btn-converter'
                onClick={handleFecharModal}
                type='submit'>
                  <span className= { exibirSpinner ? null : 'hidden'}>
                    <Spinner animation='border' size='sm'/>
                  </span>
                  <span className={ exibirSpinner ? 'hidden': null }>Converter</span>
                  </Button>
            </Col>
          </Form.Row>
        </Form>
        <Modal  data-testid='modal' show={exibirModal} onHide={handleFecharModal}>
          <Modal.Header closeButton>
            <Modal.Title>Conversão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {resultadoConversao}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleFecharModal} variant='success'>Nova conversão</Button>
          </Modal.Footer>
        </Modal>
      </Jumbotron>
    </div>
  );
}

export default ConversorMoedas;
