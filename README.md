
## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/banzhaf-shapley-web-app.git
cd banzhaf-shapley-web-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

5. Deploy to GitHub Pages:
```bash
npm run deploy
```

## Usage

1. Enter the number of issues (k) in the input field
2. For each issue:
   - Enter the quota value
   - Enter the weight vector values for each player
3. Select the calculation method (Shapley or Banzhaf)
4. Click "Calculate" to see the results

## Technical Details

The application is built using:
- React
- TypeScript
- Material-UI
- GitHub Pages for hosting

The calculation of Shapley and Banzhaf values is implemented using combinatorial algorithms that consider all possible coalitions of players.

## License

MIT License 
