import React, { useState, useEffect } from 'react';
import {
  Target,
  Mail,
  Smartphone,
  PhoneCall,
  Layers,
  Play,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { EmailClientSimulator } from '../../components/simulation/EmailClientSimulator';
import { SmsClientSimulator } from '../../components/simulation/SmsClientSimulator';
import { VoiceCallSimulator } from '../../components/simulation/VoiceCallSimulator';
import { MultiStageSimulator } from '../../components/simulation/MultiStageSimulator';
import { api } from '../../api/client';
import { Simulation } from '../../types';

interface EmployeeMissionsPageProps {
  navigate: (path: string) => void;
}

export const EmployeeMissionsPage: React.FC<EmployeeMissionsPageProps> = ({ navigate }) => {
  const [missions, setMissions] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSimulation, setActiveSimulation] = useState<Simulation | null>(null);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    setLoading(true);
    try {
      const data = await api.simulations.getMyMissions();
      setMissions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchSimulator = (sim: Simulation) => {
    setActiveSimulation(sim);
  };

  const handleSimulatorClose = () => {
    setActiveSimulation(null);
    loadMissions();
  };

  if (loading) {
    return <LoadingState message="Loading your assigned security missions..." />;
  }

  // Active Simulator View
  if (activeSimulation) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={handleSimulatorClose}
          >
            Exit Simulator
          </Button>

          <Badge variant="info" size="sm">
            Active Mission: {activeSimulation.scenario_name}
          </Badge>
        </div>

        {activeSimulation.channel === 'EMAIL' ? (
          <EmailClientSimulator
            simulation={activeSimulation}
            onEventRecorded={() => {}}
            onClose={handleSimulatorClose}
          />
        ) : activeSimulation.channel === 'SMS' ? (
          <SmsClientSimulator
            simulation={activeSimulation}
            onEventRecorded={() => {}}
            onClose={handleSimulatorClose}
          />
        ) : activeSimulation.channel === 'VOICE' ? (
          <VoiceCallSimulator
            simulation={activeSimulation}
            onEventRecorded={() => {}}
            onClose={handleSimulatorClose}
          />
        ) : (
          <MultiStageSimulator
            simulation={activeSimulation}
            onEventRecorded={() => {}}
            onClose={handleSimulatorClose}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Active Simulation Missions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Interact with authorized security scenarios in realistic email, SMS, and voice client simulators.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={loadMissions}
        >
          Refresh Missions
        </Button>
      </div>

      {missions.length === 0 ? (
        <EmptyState
          title="No Active Missions"
          description="You currently have no pending security simulations. Great job staying secure!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map((m) => {
            const channelIcons: Record<string, React.ReactNode> = {
              EMAIL: <Mail className="w-5 h-5 text-emerald-400" />,
              SMS: <Smartphone className="w-5 h-5 text-sky-400" />,
              VOICE: <PhoneCall className="w-5 h-5 text-amber-400" />,
              MULTI_STAGE: <Layers className="w-5 h-5 text-purple-400" />
            };

            const isDone = ['COMPLETED', 'REPORTED', 'FAILED', 'CREDENTIALS_ENTERED'].includes(m.status);

            return (
              <Card
                key={m.id}
                title={m.scenario_name || 'Simulation Mission'}
                action={<Badge variant={m.scenario_difficulty?.toLowerCase() || 'medium'} size="sm">{m.scenario_difficulty || 'Medium'}</Badge>}
              >
                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                      {channelIcons[m.channel] || <Target className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block">{m.channel} Exercise</span>
                      <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                        Campaign: {m.campaign_name || 'Organization Security Assessment'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Current Status:</span>
                    <Badge variant={isDone ? 'low' : 'info'} size="sm">{m.status}</Badge>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <Button
                      variant={isDone ? 'secondary' : 'primary'}
                      size="sm"
                      icon={<Play className="w-3.5 h-3.5" />}
                      onClick={() => handleLaunchSimulator(m)}
                    >
                      {isDone ? 'Re-open Simulator' : 'Enter Mission Simulator'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
