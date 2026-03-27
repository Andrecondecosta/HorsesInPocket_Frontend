import React from 'react';
import './GenealogyTree.css';

const GenealogyTree = ({ horse }) => {
  const getAncestor = (relation) =>
    horse?.ancestors?.find((a) => a.relation_type === relation);

  const renderCard = (relation, label, className) => {
    const a = getAncestor(relation);
    return (
      <div className={`vt-card ${className}${!a ? ' vt-card--empty' : ''}`}>
        <span className="vt-card__label">{label}</span>
        <span className="vt-card__name">{a?.name || '—'}</span>
        {a?.breed && <span className="vt-card__detail">{a.breed}</span>}
        {a?.breeder && <span className="vt-card__detail">{a.breeder}</span>}
      </div>
    );
  };

  return (
    <div className="vtree">

      {/* ── Subject ── */}
      <div className="vtree__subject">
        {horse?.images?.[0] && (
          <img src={horse.images[0]} alt={horse.name} className="vtree__subject-img" />
        )}
        <span className="vt-card__label">Subject</span>
        <span className="vtree__subject-name">{horse?.name || '—'}</span>
      </div>

      {/* ── Subject → Parents ── */}
      <div className="vtree__stem" />
      <div className="vtree__t vtree__t--parents">
        <div className="vtree__arm vtree__arm--left" />
        <div className="vtree__arm vtree__arm--right" />
      </div>

      {/* ── Parents ── */}
      <div className="vtree__row vtree__row--parents">
        {renderCard('father', 'Father', 'vt-card--father')}
        {renderCard('mother', 'Mother', 'vt-card--mother')}
      </div>

      {/* ── Parents → Grandparents ── */}
      <div className="vtree__gp-stems">
        <div className="vtree__gp-stem">
          <div className="vtree__stem vtree__stem--light" />
          <div className="vtree__t vtree__t--gps">
            <div className="vtree__arm vtree__arm--gp-left" />
            <div className="vtree__arm vtree__arm--gp-right" />
          </div>
        </div>
        <div className="vtree__gp-stem">
          <div className="vtree__stem vtree__stem--light" />
          <div className="vtree__t vtree__t--gps">
            <div className="vtree__arm vtree__arm--gp-left" />
            <div className="vtree__arm vtree__arm--gp-right" />
          </div>
        </div>
      </div>

      {/* ── Grandparents ── */}
      <div className="vtree__row vtree__row--gps">
        <div className="vtree__gp-group">
          {renderCard('paternal_grandfather', 'Paternal Grandfather', 'vt-card--gp')}
          {renderCard('paternal_grandmother', 'Paternal Grandmother', 'vt-card--gp')}
        </div>
        <div className="vtree__gp-group">
          {renderCard('maternal_grandfather', 'Maternal Grandfather', 'vt-card--gp-m')}
          {renderCard('maternal_grandmother', 'Maternal Grandmother', 'vt-card--gp-m')}
        </div>
      </div>

    </div>
  );
};

export default GenealogyTree;
