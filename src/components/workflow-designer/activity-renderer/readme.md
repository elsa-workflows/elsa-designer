# wf-activity-renderer



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute      | Description | Type                                                     | Default                      |
| -------------------- | -------------- | ----------- | -------------------------------------------------------- | ---------------------------- |
| `activity`           | --             |             | `Activity`                                               | `undefined`                  |
| `activityDefinition` | --             |             | `ActivityDefinition`                                     | `undefined`                  |
| `displayMode`        | `display-mode` |             | `ActivityDisplayMode.Design \| ActivityDisplayMode.Edit` | `ActivityDisplayMode.Design` |


## Methods

### `updateEditor(formData: FormData) => Promise<Activity>`



#### Returns

Type: `Promise<Activity>`




## Dependencies

### Used by

 - [wf-activity-editor](..\activity-editor)
 - [wf-designer](..\designer)

### Graph
```mermaid
graph TD;
  wf-activity-editor --> wf-activity-renderer
  wf-designer --> wf-activity-renderer
  style wf-activity-renderer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
