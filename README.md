[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://stenciljs.com/)

# Elsa Workflow Designer

[![npm (scoped)](https://img.shields.io/npm/v/@elsa-workflows/elsa-workflow-designer.svg)](https://www.npmjs.com/package/@elsa-workflows/elsa-workflow-designer)

Elsa is a visual programming tool that allows you to implement parts or all of your application with workflows.
Elsa Designer is a standalone client-side web component that you can embed in your own application.

![html-based workflow designer](/doc/workflow-sample-1.png)

## Installing this component

### Script tag

- Put a script tag similar to this `<script src='https://unpkg.com/@elsa-workflows/elsa-workflow-designer@0.0.6/dist/elsa-workflow-designer.js'></script>` in the head of your index.html
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

Elsa Workflow Designer provides the following reusable web components:

- Designer
- Designer Host
- Activity Picker
- Activity Library
- Activity Editor

These components work together to provide a workflow designer experience that enable you to declare what activities are available from the activity picker, and edit activities on the designer.
Example:

```html
<!-- Designer Host -->
<wf-designer-host>

  <!-- Activity Library -->
  <wf-activity-library>
    <wf-write-line></wf-write-line>
    <wf-read-line></wf-read-line>
    <wf-log></wf-log>
    <wf-set-variable></wf-set-variable>
  </wf-activity-library>

  <!-- Activity Editor -->
  <wf-activity-editor-modal></wf-activity-editor-modal>

  <div id="header" class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-dark border-bottom shadow-sm">
    <h5 class="my-0 mr-md-auto font-weight-normal">Workflow Designer</h5>

    <!-- Activity Picker -->
    <wf-activity-picker></wf-activity-picker>
  </div>

  <!-- Designer -->
  <wf-designer id="workflowDesigner">
  </wf-designer>
</wf-designer-host>
```

### Designer

The Designer component is responsible for rendering the workflow. It exposes methods to set and get JSON/YAML values that represent a workflow definition.
Another method of initializing the designer with a workflow definition is by declaring the activities and their connections using the `<wf-activity />` and `<wf-connection />` elements.

Example:

```html
<wf-designer id="workflowDesigner">
  <wf-activity activity-id="1" left="50" top="50" type="WriteLine"></wf-activity>
  <wf-activity activity-id="2" left="430" top="190" type="ReadLine"></wf-activity>
  <wf-activity activity-id="3" left="280" top="490" type="Log"></wf-activity>
  <wf-connection source-id="2" destination-id="3" outcome="next"></wf-connection>
  <wf-connection source-id="1" destination-id="2" outcome="next"></wf-connection>
</wf-designer>
```

The activity elements use the `type` attribute to refer to an activity type as declared in the **Activity Library**.

### Designer Host

The Designer Host component does not render anything itself; instead, it renders exactly whatever you put in between its HTML tags `<wf-designer-host></wf-designer-host>`.
The purpose of this component is to conveniently  hook up events from various components such as the designer and activity picker components. Using the Designer Host component is entirely optional if you prefer to do te event wiring yourself.

### Activity Library

The Activity Library component allows you to specify which activities will be available from the Activity Picker component. You can declare activities that are shipped with this package as well as your own custom activities. See **Custom Activities** for more details.

Example:

```html
<!-- Activity Library -->
  <wf-activity-library id="activityLibrary">
    <wf-write-line></wf-write-line>
    <wf-read-line></wf-read-line>
    <wf-log></wf-log>
    <wf-set-variable></wf-set-variable>
  </wf-activity-library>
```

### Activity Picker

The Activity Picker component renders a Bootstrap Modal dialog that lists all available activities that can be added to the design surface. It exposes `show()` and `hide()` methods to show and ode the modal programmatically. However, this is not necessary when using the Designer Host.

Example:

```html
<wf-activity-picker></wf-activity-picker>
```

### Activity Editor

The Activity Editor component renders a Bootstrap Modal dialog that displays edit forms for a given activity. When using Designer Host, the activity editor is displayed whenever you double-click an activity on the designer,

```html
<wf-activity-editor-modal></wf-activity-editor-modal>
```

## Custom Activities

TODO: Document how to define & develop custom activities.