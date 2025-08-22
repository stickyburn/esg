'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, FileText, BarChart3, TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ScoreTrendChart, ESGDistributionChart, IssuerComparisonChart } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to ESG Calculator. Here's what's happening with your assessments.
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-2 md:mt-0">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              New Assessment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issuers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs flex items-center text-muted-foreground">
                <span className="text-success flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  9%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs flex items-center text-muted-foreground">
                <span className="text-success flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  12%
                </span>
                from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. ESG Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.2/10</div>
              <p className="text-xs flex items-center text-muted-foreground">
                <span className="text-success flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  4.3%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs flex items-center text-muted-foreground">
                <span className="text-success flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  14%
                </span>
                from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>ESG Score Trend</CardTitle>
              <CardDescription>
                Monthly average ESG scores over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScoreTrendChart />
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>ESG Distribution</CardTitle>
              <CardDescription>
                Weight distribution across ESG categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ESGDistributionChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Comparison Chart */}
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issuer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { issuer: 'TechCorp Inc.', date: '2023-05-15', score: 8.2, status: 'Completed' },
                    { issuer: 'GreenEnergy Ltd.', date: '2023-05-12', score: 7.5, status: 'Completed' },
                    { issuer: 'FinanceGlobal', date: '2023-05-10', score: 6.8, status: 'In Review' },
                    { issuer: 'HealthPlus Co.', date: '2023-05-08', score: null, status: 'In Progress' },
                  ].map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.issuer}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        {item.score ? (
                          <Badge variant="secondary">{item.score}/10</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          item.status === 'Completed' ? 'default' :
                          item.status === 'In Review' ? 'outline' : 'secondary'
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>
                Highest ESG scores this quarter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { issuer: 'TechCorp Inc.', score: 8.2, change: '+0.4' },
                  { issuer: 'GreenEnergy Ltd.', score: 7.5, change: '+0.2' },
                  { issuer: 'FinanceGlobal', score: 6.8, change: '-0.1' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium leading-none">{item.issuer}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.score}/10
                      </p>
                    </div>
                    <div className="flex items-center">
                      {item.change.startsWith('+') ? (
                        <ArrowUpRight className="h-4 w-4 text-success mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-destructive mr-1" />
                      )}
                      <span className={`text-sm ${item.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Issuer Comparison</CardTitle>
            <CardDescription>
              ESG scores by category for top issuers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IssuerComparisonChart />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}