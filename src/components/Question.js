import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Question = ({ question, value, onChange }) => {
  console.log(question, 'questions...')
  switch (question.type) {
    case 'text':
      return (
        <div>
          <input
            type="text"
            placeholder="First Name"
            onChange={(e) => onChange('name', { ...value, first: e.target.value })}
            className="border rounded w-full p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            onChange={(e) => onChange('name', { ...value, last: e.target.value })}
            className="border rounded w-full p-2 mb-2"
          />
        </div>
      );
    case 'radio':
      return (
        <div>
          {question.options.map((option, index) => (
            <label key={index} className="block mb-2">
              <input
                type="radio"
                name={question.field}
                value={option}
                checked={value === option}
                onChange={() => onChange(question.field, option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      );
    case 'dateRange':
      return (
        <div className="flex flex-col">
          <label className="mb-2">Select Start Date:</label>
          <DatePicker
            selected={value?.startDate}
            onChange={(date) => onChange(question.field, { ...value, startDate: date })}
            className="border rounded p-2 mb-4"
            dateFormat="yyyy/MM/dd"
            placeholderText="Select a start date"
          />
          <label className="mb-2">Select End Date:</label>
          <DatePicker
            selected={value?.endDate}
            onChange={(date) => onChange(question.field, { ...value, endDate: date })}
            className="border rounded p-2"
            dateFormat="yyyy/MM/dd"
            placeholderText="Select an end date"
          />
        </div>
      );
    default:
      return null;
  }
};

export default Question;
