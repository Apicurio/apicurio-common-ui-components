# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-01-29

### Changed
- Upgraded PatternFly from v5 to v6
- **BREAKING:** Minimum required PatternFly version is now 6.0.0
- Migrated Chip/ChipGroup to Label/LabelGroup in filtering components
- Migrated Text/TextContent to Content component in modals
- Refactored EmptyState components to use new v6 API
- Updated Modal components to use deprecated import path (will be updated in future release)

### Technical Details
- Updated @patternfly/patternfly from ~5 to ~6
- Updated @patternfly/react-core from ~5 to ~6
- Updated @patternfly/react-icons from ~5 to ~6
- Updated @patternfly/react-table from ~5 to ~6

### Migration Notes
Applications using this library must also upgrade to PatternFly v6. The API of this library's
exported components remains backward compatible, but the visual styling will match PatternFly v6's
design system.

## [2.1.1] - 2026-01-15

Previous version using PatternFly v5
