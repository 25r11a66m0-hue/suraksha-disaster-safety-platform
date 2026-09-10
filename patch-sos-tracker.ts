import fs from 'fs';
let content = fs.readFileSync('src/components/SosTracker.tsx', 'utf-8');

content = content.replace(
  "{sos.assignedTeam && (",
  "{sos.assignedTeamId && ("
);

content = content.replace(
  "<strong className=\"text-[#434338] text-sm\">{sos.assignedTeam.name}</strong>",
  "<strong className=\"text-[#434338] text-sm\">{sos.assignedTeamName || 'Assigned Unit'}</strong>"
);

content = content.replace(
  "<span className=\"text-[#7a7a67] ml-2\">({sos.assignedTeam.type})</span>",
  ""
);

content = content.replace(
  "<a\n              href={`tel:${sos.assignedTeam.contactPhone}`}",
  "<a\n              href={`tel:+910000000000`}"
);

fs.writeFileSync('src/components/SosTracker.tsx', content);
