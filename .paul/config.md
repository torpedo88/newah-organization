# Project Config

**Project:** newah-organization
**Created:** 2026-09-15

## Project Settings

```yaml
project:
  name: newah-organization
  version: 0.0.0
```

## Integrations

### SonarQube

```yaml
sonarqube:
  enabled: true
  project_key: newah-organization
```

> Requires a reachable SonarQube server and its MCP server. Not verified at init — scans will no-op until the server is configured.

### Enterprise Plan Audit

```yaml
enterprise_plan_audit:
  enabled: true
```

> Adds an architectural review step between PLAN and APPLY.

## Preferences

```yaml
preferences:
  auto_commit: false
  verbose_output: false
```

---
*Config created: 2026-09-15*
