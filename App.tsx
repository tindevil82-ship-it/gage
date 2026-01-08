
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType } from './types';
import TransactionForm from './components/TransactionForm';
import Dashboard from './components/Dashboard';
import { getFinancialAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gemini-ledger-transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load transactions", e);
      }
    }
  }, []);

  // Save to local storage when transactions change
  useEffect(() => {
    localStorage.setItem('gemini-ledger-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const fetchAdvice = async () => {
    if (transactions.length === 0) return;
    setLoadingAdvice(true);
    const advice = await getFinancialAdvice(transactions);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Gemini Ledger</h1>
          </div>
          <button 
            onClick={fetchAdvice}
            disabled={loadingAdvice || transactions.length === 0}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loadingAdvice ? (
              <span className="animate-pulse">분석 중...</span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                AI 분석 받기
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* AI Insight Section */}
        {aiAdvice && (
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45L19.15 19H4.85L12 5.45zM11 17h2v2h-2v-2zm0-8h2v6h-2V9z"/></svg>
             </div>
             <div className="relative z-10">
               <h3 className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                 AI 재정 인사이트
               </h3>
               <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{aiAdvice}</p>
             </div>
          </div>
        )}

        <Dashboard transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TransactionForm onAdd={addTransaction} />
            </div>
          </div>

          {/* List section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold">최근 거래 내역</h3>
                <span className="text-xs text-slate-400 font-medium">총 {transactions.length}건</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <p>등록된 내역이 없습니다.</p>
                    <p className="text-sm">새로운 수입이나 지출을 추가해보세요!</p>
                  </div>
                ) : (
                  transactions.map(tx => (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {tx.type === TransactionType.INCOME ? '+' : '-'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{tx.category}</p>
                          <p className="text-xs text-slate-500">{tx.date} • {tx.description || '내용 없음'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={`font-bold ${tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.type === TransactionType.INCOME ? '+' : '-'} ₩{tx.amount.toLocaleString()}
                        </p>
                        <button 
                          onClick={() => deleteTransaction(tx.id)}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
