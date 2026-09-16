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

> Requires a reachable SonarQube server plus scanner CLI. Neither is installed — scans no-op until configured. AEGIS can install both via its tool setup.

### Enterprise Plan Audit

```yaml
enterprise_plan_audit:
  enabled: true
```

> Adds an architectural review step between PLAN and APPLY. On the prior attempt this caught three real defects before any code ran.

### AEGIS

```yaml
aegis:
  installed: true
  commands: /aegis:init, /aegis:audit, /aegis:transform
  tools_installed: none of 7
```

> Multi-domain codebase audit; `/aegis:transform` emits PAUL-ready remediation plans. Scanner tools (semgrep, trivy, gitleaks, checkov, syft, grype, sonar-scanner) not yet installed — audits run with reduced signal until they are.

## Preferences

```yaml
preferences:
  auto_commit: false
  verbose_output: false
```

---
*Config created: 2026-09-15*
