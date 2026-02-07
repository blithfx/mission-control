"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Database, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const seedData = useMutation(api.seed.seedData);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedData();
      setSeeded(true);
    } catch (error) {
      console.error("Failed to seed data:", error);
    }
    setSeeding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Configure your Mission Control dashboard</p>
      </div>

      {/* Database Settings */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            <CardTitle>Database</CardTitle>
          </div>
          <CardDescription>Manage your Convex database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Seed Sample Data</p>
              <p className="text-sm text-zinc-400">
                Populate the database with sample activities, tasks, memories, and documents
              </p>
            </div>
            <Button
              onClick={handleSeed}
              disabled={seeding}
              variant={seeded ? "secondary" : "default"}
            >
              {seeding && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              {seeded ? "Data Seeded ✓" : "Seed Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Info */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle>Connection Info</CardTitle>
          <CardDescription>Convex deployment details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Convex URL</span>
              <code className="text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
                {process.env.NEXT_PUBLIC_CONVEX_URL || "Not configured"}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
