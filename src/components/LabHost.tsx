import React from 'react';
import { SubsumptionLab } from '../interactions/SubsumptionLab';
import { FlockingLab } from '../interactions/FlockingLab';
import { BdiLab } from '../interactions/BdiLab';
import { EnvironmentLab } from '../interactions/EnvironmentLab';
import { OrganizationLab } from '../interactions/OrganizationLab';
import { ReputationLab } from '../interactions/ReputationLab';
import { VotingLab } from '../interactions/VotingLab';
import { GameLab } from '../interactions/GameLab';
import { KripkeLab } from '../interactions/KripkeLab';
import { ProofLab } from '../interactions/ProofLab';
import { AgencyLab } from '../interactions/AgencyLab';
import { ManipulationLab } from '../interactions/ManipulationLab';

interface LabHostProps {
  /** Lab id, optionally with a preset: "kripke-lab#td1". */
  labId: string;
}

export const LabHost: React.FC<LabHostProps> = ({ labId }) => {
  const [id, preset] = labId.split('#');
  switch (id) {
    case 'subsumption-lab':
      return <SubsumptionLab />;
    case 'flocking-lab':
      return <FlockingLab />;
    case 'bdi-lab':
      return <BdiLab />;
    case 'environment-lab':
      return <EnvironmentLab />;
    case 'organization-lab':
      return <OrganizationLab />;
    case 'reputation-lab':
      return <ReputationLab />;
    case 'voting-lab':
      return <VotingLab />;
    case 'game-lab':
      return <GameLab key={labId} initialPreset={preset} />;
    case 'kripke-lab':
      return <KripkeLab key={labId} initialPreset={preset} />;
    case 'proof-lab':
      return <ProofLab />;
    case 'agency-lab':
      return <AgencyLab key={labId} initialPreset={preset} />;
    case 'manipulation-lab':
      return <ManipulationLab />;
    default:
      return null;
  }
};
