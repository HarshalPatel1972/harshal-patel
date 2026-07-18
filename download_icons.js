const fs = require('fs');
const https = require('https');
const icons = ['cplusplus', 'go', 'typescript', 'rust', 'python', 'gnubash'];
const results = {};
let completed = 0;
icons.forEach(icon => {
  https.get('https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/' + icon + '.svg', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/<path d="([^"]+)"/);
      if(match) {
        results[icon] = match[1];
      }
      completed++;
      if(completed === icons.length) {
        fs.writeFileSync('src/components/new/SkillIcons.ts', 'export const skillPaths: Record<string, string> = ' + JSON.stringify(results, null, 2) + ';');
        console.log('Icons downloaded successfully!');
      }
    });
  });
});
