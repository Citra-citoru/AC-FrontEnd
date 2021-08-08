import React, {useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import {ResponseContext} from '../../context/response';
import './index.css';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
      marginBottom: theme.spacing(5)
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '30%',
    }, 
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
    marginTop: theme.spacing(2),
    },
}));

export default function PaymentForm(){
    const classes = useStyles();
    const rep = useContext(ResponseContext);
    const paymentForm = useRef(null);
    const [paymentIndexes, setPaymentIndexes] = useState([]);
    const [counter, setCounter] = useState(1);
    const [paymentDate, setPaymentDate] = useState();
    const [activateAlert, setActivateAlert] = useState(false);
    const [isClose,setIsClose] = useState(false);
    useEffect(() => {
        var disbursementDate = rep.response?.disbursementDate !== undefined ? new Date(rep.response?.disbursementDate):new Date();
        var dayOneDate = disbursementDate.setDate(disbursementDate.getDate() + 1);
        var payment= new Date(dayOneDate).toISOString().slice(0, 10);
        setPaymentDate(payment);

    },[rep.response]);

    const paymentDateChange = (event) =>{
        setPaymentDate( event.target.value);
    };

    const payloads = (form) =>{
        var arr =[];
        for (var i = 1; i < counter; i++) {
            var keyConcept = `conceptId${i}`;
            var keyAmount = `amount${i}`;

            arr.push({
                'conceptId':form[`${keyConcept}`].value,
                'amount':parseInt(form[`${keyAmount}`].value)
            })
        }
        //console.log("arr",arr);
      return {
        paymentDate: new Date(form['paymentDate'].value),
        concepts:arr
      };
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const form = paymentForm.current;
        const payload = payloads(form);
        const loanID = rep.response?.id;
        rep.setResponse({});
        try{
            axios.post(`http://localhost:5000/api/${loanID}/payments`, payload)
            .then(result => {
                rep.setResponse(result.data);
            }).catch(err=>{
                console.log(err);
                setActivateAlert(true);
            });
        }catch(err){
            console.log(err);
            setActivateAlert(true);
        };
    };

    const addTextFields = () =>{
      setPaymentIndexes(prevIndexes => [...prevIndexes, counter]);
      setCounter(prevCounter => prevCounter + 1);
  };

  const Concepts = () =>{
      const conceptsFields = paymentIndexes.map(i=>{
          return(
            <div key={i}>
                <TextField key={i}
                  required
                  label={`Concept Id ${i}`}
                  id={`conceptId${i}`}
                  style={{width:'320px'}}
                  className={clsx(classes.margin)}
                  InputLabelProps={{shrink: true}}
                />
                <TextField key={i}
                    required
                    type="number"
                    label={`Amount ${i}`}
                    id={`amount${i}`}
                    style={{width:'100px'}}
                    className={clsx(classes.margin)}
                    InputLabelProps={{shrink: true}}
                />
            </div> 
          )
      })
      return(
        <FormGroup row>
            {conceptsFields}
         </FormGroup>
      )
  };

    return(
        <div className={'payment-form'} style={{textAlign:'left'}}>
            {activateAlert?
            <Collapse in={!isClose}>
                <Alert severity="error" onClose={()=>{setIsClose(true)}}>There is something wrong!</Alert>
            </Collapse>
            :''}
            <h2>Payment</h2>
            <form id={'payment-form'} ref={paymentForm} onSubmit={handleSubmit}>
            <TextField
                required
                id="paymentDate"
                label="Payment Date"
                type="date"
                value={paymentDate}
                onChange={paymentDateChange}
                className={clsx(classes.margin, classes.textField)}
                InputLabelProps={{shrink: true}}
            />
            <h3 style={{fontWeight:'300',color:'grey',textAlign:'center'}}>Concepts</h3>
            <hr style={{color:'lightgrey',marginRight:'5%'}}/>
            <Concepts/>
            <Button onClick={addTextFields} variant="contained" color="primary" className={clsx(classes.margin, classes.textField)} visible={false}>
                        Add Concept
            </Button>
            </form>
        </div>  
    );
};