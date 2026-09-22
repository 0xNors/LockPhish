import React, { useState, useEffect } from 'react';
import {
  History,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { SimulationReplayModal } from '../../components/simulation/SimulationReplayModal';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface EmployeeResultsPageProps {
  navigate: (path: string) => void;
}

export const EmployeeResultsPage: React.FC<EmployeeResultsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replayData, setReplayData] = useState<any>(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      if (user?.employee_id) {
        const data = await api.employees.get(user.employee_id);
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReplay = async (simId: string) => {
    try {
      const replay = await api.simulations.getReplay(simId);
      setReplayData(replay);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingState message="Loading your historical results..." />;
  }

  const simulations = profile?.simulations || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">My Simulation History & Results</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past security simulation missions and inspect timeline replays.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={loadResults}
        >
          Refresh History
        </Button>
      </div>

      {simulations.length === 0 ? (
        <EmptyState
          title="No simulation history"
          description="Completed simulation missions and their debrief replays will appear here."
        />
      ) : (
        <Card title="Completed Missions & Behavioral Replays">
          <Table
            data={simulations as any[]}
            keyExtractor={(s: any) => s.id}
            columns={[
              {
                header: 'Mission Name',
                accessor: (s: any) => (
                  <div>
                    <span className="font-bold text-slate-100 block">{s.scenario_name || s.scenario_category}</span>
                    <span className="text-[11px] text-slate-500">Campaign: {s.campaign_name}</span>
                  </div>
                )
              },
              {
                header: 'Channel',
                accessor: (s: any) => <Badge variant="info" size="sm">{s.channel}</Badge>
              },
              {
                header: 'Outcome',
                accessor: (s: any) => (
                  <Badge
                    variant={s.status === 'REPORTED' ? 'low' : s.status === 'CREDENTIALS_ENTERED' || s.status === 'FAILED' ? 'critical' : 'medium'}
                    size="sm"
                  >
                    {s.status}
                  </Badge>
                )
              },
              {
                header: 'Date',
                accessor: (s: any) => <span className="text-[11px] font-mono text-slate-400">{new Date(s.created_at).toLocaleDateString()}</span>
              },
              {
                header: 'Replay',
                accessor: (s: any) => (
                  <Button variant="ghost" size="sm" onClick={() => handleOpenReplay(s.id)}>
                    View Replay
                  </Button>
                )
              }
            ]}
          />
        </Card>
      )}

      {/* Safe Simulation Replay Modal */}
      <SimulationReplayModal
        isOpen={Boolean(replayData)}
        onClose={() => setReplayData(null)}
        replayData={replayData}
      />
    </div>
  );
};
