# CodeClash

CodeClash is a modern, interactive coding contest platform built with Next.js that enables developers to participate in competitive programming challenges. Whether you're looking to improve your coding skills, prepare for technical interviews, or compete with peers, CodeClash provides a feature-rich environment for all your competitive programming needs.

## 🚀 Features

### Contest Ecosystem
- **Advanced Contest Management**: Create, join, and manage coding contests with flexible configuration options
- **Public & Private Contests**: Host both public contests for everyone and private contests for your organization or friends
- **Contest Templates**: Save time with reusable contest templates for recurring events
- **Multiple Contest Formats**: Support for various contest formats including ACM-ICPC style, CodeForces style, and custom formats

### Coding Experience
- **Real-time Contest Participation**: Engage in live contests with real-time leaderboards and updates
- **Interactive Problem Solving**: Solve problems in an intuitive coding environment with syntax highlighting
- **Multi-language Support**: Code in a variety of programming languages including Python, JavaScript, Java, C++, and more
- **Automatic Code Evaluation**: Instant feedback with our robust testing system against various test cases

### User Experience
- **Personalized Dashboard**: Track your progress, upcoming contests, and past performances
- **Rich Markdown Content**: Enjoy enhanced readability with rich content display for contest descriptions, rules, scoring systems, and prizes
- **Smart Contest Timer**: Countdown functionality that automatically redirects participants when contests begin
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark Mode**: Eye-friendly dark-themed interface for optimal coding experience

### Community & Growth
- **Global Leaderboards**: Compete globally and track your standing in the community
- **Rating System**: Advance through rating tiers as you win contests and solve problems
- **Performance Analytics**: Gain insights into your strengths and weaknesses with detailed performance metrics
- **Achievement System**: Earn badges and achievements as you reach milestones

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **State Management**: React Context API / Redux
- **Authentication**: JWT-based authentication
- **Markdown**: React-Markdown with remark-gfm for GitHub-flavored markdown
- **Notifications**: React Hot Toast
- **Deployment**: Vercel/Netlify

## 🏗️ Architecture

CodeClash follows a modern microservices architecture:

- **Client-side rendering** for dynamic user interfaces
- **API-first design** with RESTful endpoints
- **Serverless functions** for backend operations

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/codeclash.git
   cd codeclash
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```
   cp .env.example .env.local
   ```

4. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📘 Usage

### Participating in a Contest

1. Browse available contests on the homepage
2. Click on a contest to view details
3. Register for the contest
4. Wait for the contest to start (a countdown timer will be displayed)
5. Once the contest begins, you'll be automatically redirected to the contest arena
6. Solve problems and submit solutions before the contest ends

### Creating a Contest

1. Navigate to the contest creation page and at the URL add /create-contest?key=sdc
2. Fill in contest details, including title, description, rules, scoring system, and prizes
3. Set the start and end times
4. Add problems to the contest with appropriate test cases
5. Configure scoring algorithms and visibility settings
6. Publish the contest and share with participants

## 🛣️ Roadmap

- [ ] Integrated code editor with themes and preferences
- [ ] Team-based contests and collaborative coding
- [ ] AI-assisted problem recommendations
- [ ] Code plagiarism detection
- [ ] Mobile application for on-the-go participation

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## ❓ Troubleshooting

**Q: Why can't I access a contest?**  
A: Ensure you've registered for the contest and that it has started. Private contests require an invitation.

**Q: How is my rating calculated?**  
A: Ratings are calculated based on your performance relative to other participants, problem difficulty, and solving speed.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Open source community](https://github.com/) for various dependencies

## 📬 Contact

For questions or support, please reach out to [your-email@example.com](mailto:your-email@example.com)

---

<p align="center">
  Made with ❤️ by the Kartikay
</p>
