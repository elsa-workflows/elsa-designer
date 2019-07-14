import { AddActivityDefinition } from './activity-definition-actions';
import { AddActivity } from './workflow-actions';

export * from './activity-definition-actions';
export * from './workflow-actions';

export type Action = (AddActivityDefinition | AddActivity);
