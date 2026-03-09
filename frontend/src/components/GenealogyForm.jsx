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
    father: 'Father',
    mother: 'Mother',
    paternal_grandfather: 'Paternal Grandfather',
    paternal_grandmother: 'Paternal Grandmother',
    maternal_grandfather: 'Maternal Grandfather',
    maternal_grandmother: 'Maternal Grandmother',
  };

  const renderFields = () => (
    <div className="genealogy-fields">
      <input
        type="text"
        placeholder="Name"
        value={ancestors[activeTab]?.name || ''}
        onChange={(e) => handleAncestorChange(activeTab, 'name', e.target.value)}
      />
      <input
        type="text"
        placeholder="Breeder"
        value={ancestors[activeTab]?.breeder || ''}
        onChange={(e) => handleAncestorChange(activeTab, 'breeder', e.target.value)}
      />
      <input
        type="text"
        placeholder="Breed"
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
