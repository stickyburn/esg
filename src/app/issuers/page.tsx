'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download
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

const issuers = [
  {
    id: 1,
    name: 'TechCorp Inc.',
    industry: 'Technology',
    country: 'United States',
    esgScore: 8.2,
    lastAssessment: '2023-05-15',
    status: 'Active',
  },
  {
    id: 2,
    name: 'GreenEnergy Ltd.',
    industry: 'Energy',
    country: 'Germany',
    esgScore: 7.5,
    lastAssessment: '2023-05-12',
    status: 'Active',
  },
  {
    id: 3,
    name: 'FinanceGlobal',
    industry: 'Financial Services',
    country: 'United Kingdom',
    esgScore: 6.8,
    lastAssessment: '2023-05-10',
    status: 'Active',
  },
  {
    id: 4,
    name: 'HealthPlus Co.',
    industry: 'Healthcare',
    country: 'Canada',
    esgScore: null,
    lastAssessment: null,
    status: 'Pending',
  },
];

export default function IssuersPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Issuers Management</h1>
            <p className="text-muted-foreground">
              Manage and view all your issuer profiles.
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-2 md:mt-0">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Issuer
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search issuers..." 
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export Excel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Building2 className="mr-2 h-4 w-4" />
                      Bulk Import
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issuers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Issuers</CardTitle>
            <CardDescription>
              A list of all the issuers in your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>ESG Score</TableHead>
                  <TableHead>Last Assessment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issuers.map((issuer) => (
                  <TableRow key={issuer.id}>
                    <TableCell className="font-medium">{issuer.name}</TableCell>
                    <TableCell>{issuer.industry}</TableCell>
                    <TableCell>{issuer.country}</TableCell>
                    <TableCell>
                      {issuer.esgScore ? (
                        <Badge variant="secondary">{issuer.esgScore}/10</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {issuer.lastAssessment || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={issuer.status === 'Active' ? 'default' : 'secondary'}>
                        {issuer.status}
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
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