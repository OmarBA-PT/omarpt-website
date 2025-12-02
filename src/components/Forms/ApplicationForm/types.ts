// Shared types for ApplicationForm components

export type ApplicationFormData = Record<string, any>;

export interface GroupState {
  [sectionIndex: number]: {
    [groupIndex: number]: {
      isExpanded: boolean;
      isVisited: boolean;
    };
  };
}

export type FormStatus = 'idle' | 'success' | 'error';

export interface GroupRefs {
  [key: string]: HTMLDivElement | null;
}
