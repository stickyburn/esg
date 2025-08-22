'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit,
  Calendar,
  User,
  Building2,
  MoreHorizontal,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
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

const assessments = [
  {
    id: 1,
    title: 'TechCorp ESG Assessment Q2 2023',
    issuer: 'TechCorp Inc.',
    assignedTo: 'John Doe',
    status: 'Completed',
    progress: 100,
    dueDate: '2023-06-15',
    completionDate: '2023-06-10',
    score: 8.2,
  },
  {
    id: 2,
    title: 'GreenEnergy Annual ESG Review',
    issuer: 'GreenEnergy Ltd.',
    assignedTo: 'Jane Smith',
    status: 'In Progress',
    progress: 65,
    dueDate: '2023-06-30',
    completionDate: null,
    score: null,
  },
  {
    id: 3,
    title: 'FinanceGlobal ESG Evaluation',
    issuer: 'FinanceGlobal',
    assignedTo: 'Robert Johnson',
    status: 'In Review',
    progress: 100,
    dueDate: '2023-06-20',
    completionDate: '2023-06-18',
    score: 6.8,
  },
  {
    id: 4,
    title: 'HealthPlus Initial Assessment',
    issuer: 'HealthPlus Co.',
    assignedTo: 'Sarah Williams',
    status: 'Not Started',
    progress: 0,
    dueDate: '2023-07-10',
    completionDate: null,
    score: null,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Completed':
      return <Badge variant="default" className="bg-success hover:bg-success/80">Completed</Badge>;
    case 'In Progress':
      return <Badge variant="secondary">In Progress</Badge>;
    case 'In Review':
      return <Badge variant="outline">In Review</Badge>;
    case 'Not Started':
      return <Badge variant="destructive">Not Started</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'In Progress':
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    case 'In Review':
      return <AlertCircle className="h-4 w-4 text-warning" />;
    case 'Not Started':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function AssessmentsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
            <p className="text-muted-foreground">
              Manage and track all ESG assessments.
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-2 md:mt-0">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Assessment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assessments.length}</div>
              <p className="text-xs text-muted-foreground">
                +1 from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assessments.filter(a => a.status === 'Completed').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((assessments.filter(a => a.status === 'Completed').length / assessments.length) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assessments.filter(a => a.status === 'In Progress').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  assessments
                    .filter(a => a.score !== null)
                    .reduce((sum, a) => sum + (a.score || 0), 0) / 
                  assessments.filter(a => a.score !== null).length || 0
                ).toFixed(1)}/10
              </div>
              <p className="text-xs text-muted-foreground">
                From completed assessments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assessments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Assessments</CardTitle>
            <CardDescription>
              A list of all ESG assessments in your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">{assessment.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                        {assessment.issuer}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {assessment.assignedTo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(assessment.status)}
                        {getStatusBadge(assessment.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>{assessment.progress}%</span>
                        </div>
                        <Progress value={assessment.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {assessment.dueDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      {assessment.score ? (
                        <Badge variant="secondary">{assessment.score}/10</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {assessment.status !== 'Completed' && (
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Assessment
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}