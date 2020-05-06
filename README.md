[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://stenciljs.com/)

# Elsa Workflow Designer

[![npm (scoped)](https://img.shields.io/npm/v/@elsa-workflows/elsa-workflow-designer.svg)](https://www.npmjs.com/package/@elsa-workflows/elsa-workflow-designer)

Elsa is a visual programming tool that allows you to implement parts or all of your application with workflows.
Elsa Designer is a standalone client-side web component that you can embed in your own application.

![html-based workflow designer](/doc/workflow-sample-2.png)

## Installing this component

### Script tag

- Put a script tag similar to this `<script src='https://unpkg.com/@elsa-workflows/elsa-workflow-designer@0.0.10/dist/elsa-workflow-designer.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules
- Run `npm install @elsa-workflows/elsa-workflow-designer --save`
- Put a script tag similar to this `<script src='node_modules/@elsa-workflows/elsa-workflow-designer/dist/elsa-workflow-designer.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### In a stencil-starter app
- Run `npm install @elsa-workflows/elsa-workflow-designer --save`
- Add an import to the npm packages `import @elsa-workflows/elsa-workflow-designer;`
- Then you can use the element anywhere in your template, JSX, html etc

## Using this component

To use the component, add the following HTML tag:

```html
<wf-designer-host></wf-designer-host>
```

Out of the box, the designer registers a default set of activities that are provided from a set of plugins.
To add custom activities, you need to define them as part of a custom plugin.

## Integration with other Frontend framework

### Angular(2+)
1. Add Elsa Designer pkg CDN on `index.html`
```HTML
<script
    type="module"
    src="https://unpkg.com/@elsa-workflows/elsa-workflow-designer@0.0.61/dist/elsa-workflow-designer/elsa-workflow-designer.esm.js"
></script>
<script
    nomodule=""
    src="https://unpkg.com/@elsa-workflows/elsa-workflow-designer@0.0.61/dist/elsa-workflow-designer/elsa-workflow-designer.js"
></script>
```

2. On `app.module.ts`, add `CUSTOM_ELEMENTS_SCHEMA`
```Typescript
@NgModule({
  //whatever you have on app module goes here... 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

3. Add `<ng-wf-designer-host></ng-wf-designer-host>` to the HTML
```HTML
<wf-designer-host
    id="designerHost"
    canvas-height="300vh"
    [attr.data-activity-definitions]="activityDefinition"
    [attr.data-workflow]="workflowModel">
</wf-designer-host>
```
> See full example [here](https://codesandbox.io/s/angular-elsa-designer-dkb4t?file=/src/app/app.component.html)

### Custom Activities

TODO: Describe how to register custom activity definitions using JavaScript & JSON.