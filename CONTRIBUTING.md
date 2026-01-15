# 🤝 Contributing to Sehat Saathi (स्वास्थ्य साथी)

Thank you for your interest in contributing to ***Sehat Saathi***.
This project exists to make healthcare information accessible, inclusive, and stigma-free, especially for underserved communities.

Every contribution, whether code, documentation, translations, or ideas, helps move that mission forward.

## 🌱 What We Value

Before contributing, please align with these core principles:

+ Accessibility first (language, bandwidth, usability)
+ Accuracy over assumptions (especially health-related content)
+ Respect and inclusivity (for users and contributors)
+ Maintainability over shortcuts
+ Ethical responsibility in healthcare technology

If your contribution strengthens any of the above, it belongs here.

## 🧭 Ways to Contribute

You can contribute in many ways:

**💻 Code**

+ New features
+ Bug fixes
+ Performance improvements
+ UI/UX enhancements
+ Accessibility improvements

**🌍 Localization**

+ Adding new languages
+ Improving translations
+ Verifying medical terminology in regional languages

**📖 Documentation** 

+ Improving README clarity
+ Adding usage guides
+ Writing developer documentation

**🧪 Quality**

+ Writing tests
+ Manual testing
+ Reporting bugs clearly

**🛠️ Getting Started**
1. Fork the Repository

Click Fork on GitHub to create your own copy.

2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/sehat-saathi-guide.git
cd sehat-saathi-guide
```

3. Install Dependencies
```bash
bun install
```
# or
```bash
npm install
```

4. Start the Development Server
```bash
bun run dev
```
# or
```bash
npm run dev
```


The app will be available at:
```bash
👉 http://localhost:5173
```

## 🌿 Branching Strategy

Always create a new branch for your work.
```bash
git checkout -b feature/short-description
```

Examples:
```bash
feature/symptom-tracker-enhancement
```
```bash
fix/language-switch-bug
```
```bash
i18n/add-tamil-support
```
```bash
docs/update-installation-guide
```

Avoid committing directly to main.

## ✍️ Commit Guidelines

Write clear, descriptive commit messages.

✅ Good examples:

Add Hindi translations for symptom tracker
Fix hospital search crash on empty location
Improve accessibility labels for AI assistant


❌ Avoid:

fix bug
update
changes

## 🧑‍💻 Coding Guidelines
**TypeScript / React**

+ Use functional components
+ Prefer hooks over class components
+ Maintain strict TypeScript typing
+ Avoid any unless absolutely necessary

**Styling**

+ Use Tailwind CSS utilities consistently
+ Follow existing design patterns
+ Ensure mobile-first responsiveness

**Accessibility**

+ Use semantic HTML
+ Ensure keyboard navigation
+ Follow ARIA guidelines (Radix UI helps, don’t fight it)

**🌍 Localization Guidelines**

When contributing translations:

+ Keep medical terms accurate and culturally appropriate
+ Avoid slang or informal wording
+ Maintain consistency across languages
+ If unsure about a translation, add a comment
+ All language files should remain UTF-8 encoded.

🔐 Health, Safety & Ethics (Very Important)

This project provides health-related information, not diagnoses.

***Contributors must not:***

+ Add medical advice that appears authoritative or diagnostic
+ Remove disclaimers
+ Introduce fear-based or misleading health content
+ Collect personal health data without explicit discussion
+ When in doubt, err on the side of caution.

**🧪 Testing Expectations**

Before opening a Pull Request:

+ Ensure the app builds successfully
+ Test your feature in at least one language
+ Check mobile and desktop layouts if UI is affected

If you cannot add automated tests, describe how you tested manually.

## 🔁 Submitting a Pull Request

Before submitting, confirm:

 + Code runs locally
 + No unnecessary files committed
 + Relevant documentation updated
 + Translations tested (if applicable)

Then:

+ Push your branch
+ Open a Pull Request against main

Clearly explain:

+ What you changed
+ Why it was needed
+ How it was tested

## 🧠 Review Process

+ Maintainers may request changes
+ Feedback will be constructive and direct
+ Discussions are encouraged
+ Respectful disagreement is welcome
+ Quality and user impact matter more than speed.

## 📜 Code of Conduct

All contributors are expected to follow the Code of Conduct.

In short:

+ Be respectful
+ Be inclusive
+ No harassment or discrimination
+ Build a safe space for learning and collaboration

(See CODE_OF_CONDUCT.md for details.)

## 🌟 New Contributors

If you’re new to open source:

+ Start small
+ Ask questions
+ Learn as you go

Everyone was new once. Effort and honesty matter more than perfection.

## 🙌 Final Note

***Sehat Saathi*** is more than a project.
It’s a commitment to accessible, ethical, and inclusive healthcare technology.

If your contribution helps even one person navigate health information more confidently, it matters.

**Thank you for building with us. 💚**