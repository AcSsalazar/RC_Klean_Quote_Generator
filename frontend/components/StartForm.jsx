// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react';
import apiInstance from "../src/utils/axios";
import '../styles/StartForm.css'; 
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const StartForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({
    service_type: "",
    facility_type: "",
    area_size: "",
    cleaning_frequency: "",
    toilets_number: "",
    start_date: "",
    hiring_likelihood: "",
  });
  const [options, setOptions] = useState({
    service_types: [],
    facility_types: [],
    area_sizes: [],
    cleaning_freqs: [],
    toilet_qtys: [],
    start_dates: [],
    hiring_likelihoods: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await apiInstance.get("/form/options/");
        setOptions({
          service_types: response.data.service_types || [],
          facility_types: response.data.facility_types || [],
          area_sizes: response.data.area_sizes || [],
          cleaning_freqs: response.data.cleaning_freqs || [],
          toilet_qtys: response.data.toilet_qtys || [],
          start_dates: response.data.start_dates || [],
          hiring_likelihoods: response.data.hiring_likelihoods || [],
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const questions = [
    { key: 'service_type', label: 'Select one of our Services', optionsKey: 'service_types' },
    { key: 'facility_type', label: 'What type of facility needs cleaning?', optionsKey: 'facility_types' },
    { key: 'area_size', label: 'How big is the total area needing cleaning?', optionsKey: 'area_sizes' },
    { key: 'cleaning_frequency', label: 'How often do you require cleaning services?', optionsKey: 'cleaning_freqs' },
    { key: 'toilets_number', label: 'How many flushable toilets/urinals need cleaning?', optionsKey: 'toilet_qtys' },
    { key: 'start_date', label: 'How soon would you like the cleaning to begin?', optionsKey: 'start_dates' },
    { key: 'hiring_likelihood', label: 'How likely are you to make a hiring decision?', optionsKey: 'hiring_likelihoods' },
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    setResponses({
      ...responses,
      [questions[currentStep].key]: e.target.value,
    });
  };

  const handleSubmit = () => {
    apiInstance.post("form/", responses)
      .then(response => {
        Swal.fire({
          icon: "success",
          title: "Form successfully send",
        });
        // eslint-disable-next-line no-unused-vars
        const questionnaireId = response.data.id;
      })
      .catch(error => {
        console.error('Error al enviar el cuestionario:', error);
        console.log("Datos que se envían al servidor:", responses);
        alert('Ocurrió un error al enviar el cuestionario.');
      });
  };

  const currentQuestion = questions[currentStep];
  const currentOptions = options[currentQuestion.optionsKey] || [];

  return (
    <div className="questionnaire-container">
      <h2>Customer Questionnaire</h2>
      <div className="question-box">
        <p>{currentQuestion.label}</p>
        <select value={responses[currentQuestion.key]} onChange={handleChange}>
          <option value="">Select an option</option>
          {currentOptions.map(option => (
            <option key={option.id} value={option.id}>{option.name || option.description}</option>
          ))}
        </select>
      </div>
      <div className="navigation-buttons">
        {currentStep > 0 && (
          <button onClick={handlePrevious} className="nav-button">Previous</button>
        )}
        {currentStep < questions.length - 1 ? (
          <button onClick={handleNext} className="nav-button" disabled={!responses[currentQuestion.key]}>
            Next
          </button>
        ) : (
          <Link to="/">
          <button  onClick={handleSubmit} className="submit-button" disabled={!responses[currentQuestion.key]}>
           
            Submit
          </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartForm;

