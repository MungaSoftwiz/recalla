# Recalla

## Table of Contents

- [About](#about)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About

Recalla is a web-based flashcard application built to streamline the study process. Leveraging the power of spaced repetition, it helps users retain information over time by intelligently scheduling review sessions. Whether you're a student preparing for exams, a professional learning new skills, or anyone looking to memorize key concepts, Recalla is your go-to tool for effective learning.

Built with modern technologies like Next.js and Supabase, Recalla offers a seamless user experience with features like PDF-based flashcard generation and personalized study sessions.

## Features

- **Spaced Repetition:** Automatically schedules reviews based on your learning progress.
- **PDF Upload:** Generate flashcards directly from uploaded PDF files and text.
- **Study Sessions:** Track your progress with unique session IDs and review stats.
- **User Authentication:** Secure login via Supabase Auth.
- **Responsive Design:** Works on desktop, tablet, and mobile devices.
- **Customizable:** Tailor flashcards and sessions to your needs.

<!-- ## Demo
Check out a live demo of Recalla at "". Insert a text or Upload a PDF, generate flashcards, and start studying!

![Demo Screenshot](https://via.placeholder.com/800x400) -->

## Installation

Follow these steps to set up Recalla locally:

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- A Supabase account for backend services

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/MungaSoftwiz/recalla.git
   cd recalla
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   Get these from your Supabase project settings.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Usage

1. **Sign Up / Log In:** Authenticate using your email via Supabase Auth.
2. **Upload a PDF:** On the welcome screen, insert a text or upload a PDF file to generate flashcards.
3. **Study:** Navigate to the study page (`/flashcards/study?sessionId=<id>`) to review your flashcards.
4. **Track Progress:** Monitor your retention with session-based progress updates.

Example workflow:

1. Upload `biology_notes.pdf`.
2. Recalla generates 20 flashcards and assigns a `sessionId`.
3. Study at `http://localhost:3000/flashcards/study?sessionId=abc123`.

## Configuration

Customize Recalla by tweaking these optional settings:

- **Supabase Storage:** Adjust the `pdfs` bucket settings in `uploadFile` (e.g., file name, file size limits).
- **API Endpoint:** Modify `/api/flashcards/pdf` logic for custom flashcard generation.
- **Styling:** Update Tailwind CSS classes in `app/layout.css` or component files.

## Contributing

We’d love your help to improve Recalla! To contribute:

1. **Fork the repo** and create a branch for your changes.
2. **Submit a pull request** with a clear description.

For detailed instructions, see `CONTRIBUTING.md`.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements

- **Next.js** for the powerful React framework.
- **Supabase** for authentication and storage.
- **Tailwind CSS** for styling.
- All contributors and users who make Recalla possible!
