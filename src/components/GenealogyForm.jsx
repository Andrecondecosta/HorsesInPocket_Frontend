import React, { useState } from 'react';
import './GenealogyForm.css';

const GenealogyForm = ({ ancestors, setAncestors }) => {
  const [activeTab, setActiveTab] = useState('father');

  const handleAncestorChange = (relation, field, value) => {
    setAncestors((prevAncestors) => ({
      ...prevAncestors,
      [relation]: {
        ...prevAncestors[relation],
        [field]: value,
      },
    }));
  };

  const ancestorLabels = {
    father: 'Pai',
    mother: 'Mãe',
    paternal_grandfather: 'Avô Paterno',
    paternal_grandmother: 'Avó Paterna',
    maternal_grandfather: 'Avô Materno',
    maternal_grandmother: 'Avó Materna',
  };

  const renderFields = () => (
    <div className="genealogy-fields">
      <input
        type="text"
        placeholder="Nome"
        value={ancestors[activeTab]?.name || ''}
        onChange={(e) => handleAncestorChange(activeTab, 'name', e.target.value)}
      />
      <input
        type="text"
        placeholder="Criador"
        value={ancestors[activeTab]?.breeder || ''}
        onChange={(e) => handleAncestorChange(activeTab, 'breeder', e.target.value)}
      />
      <input
        type="text"
        placeholder="Raça"
        value={ancestors[activeTab]?.breed || ''}
        onChange={(e) => handleAncestorChange(activeTab, 'breed', e.target.value)}
      />
    </div>
  );

  return (
    <div className="genealogy-form">
      {/* Tabs */}
      <div className="genealogy-tabs">
        {Object.keys(ancestorLabels).map((relation) => (
          <div
            key={relation}
            className={`genealogy-tab ${activeTab === relation ? 'active' : ''}`}
            onClick={() => setActiveTab(relation)}
          >
            {ancestorLabels[relation]}
          </div>
        ))}
      </div>

      {/* Fields */}
      {renderFields()}

    </div>
  );
};

export default GenealogyForm;
