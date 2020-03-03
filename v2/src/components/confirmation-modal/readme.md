# elsa-confirmation-modal



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type      | Default     |
| ----------- | ------------ | ----------- | --------- | ----------- |
| `showModal` | `show-modal` |             | `boolean` | `undefined` |
| `title`     | `title`      |             | `string`  | `'Dialog'`  |


## Events

| Event       | Description | Type               |
| ----------- | ----------- | ------------------ |
| `confirmed` |             | `CustomEvent<any>` |
| `hidden`    |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [elsa-designer-host](../designer-host)

### Depends on

- bs-modal

### Graph
```mermaid
graph TD;
  elsa-confirmation-modal --> bs-modal
  elsa-designer-host --> elsa-confirmation-modal
  style elsa-confirmation-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
