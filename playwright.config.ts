import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

import * as dotenv from 'dotenv'; // Use import * as dotenv for compatibility
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

export default defineConfig<TestOptions>({
  timeout: 40000,
  // globalTimeout: 60000,
  expect: {
    timeout: 2000,
    toHaveScreenshot: {
      maxDiffPixels: 50
    }
  },

  retries: 1,
  //   /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  // /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['json', { outputFile: 'test-results/jsonReport.json' }],
    ['junit', { outputFile: 'test-results/junitReport.xml' }],
    // ['allure-playwright'],
    ['html']
  ],

  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'  // Ternary operator. CLI commands: set "DEV=1" & npx playwright test usePageObjects.spec.ts --project=chromium --headed or set "STAGING=1" & npx playwright test usePageObjects.spec.ts --project=chromium --headed
      : process.env.STAGING === '1' ? 'http://localhost:4202/'
        : 'http://localhost:4200/',

    trace: 'on-first-retry',
    actionTimeout: 5000,
    navigationTimeout: 25000,
    video: {
      mode: 'off',
      size: {
        width: 1920,
        height: 1080
      }
    }
  },

  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
      },
    },
    {
      name: 'chromium'
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        video: {
          mode: 'off',
          size: {
            width: 1920,
            height: 1080
          }
        }
      }
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit'
      }
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        viewport: {
          width: 1920,
          height: 1080
        }
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro']
        // viewport: {
        //   width: 414,
        //   height: 800
        // }
      }
    }
  ],

  webServer: {
    command: 'npm run start',
    url:'http://localhost:4200/',
    // timeout: 120000
  }
});
