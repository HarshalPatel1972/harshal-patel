import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  const commitCount = execSync('git rev-list --count HEAD').toString().trim();
  const stats = {
    commitCount: parseInt(commitCount, 10),
    lastUpdated: new Date().toISOString()
  };

  const targetPath = path.join(process.cwd(), 'src/data/stats.json');
  
  // Ensure directory exists
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(targetPath, JSON.stringify(stats, null, 2));
  console.log(`✅ Updated commit count: ${commitCount}`);
} catch (error) {
  console.error('❌ Failed to update commit count:', error.message);
}
