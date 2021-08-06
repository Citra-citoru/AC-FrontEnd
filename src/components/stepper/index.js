import React,{useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BorrowerForm from '../borrower-form/index';
import ApplicationForm from '../application-form/index';
import LoanForm from '../loan-form/index';
import PaymentForm from '../payment-form/index';
import { ResponseContext } from '../../context/response';
import './index.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center'
  },
}));

function getSteps() {
  return ['Borrower', 'Application', 'Loan', 'Payment'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'borrower';
    case 1:
      return 'application';
    case 2:
      return 'loan';
    case 3:
      return 'payment';
    default:
      return 'unknown step';
  }
}

export default function HorizontalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  //const rep = useContext(ResponseContext);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished!
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button> 
          </div>
        ) : (
          <div>
            <div className={'forms'}>
              {
                getStepContent(activeStep)==='borrower'?<BorrowerForm/>:
                getStepContent(activeStep)==='application'?<ApplicationForm/>:
                getStepContent(activeStep)==='loan'?<LoanForm/>:
                getStepContent(activeStep)==='payment'?<PaymentForm/>:
                ''
              }
              <div className={'form-buttons'}>
                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  type="submit"
                  form={`${getStepContent(activeStep)}-form`}
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
