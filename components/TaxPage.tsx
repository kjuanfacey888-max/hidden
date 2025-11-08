import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { WalletAccount, BudgetCategory, TaxInfo } from '../types';
import { FileTextIcon, DollarSignIcon, TrendingUpIcon, WandIcon } from './icons';

interface TaxPageProps {
  accounts: WalletAccount[];
  allCategories: BudgetCategory[];
}

const InfoCard: React.FC<{ title: string; value: string; Icon: React.FC<{ className?: string }>; color: string }> = ({ title, value, Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-gray-500 font-semibold">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const TaxPage: React.FC<TaxPageProps> = ({ accounts, allCategories }) => {
    const [aiStrategies, setAiStrategies] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const taxInfo: TaxInfo = useMemo(() => {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const totalIncome = accounts
            .flatMap(acc => acc.history)
            .filter(tx => tx.type === 'deposit' && new Date(tx.date) >= oneYearAgo)
            .reduce((sum, tx) => sum + tx.amount, 0);

        const projectedAnnualIncome = totalIncome > 0 ? totalIncome * (12 / (new Date().getMonth() + 1)) : 55000; // Mock if no data

        // Simplified progressive tax calculation
        let estimatedTaxOwed = 0;
        let income = projectedAnnualIncome;
        if (income > 578125) { estimatedTaxOwed += (income - 578125) * 0.37; income = 578125; }
        if (income > 231250) { estimatedTaxOwed += (income - 231250) * 0.35; income = 231250; }
        if (income > 182100) { estimatedTaxOwed += (income - 182100) * 0.32; income = 182100; }
        if (income > 95375) { estimatedTaxOwed += (income - 95375) * 0.24; income = 95375; }
        if (income > 44725) { estimatedTaxOwed += (income - 44725) * 0.22; income = 44725; }
        if (income > 11000) { estimatedTaxOwed += (income - 11000) * 0.12; income = 11000; }
        estimatedTaxOwed += income * 0.10;

        const effectiveTaxRate = projectedAnnualIncome > 0 ? (estimatedTaxOwed / projectedAnnualIncome) * 100 : 0;

        return { projectedAnnualIncome, estimatedTaxOwed, effectiveTaxRate };
    }, [accounts]);

    const potentialWriteOffs = useMemo(() => {
        const keywords = ['business', 'education', 'work', 'office', 'charity', 'donations'];
        return allCategories.filter(cat => keywords.some(kw => cat.name.toLowerCase().includes(kw)));
    }, [allCategories]);

    const generateStrategies = async () => {
        setIsLoading(true);
        setError(null);
        setAiStrategies([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const financialContext = JSON.stringify({
                income: taxInfo.projectedAnnualIncome,
                spending: allCategories.map(c => ({ category: c.name, amount: c.spent * 12 })), // Annualize
            });

            const prompt = `Based on this financial summary: ${financialContext}. Generate 3 actionable and personalized tax-saving strategies for a user in the US. Examples: "Maximize 401(k)/IRA contributions", "Look into HSA eligibility", "Harvest investment losses". Provide a brief, one-sentence explanation for each.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            strategies: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING,
                                    description: "A single tax strategy, formatted as 'Strategy Name: Brief explanation.'"
                                }
                            }
                        },
                        required: ['strategies']
                    }
                }
            });
            
            const data = JSON.parse(response.text);
            setAiStrategies(data.strategies);

        } catch (e) {
            console.error("AI tax strategy generation failed:", e);
            setError("Sorry, the AI could not generate strategies at this time.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="h-full flex flex-col">
            <header className="mb-8">
                <h1 className="text-5xl font-bold text-[#1A202C]">Tax Center</h1>
                <p className="text-gray-500 mt-2">Estimate your tax burden and discover optimization strategies.</p>
            </header>

            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-8">
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InfoCard title="Projected Annual Income" value={`$${taxInfo.projectedAnnualIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} Icon={TrendingUpIcon} color="bg-blue-500" />
                        <InfoCard title="Estimated Tax Owed" value={`$${taxInfo.estimatedTaxOwed.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} Icon={DollarSignIcon} color="bg-red-500" />
                        <InfoCard title="Effective Tax Rate" value={`${taxInfo.effectiveTaxRate.toFixed(1)}%`} Icon={FileTextIcon} color="bg-purple-500" />
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">AI Tax Strategies</h2>
                        <button onClick={generateStrategies} disabled={isLoading} className="flex items-center space-x-2 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50">
                             {isLoading ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <WandIcon className="w-5 h-5" />
                            )}
                            <span>Generate Strategies</span>
                        </button>
                    </div>
                     {error && <p className="text-red-500">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {aiStrategies.map((strategy, index) => {
                            const [title, ...rest] = strategy.split(':');
                            const description = rest.join(':').trim();
                            return (
                                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border">
                                    <h3 className="font-bold text-purple-700">{title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section>
                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Potential Write-Offs</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {potentialWriteOffs.map(category => (
                             <div key={category.id} className="bg-white p-6 rounded-2xl shadow-sm border">
                                <div className="flex items-center space-x-3 mb-2">
                                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white`} style={{backgroundColor: category.color}}>
                                        <category.Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Expenses in this category may be tax-deductible. Money spent on business supplies or continuing education can often lower your taxable income. Consult a tax professional.
                                </p>
                             </div>
                        ))}
                     </div>
                </section>
            </div>
        </div>
    );
};

export default TaxPage;