import React from 'react';
import './GenealogyTree.css';

const GenealogyTree = ({ horse }) => {
  const getAncestorByRelation = (relation) => {
    const ancestor = horse.ancestors.find((ancestor) => ancestor.relation_type === relation);
    return ancestor;
  };

  const renderAncestor = (relation, label) => {
    const ancestor = getAncestorByRelation(relation);
    const isUnknown = !ancestor;

    return (
      <div key={relation} className={`ancestor-box ${isUnknown ? 'unknown' : ''}`}>
        <div className="ancestor-label">{label}</div>
        <p><strong>Name:</strong> {ancestor?.name || 'Unknown'}</p>
        <p><strong>Breeder:</strong> {ancestor?.breeder || 'Unknown'}</p>
        <p><strong>Breed:</strong> {ancestor?.breed || 'Unknown'}</p>
      </div>
    );
  };

  return (
    <div className="genealogy-tree-container">
      <div className="genealogy-tree">
        {/* Main horse */}
        {/* Check before rendering the main horse */}
        {horse?.images && horse.images.length > 0 && (
          <div className="horse-box">
            <img
              src={horse.images[0]} // Use the first image as the main one
              alt={horse.name || 'Horse'}
              className="horse-image"
            />
            <p className="horse-name">{horse?.name || 'Unknown Name'}</p>
          </div>
        )}
        <div className="geneology-line-1"></div>
        {/* Parents generation */}
        <div className="generation parents">
          {renderAncestor('father', 'Father')}
          {renderAncestor('mother', 'Mother')}
        </div>
        <div className="geneology-line-2"></div>
        <div className="geneology-line-3"></div>
        {/* Grandparents generation */}
        <div className="generation grandparents">
          {renderAncestor('paternal_grandfather', 'Paternal Grandfather')}
          {renderAncestor('paternal_grandmother', 'Paternal Grandmother')}
          {renderAncestor('maternal_grandfather', 'Maternal Grandfather')}
          {renderAncestor('maternal_grandmother', 'Maternal Grandmother')}
        </div>
      </div>
    </div>
  );
};

export default GenealogyTree;
