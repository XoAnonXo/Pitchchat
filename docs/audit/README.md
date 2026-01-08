# Pitchchat Audit Report

## Scope
- Application layers: frontend, backend, database access, background jobs, and integrations
- Coverage: authentication, authorization, data handling, configuration, dependencies, LLM usage, logging/observability, and performance/testing
- Out of scope unless noted: third-party vendor internals and infrastructure managed outside this repo

## Severity Scale
- Critical: Immediate risk of compromise, data loss, or full service disruption; fix urgently
- High: Significant security or reliability risk with likely exploitation or user impact
- Medium: Notable weakness or gap that can become a risk under common conditions
- Low: Minor issue, best-practice gap, or low-likelihood impact
- Informational: Observation with no immediate risk; track for future improvement

## Evidence Format
Each finding includes:
- Evidence: file path(s) and line-level references where applicable
- Impact: why the issue matters and who/what is affected
- Recommendation: concrete remediation steps and owners
- Status: open, accepted risk, or fixed

## Table of Contents
01. [Architecture and Route Inventory](01_architecture_inventory.md)
02. [Auth and Session Security](02_auth_session.md)
03. [Authorization and Data Access](03_authorization_data_access.md)
04. [Configuration and Secrets Handling](04_config_secrets.md)
05. [Dependency and Supply-Chain Audit](05_dependencies.md)
06. [LLM Prompt and Model Routing](06_llm_prompts.md)
07. [Privacy and Data Handling](07_privacy_compliance.md)
08. [Error Handling and Observability](08_logging_errors.md)
09. [Performance and Testing Summary](09_performance_testing.md)
