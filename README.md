# rat-paws

A simple HTML page published with GitHub Actions to GitHub Pages.

## Setup

This repository automatically deploys to GitHub Pages when changes are pushed to the main branch.

### Enabling GitHub Pages

To enable GitHub Pages for this repository:

1. Go to your repository on GitHub
2. Click on **Settings**
3. Navigate to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Push your code to trigger the deployment

## Development

The main page is in [index.html](index.html). The deployment workflow is configured in [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

## Deployment

The site deploys automatically on every push to the main branch using GitHub Actions.