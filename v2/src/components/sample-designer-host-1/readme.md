# elsa-designer-host



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type     | Default     |
| ----------- | ------------ | ----------- | -------- | ----------- |
| `serverUrl` | `server-url` |             | `string` | `undefined` |


## Methods

### `addActivityDriver(constructor: new (...args: any[]) => ActivityDriver) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `addFieldDriver(constructor: new (...args: any[]) => FieldDriver) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `configureServices(action: (container: Container) => void) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [elsa-designer](../designer)
- [elsa-notifications](../notifications)
- [elsa-activity-picker](../activity-picker)
- [elsa-activity-editor](../activity-editor)
- [elsa-workflow-properties-editor](../workflow-properties-editor)
- [elsa-workflow-definition-picker](../workflow-definition-picker)
- [elsa-workflow-instance-picker](../workflow-instance-picker)
- [elsa-confirmation-modal](../confirmation-modal)
- [elsa-context-menu](../context-menu)
- bs-dropdown
- [elsa-execution-log](../execution-log)

### Graph
```mermaid
graph TD;
  elsa-designer-host --> elsa-designer
  elsa-designer-host --> elsa-notifications
  elsa-designer-host --> elsa-activity-picker
  elsa-designer-host --> elsa-activity-editor
  elsa-designer-host --> elsa-workflow-properties-editor
  elsa-designer-host --> elsa-workflow-definition-picker
  elsa-designer-host --> elsa-workflow-instance-picker
  elsa-designer-host --> elsa-confirmation-modal
  elsa-designer-host --> elsa-context-menu
  elsa-designer-host --> bs-dropdown
  elsa-designer-host --> elsa-execution-log
  elsa-notifications --> bs-toast
  elsa-activity-picker --> bs-modal
  elsa-activity-editor --> bs-modal
  elsa-workflow-properties-editor --> bs-modal
  elsa-workflow-definition-picker --> bs-modal
  elsa-workflow-instance-picker --> bs-modal
  elsa-confirmation-modal --> bs-modal
  style elsa-designer-host fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
