# scripts/generate_defense_file.py
import json
import os

courses = {}

def reg(code, title, sop_title, severity, obj, s1, s2, s3, s4, chk, std, mitre, act):
    courses[code] = {
        "code": code,
        "title": title,
        "sop_title": sop_title,
        "severity": severity,
        "strategic_objective": obj,
        "step_1": s1,
        "step_2": s2,
        "step_3": s3,
        "step_4": s4,
        "checklist": chk,
        "official_standards": std,
        "mitre_techniques": mitre,
        "incident_response_action": act
    }

# Load tracks
from track_data_1 import load_track_1
from track_data_2 import load_track_2
from track_data_3 import load_track_3

load_track_1(reg)
load_track_2(reg)
load_track_3(reg)

print(f"Loaded {len(courses)} courses total.")

ts_output = f"""// LockPhish Masterclass Academy - Complete 120-Course Defense SOP & Runbook Catalog
// Fully specialized, differentiated Standard Operating Procedures for all 120 cybersecurity masterclasses across 12 Learning Paths.

export interface DefenseChecklistItem {{
  id: string;
  label: string;
  detail: string;
}}

export interface DefenseSopDetail {{
  code: string;
  title: string;
  sop_title: string;
  severity: 'P1 - CRITICAL / ACTIVE COMPROMISE' | 'P2 - HIGH RISK / IDENTITY TARGET' | 'P3 - MEDIUM / RECONNAISSANCE' | 'P4 - OPERATIONAL HYGIENE';
  strategic_objective: string;
  step_1: string; // Phase 1: Tactical Freeze & Immediate Triage
  step_2: string; // Phase 2: Technical Forensics & Out-of-Band Inspection
  step_3: string; // Phase 3: Containment, Blast-Radius Mitigation & SOC Escalation
  step_4: string; // Phase 4: Enterprise Technical Controls & Architectural Hardening
  checklist: DefenseChecklistItem[];
  official_standards: string[];
  mitre_techniques: string[];
  incident_response_action: string;
}}

export const allDefenseSops: Record<string, DefenseSopDetail> = {json.dumps(courses, indent=2)};

export const getDefenseSop = (code?: string, title?: string, category?: string): DefenseSopDetail => {{
  if (code && allDefenseSops[code]) {{
    return allDefenseSops[code];
  }}

  // Normalized code lookup
  if (code) {{
    const upper = code.toUpperCase();
    const foundKey = Object.keys(allDefenseSops).find(k => k === upper || k.includes(upper) || upper.includes(k));
    if (foundKey && allDefenseSops[foundKey]) {{
      return allDefenseSops[foundKey];
    }}
  }}

  // Title-based lookup
  if (title) {{
    const cleanT = title.toLowerCase();
    const foundByTitle = Object.values(allDefenseSops).find(s => cleanT.includes(s.code.toLowerCase().replace('course-', '').replace(/-/g, ' ')) || cleanT.includes(s.title.toLowerCase().replace(/^[^\\w]+/, '').trim().toLowerCase()));
    if (foundByTitle) return foundByTitle;
  }}

  // Default fallback to Course 01
  return allDefenseSops['COURSE-01-CYBER-BASICS'];
}};
"""

with open('src/components/training/defenseMasterData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_output)

print("Saved src/components/training/defenseMasterData.ts successfully!")
