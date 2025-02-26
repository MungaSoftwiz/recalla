# Contributing to Recalla

Thank you for your interest in contributing to Recalla! We welcome contributions from the community to help improve this flashcard app and make it a better tool for learning and memory retention. Whether you're fixing bugs, adding features, or improving documentation, your efforts are greatly appreciated.

This document outlines the process for contributing to the project. Please read it carefully to ensure a smooth collaboration experience.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Code Changes](#submitting-code-changes)
- [Development Setup](#development-setup)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Style Guide](#style-guide)
- [Testing](#testing)
- [Questions?](#questions)

## Code of Conduct

All contributors are expected to adhere to our Code of Conduct (CODE_OF_CONDUCT.md). In summary, be respectful, inclusive, and considerate in all interactions. We want Recalla to be a welcoming place for everyone.

## How to Contribute

There are several ways to contribute to Recalla:

### Reporting Bugs

If you find a bug, please let us know so we can fix it!

1. Check the Issues page to see if it’s already reported.
2. If not, open a new issue with:
   - A clear title (e.g., "PDF Upload Fails with Large Files").
   - A description of the bug, including steps to reproduce, expected behavior, and actual behavior.
   - Any relevant logs, screenshots, or details (e.g., browser, OS).

### Suggesting Features

Have an idea to make Recalla better? We’d love to hear it!

1. Check the Issues page for similar suggestions.
2. Open a new issue with:
   - A descriptive title (e.g., "Add Dark Mode Toggle").
   - A detailed explanation of the feature and why it’s useful.
   - Optional: Any mockups or examples.
3. Use the "enhancement" label when submitting feature requests.

### Submitting Code Changes

Ready to write some code? Follow these steps:

1. **Fork the Repository**

   - Click the "Fork" button at the top of the Recalla repo.
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR_USERNAME/recalla.git
     cd recalla
     ```

2. **Create a Branch**

   - Branch off main with a descriptive name:
     ```bash
     git checkout -b feature/add-dark-mode
     ```
   - Use prefixes like `feature/`, `bugfix/`, or `docs/` for clarity.

3. **Make Changes**

   - Implement your feature or fix. Keep changes focused and modular.

4. **Commit Your Work**

   - Write clear, concise commit messages:
     ```bash
     git commit -m "feat: add dark mode toggle to settings"
     ```
   - Follow the Conventional Commits format (e.g., `feat:`, `fix:`, `docs:`).

5. **Push to Your Fork**

   ```bash
   git push origin feature/add-dark-mode
   ```

6. **Open a Pull Request**
   - Go to the Recalla repo and click "New Pull Request".
   - Select your branch and describe your changes (see [Pull Request Guidelines](#pull-request-guidelines)).

## Development Setup

To work on Recalla locally:

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account

### Steps

1. **Install Dependencies**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

2. **Set Up Environment Variables**

   - Copy `.env.example` to `.env.local` (if `.env.example` exists, or create `.env.local`):
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
   - Get these from your Supabase project dashboard.

3. **Run the App**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   - Visit [http://localhost:3000](http://localhost:3000) to see it in action.

## Pull Request Guidelines

When submitting a pull request (PR):

- **Title**: Use a clear, concise title (e.g., "Add Dark Mode Support").
- **Description**: Explain what you changed, why, and how it works. Include:
  - Related issue number (e.g., "Fixes #12").
  - Any testing steps or screenshots.
- **Scope**: Keep PRs small and focused. Large changes may be split into multiple PRs.
- **Tests**: Ensure your code doesn’t break existing functionality.
- **Review**: Be responsive to feedback from maintainers.

PRs will be reviewed by the maintainers, and we may request changes before merging.

## Style Guide

To keep the codebase consistent:

### JavaScript/TypeScript

- Follow ESLint rules (run `npm run lint` if set up).
- Prefer functional components with hooks in React.

### CSS

- Use Tailwind CSS classes where applicable.
- Keep styles modular and scoped to components.

### File Naming

- Use PascalCase for React components (e.g., `WelcomeScreen.js`).
- Use camelCase for utilities (e.g., `flashcardUtils.js`).

Run linting and formatting before committing if these tools are configured in the project.

## Testing

We aim to maintain a reliable app. Before submitting a PR:

- Test your changes locally:
  - Imput a text and verify flashcards generate.
  - Upload a PDF and verify flashcards generate.
  - Check study session navigation (`/flashcards/study?sessionId=<id>`).
- If unit tests exist (e.g., with Jest), run them:
  ```bash
  npm run test
  ```
  _(Add this script to `package.json` if testing is implemented later.)_

Report any issues you encounter in your PR description.

## Questions?

Need help? Reach out:

- **Issues**: Post questions in the Issues tab.
- **GitHub**: Mention @MungaSoftwiz in comments.

Thank you for contributing to Recalla—we can’t wait to see what you bring to the project!
