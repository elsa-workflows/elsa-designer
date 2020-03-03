# elsa-workflow-instance-picker



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type                                                             | Default     |
| ----------- | ------------ | ----------- | ---------------------------------------------------------------- | ----------- |
| `container` | --           |             | `Container`                                                      | `undefined` |
| `showModal` | `show-modal` |             | `boolean`                                                        | `undefined` |
| `status`    | `status`     |             | `"COMPLETED" \| "FAULTED" \| "IDLE" \| "RUNNING" \| "SUSPENDED"` | `undefined` |
| `workflow`  | --           |             | `Workflow`                                                       | `undefined` |


## Events

| Event                        | Description | Type                                        |
| ---------------------------- | ----------- | ------------------------------------------- |
| `hidden`                     |             | `CustomEvent<any>`                          |
| `workflow-instance-selected` |             | `CustomEvent<WorkflowInstanceSelectedArgs>` |


## Dependencies

### Used by

 - [elsa-designer-host](../designer-host)

### Depends on

- bs-modal

### Graph
```mermaid
graph TD;
  elsa-workflow-instance-picker --> bs-modal
  elsa-designer-host --> elsa-workflow-instance-picker
  style elsa-workflow-instance-picker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
