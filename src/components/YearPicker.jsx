import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './YearPicker.css';
const YearPicker = ({ selectedYear, onChange }) => {
  const [year, setYear] = useState(selectedYear);

  const handleYearChange = (date) => {
    const selectedYear = date.getFullYear(); // Obtém apenas o ano
    setYear(selectedYear);
    onChange(selectedYear); // Chama a função de callback, se necessário
  };

  // Custom input para tornar o campo readOnly
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <input
      type="text"
      readOnly
      value={value}
      onClick={onClick}
      placeholder="Select Year"
      ref={ref}
      className="custom-year-input" // Classe para estilização
    />
  ));

  return (
    <DatePicker
      selected={year ? new Date(year, 0) : null}
      onChange={handleYearChange}
      showYearPicker
      dateFormat="yyyy"
      placeholderText="Select Year"
      customInput={<CustomInput />} // Usa o custom input
    />
  );
};

export default YearPicker;
