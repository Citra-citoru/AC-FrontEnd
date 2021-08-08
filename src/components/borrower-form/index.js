import React, {useState, useRef, useContext } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import {ResponseContext} from '../../context/response';
import Collapse from '@material-ui/core/Collapse';
import { MaritalStatuses, Educations, Industries, Countries, SettlementTypes, ProductTypes} from '../../utilities/data';
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

export default function BorrowerForm(){
    const classes = useStyles();
    const rep = useContext(ResponseContext);
    const borrowerForm = useRef(null);
    const [activateAlert, setActivateAlert] = useState(false);
    const [isClose,setIsClose] = useState(false);
    const [values, setValues] = useState({
        gender:'',
        maritalStatusId	:'',
        educationTypeId:'',
        industryId:'',
        countryId:'',
        settlementTypeId:'',
        productTypeId:'',
        income:0,
        borrowerTypeId:"70BBD5E3-EDB7-4C28-A1C4-0F894EEA4467"
    });
    const handleChange = (event) => {
        const name = event.target.name;
        setValues({
          ...values,
          [name]: event.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        rep.setResponse({});
        const form = borrowerForm.current;
        const payload = {
            "externalBorrowerId": form['externalBorrowerId'].value,
            "name":form['name'].value,
            "borrowerTypeId": form['borrowerTypeId'].value
          };
        //console.log("payload",payload);
        try{
            axios.post(`http://localhost:5000/api/borrowers`, payload)
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

    var today = new Date().toISOString().slice(0, 10);
    return(
        <div className={'borrower-form'}>
            {activateAlert?
            <Collapse in={!isClose}>
                <Alert severity="error" onClose={()=>{setIsClose(true)}}>There is something wrong!</Alert>
            </Collapse>
            :''}
            <h2>Borrower</h2>
            <form id={'borrower-form'} ref={borrowerForm} onSubmit={handleSubmit}>
                <TextField
                    required
                    label="External Borrower Id"
                    id="externalBorrowerId"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Name"
                    id="name"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label="Borrower Type Id"
                    id="borrowerTypeId"
                    defaultValue={values.borrowerTypeId}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                 <TextField
                    id="birthDate"
                    label="Birth Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    type="number"
                    label="Income"
                    id="income"
                    defaultValue={values.income}
                    className={clsx(classes.margin, classes.textField)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel htmlFor="gender">Gender</InputLabel>
                    <Select
                    native
                    value={values.gender}
                    onChange={handleChange}
                    inputProps={{
                        name: 'gender',
                        id: 'gender',
                    }}
                    >
                    <option value={'male'}>Male</option>
                    <option value={'female'}>Female</option>
                    </Select>
                </FormControl>
                <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel htmlFor="maritalStatusId">Marital Status</InputLabel>
                    <Select
                    native
                    value={values.maritalStatusId}
                    onChange={handleChange}
                    inputProps={{
                        name: 'maritalStatusId',
                        id: 'maritalStatusId',
                    }}
                    >
                    {MaritalStatuses.map((value,index) => {
                        return(
                            <option key={index} value={value.key}>{value.value}</option>
                        )
                    })}
                    </Select>
                </FormControl>
                <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel htmlFor="educationTypeId">Education Type</InputLabel>
                    <Select
                    native
                    value={values.educationTypeId}
                    onChange={handleChange}
                    inputProps={{
                        name: 'educationTypeId',
                        id: 'educationTypeId',
                    }}
                    >
                    {Educations.map((value,index) => {
                        return(
                            <option key={index} value={value.key}>{value.value}</option>
                        )
                    })}
                    </Select>
                </FormControl>
                <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel htmlFor="industryId">Industry</InputLabel>
                    <Select
                    native
                    value={values.industryId}
                    onChange={handleChange}
                    inputProps={{
                        name: 'industryId',
                        id: 'industryId',
                    }}
                    >
                    {Industries.map((value,index) => {
                        return(
                            <option key={index} value={value.key}>{value.value}</option>
                        )
                    })}
                    </Select>
                </FormControl>
                <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel htmlFor="countryId">Country</InputLabel>
                    <Select
                    native
                    value={values.countryId}
                    onChange={handleChange}
                    inputProps={{
                        name: 'countryId',
                        id: 'countryId',
                    }}
                    >
                    {Countries.map((value,index) => {
                        return(
                            <option key={index} value={value.key}>{value.value}</option>
                        )
                    })}
                    </Select>
                </FormControl>
                <TextField
                    label="State"
                    id="state"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                 <TextField
                    label="City"
                    id="city"
                    value={values.city}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                 <TextField
                    type="number"
                    label="Number Of Employees"
                    id="numberOfEmployees"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                 <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel htmlFor="settlementTypeId">Settlement Type</InputLabel>
                    <Select
                    native
                    inputProps={{
                        name: 'settlementTypeId',
                        id: 'settlementTypeId',
                    }}
                    >
                    {SettlementTypes.map((value,index) => {
                        return(
                            <option key={index} value={value.key}>{value.value}</option>
                        )
                    })}
                    </Select>
                </FormControl>
                <TextField
                    type="number"
                    label="Number Of Dependents"
                    id="numberOfDependents"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                 <TextField
                    label="Employer Name"
                    id="employerName"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    id="workingStartDate"
                    label="Working Start Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    id="workingEndDate"
                    label="Working End Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel htmlFor="productTypeId">Product Type</InputLabel>
                    <Select
                    native
                    value={values.productTypeId}
                    onChange={handleChange}
                    inputProps={{
                        name: 'productTypeId',
                        id: 'productTypeId',
                    }}
                    >
                    {ProductTypes.map((value,index) => {
                        return(
                            <option key={index} value={value.key}>{value.value}</option>
                        )
                    })}
                    </Select>
                </FormControl>
                 <TextField
                    label="Job"
                    id="job"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
            </form>
        </div>  
    );
};