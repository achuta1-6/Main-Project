
assi# Investment/Portfolio Feature Implementation

## Database & Types
- [x] Add investment-related types to lib/types/database.ts
- [x] Create database migration script scripts/005_create_investment_tables.sql

## API & Backend
- [x] Create API route app/api/investments/route.ts for fetching investment data

## Frontend Pages
- [x] Create investments page app/investments/page.tsx with portfolio overview

## Components
- [x] Create components/investments/portfolio-overview.tsx
- [x] Create components/investments/stock-list.tsx
- [x] Create components/investments/crypto-list.tsx

## Navigation
- [x] Update dashboard header navigation to include Investments link
- [x] Update mobile nav to include investments

## Next Steps for Investment Features

### Database Migration
- [x] Run database migration script `scripts/005_create_investment_tables.sql` to create investment tables in Supabase

### API Integration
- [ ] Obtain API keys for Alpha Vantage (stocks) and CoinGecko (crypto)
- [ ] Install any required packages for HTTP requests (if needed, e.g., axios)
- [ ] Replace mock stock data in `app/api/investments/route.ts` with real Alpha Vantage API calls
- [ ] Replace mock crypto data in `app/api/investments/route.ts` with real CoinGecko API calls
- [ ] Add error handling and rate limiting for API calls

### Buy/Sell Features
- [ ] Extend POST handler in `app/api/investments/route.ts` to support 'buy_investment' action
- [ ] Extend POST handler to support 'sell_investment' action
- [ ] Update investment quantities, prices, and recalculate portfolio totals on buy/sell
- [ ] Add validation for buy/sell operations (e.g., sufficient funds, valid quantities)

### Testing
- [ ] Test investments page to ensure data loads correctly from real APIs
- [ ] Test buy/sell functionality and verify portfolio updates
- [ ] Update TODO.md to mark all tasks as completed
