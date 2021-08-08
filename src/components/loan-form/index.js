import React, {useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import {ResponseContext} from '../../context/response';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
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

export default function LoanForm(){
    const classes = useStyles();
    const rep = useContext(ResponseContext);
    const loanForm = useRef(null);
    const [products, setProducts] = useState([]);
    const [currencies, setCurrencies]= useState([]);
    const [indexes, setIndexes] = useState([]);
    const [counter, setCounter] = useState(1);
    const [activateAlert, setActivateAlert] = useState(false);
    const [isClose,setIsClose] = useState(false);

    const [values, setValues] = useState({
        applicationID: rep.response?.id,
        termUnitID: "6575C4FF-32DC-4B62-BB9E-AC2C34DD55D3", 
        loanStructureTypeId: ' E060ECE8-0446-45F3-B0ED-43A1F597755D',
        interestRate: 0.2,
        term: 3,
        fundId: '77a9139d-caab-43fd-aafb-3effc7652877',
        totalDisbursementAmount: 300,
        fundRatio:'0',
        firstLoan:'0',
        productId:'462de2eb-0b30-4685-9686-0ac43295f72e',
        currencyId:''
    });

    useEffect(()=>{
        axios.get(`http://localhost:5000/api/products`)
        .then(result => {
            setProducts(result.data);
        });
        axios.get(`http://localhost:5000/api/currencies`)
        .then(result => {
            setCurrencies(result.data)
        });
    },[values]);
    
    const handleChange = (event) => {
        const name = event.target.name;
        setValues({
          ...values,
          [name]: event.target.value,
        });
    };

    const payloads = (form) =>{
        var arr =[];
        for (var i = 1; i < counter; i++) {
            var number_=`number${i}`;
            var date=`date${i}`;
            var expectedPrincipal=`expectedPrincipal${i}`;
            var expectedInterest=`expectedInterest${i}`;	
            var expectedVAT=`expectedVAT${i}`;
    
            arr.push({
                'number':form[`${number_}`].value,
                'date':new Date(form[`${date}`].value),
                'expectedPrincipal':form[`${expectedPrincipal}`].value,
                'expectedInterest':form[`${expectedInterest}`].value,
                'expectedVAT':form[`${expectedVAT}`].value
            }
            )
        }
      return {
        "externalLoanId":form['externalLoanId'].value,
        "applicationId":form['applicationId'].value,
        "loanTypeId":"3A0B59D1-864A-43A6-B860-56968EBB13E6",
        "disbursementDate":form['disbursementDate'].value,
        "totalDisbursementAmount":form['totalDisbursementAmount'].value,
        "interestRate":form['interestRate'].value,
        "term":form['term'].value,
        "termUnitId":form['termUnitId'].value,
        "fundId":form['fundId'].value,
        "currencyId":form['currencyId'].value,
        "loanStructureTypeId":form['loanStructureTypeId'].value,
        "paymentSchedule":arr
    };
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        rep.setResponse({});
        const form = loanForm.current;
        const payload = payloads(form);
        console.log("payload",payload)
        try{
            axios.post(`http://localhost:5000/api/loans`, payload)
            .then(result => {
                rep.setResponse(result.data);
            }).catch(err=>{
                setActivateAlert(true);
            });
        }catch(err){
            setActivateAlert(true);
        };
    };

    const addTextFields = () =>{
        setIndexes(prevIndexes => [...prevIndexes, counter]);
        setCounter(prevCounter => prevCounter + 1);
    };

    const PaymentSchedule = () =>{
        const paymentScheduleFields = indexes.map(i=>{
            return(
            <div key={i} className={'payment-schedule'}>
                <TextField
                    required
                    type="number"
                    label={`Number ${i}`}
                    id={`number${i}`}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label={`Date ${i}`}
                    id={`date${i}`}
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label={`Expected Principal ${i}`}
                    id={`expectedPrincipal${i}`}
                    type="number"
                    defaultValue={0}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label={`Expected Interest ${i}`}
                    id={`expectedInterest${i}`}
                    type="number"
                    defaultValue={0}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                    style={{textAlign:'left'}}
                />
                <TextField
                    required
                    label={`Expected VAT ${i}`}
                    id={`expectedVAT${i}`}
                    type="number"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                    style={{textAlign:'left'}}
                />
            </div>
            )
        })
        return(
            <FormGroup row>
                {paymentScheduleFields}
            </FormGroup>
        )
    };

    var today = new Date().toISOString().slice(0, 10);
    return(
        <div className={'loan-form'}>
            {activateAlert?
            <Collapse in={!isClose}>
                <Alert severity="error" onClose={()=>{setIsClose(true)}}>There is something wrong!</Alert>
            </Collapse>
            :''}
            <h2>Loan</h2>
            <form id={'loan-form'} ref={loanForm} onSubmit={handleSubmit}>
                <TextField
                    required
                    label="External Loan Id"
                    id="externalLoanId"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    readOnly={true}
                    label="Application ID"
                    id="applicationId"
                    value={values.applicationID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    id="disbursementDate"
                    label="Disbursement Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Total Disbursement Amount"
                    id="totalDisbursementAmount"
                    className={clsx(classes.margin, classes.textField)}
                    defaultValue={values.totalDisbursementAmount}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <TextField
                    type="number"
                    label="Origination Fee"
                    id="originationFee"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    type="number"
                    label="Other Fee"
                    id="otherFee"
                    className={clsx(classes.margin, classes.textField)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <TextField
                    type="number"
                    label="Rebate"
                    id="rebate"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Interest Rate"
                    id="interestRate"
                    defaultValue={values.interestRate}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Term"
                    id="term"
                    defaultValue={values.term}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label="Term Unit Id"
                    id="termUnitId"
                    defaultValue={values.termUnitID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Frequency Id"
                    id="frequencyId"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Restructured From Loan Id"
                    id="restructuredFromLoanId"
                    value={values.applicationID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Refinanced From Loan Id"
                    id="refinancedFromLoanId"
                    value={values.applicationID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    type="number"
                    label="Refinanced Extra Amount"
                    id="refinancedExtraAmount"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Fund Id"
                    id="fundId"
                    value={values.fundId}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Facility Id"
                    id="facilityId"
                    value={values.applicationID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <FormControl component="fieldset" className={clsx(classes.margin)}>
                    <FormLabel component="legend" className={'radio-label'}><h5>Funded Ratio</h5></FormLabel>
                    <RadioGroup aria-label="fundedRatio" name="fundedRatio" value={values.fundRatio} onChange={handleChange} row={true}>
                        <FormControlLabel value="0" control={<Radio color="primary"/>} label="0" labelPlacement="End"/>
                        <FormControlLabel value="1" control={<Radio color="primary"/>} label="1" labelPlacement="end"/>
                    </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" className={clsx(classes.margin)}>
                    <FormLabel component="legend" className={'radio-label'}><h5>First Loan</h5></FormLabel>
                    <RadioGroup aria-label="isFirstLoan" name="isFirstLoan" value={values.firstLoan} onChange={handleChange} row={true}>
                        <FormControlLabel value="0" control={<Radio color="primary"/>} label="yes" labelPlacement="end" />
                        <FormControlLabel value="1" control={<Radio color="primary"/>} label="no" labelPlacement="end"/>
                    </RadioGroup>
                </FormControl>
                <TextField
                    id="collateralFromDate"
                    label="Collateral From Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    id="collateralToDate"
                    label="Collateral To Date"
                    type="date"
                    defaultValue={today}
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
                    id="loanStructureTypeId"
                    label="loanStructureTypeId"
                    defaultValue={values.loanStructureTypeId}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    id="recoveredFrom"
                    label="Recovered From"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Collateral Type Id"
                    id="collateralTypeId"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    type="number"
                    label="Collateral Value"
                    id="collateralValue"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    id="collateralAcquisitionDate"
                    label="Collateral Acquisition Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    id="collateralAmortizationStartDate"
                    label="Collateral Amortization Start Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    type="number"
                    label="Collateral Market Value"
                    id="collateralMarketValue"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    type="number"
                    label="Loan Number"
                    id="loanNumber"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    id="agentId"
                    label="agentId"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    id="agentName"
                    label="Agent Name"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    type="number"
                    label="Agent Revenue"
                    id="agentRevenue"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    type="number"
                    label="Recovery Rate"
                    id="recoveryRate"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel htmlFor="productId" shrink={true}>Product</InputLabel>
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
                    label="Lender"
                    id="lender"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label="Contract Number"
                    id="contractNumber"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <br/>
                <h3 style={{fontWeight:'300',color:'grey'}}>Payment Schedule</h3>
                <hr style={{color:'lightgrey',marginRight:'5%'}}/>
                <FormGroup row>
                <PaymentSchedule/>
                    <Button onClick={addTextFields} variant="contained" color="primary" className={clsx(classes.margin, classes.textField)} visible={false}>
                        Add Payment Schedule
                    </Button>
                </FormGroup>
            </form>
        </div>  
    );
};