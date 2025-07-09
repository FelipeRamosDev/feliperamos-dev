# GitHub Actions Workflows Documentation

This document outlines all the GitHub Actions workflows and configurations created for the feliperamos-dev project.

## 📁 Directory Structure

```
.github/
├── workflows/
│   ├── ci.yml                     # Main CI/CD Pipeline
│   ├── dependabot.yml             # Dependabot Auto-merge
│   ├── maintenance.yml            # Maintenance Tasks
│   ├── release.yml                # Release Management
│   └── health-check.yml           # Production Health Check
├── ISSUE_TEMPLATE/
│   ├── bug_report.yml             # Bug Report Template
│   ├── feature_request.yml        # Feature Request Template
│   └── performance_issue.yml      # Performance Issue Template
├── pull_request_template.md       # Pull Request Template
├── dependabot.yml                 # Dependabot Configuration
└── SECURITY.md                    # Security Policy
```

## 🔧 Workflow Details

### 1. CI/CD Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` and `develop` branches
- Pull requests to `main` and `develop`
- Manual trigger (`workflow_dispatch`)
- Weekly scheduled run (Monday 2 AM UTC)

**Jobs:**
- **Test**: Runs tests on Node.js 18.x & 20.x with coverage
- **Build**: Builds application and uploads artifacts
- **Type Check**: TypeScript type validation
- **Security**: npm audit + CodeQL analysis
- **Deploy Preview**: Vercel deployment for PRs
- **Deploy Production**: Vercel production deployment on main
- **Lighthouse**: Performance monitoring for PRs
- **Dependency Review**: Security review for dependencies

**Key Features:**
- Multi-node version testing
- Codecov integration
- Bundle size monitoring
- PR comments with deployment status
- Lighthouse performance checks

### 2. Maintenance Tasks (`maintenance.yml`)

**Triggers:**
- Weekly scheduled run (Monday 1 AM UTC)
- Manual trigger

**Jobs:**
- **Update Dependencies**: Weekly dependency updates via PR
- **Cleanup Artifacts**: Removes old build artifacts (14+ days)
- **Security Scan**: Enhanced security audit with reporting
- **Performance Monitoring**: Bundle size analysis and monitoring

### 3. Release Management (`release.yml`)

**Triggers:**
- Push to version tags (`v*`)
- Manual trigger with version input

**Jobs:**
- **Create Release**: Generates GitHub release with changelog
- **Deploy Release**: Production deployment after release
- **Post Release**: Lighthouse audit and summary generation

### 4. Health Check (`health-check.yml`)

**Triggers:**
- Every 6 hours
- Manual trigger

**Jobs:**
- **Health Check**: Comprehensive production monitoring
  - Basic connectivity test
  - Performance validation
  - API endpoint checks
  - SSL certificate validation
  - Mobile responsiveness test
  - Automatic issue creation on failure

### 5. Dependabot Auto-merge (`dependabot.yml`)

**Features:**
- Auto-merge patch updates
- Auto-merge minor dev dependency updates
- Manual review for major updates

## 📋 Issue Templates

### Bug Report Template
- Structured bug reporting with environment details
- Screenshots and reproduction steps
- Browser and device information
- Console error collection

### Feature Request Template
- Problem statement and proposed solution
- Priority levels and categorization
- Use case descriptions
- Acceptance criteria

### Performance Issue Template
- Performance impact assessment
- Measurement data collection
- Environment and network details
- Specialized for performance-related issues

## 🔒 Security Configuration

### Security Policy (`SECURITY.md`)
- Responsible disclosure guidelines
- Reporting procedures
- Response timelines
- Security best practices

### CodeQL Analysis
- Automated code security scanning
- Security-extended queries
- Integrated with CI pipeline

## 📊 Monitoring & Reporting

### Lighthouse CI
- Performance monitoring on every PR
- Configurable thresholds for metrics
- Temporary public storage for reports
- GitHub integration for PR comments

### Coverage Reporting
- Codecov integration
- Coverage reports on every test run
- Fail-safe configuration

### Bundle Analysis
- Bundle size monitoring
- Performance impact tracking
- Artifact generation for analysis

## 🚀 Deployment Strategy

### Preview Deployments
- Automatic Vercel deployment for PRs
- PR comments with deployment status
- Lighthouse testing on preview deployments

### Production Deployments
- Triggered on main branch pushes
- Dependency on all CI checks
- Post-deployment notifications

## 🔧 Configuration Files

### Dependabot Configuration
- Weekly dependency updates
- Grouped dependency updates
- Reviewer assignment
- Commit message conventions

### Lighthouse Configuration
- Multi-URL testing (main, /en, /pt)
- Performance thresholds
- Accessibility requirements
- SEO validation

## 📈 Best Practices Implemented

### Security
- Secret management via GitHub secrets
- Dependency security scanning
- Automated vulnerability updates
- Code security analysis

### Performance
- Bundle size monitoring
- Lighthouse performance checks
- Optimal build configurations
- Artifact cleanup automation

### Quality Assurance
- Multi-node version testing
- Comprehensive test coverage
- TypeScript type checking
- ESLint validation

### DevOps
- Automated dependency management
- Health monitoring
- Release automation
- Documentation templates

## 🎯 Key Features

1. **Comprehensive Testing**: Multiple Node.js versions, full test coverage
2. **Security Focus**: Automated security scanning and vulnerability management
3. **Performance Monitoring**: Lighthouse CI and bundle analysis
4. **Automated Deployments**: Preview and production deployment automation
5. **Dependency Management**: Automated updates with security prioritization
6. **Health Monitoring**: 24/7 production health checks
7. **Documentation**: Structured issue and PR templates
8. **Maintenance**: Automated cleanup and maintenance tasks

## 📱 Environment Variables Required

Set these secrets in your GitHub repository:

```
CODECOV_TOKEN          # For coverage reporting
VERCEL_TOKEN          # For Vercel deployments
VERCEL_ORG_ID         # Vercel organization ID
VERCEL_PROJECT_ID     # Vercel project ID
LHCI_GITHUB_APP_TOKEN # For Lighthouse CI
```

## 🔍 Workflow Monitoring

All workflows include:
- Error handling and recovery
- Detailed logging
- Artifact generation
- Status reporting
- Notification systems

This comprehensive CI/CD setup ensures code quality, security, performance, and reliable deployments for the feliperamos-dev project.
