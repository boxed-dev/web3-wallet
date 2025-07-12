# Web3 Multi-Chain Wallet

⚠️ **DEMO PROJECT ** ⚠️

This is a learning/demonstration project for educational purposes only. 
DO NOT use this with real cryptocurrency or store significant amounts.

A browser-based multi-chain cryptocurrency wallet demo supporting Ethereum and Solana networks.
Built with Next.js, TypeScript, and modern Web3 libraries for educational/learning purposes.

**THIS IS A DEMO PROJECT - NOT INTENDED FOR PRODUCTION USE OR REAL FUNDS.**

## Features

### Core Functionality
- ✅ Multi-chain support (Ethereum & Solana)
- ✅ Secure wallet generation with mnemonic phrases
- ✅ Password-protected local storage encryption
- ✅ Multiple wallet management
- ✅ Real-time balance checking
- ✅ Private key management with visibility controls
- ✅ Wallet import/export capabilities

### User Interface
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Dark/light theme support
- ✅ Intuitive step-by-step wallet creation
- ✅ Copy-to-clipboard functionality
- ✅ Real-time network statistics
- ✅ Wallet renaming and deletion

### Security Features
- ✅ Client-side encryption using AES
- ✅ Secure seed phrase backup
- ✅ No server-side storage
- ✅ Private key protection
- ✅ Password strength validation

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### Blockchain Libraries
- ethers.js (Ethereum interaction)
- @solana/web3.js (Solana interaction)
- crypto-js (Encryption)

### Development Tools
- ESLint
- TypeScript
- PostCSS
- Tailwind CSS

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web3-multi-wallet.git
   cd web3-multi-wallet
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

**Note**: This is for educational/demo purposes only. DO NOT use with real cryptocurrency.

### Creating Your First Wallet

1. **Launch the Application**
   - Navigate to the wallet creation page
   - Choose a strong password (minimum 8 characters)

2. **Generate Wallet**
   - Click "Generate Wallet" to create new addresses
   - Automatically generates both Ethereum and Solana addresses

3. **Backup Seed Phrase**
   - Write down your 12-word recovery phrase
   - Store it securely offline
   - This is the only way to recover your wallet

4. **Access Dashboard**
   - View your wallet addresses
   - Check real-time balances
   - Manage multiple wallets

### Managing Multiple Wallets

1. **Add New Wallet**
   - Click the "Add New Wallet" card
   - Enter a custom name
   - New addresses are generated automatically

2. **Switch Between Wallets**
   - Click on any wallet card to activate it
   - Active wallet is highlighted with a badge

3. **Rename Wallets**
   - Click the edit icon on any wallet
   - Enter new name and confirm

4. **Delete Wallets**
   - Click the trash icon (only if you have multiple wallets)
   - Wallet is permanently removed

### Security Best Practices

- ✅ Use a strong, unique password
- ✅ Write down your seed phrase on paper
- ✅ Store seed phrase in a safe location
- ✅ Never share your private keys
- ✅ Always verify addresses before sending funds
- ✅ Use on trusted devices only

## Project Structure

```
web3-wallet/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── wallet/
│   │       └── page.tsx        # Main wallet interface
│   ├── components/
│   │   └── ui/                 # Reusable UI components
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## Environment Variables

No environment variables are required for basic functionality. The application uses:
- Ethereum Mainnet (via public RPC)
- Solana Mainnet (via public RPC)

For production, consider using your own RPC endpoints:
```bash
# .env.local (optional)
NEXT_PUBLIC_ETHEREUM_RPC_URL=your_ethereum_rpc_url
NEXT_PUBLIC_SOLANA_RPC_URL=your_solana_rpc_url
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Follow React best practices

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write clean, typed TypeScript code
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

## Security Considerations

### What We Do
- ✅ Client-side encryption only
- ✅ No server-side key storage
- ✅ Secure random number generation
- ✅ Password-based encryption
- ✅ Input validation and sanitization

### What You Should Do
- ✅ Use on trusted devices only
- ✅ Keep software updated
- ✅ Use strong passwords
- ✅ Backup seed phrases securely
- ✅ Verify all transactions

### Important Disclaimers
- 🚨 **THIS IS A DEMO PROJECT - NOT PRODUCTION READY**
- 🚨 **DO NOT USE WITH REAL CRYPTOCURRENCY**
- This is educational/learning software only
- Code has not been audited for security
- Use at your own risk for educational purposes only
- Not suitable for any real funds or production use
- Consider proper hardware wallets for actual cryptocurrency storage

## Roadmap

### Planned Features
- [ ] Transaction history
- [ ] Send/receive functionality
- [ ] Multi-signature support
- [ ] Hardware wallet integration
- [ ] DeFi protocol integration
- [ ] NFT support
- [ ] Mobile app version

### Known Limitations
- Browser-based only
- No mobile app yet
- Limited to Ethereum and Solana
- No built-in exchange features

## Support

If you encounter issues or have questions:

1. Check the [Issues](https://github.com/yourusername/web3-multi-wallet/issues) page
2. Create a new issue if your problem isn't listed
3. Provide detailed information about your issue
4. Include browser version and operating system

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [ethers.js](https://ethers.org/) - Ethereum library
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) - Solana library
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

🚨 **CRITICAL WARNING**: This is a DEMO/LEARNING project, NOT a production wallet. 
DO NOT use with real cryptocurrency. This code has not been audited and is for 
educational purposes only. Use proper hardware wallets for actual cryptocurrency storage.
