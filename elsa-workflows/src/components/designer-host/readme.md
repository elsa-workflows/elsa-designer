# elsa-designer-host



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute  | Description | Type                   | Default     |
| --------------------- | ---------- | ----------- | ---------------------- | ----------- |
| `activityDefinitions` | --         |             | `ActivityDefinition[]` | `undefined` |
| `container`           | --         |             | `Container`            | `undefined` |
| `workflow`            | `workflow` |             | `Workflow \| string`   | `undefined` |


## Dependencies

### Depends on

- [elsa-designer](../designer)
- [elsa-activity-picker](../activity-picker)
- [elsa-activity-editor](../activity-editor)

### Graph
```mermaid
graph TD;
  elsa-designer-host --> elsa-designer
  elsa-designer-host --> elsa-activity-picker
  elsa-designer-host --> elsa-activity-editor
  elsa-designer --> elsa-context-menu
  elsa-designer --> elsa-context-menu-item
  elsa-activity-picker --> bs-modal
  elsa-activity-editor --> bs-modal
  style elsa-designer-host fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
