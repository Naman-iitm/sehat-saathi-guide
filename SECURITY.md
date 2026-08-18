# Security Policy

## Overview

Sehat Saathi is an open-source healthcare information and digital wellness platform. Because the project may process health-related information, security and privacy are treated as important engineering concerns.

This document explains how to report security vulnerabilities responsibly.

## Supported Versions

Security fixes are applied to the actively maintained `main` branch and the latest stable release.

| Version               | Supported      |
| --------------------- | -------------- |
| `main`                | ✅              |
| Latest stable release | ✅              |
| Older releases        | ⚠️ Best effort |
| Unmaintained releases | ❌              |

## Reporting a Vulnerability

Please do **not** report security vulnerabilities through public GitHub Issues, Pull Requests, Discussions, or other public channels.

If you discover a security vulnerability, use GitHub's private vulnerability reporting feature for this repository, if available.

When reporting a vulnerability, please include:

* A clear description of the vulnerability
* Steps required to reproduce it
* The affected component or file
* Potential security impact
* Relevant logs or screenshots, where safe to provide
* A suggested mitigation, if known

Please avoid including real user health information, credentials, API keys, tokens, or other sensitive information in your report.

## Examples of Security Issues

Security issues may include:

* Authentication or authorization bypasses
* Exposure of private user information
* Insecure API endpoints
* Credential or API-key exposure
* Injection vulnerabilities
* Cross-site scripting (XSS)
* Insecure file uploads
* Improper handling of health-related information
* Database access vulnerabilities
* Insecure WebSocket or real-time communication
* Sensitive information accidentally committed to the repository

## Responsible Disclosure

Please allow maintainers reasonable time to investigate and address a vulnerability before publicly disclosing technical details.

Security reports will be investigated based on severity, reproducibility, and potential impact.

## Sensitive Data

Do not commit:

* API keys
* Passwords
* JWT secrets
* Database credentials
* OAuth secrets
* Private certificates
* Production environment variables
* Real patient or user health information

Use environment variables and the provided `.env.example` file for local configuration.

## Important Medical Disclaimer

Sehat Saathi is a technology and educational project. Information or recommendations provided by the application should not be treated as a substitute for professional medical diagnosis, treatment, or emergency medical care.

## Contact

For general project questions, please use GitHub Issues or Discussions.

For security vulnerabilities, use GitHub's private security reporting mechanism rather than public communication channels.
