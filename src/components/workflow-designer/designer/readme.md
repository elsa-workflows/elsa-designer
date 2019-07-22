# workflow-canvas



<!-- Auto Generated Below -->


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `add-activity`  |             | `CustomEvent<any>` |
| `edit-activity` |             | `CustomEvent<any>` |


## Methods

### `addActivity(activityDefinition: ActivityDefinition) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `getWorkflow() => Promise<{ activities: Activity[]; connections: import("C:/Projects/Elsa/elsa-designer-html/src/models/connection").Connection[]; }>`



#### Returns

Type: `Promise<{ activities: Activity[]; connections: Connection[]; }>`



### `loadWorkflow(workflow: Workflow) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `newWorkflow() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `updateActivity(activity: Activity) => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
