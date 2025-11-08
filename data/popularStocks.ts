import { StockDetails } from '../types';
import { 
    AppleIcon, MicrosoftIcon, GoogleIcon, AmazonIcon, NvidiaIcon, MetaIcon, TeslaIcon, 
    VisaIcon, MastercardIcon, JNJIcon, JPMIcon, WalmartIcon, PGIcon, UNHIcon, HDIcon,
    BACIcon, VZIcon, KOIcon, PFEIcon, DISIcon, NKEIcon, IBMIcon, IntelIcon, CiscoIcon,
    OracleIcon, SalesforceIcon, AdobeIcon, NetflixIcon, PepsiCoIcon, TMobileIcon, 
    ComcastIcon, AmgenIcon, BroadcomIcon, CostcoIcon, McDonaldIcon, QualcommIcon,
    StarbucksIcon, TexasInstrumentsIcon, GeneralElectricIcon, FordIcon, ATandTIcon,
    ExxonMobilIcon, ChevronIcon, PfizerIcon, BoeingIcon, GoldmanSachsIcon,
    CaterpillarIcon, HomeDepotIcon, LowesIcon, TargetIcon, UPSIcon, FedExIcon,
    StockIcon
} from '../components/icons';

export const popularStockSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.', Icon: AppleIcon },
    { symbol: 'MSFT', name: 'Microsoft Corp.', Icon: MicrosoftIcon },
    { symbol: 'GOOGL', name: 'Alphabet Inc. (Class A)', Icon: GoogleIcon },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', Icon: AmazonIcon },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', Icon: NvidiaIcon },
    { symbol: 'META', name: 'Meta Platforms, Inc.', Icon: MetaIcon },
    { symbol: 'TSLA', name: 'Tesla, Inc.', Icon: TeslaIcon },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', Icon: StockIcon },
    { symbol: 'V', name: 'Visa Inc.', Icon: VisaIcon },
    { symbol: 'JNJ', name: 'Johnson & Johnson', Icon: JNJIcon },
    { symbol: 'WMT', name: 'Walmart Inc.', Icon: WalmartIcon },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', Icon: JPMIcon },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', Icon: UNHIcon },
    { symbol: 'MA', name: 'Mastercard Inc.', Icon: MastercardIcon },
    { symbol: 'PG', name: 'Procter & Gamble Co.', Icon: PGIcon },
    { symbol: 'HD', name: 'The Home Depot, Inc.', Icon: HDIcon },
    { symbol: 'BAC', name: 'Bank of America Corp.', Icon: BACIcon },
    { symbol: 'PFE', name: 'Pfizer Inc.', Icon: PfizerIcon },
    { symbol: 'DIS', name: 'The Walt Disney Co.', Icon: DISIcon },
    { symbol: 'KO', name: 'The Coca-Cola Co.', Icon: KOIcon },
    { symbol: 'PEP', name: 'PepsiCo, Inc.', Icon: PepsiCoIcon },
    { symbol: 'NKE', name: 'NIKE, Inc.', Icon: NKEIcon },
    { symbol: 'MCD', name: "McDonald's Corp.", Icon: McDonaldIcon },
    { symbol: 'CSCO', name: 'Cisco Systems, Inc.', Icon: CiscoIcon },
    { symbol: 'INTC', name: 'Intel Corp.', Icon: IntelIcon },
    { symbol: 'VZ', name: 'Verizon Communications Inc.', Icon: VZIcon },
    { symbol: 'CRM', name: 'Salesforce, Inc.', Icon: SalesforceIcon },
    { symbol: 'ADBE', name: 'Adobe Inc.', Icon: AdobeIcon },
    { symbol: 'NFLX', name: 'Netflix, Inc.', Icon: NetflixIcon },
    { symbol: 'ORCL', name: 'Oracle Corp.', Icon: OracleIcon },
    { symbol: 'IBM', name: 'IBM Corp.', Icon: IBMIcon },
    { symbol: 'CMCSA', name: 'Comcast Corp.', Icon: ComcastIcon },
    { symbol: 'TMUS', name: 'T-Mobile US, Inc.', Icon: TMobileIcon },
    { symbol: 'AMGN', name: 'Amgen Inc.', Icon: AmgenIcon },
    { symbol: 'AVGO', name: 'Broadcom Inc.', Icon: BroadcomIcon },
    { symbol: 'COST', name: 'Costco Wholesale Corp.', Icon: CostcoIcon },
    { symbol: 'QCOM', name: 'QUALCOMM Inc.', Icon: QualcommIcon },
    { symbol: 'SBUX', name: 'Starbucks Corp.', Icon: StarbucksIcon },
    { symbol: 'TXN', name: 'Texas Instruments Inc.', Icon: TexasInstrumentsIcon },
    { symbol: 'GE', name: 'General Electric Co.', Icon: GeneralElectricIcon },
    { symbol: 'F', name: 'Ford Motor Co.', Icon: FordIcon },
    { symbol: 'T', name: 'AT&T Inc.', Icon: ATandTIcon },
    { symbol: 'XOM', name: 'Exxon Mobil Corp.', Icon: ExxonMobilIcon },
    { symbol: 'CVX', name: 'Chevron Corp.', Icon: ChevronIcon },
    { symbol: 'BA', name: 'The Boeing Co.', Icon: BoeingIcon },
    { symbol: 'GS', name: 'The Goldman Sachs Group, Inc.', Icon: GoldmanSachsIcon },
    { symbol: 'CAT', name: 'Caterpillar Inc.', Icon: CaterpillarIcon },
    { symbol: 'LOW', name: "Lowe's Companies, Inc.", Icon: LowesIcon },
    { symbol: 'TGT', name: 'Target Corp.', Icon: TargetIcon },
    { symbol: 'UPS', name: 'United Parcel Service, Inc.', Icon: UPSIcon },
    { symbol: 'FDX', name: 'FedEx Corp.', Icon: FedExIcon },
    { symbol: 'AMD', name: 'Advanced Micro Devices, Inc.', Icon: StockIcon },
    { symbol: 'PYPL', name: 'PayPal Holdings, Inc.', Icon: StockIcon },
    { symbol: 'SQ', name: 'Block, Inc.', Icon: StockIcon },
    { symbol: 'UBER', name: 'Uber Technologies, Inc.', Icon: StockIcon },
    { symbol: 'LYFT', name: 'Lyft, Inc.', Icon: StockIcon },
    { symbol: 'SNAP', name: 'Snap Inc.', Icon: StockIcon },
    { symbol: 'TWTR', name: 'X Corp. (formerly Twitter)', Icon: StockIcon },
    { symbol: 'PINS', name: 'Pinterest, Inc.', Icon: StockIcon },
    { symbol: 'ZM', name: 'Zoom Video Communications, Inc.', Icon: StockIcon },
    { symbol: 'ROKU', name: 'Roku, Inc.', Icon: StockIcon },
    { symbol: 'SPOT', name: 'Spotify Technology S.A.', Icon: StockIcon },
    { symbol: 'SHOP', name: 'Shopify Inc.', Icon: StockIcon },
    { symbol: 'SNOW', name: 'Snowflake Inc.', Icon: StockIcon },
    { symbol: 'U', name: 'Unity Software Inc.', Icon: StockIcon },
    { symbol: 'RBLX', name: 'Roblox Corp.', Icon: StockIcon },
    { symbol: 'COIN', name: 'Coinbase Global, Inc.', Icon: StockIcon },
    { symbol: 'HOOD', name: 'Robinhood Markets, Inc.', Icon: StockIcon },
    { symbol: 'PLTR', name: 'Palantir Technologies Inc.', Icon: StockIcon },
    { symbol: 'SOFI', name: 'SoFi Technologies, Inc.', Icon: StockIcon },
    { symbol: 'MSTR', name: 'MicroStrategy Inc.', Icon: StockIcon },
    { symbol: 'MRNA', name: 'Moderna, Inc.', Icon: StockIcon },
    { symbol: 'BNTX', name: 'BioNTech SE', Icon: StockIcon },
    { symbol: 'GILD', name: 'Gilead Sciences, Inc.', Icon: StockIcon },
    { symbol: 'BIIB', name: 'Biogen Inc.', Icon: StockIcon },
    { symbol: 'VRTX', name: 'Vertex Pharmaceuticals Inc.', Icon: StockIcon },
    { symbol: 'REGN', name: 'Regeneron Pharmaceuticals, Inc.', Icon: StockIcon },
    { symbol: 'LLY', name: 'Eli Lilly and Co.', Icon: StockIcon },
    { symbol: 'MRK', name: 'Merck & Co., Inc.', Icon: StockIcon },
    { symbol: 'ABBV', name: 'AbbVie Inc.', Icon: StockIcon },
    { symbol: 'BMY', name: 'Bristol-Myers Squibb Co.', Icon: StockIcon },
    { symbol: 'ANTM', name: 'Elevance Health, Inc.', Icon: StockIcon },
    { symbol: 'CI', name: 'The Cigna Group', Icon: StockIcon },
    { symbol: 'CVS', name: 'CVS Health Corp.', Icon: StockIcon },
    { symbol: 'LMT', name: 'Lockheed Martin Corp.', Icon: StockIcon },
    { symbol: 'RTX', name: 'RTX Corp.', Icon: StockIcon },
    { symbol: 'NOC', name: 'Northrop Grumman Corp.', Icon: StockIcon },
    { symbol: 'GD', name: 'General Dynamics Corp.', Icon: StockIcon },
    { symbol: 'HON', name: 'Honeywell International Inc.', Icon: StockIcon },
    { symbol: 'MMM', name: '3M Co.', Icon: StockIcon },
    { symbol: 'DE', name: 'Deere & Co.', Icon: StockIcon },
    { symbol: 'GM', name: 'General Motors Co.', Icon: StockIcon },
    { symbol: 'DAL', name: 'Delta Air Lines, Inc.', Icon: StockIcon },
    { symbol: 'AAL', name: 'American Airlines Group Inc.', Icon: StockIcon },
    { symbol: 'UAL', name: 'United Airlines Holdings, Inc.', Icon: StockIcon },
    { symbol: 'SBUX', name: 'Starbucks Corp.', Icon: StarbucksIcon },
];

export const generatePopularStocks = (): StockDetails[] => {
    return popularStockSymbols.map((stock, index) => {
        // --- Basic Info ---
        const basePrice = (stock.symbol.charCodeAt(0) * stock.symbol.length * ((index % 10) + 1) * 1.2) % 1500 + 20;
        const price = basePrice * (1 + (Math.random() - 0.5) * 0.1);
        const changePercent = (Math.random() - 0.48) * 6;
        const marketCap = price * (Math.random() * 8e9 + 2e9);
        const volume = Math.random() * 9e7 + 1e7;
        const chartData = Array.from({ length: 30 }, (_, i) => ({
            name: `${i+1}`,
            value: basePrice * (1 + (Math.random() - 0.5) * 0.2)
        }));

        // --- Detailed Info ---
        const about = `${stock.name} is a prominent company in its industry. It engages in the design, manufacture, and sale of its products and services worldwide.`;
        const employees = Math.floor(Math.random() * 200000) + 5000;
        const headquarters = "City, State";
        const founded = Math.floor(Math.random() * 100) + 1920;

        const peRatio = Math.random() * 30 + 10;
        const dividendYield = Math.random() < 0.6 ? Math.random() * 4 : null;
        const highToday = price * (1 + Math.random() * 0.03);
        const lowToday = price * (1 - Math.random() * 0.03);

        const totalRatings = 52;
        const buy = Math.random() * 60 + 20;
        const hold = Math.random() * (80 - buy);
        const sell = 100 - buy - hold;

        const allSymbols = [...popularStockSymbols];
        const peopleAlsoOwn = Array.from({ length: 6 }).map(() => {
            const randomStock = allSymbols[Math.floor(Math.random() * allSymbols.length)];
            const p = (randomStock.symbol.charCodeAt(0) * Math.random() * 5) % 800 + 10;
            const c = (Math.random() - 0.48) * 4;
            return { ...randomStock, price: p, changePercent: c };
        });

        return {
            ...stock,
            marketCap,
            volume,
            price,
            changePercent,
            chartData,
            about,
            employees,
            headquarters,
            founded,
            keyStatistics: {
                marketCap,
                peRatio,
                dividendYield,
                averageVolume: volume * 1.1,
                highToday,
                lowToday,
                openPrice: lowToday + (highToday - lowToday) * Math.random(),
                volume,
            },
            analystRatings: {
                buy,
                hold,
                sell,
                bullsSay: { source: 'Morningstar', content: 'The company\'s full self-driving software should generate growing profits, leading to a robotaxi service.'},
                bearsSay: { source: 'Zacks', content: 'The CEO\'s political activities will turn consumers away from buying in key markets including the US and Europe.'}
            },
            peopleAlsoOwn,
        };
    });
};