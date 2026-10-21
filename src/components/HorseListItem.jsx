import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

/**
 * Lista de cavalos partilhada por My Horses e Received Horses:
 * lista compacta no telemóvel, grelha de cartões com fotografia no computador.
 */
export const HorseList = ({ children, className }) => (
  <ul
    className={cn(
      'divide-y divide-[#ece7dd] overflow-hidden rounded-[14px] border bg-card md:grid md:grid-cols-3 md:gap-5 md:divide-y-0 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent lg:grid-cols-4',
      className
    )}
  >
    {children}
  </ul>
);

/**
 * Um cavalo da lista.
 * - eyebrow: linha pequena em cor de couro por cima do nome (ex.: "No. 01", "From Ana")
 * - eyebrowMobileOnly: esconde o eyebrow no computador (quando já está no overlay)
 * - overlay: etiqueta sobre a fotografia, só no computador (ex.: "No. 01")
 * - notice: aviso por baixo da informação (ex.: screenshot pendente)
 * - to: destino ao tocar; sem `to` o cartão não é clicável
 * - dimmed: fotografia desfocada (ex.: acesso em pausa)
 */
const HorseListItem = ({
  testId,
  to,
  name,
  photo,
  eyebrow,
  eyebrowMobileOnly = false,
  meta,
  overlay,
  notice,
  dimmed = false,
}) => {
  const body = (
    <>
      <div className="relative size-[62px] shrink-0 overflow-hidden rounded-[10px] bg-[#e3ded3] md:aspect-[4/3] md:size-auto md:w-full md:rounded-none">
        {photo ? (
          <img src={photo} alt="" className={cn('size-full object-cover', dimmed && 'scale-110 blur-md')} />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              'flex size-full items-center justify-center font-serif text-3xl font-bold text-[#5c5f58] md:text-5xl',
              dimmed && 'blur-sm'
            )}
          >
            {name?.[0]?.toUpperCase()}
          </span>
        )}
        {overlay && (
          <Badge variant="overlay" className="absolute top-3 left-3 hidden text-[10.5px] md:inline-flex">
            {overlay}
          </Badge>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col md:px-4 md:pt-3 md:pb-4">
        {eyebrow && (
          <span
            className={cn(
              'truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-leather',
              eyebrowMobileOnly && 'md:hidden'
            )}
          >
            {eyebrow}
          </span>
        )}
        <span className="truncate font-serif text-[22px] font-bold leading-tight md:text-[26px]">{name}</span>
        {meta && <span className="truncate text-[12.5px] text-muted-foreground md:text-[13px]">{meta}</span>}
        {notice}
      </div>

      {to && <ChevronRight className="size-4 shrink-0 text-muted-foreground/70 md:hidden" aria-hidden="true" />}
    </>
  );

  const layout =
    'flex items-center gap-3.5 px-3.5 py-3 md:h-full md:flex-col md:items-stretch md:gap-0 md:overflow-hidden md:rounded-[14px] md:border md:bg-card md:p-0';

  return (
    <li data-testid={testId}>
      {to ? (
        <Link to={to} className={cn(layout, 'hover:bg-accent/60 md:transition-shadow md:hover:bg-card md:hover:shadow-md')}>
          {body}
        </Link>
      ) : (
        <div className={layout}>{body}</div>
      )}
    </li>
  );
};

export default HorseListItem;
