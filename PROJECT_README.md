# NoScalp - Event Ticketing Landing Page

A modern, responsive landing page for an event ticketing platform built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Smooth Animations**: Elegant animations using Framer Motion
- **Component-Based Architecture**: Modular and reusable components
- **Modern UI**: Clean, professional design with gradient backgrounds
- **TypeScript**: Type-safe code for better developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid development

## 📦 Components

### Navbar

- Responsive navigation with mobile menu
- Animated logo and links
- Sticky header with backdrop blur

### Hero Section

- Eye-catching gradient background
- Image and text side-by-side layout (responsive stacking on mobile)
- Call-to-action buttons with hover effects
- Floating search bar with event filters

### Upcoming Events

- Grid layout with responsive columns
- Event cards with hover animations
- Filter options for events
- Date badges and event details

### Make Event Section

- Promotional section with illustration
- Call-to-action for creating events
- Gradient background

### Brands Section

- Partner/sponsor logos grid
- Hover effects on brand cards

### Blog Section

- Blog post cards with images
- Responsive grid layout
- Load more functionality

### Footer

- Multi-column layout
- Social media links
- Newsletter subscription
- Quick links and sitemap

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18+ installed
- pnpm package manager

## 🚀 Getting Started

1. **Install dependencies**:

```bash
pnpm install
```

2. **Add required images**:

   - See `IMAGE_ASSETS.md` for the list of required images
   - Place images in the `/public` directory

3. **Run development server**:

```bash
pnpm dev
```

4. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
noscalp/
├── app/
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation component
│   │   ├── UpcomingEvents.tsx  # Events grid section
│   │   ├── MakeEvent.tsx       # Create event CTA section
│   │   ├── Brands.tsx          # Partner brands section
│   │   ├── Blog.tsx            # Blog posts section
│   │   ├── Footer.tsx          # Footer component
│   │   └── index.ts            # Component exports
│   ├── Hero.tsx                # Hero section
│   ├── page.tsx                # Main page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── public/                     # Static assets (images)
├── IMAGE_ASSETS.md            # Image requirements
└── README.md                  # This file
```

## 🎨 Customization

### Colors

The project uses a purple-pink gradient theme. To customize colors, update the Tailwind classes in components:

- Primary: `#5522CC`, `#ED4690`
- Backgrounds: `bg-linear-to-b`, `bg-linear-to-r`
- Text: `text-white`, `text-gray-900`

### Animations

All animations are defined using Framer Motion. To customize:

- Adjust `initial`, `animate`, and `transition` props
- Modify `whileHover` and `whileTap` for interactive elements

### Content

Update the data arrays in each component to change:

- Event listings
- Blog posts
- Brand logos
- Navigation links

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔧 Build for Production

```bash
pnpm build
pnpm start
```

## 📄 License

This project is created for demonstration purposes.

## 🤝 Contributing

Feel free to fork and customize for your own projects!
