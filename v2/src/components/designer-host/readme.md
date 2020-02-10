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
- [elsa-activity-picker](../activity-picker)
- [elsa-activity-editor](../activity-editor)
- [elsa-workflow-picker](../workflow-picker)
- [elsa-literal-expression](../literal-expression)
- [elsa-javascript-expression](../javascript-expression)
- [elsa-liquid-expression](../liquid-expression)

### Graph
```mermaid
graph TD;
  elsa-designer-host --> elsa-designer
  elsa-designer-host --> elsa-activity-picker
  elsa-designer-host --> elsa-activity-editor
  elsa-designer-host --> elsa-workflow-picker
  elsa-designer-host --> elsa-literal-expression
  elsa-designer-host --> elsa-javascript-expression
  elsa-designer-host --> elsa-liquid-expression
  elsa-designer --> elsa-context-menu
  elsa-designer --> elsa-context-menu-item
  elsa-activity-picker --> bs-modal
  elsa-activity-editor --> bs-modal
  elsa-workflow-picker --> bs-dropdown
  elsa-workflow-picker --> bs-modal
  style elsa-designer-host fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
