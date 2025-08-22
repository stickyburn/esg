"use client"

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    score: 6.5,
  },
  {
    name: 'Feb',
    score: 7.0,
  },
  {
    name: 'Mar',
    score: 6.8,
  },
  {
    name: 'Apr',
    score: 7.2,
  },
  {
    name: 'May',
    score: 7.5,
  },
  {
    name: 'Jun',
    score: 7.2,
  },
];

const COLORS = ['#0f4c75', '#2ecc71', '#f39c12', '#e74c3c'];

const pieData = [
  { name: 'Environmental', value: 40 },
  { name: 'Social', value: 30 },
  { name: 'Governance', value: 30 },
];

const barData = [
  {
    name: 'TechCorp',
    environmental: 8.5,
    social: 7.8,
    governance: 8.3,
  },
  {
    name: 'GreenEnergy',
    environmental: 9.0,
    social: 7.2,
    governance: 6.8,
  },
  {
    name: 'FinanceGlobal',
    environmental: 6.5,
    social: 7.0,
    governance: 7.5,
  },
];

export function ScoreTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[6, 8]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="score" stroke="#0f4c75" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ESGDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function IssuerComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="environmental" fill="#0f4c75" />
        <Bar dataKey="social" fill="#2ecc71" />
        <Bar dataKey="governance" fill="#f39c12" />
      </BarChart>
    </ResponsiveContainer>
  );
}