"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { VitalRecordDto } from "@nursenest/types";
import { formatDate } from "@/lib/utils";

export function VitalsChart({ vitals }: { vitals: VitalRecordDto[] }) {
  const data = [...vitals].reverse().map((v) => ({
    time: formatDate(v.recordedAt),
    heartRate: v.heartRate,
    spo2: v.spo2,
    systolic: v.systolic,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="heartRate" stroke="#059669" name="Heart Rate" />
        <Line type="monotone" dataKey="spo2" stroke="#2563eb" name="SpO2" />
        <Line type="monotone" dataKey="systolic" stroke="#dc2626" name="Systolic" />
      </LineChart>
    </ResponsiveContainer>
  );
}
