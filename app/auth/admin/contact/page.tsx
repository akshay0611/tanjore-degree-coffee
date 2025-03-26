"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Mail, User, Clock, ChevronDown, CheckCircle, XCircle, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
  status?: "open" | "closed";
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check user authentication and role
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const role = user.user_metadata?.role;
        setUserRole(role || 'No role assigned');
        console.log('Current user:', user);
        console.log('User role:', role);
      } else {
        setUserRole('Not authenticated');
        setErrorMessage('You must be logged in to view contacts');
      }
    };
    checkUser();
  }, []);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching contacts:", error);
        setErrorMessage(`Error fetching contacts: ${error.message}`);
        setContacts([]);
      } else if (!data || data.length === 0) {
        setErrorMessage("No contacts found or you don't have permission to view them");
        setContacts([]);
      } else {
        setContacts(data);
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const updateStatus = async (id: string, newStatus: "open" | "closed") => {
    const { error } = await supabase
      .from("contacts")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      setErrorMessage(`Error updating status: ${error.message}`);
    } else {
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, status: newStatus } : contact
      ));
    }
  };

  const handleDownloadReport = () => {
    const csvContent = [
      "Name,Email,Phone,Subject,Message,Status,Created At",
      ...contacts.map(contact => 
        `${contact.name},${contact.email},${contact.phone || ''},${contact.subject},${contact.message},${contact.status || 'open'},${contact.created_at}`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contacts_report_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-4 text-amber-600">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 custom-serif">Contact Queries</h1>
          <p className="text-amber-700">Manage customer inquiries and feedback</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-amber-600">Current Role: {userRole}</p>
          <Button 
            className="bg-amber-800 hover:bg-amber-700 text-white" 
            onClick={handleDownloadReport}
            disabled={contacts.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-red-700">
            {errorMessage}
            <p className="mt-2">Please ensure you are logged in as an admin user</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-amber-900">Contact Messages</CardTitle>
          <CardDescription className="text-amber-600">
            View and manage all submitted contact queries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-amber-900">Name</TableHead>
                <TableHead className="text-amber-900">Email</TableHead>
                <TableHead className="text-amber-900">Subject</TableHead>
                <TableHead className="text-amber-900">Status</TableHead>
                <TableHead className="text-amber-900">Date</TableHead>
                <TableHead className="text-amber-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <>
                    <TableRow key={contact.id}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.subject}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={contact.status === "closed" ? "secondary" : "default"}
                          className={contact.status === "closed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}
                        >
                          {contact.status || "open"}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(contact.created_at), "MMM d, yyyy HH:mm")}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-300 text-amber-800"
                            onClick={() => toggleRow(contact.id)}
                          >
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform ${expandedRows.has(contact.id) ? "rotate-180" : ""}`} 
                            />
                          </Button>
                          {contact.status !== "closed" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-800 hover:bg-green-50"
                              onClick={() => updateStatus(contact.id, "closed")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Closed
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-amber-300 text-amber-800 hover:bg-amber-50"
                              onClick={() => updateStatus(contact.id, "open")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reopen
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(contact.id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-amber-50">
                          <div className="p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-amber-600" />
                              <span className="text-amber-900 font-medium">Message:</span>
                              <span>{contact.message}</span>
                            </div>
                            {contact.phone && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-amber-600" />
                                <span className="text-amber-900 font-medium">Phone:</span>
                                <span>{contact.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-600" />
                              <span className="text-amber-900 font-medium">Received:</span>
                              <span>{format(new Date(contact.created_at), "MMMM d, yyyy 'at' HH:mm")}</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-amber-600">
                    No contact queries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}