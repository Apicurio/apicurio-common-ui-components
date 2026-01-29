# Apicurio Common UI Components
This library contains some React + Patternfly UI components that are used across multiple Apicurio
UI projects.

## Requirements

This library requires the following peer dependencies:

- React 18.x
- PatternFly 6.x
  - @patternfly/patternfly ~6
  - @patternfly/react-core ~6
  - @patternfly/react-icons ~6
  - @patternfly/react-table ~6
- Additional peer dependencies listed in package.json

## Building
Use standard Node/NPM tooling to build the code in this library.

```
npm install
npm run lint
npm run build
```

## Developing
This library includes a demo application that showcases the components it provides, and allows easy
iterative development.

```
npm install
npm run dev
```

Once running, open your browser to the URL indicated by the output of `npm run dev`.  You will
see the showcase application.

## Migrating to v3.0.0 (PatternFly v6)

### Prerequisites
Your application must be using PatternFly v6. If you are still on PatternFly v5, follow the
[official PatternFly upgrade guide](https://www.patternfly.org/get-started/upgrade/) first.

### Steps
1. Update your application to PatternFly v6
2. Update this library to v3.0.0:
   ```bash
   npm install @apicurio/common-ui-components@3.0.0
   ```
3. No code changes required in your application - all component APIs remain compatible

### What Changed
- Visual styling now matches PatternFly v6 design system
- Filter chips now use Label component (visually similar, no API changes)
- Modal components temporarily use deprecated PatternFly imports (will be updated in future)

### Known Issues
- Modal components use the deprecated Modal from PatternFly v6. This will be addressed in a future
  release.