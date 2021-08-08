import React, {useState, useRef, useContext , useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import {ResponseContext} from '../../context/response';
import Collapse from '@material-ui/core/Collapse';
//import { Products, Currencies } from '../../utilities/data';
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

export default function ApplicationForm(){
    const classes = useStyles();
    const rep = useContext(ResponseContext);
    const applicationForm = useRef(null);
    const [activateAlert, setActivateAlert] = useState(false);
    const [products, setProducts] = useState([]);
    const [currencies, setCurrencies]= useState([]);
    const [isClose,setIsClose] = useState(false);
    const [values, setValues] = useState({
        productId:'462de2eb-0b30-4685-9686-0ac43295f72e',
        currencyId:''
    });
    const handleChange = (event) => {
        const name = event.target.name;
        setValues({
          ...values,
          [name]: event.target.value,
        });
    };

    useEffect(()=>{
        axios.get(`http://localhost:5000/api/products`)
        .then(result => {
            setProducts(result.data);
        });
        axios.get(`http://localhost:5000/api/currencies`)
        .then(result => {
            setCurrencies(result.data)
        })
    },[]);

    console.log("rep.response?.id",rep.response?.id);
    const handleSubmit = async(e) => {
        e.preventDefault();
        const form = applicationForm.current;
        const borrowerID = rep.response?.id;
        rep.setResponse({});
        const payload = {
            "externalApplicationId":form['externalApplicationId'].value,
            "applicationDate":form['applicationDate'].value,
            "requestedAmount":form['requestedAmount'].value,
            "requestedTerm":form['requestedTerm'].value,
            "requestedTermUnitId":form['requestedTermUnitId'].value,	
            "productId":form['productId'].value,
            "currencyId":form['currencyId'].value,
          }
        try{
            axios.post(`http://localhost:5000/api/${borrowerID}/applications`, payload)
            .then(result => {
                console.log("resultdata",result.data);
                rep.setResponse(result.data);
            }).catch(err=>{
                setActivateAlert(true);
            });
        }catch(err){
            setActivateAlert(true);
        };
    };

    var today = new Date().toISOString().slice(0, 10);
    return(
        <div className={'application-form'}>
            {activateAlert?
            <Collapse in={!isClose}>
                <Alert severity="error" onClose={()=>{setIsClose(true)}}>There is something wrong!</Alert>
            </Collapse>
            :''}
            <h2>Application</h2>
            <form id={'application-form'} ref={applicationForm} onSubmit={handleSubmit}>
                <TextField
                    required
                    label="External Application Id"
                    id="externalApplicationId"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    id="applicationDate"
                    label="Application Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Requested Amount"
                    id="requestedAmount"
                    defaultValue={0}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Requested Term"
                    id="requestedTerm"
                    defaultValue={3}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label="Requested Term Unit Id"
                    id="requestedTermUnitId"
                    defaultValue={"246d03c8-ea99-406e-a32e-e5764e634a63"}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Requested Frequency Id"
                    id="requestedFrequencyId"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                 <TextField
                    type="number"
                    label="recovery Rate"
                    id="recoveryRate"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Platform"
                    id="platform"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel required htmlFor="productId" shrink={true}>Product</InputLabel>
                    <Select
                    native
                    value={values.productId}
                    onChange={handleChange}
                    inputProps={{
                        name: 'productId',
                        id: 'productId',
                    }}
                    >
                    {products.map((value,index) => {
                        return(
                            <option key={index} value={value.id}>{value.name}</option>
                        )
                    })}
                    </Select>
                </FormControl>
                <TextField
                    label="Loan Grade"
                    id="loanGrade"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    type="number"
                    label="credit Bureau Score"
                    id="creditBureauScore"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel required htmlFor="currencyId" shrink={true}>Currency</InputLabel>
                    <Select
                    native
                    value={values.currencyId}
                    onChange={handleChange}
                    inputProps={{
                        name: 'currencyId',
                        id: 'currencyId',
                    }}
                    >
                    {currencies.map((value,index) => {
                        return(
                            <option key={index} value={value.id}>{value.name}</option>
                        )
                    })}
                    </Select>
                </FormControl>
                <TextField
                    label="Purpose Of Loan"
                    id="purposeOfLoan"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Agent Id"
                    id="agentId"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                 <TextField
                    label="Agent Name"
                    id="agentName"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    type="number"
                    label="Agent Revenue"
                    id="agentRevenue"
                    className={clsx(classes.margin, classes.textField)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
            </form>
        </div>  
    );
};