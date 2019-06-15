# workflow-canvas



<!-- Auto Generated Below -->


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `add-activity`  |             | `CustomEvent<any>` |
| `edit-activity` |             | `CustomEvent<any>` |


## Methods

### `addActivity(activityDefinition: ActivityComponent) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `export(format: WorkflowFormat) => Promise<any>`



#### Returns

Type: `Promise<any>`



### `updateActivity(activity: Activity) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [wf-context-menu](..\..\context-menu)
- [wf-context-menu-item](..\..\context-menu)

### Graph
```mermaid
graph TD;
  wf-designer --> wf-context-menu
  wf-designer --> wf-context-menu-item
  style wf-designer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
