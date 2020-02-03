# workflow-canvas



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute       | Description | Type                                                     | Default                                         |
| --------------------- | --------------- | ----------- | -------------------------------------------------------- | ----------------------------------------------- |
| `activityDefinitions` | --              |             | `ActivityDefinition[]`                                   | `[]`                                            |
| `canvasHeight`        | `canvas-height` |             | `string`                                                 | `undefined`                                     |
| `readonly`            | `readonly`      |             | `boolean`                                                | `undefined`                                     |
| `workflow`            | --              |             | `{ activities: Activity[]; connections: Connection[]; }` | `{     activities: [],     connections: []   }` |


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `add-activity`    |             | `CustomEvent<any>` |
| `edit-activity`   |             | `CustomEvent<any>` |
| `workflowChanged` |             | `CustomEvent<any>` |


## Methods

### `addActivity(activityDefinition: ActivityDefinition) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `getWorkflow() => Promise<any>`



#### Returns

Type: `Promise<any>`



### `newWorkflow() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `updateActivity(activity: Activity) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [wf-designer-host](..\designer-host)

### Depends on

- [wf-context-menu](..\..\context-menu)
- [wf-context-menu-item](..\..\context-menu)
- [wf-activity-renderer](..\activity-renderer)

### Graph
```mermaid
graph TD;
  wf-designer --> wf-context-menu
  wf-designer --> wf-context-menu-item
  wf-designer --> wf-activity-renderer
  wf-designer-host --> wf-designer
  style wf-designer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
