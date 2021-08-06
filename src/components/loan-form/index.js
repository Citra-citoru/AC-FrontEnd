import React, {useState, useRef, useContext } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
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
import Button from '@material-ui/core/Button';
import { Products, Currencies, LoanStructureTypes } from '../../utilities/data';
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
    const [indexes, setIndexes] = useState([]);
    const [counter, setCounter] = useState(1);

    const [values, setValues] = useState({
        applicationID: rep.response?.id,
        currencyId:'',
        loanStructureTypeId:'',
        productId:''
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
        const form = loanForm.current;
        const payload = {
            "externalLoanId":form['externalLoanId'].value,
            "applicationId":form['applicationId'].value,
            "disbursementDate":form['disbursementDate'].value,
            "totalDisbursementAmount":form['totalDisbursementAmount'].value,
            "originationFee":form['originationFee'].value,
            "otherFee":form['otherFee'].value,
            "rebate":form['rebate'].value,
            "interestRate":form['interestRate'].value,
            "term":form['term'].value,
            "termUnitId":form['termUnitId'].value,
            "frequencyId":form['frequencyId'].value,
            "restructuredFromLoanId":form['restructuredFromLoanId'].value,
            "refinancedFromLoanId":form['refinancedFromLoanId'].value,
            "refinancedExtraAmount":form['refinancedExtraAmount'].value,
            "fundId":form['fundId'].value,
            "facilityId":form['facilityId'].value,
            "fundedRatio":form['fundedRatio'].value,
            "isFirstLoan":form['isFirstLoan'].value,
            "collateralFromDate":form['collateralFromDate'].value,
            "collateralToDate":form['collateralToDate'].value,
            "currencyId":form['currencyId'].value,
            "loanStructureTypeId":form['loanStructureTypeId'].value,
            "recoveredFrom":form['recoveredFrom'].value,
            "collateralTypeId":form['collateralTypeId'].value,
            "collateralValue":form['collateralValue'].value,
            "collateralAcquisitionDate":form['collateralAcquisitionDate'].value,
            "collateralAmortizationStartDate":form['collateralAmortizationStartDate'].value,
            "collateralMarketValue":form['collateralMarketValue'].value,
            "loanNumber":form['loanNumber'].value,
            "agentId":form['agentId'].value,
            "agentName":form['agentName'].value,
            "agentRevenue":form['agentRevenue'].value,
            "recoveryRate":form['recoveryRate'].value,
            "productId":form['productId'].value,
            "lender":form['lender'].value,
            "contractNumber":form['contractNumber'].value,
            "paymentSchedule":form['paymentSchedule'].value
        };

        try{
            axios.post(`http://localhost:5000/api/loans`, payload)
            .then(result => {
                console.log(result.data);
                rep.setResponse(result.data);
            })
        }catch(err){
            console.log(err);
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
                    label={`Number ${i}`}
                    id={`number ${i}`}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label={`Date ${i}`}
                    id={`date ${i}`}
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label={`Expected Principal ${i}`}
                    id={`expectedPrincipal ${i}`}
                    type="number"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    label={`Expected Interest ${i}`}
                    id={`expectedInterest ${i}`}
                    type="number"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                    style={{textAlign:'left'}}
                />
                <TextField
                    label={`Expected VAT ${i}`}
                    id={`expectedVAT ${i}`}
                    type="number"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                    style={{textAlign:'left'}}
                />
                </div>
            )
        })
        return(
            <div>
            {paymentScheduleFields}
        </div>
        )
    };

    var today = new Date().toISOString().slice(0, 10);
    return(
        <div className={'loan-form'}>
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
                    id="applicationID"
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
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <TextField
                    required
                    type="number"
                    label="Origination Fee"
                    id="originationFee"
                    className={clsx(classes.margin, classes.textField)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <TextField
                    required
                    type="number"
                    label="Other Fee"
                    id="otherFee"
                    className={clsx(classes.margin, classes.textField)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <TextField
                    required
                    type="number"
                    label="Rebate"
                    id="rebate"
                    className={clsx(classes.margin, classes.textField)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <TextField
                    required
                    type="number"
                    label="Interest Rate"
                    id="interestRate"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Term"
                    id="term"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label="Term Unit Id"
                    id="termUnitId"
                    value={values.applicationID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label="Frequency Id"
                    id="frequencyId"
                    value={values.applicationID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label="Restructured From Loan Id"
                    id="restructuredFromLoanId"
                    value={values.applicationID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label="Refinanced From Loan Id"
                    id="refinancedFromLoanId"
                    value={values.applicationID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Refinanced Extra Amount"
                    id="refinancedExtraAmount"
                    className={clsx(classes.margin, classes.textField)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
                <TextField
                    required
                    label="Fund Id"
                    id="fundId"
                    value={values.applicationID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label="Facility Id"
                    id="facilityId"
                    value={values.applicationID}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <FormControl component="fieldset" className={clsx(classes.margin)}>
                    <FormLabel component="legend" className={'radio-label'}><h5>Funded Ratio</h5></FormLabel>
                    <RadioGroup aria-label="fundedRatio" name="fundedRatio" onChange={handleChange} row={true}>
                        <FormControlLabel value="0" control={<Radio color="primary"/>} label="0" labelPlacement="End"/>
                        <FormControlLabel value="1" control={<Radio color="primary"/>} label="1" labelPlacement="end"/>
                    </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" className={clsx(classes.margin)}>
                    <FormLabel component="legend" className={'radio-label'}><h5>First Loan</h5></FormLabel>
                    <RadioGroup aria-label="isFirstLoan" name="isFirstLoan" onChange={handleChange} row={true}>
                        <FormControlLabel value="1" control={<Radio color="primary"/>} label="yes" labelPlacement="end" />
                        <FormControlLabel value="0" control={<Radio color="primary"/>} label="no" labelPlacement="end"/>
                    </RadioGroup>
                </FormControl>
                <TextField
                    required
                    id="collateralFromDate"
                    label="Collateral From Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    id="collateralToDate"
                    label="Collateral To Date"
                    type="date"
                    defaultValue={today}
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
                <FormControl className={clsx(classes.formControl,classes.margin, classes.textField)}>
                    <InputLabel required htmlFor="loanStructureTypeId">Loan Structure Type</InputLabel>
                    <Select
                    native
                    value={values.currencyId}
                    onChange={handleChange}
                    inputProps={{
                        name: 'loanStructureTypeId',
                        id: 'loanStructureTypeId',
                    }}
                    >
                    {LoanStructureTypes.map((value,index) => {
                        return(
                            <option key={index} value={value.key}>{value.value}</option>
                        )
                    })}
                    </Select>
                </FormControl>
                <TextField
                    required
                    id="recoveredFrom"
                    label="Recovered From"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    label="Collateral Type Id"
                    id="collateralTypeId"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Collateral Value"
                    id="collateralValue"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    id="collateralAcquisitionDate"
                    label="Collateral Acquisition Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    id="collateralAmortizationStartDate"
                    label="Collateral Amortization Start Date"
                    type="date"
                    defaultValue={today}
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Collateral Market Value"
                    id="collateralMarketValue"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Loan Number"
                    id="loanNumber"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    id="agentId"
                    label="agentId"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    id="agentName"
                    label="Agent Name"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Agent Revenue"
                    id="agentRevenue"
                    className={clsx(classes.margin, classes.textField)}
                    InputLabelProps={{shrink: true}}
                />
                <TextField
                    required
                    type="number"
                    label="Recovery Rate"
                    id="recoveryRate"
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