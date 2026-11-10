import { Course } from '../types';
import { course3ModulesA } from './course3a';
import { course3ModulesB } from './course3b';

export const course3Data: Course = {
  id: 'course-3',
  title: 'Modal Logic, Model Checking & KBE Manipulation',
  code: 'SMEIA305 · ECUE Multiagent systems',
  subtitle: 'Chapter 3: epistemic (S5) and doxastic (KD45) logics, correspondence theory, PDL/DEL/STIT/BIAT, neighborhoods, the KBE theory of manipulation, and the TD',
  instructor: 'Christopher Leturc',
  ects: 0,
  totalPages: 111,
  modules: [...course3ModulesA, ...course3ModulesB]
};
