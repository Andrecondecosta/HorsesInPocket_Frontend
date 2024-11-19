import React from 'react';
import './GenealogyForm.css';

const GenealogyForm = ({ ancestors, setAncestors }) => {
  const handleAncestorChange = (relation, field, value) => {
    setAncestors((prevAncestors) => ({
      ...prevAncestors,
      [relation]: {
        ...prevAncestors[relation],
        [field]: value,
      },
    }));
  };

  const renderAncestorInput = (relation, label) => {
    const hasError = !ancestors[relation]?.name;

    return (
      <div className={`ancestor-input ${hasError ? 'has-error' : ''}`}>
        <h3>{label}</h3>
        <input
          type="text"
          placeholder="Nome"
          value={ancestors[relation]?.name || ''}
          onChange={(e) => handleAncestorChange(relation, 'name', e.target.value)}
        />
        <input
          type="text"
          placeholder="Criador"
          value={ancestors[relation]?.breeder || ''}
          onChange={(e) => handleAncestorChange(relation, 'breeder', e.target.value)}
        />
        <input
          type="text"
          placeholder="Raça"
          value={ancestors[relation]?.breed || ''}
          onChange={(e) => handleAncestorChange(relation, 'breed', e.target.value)}
        />
      </div>
    );
  };


  const ancestorFields = [
    { relation: 'father', label: 'Pai' },
    { relation: 'mother', label: 'Mãe' },
    { relation: 'paternal_grandfather', label: 'Avô Paterno' },
    { relation: 'paternal_grandmother', label: 'Avó Paterna' },
    { relation: 'maternal_grandfather', label: 'Avô Materno' },
    { relation: 'maternal_grandmother', label: 'Avó Materna' },
  ];

  return (
    <div className="genealogy-form">
      <h2>Genealogia</h2>
      <div className="genealogy-inputs">
        {ancestorFields.map(({ relation, label }) =>
          renderAncestorInput(relation, label)
        )}
      </div>
    </div>
  );
};

export default GenealogyForm;
