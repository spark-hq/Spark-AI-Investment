#!/usr/bin/env node

/**
 * Spark Investment AI - Automated Testing Script
 * Tests all components, pages, and features
 * 
 * Usage: node test-project.js
 */

import { existsSync, statSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testHeader(title) {
  console.log('\n' + '='.repeat(60));
  log(`  ${title}`, 'cyan');
  console.log('='.repeat(60));
}

function checkFileExists(filePath) {
  const fullPath = join(process.cwd(), filePath);
  const exists = existsSync(fullPath);
  
  if (exists) {
    log(`  ✓ ${filePath}`, 'green');
    results.passed++;
  } else {
    log(`  ✗ ${filePath} - NOT FOUND`, 'red');
    results.failed++;
  }
  
  results.tests.push({ file: filePath, passed: exists });
  return exists;
}

function checkFolderExists(folderPath) {
  const fullPath = join(process.cwd(), folderPath);
  const exists = existsSync(fullPath) && statSync(fullPath).isDirectory();
  
  if (exists) {
    log(`  ✓ ${folderPath}/`, 'green');
    results.passed++;
  } else {
    log(`  ✗ ${folderPath}/ - NOT FOUND`, 'red');
    results.failed++;
  }
  
  return exists;
}

function checkFileContent(filePath, searchString, description) {
  const fullPath = join(process.cwd(), filePath);
  
  try {
    if (!existsSync(fullPath)) {
      log(`  ⚠ ${description} - File not found`, 'yellow');
      results.warnings++;
      return false;
    }
    
    const content = readFileSync(fullPath, 'utf8');
    const found = content.includes(searchString);
    
    if (found) {
      log(`  ✓ ${description}`, 'green');
      results.passed++;
    } else {
      log(`  ✗ ${description} - Not found in file`, 'red');
      results.failed++;
    }
    
    return found;
  } catch (error) {
    log(`  ✗ ${description} - Error reading file`, 'red');
    results.failed++;
    return false;
  }
}

function countFilesInFolder(folderPath) {
  const fullPath = join(process.cwd(), folderPath);
  try {
    if (!existsSync(fullPath)) return 0;
    const files = readdirSync(fullPath);
    return files.filter(f => !f.startsWith('.')).length;
  } catch (error) {
    return 0;
  }
}

// Main test execution
async function runTests() {
  log('\n🚀 SPARK INVESTMENT AI - PROJECT TESTING SUITE', 'magenta');
  log('Testing all components, pages, and features...\n', 'cyan');

  // ============================================
  // TEST 1: Project Structure
  // ============================================
  testHeader('TEST 1: Project Structure');
  
  checkFolderExists('src');
  checkFolderExists('src/pages');
  checkFolderExists('src/components');
  checkFolderExists('src/data');
  checkFolderExists('src/utils');
  checkFileExists('package.json');
  checkFileExists('vite.config.js');
  checkFileExists('tailwind.config.cjs');

  // ============================================
  // TEST 2: Core Files
  // ============================================
  testHeader('TEST 2: Core Application Files');
  
  checkFileExists('src/main.jsx');
  checkFileExists('src/App.jsx');
  checkFileExists('src/index.css');
  checkFileExists('src/App.css');

  // ============================================
  // TEST 3: Pages
  // ============================================
  testHeader('TEST 3: Pages (7 pages)');
  
  checkFileExists('src/pages/Home.jsx');
  checkFileExists('src/pages/Dashboard.jsx');
  checkFileExists('src/pages/Calculator.jsx');
  checkFileExists('src/pages/Results.jsx');
  checkFileExists('src/pages/Investments.jsx');
  checkFileExists('src/pages/AIAnalysis.jsx');
  checkFileExists('src/pages/NotFound.jsx');

  // ============================================
  // TEST 4: UI Components
  // ============================================
  testHeader('TEST 4: UI Components (4 components)');
  
  checkFileExists('src/components/ui/Button.jsx');
  checkFileExists('src/components/ui/Card.jsx');
  checkFileExists('src/components/ui/Input.jsx');
  checkFileExists('src/components/ui/Select.jsx');

  // ============================================
  // TEST 5: Layout Components
  // ============================================
  testHeader('TEST 5: Layout Components (3 components)');
  
  checkFileExists('src/components/layout/Navbar.jsx');
  checkFileExists('src/components/layout/Footer.jsx');
  checkFileExists('src/components/layout/Layout.jsx');

  // ============================================
  // TEST 6: Dashboard Components
  // ============================================
  testHeader('TEST 6: Dashboard Components (2 components)');
  
  checkFileExists('src/components/dashboard/PortfolioSummary.jsx');
  checkFileExists('src/components/dashboard/PlatformCards.jsx');

  // ============================================
  // TEST 7: Investment Components
  // ============================================
  testHeader('TEST 7: Investment Components (4 components)');
  
  checkFileExists('src/components/investments/InvestmentCard.jsx');
  checkFileExists('src/components/investments/InvestmentFilters.jsx');
  checkFileExists('src/components/investments/InvestmentTimeline.jsx');
  checkFileExists('src/components/investments/InvestmentDetailModal.jsx');

  // ============================================
  // TEST 8: AI Analysis Components
  // ============================================
  testHeader('TEST 8: AI Analysis Components (7 components)');
  
  checkFileExists('src/components/ai-analysis/RiskMeter.jsx');
  checkFileExists('src/components/ai-analysis/ProConsList.jsx');
  checkFileExists('src/components/ai-analysis/PredictionChart.jsx');
  checkFileExists('src/components/ai-analysis/AnalysisCard.jsx');
  checkFileExists('src/components/ai-analysis/HealthScore.jsx');
  checkFileExists('src/components/ai-analysis/AIExplanation.jsx');
  checkFileExists('src/components/ai-analysis/ValuationBadge.jsx');

  // ============================================
  // TEST 9: Data Files
  // ============================================
  testHeader('TEST 9: Data Files (4 files)');
  
  checkFileExists('src/data/dummyData.js');
  checkFileExists('src/data/portfolioData.js');
  checkFileExists('src/data/investmentData.js');
  checkFileExists('src/data/aiAnalysisData.js');

  // ============================================
  // TEST 10: Utility Files
  // ============================================
  testHeader('TEST 10: Utility Files');
  
  checkFileExists('src/utils/calculations.js');

  // ============================================
  // TEST 11: Routing Configuration
  // ============================================
  testHeader('TEST 11: Routing Configuration');
  
  checkFileContent('src/App.jsx', '<Route path="/" element={<Home />}', 'Home route');
  checkFileContent('src/App.jsx', '<Route path="/dashboard" element={<Dashboard />}', 'Dashboard route');
  checkFileContent('src/App.jsx', '<Route path="/calculator" element={<Calculator />}', 'Calculator route');
  checkFileContent('src/App.jsx', '<Route path="/results" element={<Results />}', 'Results route');
  checkFileContent('src/App.jsx', '<Route path="/investments" element={<Investments />}', 'Investments route');
  checkFileContent('src/App.jsx', '<Route path="/ai-analysis" element={<AIAnalysis/>}', 'AI Analysis route');
  checkFileContent('src/App.jsx', '<Route path="*" element={<NotFound />}', '404 route');

  // ============================================
  // TEST 12: Imports in App.jsx
  // ============================================
  testHeader('TEST 12: Page Imports in App.jsx');
  
  checkFileContent('src/App.jsx', "import Home from", 'Home import');
  checkFileContent('src/App.jsx', "import Dashboard from", 'Dashboard import');
  checkFileContent('src/App.jsx', "import Calculator from", 'Calculator import');
  checkFileContent('src/App.jsx', "import Results from", 'Results import');
  checkFileContent('src/App.jsx', "import Investments from", 'Investments import');
  checkFileContent('src/App.jsx', "import AIAnalysis from", 'AIAnalysis import');
  checkFileContent('src/App.jsx', "import NotFound from", 'NotFound import');

  // ============================================
  // TEST 13: Key Features in Data Files
  // ============================================
  testHeader('TEST 13: Data File Content Validation');
  
  checkFileContent('src/data/investmentData.js', 'export const investments', 'Investment data export');
  checkFileContent('src/data/aiAnalysisData.js', 'export const aiAnalysisData', 'AI analysis data export');
  checkFileContent('src/data/aiAnalysisData.js', 'healthScore', 'Health score in AI data');
  checkFileContent('src/data/aiAnalysisData.js', 'valuation', 'Valuation in AI data');
  checkFileContent('src/data/aiAnalysisData.js', 'aiExplanation', 'AI explanation in AI data');
  checkFileContent('src/data/portfolioData.js', 'export const portfolioSummary', 'Portfolio summary export');

  // ============================================
  // TEST 14: Component Imports in Pages
  // ============================================
  testHeader('TEST 14: Component Usage in Pages');
  
  checkFileContent('src/pages/Dashboard.jsx', 'PortfolioSummary', 'Dashboard uses PortfolioSummary');
  checkFileContent('src/pages/Dashboard.jsx', 'PlatformCards', 'Dashboard uses PlatformCards');
  checkFileContent('src/pages/Investments.jsx', 'InvestmentDetailModal', 'Investments uses InvestmentDetailModal');
  checkFileContent('src/pages/Investments.jsx', 'InvestmentFilters', 'Investments uses Filters');
  checkFileContent('src/pages/Investments.jsx', 'InvestmentTimeline', 'Investments uses Timeline');
  checkFileContent('src/pages/AIAnalysis.jsx', 'RiskMeter', 'AI Analysis uses RiskMeter');
  checkFileContent('src/pages/AIAnalysis.jsx', 'HealthScore', 'AI Analysis uses HealthScore');
  checkFileContent('src/pages/AIAnalysis.jsx', 'ValuationBadge', 'AI Analysis uses ValuationBadge');
  checkFileContent('src/pages/AIAnalysis.jsx', 'AIExplanation', 'AI Analysis uses AIExplanation');

  // ============================================
  // TEST 15: Tailwind & Styling
  // ============================================
  testHeader('TEST 15: Styling & Design System');
  
  checkFileContent('src/index.css', '@tailwind', 'Tailwind CSS imported');
  checkFileContent('src/pages/Home.jsx', 'bg-gradient-to', 'Gradient backgrounds used');
  checkFileContent('src/pages/Dashboard.jsx', 'from-indigo-', 'Indigo-purple theme colors');
  checkFileContent('src/components/layout/Navbar.jsx', 'lucide-react', 'Lucide icons imported');

  // ============================================
  // TEST 16: Package Dependencies
  // ============================================
  testHeader('TEST 16: Package.json Dependencies');
  
  checkFileContent('package.json', '"react"', 'React dependency');
  checkFileContent('package.json', '"react-router-dom"', 'React Router dependency');
  checkFileContent('package.json', '"lucide-react"', 'Lucide React icons');
  checkFileContent('package.json', '"recharts"', 'Recharts for graphs');

  // ============================================
  // TEST 17: Folder Structure Count
  // ============================================
  testHeader('TEST 17: Component Count Summary');
  
  const pageCount = countFilesInFolder('src/pages');
  const uiCount = countFilesInFolder('src/components/ui');
  const layoutCount = countFilesInFolder('src/components/layout');
  const dashboardCount = countFilesInFolder('src/components/dashboard');
  const investmentCount = countFilesInFolder('src/components/investments');
  const aiCount = countFilesInFolder('src/components/ai-analysis');
  const dataCount = countFilesInFolder('src/data');
  
  log(`  Pages: ${pageCount} files (Expected: 7)`, pageCount === 7 ? 'green' : 'yellow');
  log(`  UI Components: ${uiCount} files (Expected: 4)`, uiCount === 4 ? 'green' : 'yellow');
  log(`  Layout Components: ${layoutCount} files (Expected: 3)`, layoutCount === 3 ? 'green' : 'yellow');
  log(`  Dashboard Components: ${dashboardCount} files (Expected: 2)`, dashboardCount === 2 ? 'green' : 'yellow');
  log(`  Investment Components: ${investmentCount} files (Expected: 4)`, investmentCount === 4 ? 'green' : 'yellow');
  log(`  AI Analysis Components: ${aiCount} files (Expected: 7)`, aiCount === 7 ? 'green' : 'yellow');
  log(`  Data Files: ${dataCount} files (Expected: 4)`, dataCount === 4 ? 'green' : 'yellow');

  // ============================================
  // FINAL RESULTS
  // ============================================
  console.log('\n' + '='.repeat(60));
  log('  TEST RESULTS SUMMARY', 'magenta');
  console.log('='.repeat(60));
  
  const total = results.passed + results.failed + results.warnings;
  const passRate = ((results.passed / total) * 100).toFixed(1);
  
  log(`\n  ✓ Passed: ${results.passed}`, 'green');
  log(`  ✗ Failed: ${results.failed}`, 'red');
  log(`  ⚠ Warnings: ${results.warnings}`, 'yellow');
  log(`  ━ Total Tests: ${total}`, 'cyan');
  log(`  ✦ Pass Rate: ${passRate}%\n`, passRate >= 95 ? 'green' : passRate >= 80 ? 'yellow' : 'red');

  // Status message
  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED! Project is ready!', 'green');
  } else if (results.failed <= 5) {
    log('⚠️  MOSTLY COMPLETE! Fix the failed tests.', 'yellow');
  } else {
    log('❌ MULTIPLE FAILURES! Review the project structure.', 'red');
  }

  // Project completion estimate
  const completedPages = pageCount;
  const totalExpectedPages = 15; // Total pages planned
  const completionPercentage = ((completedPages / totalExpectedPages) * 100).toFixed(0);
  
  console.log('\n' + '='.repeat(60));
  log(`  PROJECT COMPLETION: ${completionPercentage}% (${completedPages}/${totalExpectedPages} pages)`, 'cyan');
  console.log('='.repeat(60) + '\n');

  // Exit with appropriate code
  process.exit(results.failed === 0 ? 0 : 1);
}

// Run the tests
runTests().catch(error => {
  log(`\n❌ TEST SUITE ERROR: ${error.message}`, 'red');
  process.exit(1);
});