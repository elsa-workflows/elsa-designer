export interface ActivityDefinition {
  type: string
  displayName: string
  description: string
  category: string
  icon?: string
  outcomes: Array<string>
}
