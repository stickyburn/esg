'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ViewReportModal } from '@/components'; // Import the modal
import { useReports } from '@/lib/api'; // Import the hook
import {
  BarChart3,
  TrendingUp,
  Download,
  FileText,
  Calendar,
  Building2,
  MoreHorizontal,
  Eye,
  Plus,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const comparisons = [
  {
    id: 1,
    title: 'TechCorp vs GreenEnergy',
    issuers: ['TechCorp Inc.', 'GreenEnergy Ltd.'],
    date: '2023-06-12',
    period: 'Q2 2023',
  },
  {
    id: 2,
    title: 'Technology Sector Benchmark',
    issuers: ['TechCorp Inc.', 'DataSoft', 'CloudNet'],
    date: '2023-05-20',
    period: 'Q1-Q2 2023',
  },
];

const historicalData = [
  {
    period: 'Q1 2023',
    avgScore: 6.8,
    assessments: 8,
    topPerformer: 'TechCorp Inc.',
    topScore: 7.9,
  },
  {
    period: 'Q2 2023',
    avgScore: 7.2,
    assessments: 12,
    topPerformer: 'TechCorp Inc.',
    topScore: 8.2,
  },
];

export default function ReportsPage() {
  const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const { data: reports = [], isLoading, error } = useReports();
  
  console.log("Reports data:", reports);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);

  const handleViewReport = (reportId: number) => {
    setSelectedReportId(reportId);
    setIsViewReportModalOpen(true);
  };

  return (
    <>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Generate and view ESG assessment reports and analytics.
              </p>
            </div>
            <div className="mt-4 flex items-center space-x-2 md:mt-0">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.length}</div>
                <p className="text-xs text-muted-foreground">
                  {reports.length > 0 ? 'Total generated reports' : 'No reports yet'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. ESG Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reports.length > 0 
                    ? (reports.reduce((sum: number, report: any) => sum + (report.overall_score || 0), 0) / reports.filter((r: any) => r.overall_score !== null).length || 1).toFixed(1)
                    : '0.0'}/10
                </div>
                <p className="text-xs text-muted-foreground">
                  {reports.length > 0 ? 'Based on completed assessments' : 'No data available'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comparisons</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Created this quarter
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Generated</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reports.length > 0 ? new Date(reports[0]?.created_at).toLocaleDateString() : 'No reports'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Latest report
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different report types */}
          <Tabs defaultValue="results" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="results" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Results</span>
              </TabsTrigger>
              <TabsTrigger value="historical" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Historical</span>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Comparison</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </TabsTrigger>
            </TabsList>

            {/* Assessment Results Tab */}
            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Results</CardTitle>
                  <CardDescription>
                    View detailed results from completed ESG assessments.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Issuer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">Loading reports...</TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-red-500">
                            Error loading reports: {(error as Error).message}
                          </TableCell>
                        </TableRow>
                      ) : reports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">No reports found</TableCell>
                        </TableRow>
                      ) : (
                        reports.map((report: any) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">
                              {report.company.name} ESG Assessment
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                                {report.company.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Assessment Result</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                {new Date(report.created_at).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              {report.overall_score !== null ? (
                                <Badge variant="secondary">{report.overall_score}/10</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">
                                Completed
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewReport(report.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Report
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Excel
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Historical Analysis Tab */}
            <TabsContent value="historical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historical Analysis</CardTitle>
                  <CardDescription>
                    Track ESG performance trends over time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {historicalData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-medium">{data.period}</h3>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{data.assessments} assessments</span>
                            <span>Avg. Score: {data.avgScore}/10</span>
                            <span>Top: {data.topPerformer} ({data.topScore}/10)</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh Data
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comparison Views Tab */}
            <TabsContent value="comparison" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comparison Views</CardTitle>
                  <CardDescription>
                    Compare ESG performance between different issuers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comparisons.map((comparison) => (
                      <div key={comparison.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-medium">{comparison.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {comparison.issuers.join(' vs ')}
                          </p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Period: {comparison.period}</span>
                            <span>Date: {comparison.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            View Comparison
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Update Comparison
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Comparison
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Export Center Tab */}
            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export Center</CardTitle>
                  <CardDescription>
                    Configure and export ESG data in various formats.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Excel Reports</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Export detailed assessment data with charts and visualizations.
                        </p>
                        <Button className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Export Excel
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">PDF Reports</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Generate professional PDF reports with company branding.
                        </p>
                        <Button className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Export PDF
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Raw Data</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Export assessment data in CSV or JSON format for analysis.
                        </p>
                        <Button className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Export Data
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
      <ViewReportModal
        isOpen={isViewReportModalOpen}
        onClose={() => setIsViewReportModalOpen(false)}
        reportId={selectedReportId}
      />
    </>
  );
}