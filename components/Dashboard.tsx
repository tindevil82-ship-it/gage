
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface DashboardProps {
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
  
  const categoryData = expenseTransactions.reduce((acc: any[], curr) => {
    const existing = acc.find(a => a.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = expenseTransactions
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Summary Cards */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500 text-sm font-medium">현재 잔액</p>
        <p className="text-2xl font-bold text-slate-900">₩ {balance.toLocaleString()}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500 text-sm font-medium text-emerald-600">총 수입</p>
        <p className="text-2xl font-bold text-emerald-600">₩ {totalIncome.toLocaleString()}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500 text-sm font-medium text-red-500">총 지출</p>
        <p className="text-2xl font-bold text-red-500">₩ {totalExpense.toLocaleString()}</p>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2 h-80">
        <h4 className="font-bold mb-4">카테고리별 지출</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-80">
        <h4 className="font-bold mb-4">지출 분포</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
