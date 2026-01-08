
import React, { useState } from 'react';
import { TransactionType, Transaction } from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAdd({
      type,
      amount: Number(amount),
      category,
      description,
      date
    });

    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold mb-4">내역 추가하기</h3>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setType(TransactionType.EXPENSE)}
          className={`flex-1 py-2 rounded-lg font-medium transition-all ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          지출
        </button>
        <button
          type="button"
          onClick={() => setType(TransactionType.INCOME)}
          className={`flex-1 py-2 rounded-lg font-medium transition-all ${type === TransactionType.INCOME ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          수입
        </button>
      </div>

      <div className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          type="number"
          placeholder="금액 (₩)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          type="text"
          placeholder="카테고리 (식비, 교통 등)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          type="text"
          placeholder="상세 내용"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          기록하기
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
