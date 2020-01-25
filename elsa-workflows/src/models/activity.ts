export interface Activity {
  id: string
  type: string
  name?: string
  displayName: string
  state: any
  left: number;
  top: number
  outcomes: Array<string>
}
