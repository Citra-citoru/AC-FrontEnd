import React, {useState, useRef, useContext } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import {ResponseContext} from '../../context/response';
import { Products, Currencies } from '../../utilities/data';
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
    const [values, setValues] = useState({
        productId:'',
        currencyId:''
    });
    const handleChange = (event) => {
        const name = event.target.name;
        setValues({
          ...values,
          [name]: event.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const form = applicationForm.current;
        const borrowerID = rep.response;
        const payload = {
            "externalBorrowerId":form['externalBorrowerId'].value,
            "name": form['name'].value,
            "borrowerTypeId":form['borrowerTypeId'].value,
            "birthDate": form['birthDate'].value,
            "income":form['income'].value,
            "gender": form['gender'].value,
            "maritalStatusId":form['maritalStatusId'].value,
            "educationTypeId":form['educationTypeId'].value,
            "industryId":form['industryId'].value,
            "countryId":form['countryId'].value,
            "state":form['state'].value,
            "city":form['city'].value,
            "numberOfEmployees": form['numberOfEmployees'].value,
            "settlementTypeId":form['settlementTypeId'].value,
            "numberOfDependents": form['numberOfDependents'].value,
            "employerName":form['employerName'].value,
            "workingStartDate":form['workingStartDate'].value,
            "workingEndDate":form['workingEndDate'].value,
            "productTypeId":form['productTypeId'].value,
            "job": form['job'].value,
          }
        try{
            axios.post(`http://localhost:5000/api/${borrowerID}/applications`, payload)
            .then(result => {
                console.log(result.data);
                rep.setResponse(result.data);
            })
        }catch(err){
            console.log(err);
        };
    };

    var today = new Date().toISOString().slice(0, 10);
    return(
        <div className={'application-form'}>
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
                    className={clsx(classes.margin, classes.textField)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <TextField
                    required
                    type="number"
                    label="Requested Term"
                    id="requestedTerm"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label="Requested Term Unit Id"
                    id="requestedTermUnitId"
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
                    <InputLabel required htmlFor="productId">Product</InputLabel>
                    <Select
                    native
                    value={values.productId}
                    onChange={handleChange}
                    inputProps={{
                        name: 'productId',
                        id: 'productId',
                    }}
                    >
                    {Products.map((value,index) => {
                        return(
                            <option key={index} value={value.key}>{value.value}</option>
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
                    <InputLabel required htmlFor="currencyId">Currency</InputLabel>
                    <Select
                    native
                    value={values.currencyId}
                    onChange={handleChange}
                    inputProps={{
                        name: 'currencyId',
                        id: 'currencyId',
                    }}
                    >
                    {Currencies.map((value,index) => {
                        return(
                            <option key={index} value={value.key}>{value.value}</option>
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