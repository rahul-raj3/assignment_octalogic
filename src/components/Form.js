import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentQuestion, setFormData, setError, clearError,clearFormData } from '../features/formSlice';
import Question from './Question';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const initialQuestions = [
  { id: 1, type: 'text', question: "What is your name?", field: 'name' },
  { id: 2, type: 'radio', question: "Number of wheels?", field: 'wheels', options: [2, 4] },
  { id: 3, type: 'radio', question: "Type of vehicle?", field: 'vehicleType', options: [] },
  { id: 4, type: 'radio', question: "Specific Model?", field: 'model', options: [] },
  { id: 5, type: 'dateRange', question: "Select Date Range", field: 'dateRange' }
];

// const vehicleTypes = {
//   2: ['Motorbike', 'Scooter', 'Bicycle'],
//   4: ['Car', 'Truck', 'Van']
// };

const vehicleModels = {
  hatchback: ['TATA Tiago', 'Maruti Wagno R'],
  suv: ['TATA Punch', 'Honda Creta'],
  sedan: ['Honda city', 'verna'],
  cruiser: ['Royal Enfield', 'harley davidson'],
  sports: ['pulsar', 'yamaha apache'],
};

const Form = () => {
  const dispatch = useDispatch();
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);

  const { currentQuestion, data, error } = useSelector(state => state.form);

  const questions = [...initialQuestions];

  const getVehicleTypes = async() => {
    try {
      const response = await fetch('http://localhost:3002/api/common/getVehicleType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if(result?.status) {
        setVehicleTypes(result?.data)
        // toast("Thanks! for reaching us we will contact you soon. ", { type: "success" });
        // dispatch(clearFormData()); // Clear form data on success
      } 
      // else {
      //   toast("Something went wrong. ", { type: "error" });
      // }
      // console.log('Success:', result);
      // Optionally reset the form or redirect
    } catch (error) {
      console.error('Error:', error);
      dispatch(setError('Failed to Get vehicle type. Please try again.'));
    }
  }

  const getVehicleModels = async() => {
    try {
      const response = await fetch('http://localhost:3002/api/common/getVehicleModels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if(result?.status) {
        setVehicleModels(result?.data)
        // toast("Thanks! for reaching us we will contact you soon. ", { type: "success" });
        // dispatch(clearFormData()); // Clear form data on success
      } 
      // else {
      //   toast("Something went wrong. ", { type: "error" });
      // }
      // console.log('Success:', result);
      // Optionally reset the form or redirect
    } catch (error) {
      console.error('Error:', error);
      dispatch(setError('Failed to Get vehicle type. Please try again.'));
    }
  }


  useEffect(() => {
    getVehicleTypes()
    getVehicleModels()
  }, [])

  useEffect(() => {
    if (data.wheels) {
      questions[2].options = vehicleTypes[data.wheels];
    }
  }, [data.wheels]);

  useEffect(() => {
    if (data.vehicleType) {
      questions[3].options = vehicleModels[data.vehicleType] || [];
    }
  }, [data.vehicleType]);

  const handleNext = () => {
    if (isValid(currentQuestion)) {
      dispatch(clearError());
      dispatch(setCurrentQuestion(currentQuestion + 1));
    } else {
      dispatch(setError('Please answer the question before proceeding.'));
    }
  };

  const isValid = (index) => {
    const question = questions[index];
    if (!question) return false;
    if (question.type === 'text') {
      return data[question.field]?.first && data[question.field]?.last;
    }
    if (question.type === 'radio') {
      return data[question.field];
    }
    if (question.type === 'dateRange') {
      return data[question.field]?.startDate && data[question.field]?.endDate;
    }
    return true;
  };

  const handleChange = (field, value) => {
    dispatch(setFormData({ [field]: value }));
  };

  const isFormValid = () => {
    return (
      data.name?.first && data.name?.last &&
      data.wheels &&
      data.vehicleType &&
      data.model &&
      data.dateRange?.startDate &&
      data.dateRange?.endDate
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the form is valid before submission
    if (!isFormValid()) {
      dispatch(setError('Please fill all fields before submitting.'));
      return;
    }

    const formData = {
      name: data.name,
      wheels: data.wheels,
      vehicleType: data.vehicleType,
      model: data.model,
      dateRange: {
        startDate: data.dateRange?.startDate,
        endDate: data.dateRange?.endDate,
      },
    };

    try {
      const response = await fetch('http://localhost:3002/api/common/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if(result?.status) {
        toast("Thanks! for reaching us we will contact you soon. ", { type: "success" });
        dispatch(clearFormData()); // Clear form data on success
      } else {
        toast("Something went wrong. ", { type: "error" });
      }
      console.log('Success:', result);
      // Optionally reset the form or redirect
    } catch (error) {
      console.error('Error:', error);
      dispatch(setError('Failed to submit the form. Please try again.'));
    }
  };

  console.log(vehicleModels, 'vehicle getVehicleModels...')

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
      {questions[currentQuestion] ? (
        <>
          <h2 className="text-2xl mb-4">{questions[currentQuestion].question}</h2>
          {error && <p className="text-red-500">{error}</p>}
          <Question
            question={questions[currentQuestion]}
            value={data[questions[currentQuestion].field]}
            onChange={handleChange}
          />
          <div className="flex justify-between">
            {/* {currentQuestion > 0 && (
              <button
                type="button"
                onClick={() => dispatch(setCurrentQuestion(currentQuestion - 1))}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Back
              </button>
            )} */}
            <button
              type={currentQuestion === questions.length - 1 ? 'submit' : 'button'}
              onClick={currentQuestion === questions.length - 1 ? handleSubmit : handleNext}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">All questions answered!</p>
      )}
    </form>
  );
};

export default Form;
