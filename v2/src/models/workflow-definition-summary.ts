export interface WorkflowDefinitionSummary {
  id: string
  definitionId: string
  name: string
  description: string
  version: number
  isLatest: boolean
  isPublished: boolean
  isSingleton: boolean
  isDisabled: boolean
}
