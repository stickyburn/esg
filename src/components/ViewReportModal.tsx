'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Building2, Calendar, FileText, TrendingUp } from "lucide-react";
import { getReport } from "@/lib/api"; // Assumed API function, will create if not exists

// Define the Report type based on the backend structure
interface Report {
  id: number;
  company_id: number;
  questionnaire_id: number;
  overall_score: number | null;
  section_scores: Record<string, number> | null;
  created_at: string;
  updated_at: string;
  company: {
    id: number;
    name: string;
    logo_url: string | null;
  };
  questionnaire: {
    id: number;
    name: string;
  };
}

interface ViewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: number | null;
}

export function ViewReportModal({ isOpen, onClose, reportId }: ViewReportModalProps) {
  const { data: report, isLoading, error } = useQuery<Report, Error>({
    queryKey: ["report", reportId],
    queryFn: () => getReport(reportId!), // getReport will be implemented in api lib
    enabled: !!reportId && isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ESG Report Details
          </DialogTitle>
          <DialogDescription>
            {isLoading ? "Loading report..." : error ? "Error loading report" : `Viewing report for ${report?.company.name}`}
          </DialogDescription>
        </DialogHeader>
        {!isLoading && !error && report && (
          <div className="space-y-6">
            {/* Report Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{report.company.name} - {report.questionnaire.name}</span>
                  <Badge variant={report.overall_score ? "default" : "secondary"}>
                    {report.overall_score ? `Overall Score: ${report.overall_score}/10` : "Score Pending"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>Company ID: {report.company_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Questionnaire ID: {report.questionnaire_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Generated: {new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Scores */}
            {report.section_scores && Object.keys(report.section_scores).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Section Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Section</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(report.section_scores).map(([section, score]) => (
                        <TableRow key={section}>
                          <TableCell className="font-medium capitalize">{section}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">{score}/10</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
             {/* Placeholder for future detailed responses */}
             <Card>
                <CardHeader>
                  <CardTitle>Detailed Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Detailed question-by-question responses can be added here in a future iteration.</p>
                </CardContent>
              </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}