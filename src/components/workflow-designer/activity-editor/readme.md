# wf-activity-editor



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description | Type       | Default     |
| ---------- | --------- | ----------- | ---------- | ----------- |
| `activity` | --        |             | `Activity` | `undefined` |
| `show`     | `show`    |             | `boolean`  | `undefined` |


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `update-activity` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [wf-activity-renderer](..\activity-renderer)

### Graph
```mermaid
graph TD;
  wf-activity-editor --> wf-activity-renderer
  wf-activity-renderer --> wf-field-editor-expression
  wf-activity-renderer --> wf-field-editor-text
  style wf-activity-editor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
