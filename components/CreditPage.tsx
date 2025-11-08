import React, { useMemo } from 'react';
import type { CreditReport, CreditScoreInfo } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ShieldCheckIcon } from './icons';

interface CreditPageProps {
  report: CreditReport | null;
  isLoading: boolean;
  onFetchReport: () => void;
}

// Fix: Update function to return a hexColor for SVG compatibility.
const getScoreRating = (score: number): { rating: string, color: string, textColor: string, hexColor: string } => {
    if (score >= 800) return { rating: 'Excellent', color: 'bg-green-500', textColor: 'text-green-600', hexColor: '#22C55E' };
    if (score >= 740) return { rating: 'Very Good', color: 'bg-green-400', textColor: 'text-green-500', hexColor: '#4ADE80' };
    if (score >= 670) return { rating: 'Good', color: 'bg-yellow-400', textColor: 'text-yellow-500', hexColor: '#FACC15' };
    if (score >= 580) return { rating: 'Fair', color: 'bg-orange-400', textColor: 'text-orange-500', hexColor: '#FB923C' };
    return { rating: 'Poor', color: 'bg-red-500', textColor: 'text-red-600', hexColor: '#EF4444' };
};

const getGrade = (value: number, higherIsBetter: boolean = true): { grade: string, color: string } => {
    const effectiveValue = higherIsBetter ? value : 100 - value;
    if (effectiveValue > 90) return { grade: 'A', color: 'bg-green-100 text-green-800' };
    if (effectiveValue > 80) return { grade: 'B', color: 'bg-yellow-100 text-yellow-800' };
    if (effectiveValue > 70) return { grade: 'C', color: 'bg-orange-100 text-orange-800' };
    if (effectiveValue > 60) return { grade: 'D', color: 'bg-red-100 text-red-800' };
    return { grade: 'F', color: 'bg-red-100 text-red-800' };
};

const ScoreGauge: React.FC<{ bureau: string, scoreInfo: CreditScoreInfo }> = ({ bureau, scoreInfo }) => {
    // FIX: Use the new hexColor property for the SVG stroke.
    // Fix: Cast score to Number to prevent potential type mismatches.
    const { rating, textColor, hexColor } = getScoreRating(Number(scoreInfo.score));
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - ((scoreInfo.score - 300) / 550) * circumference;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center border">
            <h3 className="font-bold text-lg text-gray-700">{bureau}</h3>
            <div className="relative w-40 h-40 my-3">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e9ecef" strokeWidth="8" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke={hexColor} strokeWidth="8" strokeDasharray={`${circumference} ${circumference}`} style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.8s ease-out' }} strokeLinecap="round" transform="rotate(-90 60 60)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${textColor}`}>{scoreInfo.score}</span>
                    <span className={`text-sm font-semibold ${textColor}`}>{rating}</span>
                </div>
            </div>
            <p className="text-xs text-gray-500 text-center">{scoreInfo.reason_codes[0]}</p>
        </div>
    );
};

const DebtChart: React.FC<{ report: CreditReport }> = ({ report }) => {
    const debtData = [
        { name: 'Credit Card', value: report.trade_accounts.filter(a => a.portfolio_type === 'revolving').reduce((sum, a) => sum + parseFloat(a.balance), 0), color: '#8B5CF6' },
        { name: 'Auto Loan', value: report.trade_accounts.filter(a => a.account_type === 'Auto Loan').reduce((sum, a) => sum + parseFloat(a.balance), 0), color: '#FBBF24' },
        { name: 'Home Loan', value: report.trade_accounts.filter(a => a.portfolio_type === 'mortgage').reduce((sum, a) => sum + parseFloat(a.balance), 0), color: '#EC4899' },
    ].filter(d => d.value > 0);

    const totalDebt = debtData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border h-full flex flex-col">
            <h3 className="font-bold text-lg text-gray-700">Debt Graph</h3>
            <div className="flex-1 flex items-center justify-center my-4">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={debtData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false}>
                            {debtData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 text-sm">
                            Total Debt
                        </text>
                        <text x="50%" y="50%" dy="1.2em" textAnchor="middle" dominantBaseline="middle" className="fill-gray-800 text-2xl font-bold">
                            ${totalDebt.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </text>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-2">
                {debtData.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                            <span className="font-semibold">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-600">{((item.value / totalDebt) * 100).toFixed(0)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CreditFactorCard: React.FC<{ title: string, value: string, grade: string, gradeColor: string, children: React.ReactNode }> = ({ title, value, grade, gradeColor, children }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border relative overflow-hidden">
        <div className="absolute -top-2 -left-2 w-12 h-12 bg-gray-100 rounded-full"></div>
        <div className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-bold rounded-full ${gradeColor}`}>{grade}</div>
        <h4 className="font-bold text-gray-800 relative z-10">{title}</h4>
        <p className="font-bold text-lg text-purple-600 relative z-10">{value}</p>
        <p className="text-xs text-gray-500 mt-1 relative z-10">{children}</p>
    </div>
);


const CreditPage: React.FC<CreditPageProps> = ({ report, isLoading, onFetchReport }) => {

    // --- Data Calculations ---
    const { paymentHistory, creditUsage, accountMix, creditAge, inquiries, publicRecords } = useMemo(() => {
        if (!report) return { paymentHistory: 0, creditUsage: 0, accountMix: 0, creditAge: 0, inquiries: 0, publicRecords: 0 };
        
        const totalAccounts = report.trade_accounts.length;
        if(totalAccounts === 0) return { paymentHistory: 100, creditUsage: 100, accountMix: 0, creditAge: 0, inquiries: 0, publicRecords: 0 };

        // Payment History
        const totalPayments = report.trade_accounts.reduce((sum, acc) => sum + (acc.payment_history?.split(',').length || 0), 0);
        const latePayments = report.trade_accounts.reduce((sum, acc) => sum + (acc.payment_history?.split(',').filter(p => p !== '1' && p !== '0' && p !== 'E' && p !== 'C').length || 0), 0);
        const paymentHistoryScore = totalPayments > 0 ? ((totalPayments - latePayments) / totalPayments) * 100 : 100;

        // Credit Usage
        const revolvingAccounts = report.trade_accounts.filter(a => a.portfolio_type === 'revolving' && a.credit_limit);
        const totalBalance = revolvingAccounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);
        const totalLimit = revolvingAccounts.reduce((sum, a) => sum + parseFloat(a.credit_limit!), 0);
        const usagePercentage = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;
        const creditUsageScore = 100 - Math.min(usagePercentage, 100);

        // Credit Age
        const totalMonths = report.trade_accounts.reduce((sum, acc) => sum + parseInt(acc.months_reviewed, 10), 0);
        const averageAgeMonths = totalMonths / totalAccounts;
        const creditAgeScore = Math.min((averageAgeMonths / (10 * 12)) * 100, 100);

        return {
            paymentHistory: paymentHistoryScore,
            creditUsage: creditUsageScore,
            accountMix: Math.min((totalAccounts / 10) * 100, 100),
            creditAge: creditAgeScore,
            inquiries: report.inquiries.length,
            publicRecords: report.public_record.length
        }
    }, [report]);

    if (!report) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center">
                <ShieldCheckIcon className="w-20 h-20 text-purple-300 mb-4"/>
                <h1 className="text-3xl font-bold text-gray-800">Check Your Credit Health</h1>
                <p className="text-gray-600 mt-2 max-w-md">Get a comprehensive overview of your credit scores from all three major bureaus and understand the factors that influence your financial health.</p>
                <button
                    onClick={onFetchReport}
                    disabled={isLoading}
                    className="mt-6 bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center disabled:opacity-50"
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : null}
                    {isLoading ? 'Fetching Report...' : 'Check My Credit'}
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <header className="mb-8">
                <h1 className="text-5xl font-bold text-[#1A202C]">Credit Health</h1>
                <p className="text-gray-500 mt-2">An overview of your credit scores and the factors that influence them.</p>
            </header>
            
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-8">
                {/* Score Gauges */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {report.credit_score.equifax && <ScoreGauge bureau="Equifax" scoreInfo={report.credit_score.equifax} />}
                    {report.credit_score.transunion && <ScoreGauge bureau="TransUnion" scoreInfo={report.credit_score.transunion} />}
                    {report.credit_score.experian && <ScoreGauge bureau="Experian" scoreInfo={report.credit_score.experian} />}
                    {report.trade_accounts.length > 0 && <DebtChart report={report} />}
                </section>
                
                {/* Credit Factors */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Score Analysis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CreditFactorCard title="Payment History" value={`${paymentHistory.toFixed(0)}%`} grade={getGrade(paymentHistory).grade} gradeColor={getGrade(paymentHistory).color}>
                           This score represents your creditworthiness. To determine your score, banks and credit.
                        </CreditFactorCard>
                         <CreditFactorCard title="Credit Usage" value={`${(100-creditUsage).toFixed(0)}%`} grade={getGrade(creditUsage).grade} gradeColor={getGrade(creditUsage).color}>
                           Keep your credit usage below 30% on your credit cards in order to improve this grade.
                        </CreditFactorCard>
                        <CreditFactorCard title="Account Mix" value={`${report.trade_accounts.length} Accounts`} grade={getGrade(accountMix).grade} gradeColor={getGrade(accountMix).color}>
                            You have a good mix of credit accounts. It indicates you are responsible.
                        </CreditFactorCard>
                         <CreditFactorCard title="Credit Age" value={`${(creditAge / 10).toFixed(1)} Years`} grade={getGrade(creditAge).grade} gradeColor={getGrade(creditAge).color}>
                           You have built your credit history over a long period of time. This is good for your score.
                        </CreditFactorCard>
                         <CreditFactorCard title="Inquiries" value={`${inquiries} Inquiries`} grade={getGrade(100 - (inquiries * 10), true).grade} gradeColor={getGrade(100 - (inquiries * 10)).color}>
                           You have a good mix of credit accounts. It indicates you are responsible.
                        </CreditFactorCard>
                         <CreditFactorCard title="Public Records" value={`${publicRecords} Records`} grade={getGrade(100 - (publicRecords * 50)).grade} gradeColor={getGrade(100 - (publicRecords * 50)).color}>
                           Public records like bankruptcies can significantly impact your score.
                        </CreditFactorCard>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CreditPage;