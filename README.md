# Pic2Cook 🍳

Pic2Cook analyzes food images using Mistral AI's Pixtral 12B model to generate step-by-step cooking instructions and shopping lists.

![Pic2Cook Demo](public/demo.gif)

## Try It 🌟

Give Pic2Cook a try at [pic2cook.com](https://pic2cook.com/).

- Try example images without signing up
- Create an account to upload your own pictures
- Get instant recipes and grocery lists

## Features ✨

- **AI Recipe Generation**: Upload food photos to get detailed recipes.
- **Smart Grocery Lists**: Auto-generated shopping lists with quantities, serving as a to-do list for your grocery shopping
- **Example Images**: Try it out with sample food pictures without signing up
- **User Accounts**: Secure authentication with email/password
- **API Key Management**: Bring your own Mistral AI API key

## Tech Stack 🛠️

- **AI Model**: [Mistral AI](https://mistral.ai/) (Pixtral 12B)
- **Framework**: [Next.js 14](https://nextjs.org/) 
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Deployment**: [Vercel](https://vercel.com)

## Run Locally 🚀

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sophiamyang/pic2cook.git
cd pic2cook
```

2. Install dependencies:

```bash
npm install
```
3. Environment Variables:

Create a `.env` file with:
```
DATABASE_URL="your-postgresql-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
MISTRAL_API_KEY="your-mistral-api-key"
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app running.


## Development 🔧

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma database GUI

## API Routes 🔌

- `/api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `/api/auth/signup` - User registration endpoint


---

Made with ❤️ using Next.js and Mistral AI

