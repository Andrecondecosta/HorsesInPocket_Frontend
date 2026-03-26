import React from 'react';
import './GenealogyTree.css';

const GenealogyTree = ({ horse }) => {
  const getAncestor = (relation) =>
    horse?.ancestors?.find((a) => a.relation_type === relation);

  const renderCard = (relation, label, className) => {
    const a = getAncestor(relation);
    return (
      <div className={`pedigree-card ${className} ${!a ? 'card-unknown' : ''}`}>
        <div className="card-label">{label}</div>
        <div className="card-name">{a?.name || '—'}</div>
        {a?.breed && <div className="card-detail">{a.breed}</div>}
        {a?.breeder && <div className="card-detail">{a.breeder}</div>}
      </div>
    );
  };

  return (
    <div className="pedigree-scroll">
      <div className="pedigree">

        {/* ── Column 1: Subject ── */}
        <div className="pedigree-col col-subject">
          <div className="pedigree-subject">
            {horse?.images?.[0] && (
              <img src={horse.images[0]} alt={horse.name} className="subject-img" />
            )}
            <div className="card-label">Subject</div>
            <div className="subject-name">{horse?.name || '—'}</div>
          </div>
        </div>

        {/* ── Connector 1 → 2 ── */}
        <div className="pedigree-connector connector-1">
          <div className="c-h-top" />
          <div className="c-v" />
          <div className="c-h-bottom" />
        </div>

        {/* ── Column 2: Parents ── */}
        <div className="pedigree-col col-parents">
          <div className="parent-slot slot-top">
            {renderCard('father', 'Father', 'card-father')}
          </div>
          <div className="parent-slot slot-bottom">
            {renderCard('mother', 'Mother', 'card-mother')}
          </div>
        </div>

        {/* ── Connector 2 → 3 ── */}
        <div className="pedigree-connector connector-2">
          <div className="c-h-q1" />
          <div className="c-v-top" />
          <div className="c-h-q2" />
          <div className="c-spacer" />
          <div className="c-h-q3" />
          <div className="c-v-bottom" />
          <div className="c-h-q4" />
        </div>

        {/* ── Column 3: Grandparents ── */}
        <div className="pedigree-col col-grandparents">
          <div className="gp-slot">
            {renderCard('paternal_grandfather', 'Paternal GF', 'card-gp card-father-side')}
          </div>
          <div className="gp-slot">
            {renderCard('paternal_grandmother', 'Paternal GM', 'card-gp card-father-side')}
          </div>
          <div className="gp-slot">
            {renderCard('maternal_grandfather', 'Maternal GF', 'card-gp card-mother-side')}
          </div>
          <div className="gp-slot">
            {renderCard('maternal_grandmother', 'Maternal GM', 'card-gp card-mother-side')}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GenealogyTree;
