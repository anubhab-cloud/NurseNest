"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import type { InvoiceDto } from "@nursenest/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function NurseEarningsPage() {
  const { data: invoices = [] } = useQuery({
    queryKey: ["nurse-invoices"],
    queryFn: () => apiFetch<InvoiceDto[]>("/api/v1/nurse/me/invoices"),
  });

  const paid = invoices.filter((i) => i.status === "PAID");
  const total = paid.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{formatCurrency(total)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {invoices.map((i) => (
            <div key={i.id} className="flex justify-between border-b pb-2">
              <span>{formatDate(i.createdAt)}</span>
              <span>{formatCurrency(i.amount)}</span>
              <Badge>{i.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
