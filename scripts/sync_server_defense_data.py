# scripts/sync_server_defense_data.py
import os
import json

with open('src/components/training/defenseMasterData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Write to server/database/defenseData.ts
with open('server/database/defenseData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Synchronized server/database/defenseData.ts successfully!")
