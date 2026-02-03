"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Monitor, Database, RefreshCcw } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);

  const pollCDC = async () => {
    setLoading("cdc");
    await fetch("/api/test/cdc", { method: "POST" });
    setLoading(null);
  };

  const pollCDCConfig = async () => {
    setLoading("config");
    await fetch("/api/test/cdc-config", { method: "POST" });
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          IPIS – PDC Dashboard
        </h1>

        <div className="flex gap-3">
          <Button
            onClick={pollCDC}
            disabled={loading === "cdc"}
            className="gap-2"
          >
            <RefreshCcw size={16} />
            {loading === "cdc" ? "Polling…" : "Poll CDC"}
          </Button>

          <Button
            variant="outline"
            onClick={pollCDCConfig}
            disabled={loading === "config"}
            className="gap-2"
          >
            <RefreshCcw size={16} />
            {loading === "config" ? "Polling…" : "Poll Config"}
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <Monitor className="text-blue-600" size={28} />
            <div>
              <p className="text-sm text-zinc-500">Platform</p>
              <p className="text-xl font-semibold">PF-1</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <Database className="text-emerald-600" size={28} />
            <div>
              <p className="text-sm text-zinc-500">Display Devices</p>
              <p className="text-xl font-semibold">7 Connected</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <Activity className="text-rose-600" size={28} />
            <div>
              <p className="text-sm text-zinc-500">CDC Status</p>
              <p className="text-xl font-semibold text-green-600">Online</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Latest Trains</h2>
            <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
              <li>12314 – Rajdhani Express – 10:10</li>
              <li>12304 – Rajdhani Express – 10:15</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Line Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                INT: <b>50</b>
              </p>
              <p>
                PTO: <b>10</b>
              </p>
              <p>
                DTO: <b>60</b>
              </p>
              <p>
                CHR: <b>3</b>
              </p>
              <p>
                EFF: <b>9</b>
              </p>
              <p>
                SPD: <b>0</b>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-12 text-center text-sm text-zinc-500">
        Integrated Passenger Information System · PDC Module · JES TECH
      </footer>
    </div>
  );
}
