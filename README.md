# FutureFit - AI Body Composition Analysis

FutureFit is an AI-powered body fat estimation app that uses photo analysis to track your body composition over time. Built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

- **AI-Powered Body Fat Analysis**: Uses computer vision to estimate body fat percentage from photos
- **Progress Tracking**: Monitor your body composition changes over time with detailed charts
- **Personalized Plans**: Get customized workout and nutrition plans based on your goals
- **Photo Capture**: Take front and side photos directly in the browser
- **User Authentication**: Secure login with Clerk (email and Google OAuth)
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Authentication**: Clerk
- **AI/ML**: ONNX Runtime Web, TensorFlow.js (for future pose detection)
- **Database**: PostgreSQL (with mock data for MVP)
- **Charts**: Chart.js, react-chartjs-2

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (optional for MVP - uses mock data)
- Clerk account for authentication

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd future-fit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here

   # Database (optional for MVP)
   DATABASE_URL=postgresql://username:password@localhost:5432/futurefit

   # Next.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ```

4. **Set up Clerk Authentication**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Create a new application
   - Copy your publishable and secret keys to `.env.local`
   - Configure OAuth providers (Google, etc.) if desired

5. **Set up Database (Optional)**
   For the MVP, the app uses mock data. To use a real database:
   ```bash
   # Create PostgreSQL database
   createdb futurefit
   
   # Run the schema
   psql -d futurefit -f database/schema.sql
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 User Flow

1. **Sign Up/Login**: Users authenticate with Clerk
2. **Profile Setup**: Enter height, weight, age, sex, and fitness goals
3. **Photo Capture**: Take front and side photos using the camera component
4. **AI Analysis**: Photos are processed to estimate body fat percentage
5. **Results**: View body fat percentage with confidence intervals
6. **Dashboard**: Track progress over time and view personalized plans

## 🧠 AI Implementation

### Current MVP Implementation
- **Mock Pose Detection**: Simulates body landmark detection
- **US Navy Formula**: Calculates body fat using waist, neck, and hip measurements
- **Rules-Based Plans**: Generates workout and nutrition plans based on user goals

### Future Enhancements
- **Real Pose Detection**: Integrate MoveNet/BlazePose with ONNX Runtime Web
- **Body Segmentation**: Add MediaPipe BodyPix for silhouette analysis
- **Advanced Algorithms**: Implement more sophisticated body composition models

## 📊 Body Fat Calculation

The app uses the US Navy body fat formula:

**For Men:**
```
BF% = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
```

**For Women:**
```
BF% = 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
```

## 🏋️ Workout Plans

The app generates personalized workout plans based on user goals:

- **Fat Loss**: HIIT, cardio, and full-body strength training
- **Muscle Gain**: Progressive overload with push/pull/legs split
- **Maintenance**: Balanced strength and cardio routine

## 🍎 Nutrition Plans

Nutrition plans include:
- **Calorie Targets**: Based on TDEE calculations
- **Macro Distribution**: Protein, carbs, and fat ratios
- **Meal Suggestions**: Sample meals and snacks
- **Guidelines**: Goal-specific nutrition advice

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── profile/           # User profile page
│   ├── scan/              # Photo capture page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── camera/            # Camera capture component
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility libraries
│   ├── ai/                # AI processing functions
│   └── plans/             # Workout/nutrition plan generators
└── middleware.ts          # Clerk middleware
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run format` - Format code

### Adding New Features

1. **New Pages**: Add to `src/app/` directory
2. **API Routes**: Add to `src/app/api/` directory
3. **Components**: Add to `src/components/` directory
4. **Utilities**: Add to `src/lib/` directory

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security

- **Authentication**: Clerk handles all authentication securely
- **API Routes**: Protected with Clerk middleware
- **Data**: User data is encrypted and stored securely
- **Photos**: Processed locally, not stored on servers (MVP)

## 📈 Future Roadmap

- [ ] Real AI pose detection with ONNX Runtime Web
- [ ] Body segmentation with MediaPipe BodyPix
- [ ] Advanced body composition algorithms
- [ ] Social features and challenges
- [ ] Mobile app (React Native)
- [ ] Integration with fitness trackers
- [ ] Nutrition database integration
- [ ] Advanced progress analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our Discord community (link coming soon)

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [TailwindCSS](https://tailwindcss.com) for styling
- [Next.js](https://nextjs.org) for the framework
- [TensorFlow.js](https://www.tensorflow.org/js) for AI capabilities

---

Built with ❤️ for the fitness community