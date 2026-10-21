import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// As duas linhas do pedigree, com os relation_type que o backend guarda
export const LINES = [
  {
    key: 'sire',
    parent: { relation: 'father', label: 'Sire', dot: 'bg-primary', text: 'text-primary-soft-foreground' },
    grandparents: [
      { relation: 'paternal_grandfather', label: "Sire's sire" },
      { relation: 'paternal_grandmother', label: "Sire's dam" },
    ],
  },
  {
    key: 'dam',
    parent: { relation: 'mother', label: 'Dam', dot: 'bg-[#a0673a]', text: 'text-leather' },
    grandparents: [
      { relation: 'maternal_grandfather', label: "Dam's sire" },
      { relation: 'maternal_grandmother', label: "Dam's dam" },
    ],
  },
];

const hasData = (ancestor) => !!(ancestor?.name || ancestor?.breed || ancestor?.breeder);

// Antepassado em falta: cartão tracejado, com "Add" para o dono
const MissingCard = ({ label, editHref, className }) => (
  <div
    className={cn(
      'flex flex-col justify-center rounded-xl border-[1.5px] border-dashed border-[#c9c0ae] px-3 py-2',
      className
    )}
  >
    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
    <span className="text-[13px] text-muted-foreground">Not recorded</span>
    {editHref && (
      <Link to={editHref} className="flex items-center gap-1 text-[12.5px] font-semibold text-primary">
        <Plus className="size-3.5" aria-hidden="true" />
        Add
      </Link>
    )}
  </div>
);

const AncestorCard = ({ ancestor, label, labelClassName, dotClassName, large, className }) => (
  <div
    className={cn('flex flex-col justify-center rounded-xl border border-foreground/[0.08] bg-card px-3 py-2', className)}
  >
    <span
      className={cn(
        'flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground',
        labelClassName
      )}
    >
      {dotClassName && <span className={cn('size-[7px] rounded-full', dotClassName)} aria-hidden="true" />}
      {label}
    </span>
    <span className={cn('font-serif font-bold leading-tight', large ? 'text-[23px] md:text-[26px]' : 'text-xl')}>
      {ancestor.name || 'Unnamed'}
    </span>
    {ancestor.breed && <span className="text-xs text-muted-foreground">{ancestor.breed}</span>}
    {ancestor.breeder && <span className="text-xs text-muted-foreground">{ancestor.breeder}</span>}
  </div>
);

// Chaveta que liga um progenitor aos seus dois pais
const Bracket = () => (
  <div className="relative w-[22px] shrink-0 self-stretch md:w-8" aria-hidden="true">
    <div className="absolute top-1/2 left-0 w-[10px] border-t-[1.5px] border-[#c9c0ae] md:w-4" />
    <div className="absolute top-1/4 right-0 bottom-1/4 left-[10px] rounded-l-md border-[1.5px] border-r-0 border-[#c9c0ae] md:left-4" />
  </div>
);

/**
 * Pedigree em árvore, como nos certificados dos livros de raça:
 * pais à esquerda (Sire em cima, Dam em baixo), avós à direita, ligados por chavetas.
 */
const PedigreeTree = ({ ancestors = [], editHref }) => {
  const byRelation = (relation) => ancestors.find((a) => a.relation_type === relation);

  if (!ancestors.some(hasData)) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[14px] border bg-card px-6 py-10 text-center">
        <h3 className="font-serif text-2xl font-bold">No pedigree recorded yet</h3>
        <p className="max-w-xs text-sm text-muted-foreground">Add the sire, the dam and their parents.</p>
        {editHref && (
          <Button asChild variant="outline">
            <Link to={editHref}><Plus />Add pedigree</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" data-testid="pedigree-tree">
      <div className="grid grid-cols-[138px_22px_minmax(0,1fr)] text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground md:grid-cols-[13rem_2rem_minmax(0,1fr)]">
        <span>Parents</span>
        <span />
        <span>Grandparents</span>
      </div>

      {LINES.map((line, index) => {
        const parent = byRelation(line.parent.relation);
        return (
          <React.Fragment key={line.key}>
            {index > 0 && <div className="h-px bg-border" />}
            <div className="flex items-center">
              {hasData(parent) ? (
                <AncestorCard
                  ancestor={parent}
                  label={line.parent.label}
                  labelClassName={line.parent.text}
                  dotClassName={line.parent.dot}
                  large
                  className="w-[138px] shrink-0 md:w-52"
                />
              ) : (
                <MissingCard label={line.parent.label} editHref={editHref} className="w-[138px] shrink-0 md:w-52" />
              )}

              <Bracket />

              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                {line.grandparents.map(({ relation, label }) => {
                  const grandparent = byRelation(relation);
                  return hasData(grandparent) ? (
                    <AncestorCard key={relation} ancestor={grandparent} label={label} className="min-h-[73px]" />
                  ) : (
                    <MissingCard key={relation} label={label} editHref={editHref} className="min-h-[73px]" />
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {editHref && (
        <Button asChild variant="outline" size="lg" className="mt-1 self-start max-md:w-full">
          <Link to={editHref}><Pencil />Edit pedigree</Link>
        </Button>
      )}
    </div>
  );
};

export default PedigreeTree;
