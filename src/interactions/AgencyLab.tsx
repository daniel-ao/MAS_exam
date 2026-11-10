import React, { useState } from 'react';
import { KripkeLab } from './KripkeLab';
import { NeighborhoodLab } from './NeighborhoodLab';
import { Pill } from './LabFrame';

/** STIT choice cells (relational, S5) next to neighborhood semantics (BIAT / Eᵈ / TD Ex. 4). */
export const AgencyLab: React.FC<{ initialPreset?: string }> = ({ initialPreset }) => {
  const [tab, setTab] = useState<'stit' | 'nbhd'>(initialPreset === 'stit' || !initialPreset ? 'stit' : 'nbhd');
  return (
    <div>
      <div className="flex justify-center gap-2 mt-4">
        <Pill active={tab === 'stit'} onClick={() => setTab('stit')}>STIT choice cells (Eᵢ, S5)</Pill>
        <Pill active={tab === 'nbhd'} onClick={() => setTab('nbhd')}>Neighborhoods (BAᵢ, Eᵢᵈ, □)</Pill>
      </div>
      {tab === 'stit' ? <KripkeLab initialPreset="stit" /> : <NeighborhoodLab initialPreset={initialPreset === 'stit' ? undefined : initialPreset} />}
    </div>
  );
};
