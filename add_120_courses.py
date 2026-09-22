import re

# Load trainingMasterData.ts
with open('server/database/trainingMasterData.ts', 'r') as f:
    code = f.read()

# Let's inspect where remainingTopics is defined
start_marker = "const remainingTopics: Array<{"
end_marker = "];\n\n// Add structured courses for all remaining topics"
if end_marker not in code:
    end_marker = "];\n\n// Build remaining courses"

print("Start marker found:", start_marker in code)
print("End marker found:", end_marker in code)
