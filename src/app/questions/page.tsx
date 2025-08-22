'use client';

import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Plus, 
  Settings, 
  FileText, 
  List,
  Calculator,
  BookOpen,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy
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

const sections = [
  {
    id: 1,
    name: 'Environmental Factors',
    description: 'Questions related to environmental impact',
    questionCount: 12,
    scoringMethod: 'Weighted Average',
  },
  {
    id: 2,
    name: 'Social Responsibility',
    description: 'Questions about social practices and policies',
    questionCount: 8,
    scoringMethod: 'Sum',
  },
  {
    id: 3,
    name: 'Governance Structure',
    description: 'Questions about corporate governance',
    questionCount: 10,
    scoringMethod: 'Custom Formula',
  },
];

const questions = [
  {
    id: 1,
    text: 'What is the company\'s policy on carbon emissions reduction?',
    section: 'Environmental Factors',
    type: 'Multiple Choice',
    required: true,
    weight: 1.5,
  },
  {
    id: 2,
    text: 'Does the company have a diversity and inclusion program?',
    section: 'Social Responsibility',
    type: 'Yes/No',
    required: true,
    weight: 1.0,
  },
  {
    id: 3,
    text: 'What percentage of board members are independent?',
    section: 'Governance Structure',
    type: 'Numeric Range',
    required: true,
    weight: 2.0,
  },
];

const templates = [
  {
    id: 1,
    name: 'Technology Sector Template',
    description: 'ESG assessment template for technology companies',
    sections: 3,
    questions: 25,
    lastUpdated: '2023-05-10',
  },
  {
    id: 2,
    name: 'Financial Services Template',
    description: 'ESG assessment template for financial institutions',
    sections: 4,
    questions: 30,
    lastUpdated: '2023-04-22',
  },
];

export default function QuestionsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Questions & Scoring</h1>
            <p className="text-muted-foreground">
              Manage assessment questions, sections, and scoring configurations.
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-2 md:mt-0">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Scoring Engine
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Question
            </Button>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="sections" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sections" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Sections</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Questions</span>
            </TabsTrigger>
            <TabsTrigger value="scoring" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Scoring</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Section Management Tab */}
          <TabsContent value="sections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Sections</CardTitle>
                <CardDescription>
                  Manage different sections of your ESG assessment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{section.name}</h3>
                          <Badge variant="outline">{section.scoringMethod}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                        <p className="text-xs text-muted-foreground">{section.questionCount} questions</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Questions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calculator className="mr-2 h-4 w-4" />
                              Configure Scoring
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Question Library</CardTitle>
                <CardDescription>
                  View and manage all questions across all sections.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">{question.text}</TableCell>
                        <TableCell>{question.section}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{question.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {question.required ? (
                            <Badge variant="default">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>{question.weight}</TableCell>
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
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
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
          </TabsContent>
          
          {/* Scoring Tab */}
          <TabsContent value="scoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scoring Engine Configuration</CardTitle>
                <CardDescription>
                  Configure how scores are calculated for sections and overall assessments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Section Scoring</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Environmental Factors</span>
                          <span className="text-sm font-medium">Weighted Average</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Social Responsibility</span>
                          <span className="text-sm font-medium">Sum</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Governance Structure</span>
                          <span className="text-sm font-medium">Custom Formula</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Overall Scoring</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Environmental Weight</span>
                          <span className="text-sm font-medium">40%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Social Weight</span>
                          <span className="text-sm font-medium">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Governance Weight</span>
                          <span className="text-sm font-medium">30%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure Scoring
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Templates</CardTitle>
                <CardDescription>
                  Manage and use templates for different types of assessments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>{template.sections} sections</span>
                          <span>{template.questions} questions</span>
                          <span>Last updated: {template.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Use Template
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
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
                      </div>
                    </div>
                  ))}
                  <Button className="w-full" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}