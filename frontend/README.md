# avlokanias Clone

A modern web application for IAS exam preparation, inspired by the avlokanias platform. Built with Next.js and Tailwind CSS.

## Features

- Personalized answer evaluation service
- Comprehensive study resources including notes, videos, and PYQs
- User dashboard for tracking progress
- Subscription plans for different levels of access
- Responsive design for all devices

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: Coming soon
- **Database**: Coming soon

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/convertias-clone.git
   cd convertias-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/pages` - Next.js pages
- `/components` - Reusable UI components
- `/styles` - Global styles and Tailwind configuration
- `/public` - Static assets

## Development

### Adding New Pages

1. Create a new file in the `/pages` directory.
2. Import necessary components.
3. Export a React component as the default export.

### Styling Components

This project uses Tailwind CSS for styling. Refer to the Tailwind CSS documentation for utility classes.

## Deployment

Follow these steps to deploy your application to production:

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project is inspired by the avlokanias platform, which provides valuable services for IAS aspirants.
- All design elements are created for educational purposes.

# Frontend Structure

## Overview
This frontend uses Next.js and is organized for scalability and maintainability. Below is the recommended structure after restructuring:

```
frontend/
  components/         # Feature-based or domain-based React components
    Hero/
      HeroSection.tsx
      HeroImage.tsx
    Footer/
      Footer.tsx
    ...
  features/           # (optional, for larger apps)
  pages/              # Next.js pages
  public/             # Static assets (images, icons, etc.)
    images/
    icons/
  services/           # API and business logic
  styles/             # Global styles
  utils/              # Shared utility/helper functions
  README.md           # This file
```

## Guidelines
- **components/**: Group components by feature or domain for better scalability.
- **public/**: All static assets are consolidated here. Use subfolders for organization.
- **services/**: Place API calls and business logic here.
- **utils/**: Place shared utility/helper functions here.
- **styles/**: Global CSS and Tailwind configuration.

## How to Add a New Feature
1. Create a new folder in `components/` for the feature.
2. Add related components inside this folder.
3. Add any shared logic to `utils/`.
4. Place static assets in `public/images/` or `public/icons/` as appropriate.

---

_Last updated: [DATE]_ 