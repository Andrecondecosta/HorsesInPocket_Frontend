import React from 'react';
import './GenealogyTree.css';

const GenealogyTree = ({ horse }) => {
  const getAncestorByRelation = (relation) => {
    const ancestor = horse.ancestors.find((ancestor) => ancestor.relation_type === relation);
    console.log(`Relation: ${relation}`, ancestor); // Log para depuração
    return ancestor;
  };

  const renderAncestor = (relation, label) => {
    const ancestor = getAncestorByRelation(relation);
    const isUnknown = !ancestor;

    return (
      <div key={relation} className={`ancestor-box ${relation} ${isUnknown ? 'unknown' : ''}`}>
        <div className="ancestor-label">{label}</div>
        <p>{ancestor && ancestor.name ? ancestor.name : 'Desconhecido'}</p>
        <p><strong>Criador:</strong> {ancestor && ancestor.breeder ? ancestor.breeder : 'Desconhecido'}</p>
        <p><strong>Raça:</strong> {ancestor && ancestor.breed ? ancestor.breed : 'Desconhecido'}</p>
      </div>
    );
  };

  return (
    <div className="genealogy-tree-container">
      <div className="genealogy-tree">
        <h2>Genealogia</h2>
        <div className="genealogy-container">
          {renderAncestor('father', 'Pai')}
          {renderAncestor('mother', 'Mãe')}
          {renderAncestor('paternal_grandfather', 'Avô Paterno')}
          {renderAncestor('paternal_grandmother', 'Avó Paterna')}
          {renderAncestor('maternal_grandfather', 'Avô Materno')}
          {renderAncestor('maternal_grandmother', 'Avó Materna')}
        </div>
        <div className="genealogy-image">
          <img
            src="https://res.cloudinary.com/dcvtrregd/image/upload/v1731449253/HorsesInPocket/Arvore_geneologica_no7srp.png"
            alt="Genealogia"
          />

        </div>
          <div className="genealogy-image-2">
          <img
            src="https://res.cloudinary.com/dcvtrregd/image/upload/v1731449253/HorsesInPocket/Arvore_geneologica_no7srp.png"
            alt="Genealogia"
          />
          </div>
      </div>
    </div>
  );
};

export default GenealogyTree;
