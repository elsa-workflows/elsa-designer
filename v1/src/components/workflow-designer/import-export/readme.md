# wf-import-export



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type                                                                  |
| ----------------- | ----------- | --------------------------------------------------------------------- |
| `import-workflow` |             | `CustomEvent<{ activities: Activity[]; connections: Connection[]; }>` |


## Methods

### `export(designer: HTMLWfDesignerElement, formatDescriptor: WorkflowFormatDescriptor) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `import(data?: ImportedWorkflowData) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [wf-designer-host](..\designer-host)

### Graph
```mermaid
graph TD;
  wf-designer-host --> wf-import-export
  style wf-import-export fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
