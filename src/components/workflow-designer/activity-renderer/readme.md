# wf-activity-renderer



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute      | Description | Type                                                     | Default                      |
| -------------------- | -------------- | ----------- | -------------------------------------------------------- | ---------------------------- |
| `activity`           | --             |             | `Activity`                                               | `undefined`                  |
| `activityDefinition` | --             |             | `ActivityDefinition`                                     | `undefined`                  |
| `displayMode`        | `display-mode` |             | `ActivityDisplayMode.Design \| ActivityDisplayMode.Edit` | `ActivityDisplayMode.Design` |


## Dependencies

### Used by

 - [wf-activity-editor](..\activity-editor)
 - [wf-designer](..\designer)

### Depends on

- [wf-field-editor-expression](..\..\field-editors\expression)
- [wf-field-editor-text](..\..\field-editors\text)

### Graph
```mermaid
graph TD;
  wf-activity-renderer --> wf-field-editor-expression
  wf-activity-renderer --> wf-field-editor-text
  wf-activity-editor --> wf-activity-renderer
  wf-designer --> wf-activity-renderer
  style wf-activity-renderer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
