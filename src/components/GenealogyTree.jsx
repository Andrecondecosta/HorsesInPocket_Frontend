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
        <p><strong>Nome:</strong> {ancestor?.name || 'Desconhecido'}</p>
        <p><strong>Criador:</strong> {ancestor?.breeder || 'Desconhecido'}</p>
        <p><strong>Raça:</strong> {ancestor?.breed || 'Desconhecido'}</p>
      </div>
    );
  };

  return (
    <div className="genealogy-tree-container">
  <div className="genealogy-tree">
    {/* Cavalo principal */}
    {/* Verificação antes de renderizar o cavalo principal */}
    {horse?.images && horse.images.length > 0 && (
          <div className="horse-box">
            <img
              src={horse.images[0]} // Usa a primeira imagem como a principal
              alt={horse.name || 'Cavalo'}
              className="horse-image"
            />
            <p className="horse-name">{horse?.name || 'Nome Desconhecido'}</p>
          </div>
        )}
    <div className="geneology-line-1"></div>
    {/* Geração dos Pais */}
    <div className="generation parents">
      {renderAncestor('father', 'Pai')}
      {renderAncestor('mother', 'Mãe')}
    </div>
    <div className="geneology-line-2"></div>
    <div className="geneology-line-3"></div>
    {/* Geração dos Avós */}
    <div className="generation grandparents">
      {renderAncestor('paternal_grandfather', 'Avô Paterno')}
      {renderAncestor('paternal_grandmother', 'Avó Paterna')}
      {renderAncestor('maternal_grandfather', 'Avô Materno')}
      {renderAncestor('maternal_grandmother', 'Avó Materna')}
    </div>
  </div>
</div>

  );
};

export default GenealogyTree;
