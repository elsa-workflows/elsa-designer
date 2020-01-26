# BS-Components

## [Documentation](https://bs-components.github.io/)

BS-Components is a Web Component replacement for the jQuery bootstrap plugins.  It works across multiple JavaScript frameworks including Plain JS, React, Vue, and Angular.

BS-Components was written because of a frustration about how Bootstrap is implements differently in the different JavaScript Frameworks.  As web developers we know how to write HTML and the solutions for React, Angular, and Vue all put a layer between the developer and the HTML.  The main goal of BS-Components is to put the developer as close to writing plain html while retaining the functionality of the Bootstrap components.  The BS-Components are implemented the same way across the different technologies.

The BS-Components were designed to be as close to the Bootstrap jQuery plugin components as possible.  Except they have had attributes added so that framework props can be used to pass data to them and Because jQuery is not used the events that the Web Components use can be listened to using the normal JavaScript framework listeners.

Note: This project does not support browsers older than IE11.

See [documentation](https://bs-components.github.io/) for installation and getting started instructions

---

Built Using:

- [bootstrap css from v4.1.3](https://github.com/twbs/bootstrap/releases/tag/v4.1.3)
- [stencil](https://stenciljs.com/)

Tests Using:

- [testcafe](https://github.com/DevExpress/testcafe)

---

Status:

- [x] Documentation
- [x] Example projects - (Angular is still WIP)
- [x] tooltip - run tests using: `yarn test-bs-tooltip`
- [x] popover - run tests using: `yarn test-bs-popover`
- [x] button - run tests using: `yarn test-bs-button`
- [x] modal - run tests using: `yarn test-bs-modal`
- [x] dropdown - run tests using: `yarn test-bs-dropdown`
- [x] collapse - run tests using: `yarn test-bs-collapse`
- [x] alert - run tests using: `yarn test-bs-alert`
- [x] tab - run tests using: `yarn test-bs-tab`
- [x] scrollspy - run tests using: `yarn test-bs-scrollspy`
- [ ] carousel not planned currently but maybe later

For all of the other bootstrap components a web component solution is not needed because they can be done with normal html and css. Use the bootstrap webpage component documents.

Note: bootstrap forms do tend to use some javascript validation to show or hide tooltip helpers. These do not have methods that are provided by bootstrap.js so this project will not have web component counterparts.
