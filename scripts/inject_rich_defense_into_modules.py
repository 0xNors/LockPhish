# scripts/inject_rich_defense_into_modules.py
import re

with open('server/database/trainingMasterData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any occurrence of the old defense_sop structure passed to createRichModule
# Pattern: {\n\s*step_1: c\.sop1,\n\s*step_2: c\.sop2,\n\s*step_3: c\.sop3,[\s\S]*?prevention_checklist:[\s\S]*?\]\s*}
pattern = re.compile(r'\{\s*step_1: c\.sop1,\s*step_2: c\.sop2,\s*step_3: c\.sop3,\s*prevention_checklist:[\s\S]*?\]\s*\}')
content = pattern.sub('richDefense', content)

# Also replace static step_1 / step_2 / step_3 patterns inside createRichModule
pattern2 = re.compile(r'\{\s*step_1: \'[^\']+\',\s*step_2: \'[^\']+\',\s*step_3: \'[^\']+\',\s*prevention_checklist:[\s\S]*?\]\s*\}')
content = pattern2.sub('richDefense', content)

with open('server/database/trainingMasterData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated createRichModule calls to use richDefense!")
