import React, { useState } from 'react';
import './GenealogyTree.css';

const GenealogyTree = ({ horse }) => {
  const [expanded, setExpanded] = useState(null);

  const getAncestor = (relation) =>
    horse?.ancestors?.find((a) => a.relation_type === relation);

  const toggle = (relation) =>
    setExpanded((prev) => (prev === relation ? null : relation));

  const renderCard = (relation, label, variant) => {
    const a = getAncestor(relation);
    const isOpen = expanded === relation;
    const hasAny = !!(a?.name || a?.breed || a?.breeder);
    const hasExtra = !!(a?.breed || a?.breeder);

    return (
      <div
        className={`gt-card gt-card--${variant}${!a?.name ? ' gt-card--empty' : ''}${isOpen ? ' gt-card--open' : ''}`}
        onClick={hasAny ? () => toggle(relation) : undefined}
        role={hasAny ? 'button' : undefined}
        tabIndex={hasAny ? 0 : undefined}
        onKeyDown={hasAny ? (e) => e.key === 'Enter' && toggle(relation) : undefined}
        data-testid={`genealogy-card-${relation}`}
      >
        <span className="gt-label">{label}</span>
        <span className="gt-name">{a?.name || '—'}</span>

        <div className="gt-details">
          {a?.breed && (
            <span className="gt-detail">
              <b>Breed:</b> {a.breed}
            </span>
          )}
          {a?.breeder && (
            <span className="gt-detail">
              <b>Breeder:</b> {a.breeder}
            </span>
          )}
        </div>

        {!isOpen && hasExtra && <span className="gt-hint">details</span>}
        {isOpen && <span className="gt-hint gt-hint--close">close</span>}
      </div>
    );
  };

  return (
    <div className="gtree">

      {/* Subject */}
      <div className="gtree__subject">
        {horse?.images?.[0] && (
          <img
            src={horse.images[0]}
            alt={horse.name}
            className="gtree__subject-img"
          />
        )}
        <span className="gt-label">Subject</span>
        <span className="gtree__subject-name">{horse?.name || '—'}</span>
      </div>

      {/* Connector: Subject → two branches */}
      <div className="gtree__vstem" />
      <div className="gtree__hbar">
        <div className="gtree__arm gtree__arm--main-l" />
        <div className="gtree__arm gtree__arm--main-r" />
      </div>

      {/* Parents level */}
      <div className="gtree__level">

        {/* Father branch */}
        <div className="gtree__branch">
          {renderCard('father', 'Father', 'father')}
          <div className="gtree__vstem gtree__vstem--light" />
          <div className="gtree__hbar">
            <div className="gtree__arm gtree__arm--gp-l" />
            <div className="gtree__arm gtree__arm--gp-r" />
          </div>
          <div className="gtree__gp-row">
            {renderCard('paternal_grandfather', 'Pat. Grandfather', 'gp')}
            {renderCard('paternal_grandmother', 'Pat. Grandmother', 'gp')}
          </div>
        </div>

        {/* Mother branch */}
        <div className="gtree__branch">
          {renderCard('mother', 'Mother', 'mother')}
          <div className="gtree__vstem gtree__vstem--light" />
          <div className="gtree__hbar">
            <div className="gtree__arm gtree__arm--gp-l" />
            <div className="gtree__arm gtree__arm--gp-r" />
          </div>
          <div className="gtree__gp-row">
            {renderCard('maternal_grandfather', 'Mat. Grandfather', 'gp-m')}
            {renderCard('maternal_grandmother', 'Mat. Grandmother', 'gp-m')}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GenealogyTree;
