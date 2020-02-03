# wf-activity-editor



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute | Description | Type                   | Default     |
| --------------------- | --------- | ----------- | ---------------------- | ----------- |
| `activity`            | --        |             | `Activity`             | `undefined` |
| `activityDefinitions` | --        |             | `ActivityDefinition[]` | `[]`        |
| `show`                | `show`    |             | `boolean`              | `undefined` |


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `update-activity` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [wf-designer-host](..\designer-host)

### Depends on

- [wf-activity-renderer](..\activity-renderer)

### Graph
```mermaid
graph TD;
  wf-activity-editor --> wf-activity-renderer
  wf-designer-host --> wf-activity-editor
  style wf-activity-editor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
