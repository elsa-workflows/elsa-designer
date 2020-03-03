# elsa-workflow-properties-editor



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type        | Default     |
| ----------- | ------------ | ----------- | ----------- | ----------- |
| `container` | --           |             | `Container` | `undefined` |
| `showModal` | `show-modal` |             | `boolean`   | `undefined` |
| `workflow`  | --           |             | `Workflow`  | `undefined` |


## Events

| Event              | Description | Type                               |
| ------------------ | ----------- | ---------------------------------- |
| `hidden`           |             | `CustomEvent<any>`                 |
| `workflow-updated` |             | `CustomEvent<WorkflowUpdatedArgs>` |


## Dependencies

### Used by

 - [elsa-designer-host](../designer-host)

### Depends on

- bs-modal

### Graph
```mermaid
graph TD;
  elsa-workflow-properties-editor --> bs-modal
  elsa-designer-host --> elsa-workflow-properties-editor
  style elsa-workflow-properties-editor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
