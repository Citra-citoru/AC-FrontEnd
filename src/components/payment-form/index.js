import React, {useState, useRef, useContext } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
    //var disbursementDate = rep.response?.disbursementDate !== undefined ? new Date(rep.response?.disbursementDate):new Date();
    //var dayOneDate = disbursementDate.setDate(disbursementDate.getDate() + 1);
    //var paymentDate = new Date(dayOneDate).toISOString().slice(0, 10);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const form = paymentForm.current;
        const loanID = rep.response?.id;
        const payload = {
          "paymentDate":form['paymentDate'].value,
          "concepts": form['concepts'].value,
        }
        try{
            axios.post(`http://localhost:5000/api/${loanID}/payments`, payload)
            .then(result => {
                console.log(result.data);
                rep.setResponse(result.data);
            })
        }catch(err){
            console.log(err);
        };
    };

    const addTextFields = () =>{
      setPaymentIndexes(prevIndexes => [...prevIndexes, counter]);
      setCounter(prevCounter => prevCounter + 1);
  };
  var today = new Date().toISOString().slice(0, 10);
  const PaymentSchedule = () =>{
      const paymentScheduleFields = paymentIndexes.map(i=>{
          return(
              <TextField key={i}
                  label={`Amount ${i}`}
                  id={`amount ${i}`}
                  className={clsx(classes.margin, classes.textField)}
                  InputLabelProps={{shrink: true}}
              />
          )
      })
      return(
          <div>
            {paymentScheduleFields}
          </div>
      )
  };
    return(
        <div className={'payment-form'}>
            <h2>Payment</h2>
            <form id={'payment-form'} ref={paymentForm} onSubmit={handleSubmit}>
            <TextField
                required
                id="paymentDate"
                label="Payment Date"
                type="date"
                className={clsx(classes.margin, classes.textField)}
                InputLabelProps={{shrink: true}}
            />
            <PaymentSchedule/>
            <Button onClick={addTextFields} variant="contained" color="primary" className={clsx(classes.margin, classes.textField)} visible={false}>
                        Add Concept
            </Button>
            </form>
        </div>  
    );
};