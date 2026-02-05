# Apicurio Common UI Components
This library contains some React + Patternfly UI components that are used across multiple Apicurio
UI projects.

## Requirements

This library requires the following peer dependencies:

- React 19.x
  - react ~19
  - react-dom ~19
- React Router 7.x
  - react-router ~7
- PatternFly 6.x
  - @patternfly/patternfly ~6
  - @patternfly/react-core ~6
  - @patternfly/react-icons ~6
  - @patternfly/react-table ~6
- luxon ~3
- oidc-client-ts ~3

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

## Migrating to v4.0.0 (React 19 + React Router 7)

### Prerequisites
- Your application must be using PatternFly v6
- Your application must be using React 19.x
- Your application must be using React Router 7.x

If you are still on earlier versions, follow the appropriate upgrade guides first:
- [PatternFly upgrade guide](https://www.patternfly.org/get-started/upgrade/)
- [React 19 upgrade guide](https://react.dev/blog/2024/12/05/react-19)
- [React Router v7 upgrade guide](https://reactrouter.com/upgrading/v6)

### Steps
1. Update your application to React 19, React Router 7, and PatternFly v6
2. Update this library to v4.0.0:
   ```bash
   npm install @apicurio/common-ui-components@4.0.0
   ```
3. No code changes required in your application - all component APIs remain compatible

### What Changed
- Updated to React 19.x
- Updated to React Router 7.x
- All peer dependencies updated to latest major versions
- Visual styling matches PatternFly v6 design system
- Filter chips use Label component (visually similar, no API changes)

### Known Issues
- Modal components use the deprecated Modal from PatternFly v6. This will be addressed in a future
  release.