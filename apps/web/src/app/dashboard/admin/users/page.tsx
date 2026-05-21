"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import type { AuthUserDto, PaginatedDto } from "@nursenest/types";

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiFetch<PaginatedDto<AuthUserDto>>("/api/v1/admin/users?limit=50"),
  });

  const toggle = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiFetch(`/api/v1/admin/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(data?.items ?? []).map((u) => (
          <div key={u.id} className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">{u.email}</p>
              <Badge variant="secondary">{u.role}</Badge>
            </div>
            <Button
              size="sm"
              variant={u.isActive ? "outline" : "default"}
              onClick={() => toggle.mutate({ id: u.id, isActive: !u.isActive })}
            >
              {u.isActive ? "Deactivate" : "Activate"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
