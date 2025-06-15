#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const program = new Command();

// Default API URL from environment variable or fallback
const DEFAULT_API_URL = process.env.MIDDLEWARE_API_URL || 'http://localhost:4000';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Analytics {
  usersCount: number;
  active: number;
}

// Helper function to check if API is running
async function checkApiHealth(url: string): Promise<boolean> {
  try {
    await axios.get(`${url}/users`);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to handle API errors
function handleApiError(error: any) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNREFUSED') {
      console.error(chalk.red('Error: Could not connect to the middleware API. Is it running?'));
    } else {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  } else {
    console.error(chalk.red('An unexpected error occurred'));
  }
  process.exit(1);
}

program
  .name('middleware-cli')
  .description('CLI tool for monitoring middleware API')
  .version('1.0.0');

program
  .option('-u, --url <url>', 'Middleware API URL', DEFAULT_API_URL);

program
  .command('status')
  .description('Check if the middleware API is running')
  .action(async (options) => {
    const apiUrl = options.parent.url;
    try {
      const isRunning = await checkApiHealth(apiUrl);
      if (isRunning) {
        console.log(chalk.green('✓ Middleware API is running'));
      } else {
        console.log(chalk.red('✗ Middleware API is not responding'));
      }
    } catch (error) {
      handleApiError(error);
    }
  });

program
  .command('users')
  .description('List all users from the middleware API')
  .action(async (options) => {
    const apiUrl = options.parent.url;
    try {
      const response = await axios.get<User[]>(`${apiUrl}/users`);
      const users = response.data;
      
      if (users.length === 0) {
        console.log(chalk.yellow('No users found'));
        return;
      }

      console.log(chalk.blue('\nUsers:'));
      users.forEach(user => {
        console.log(chalk.white(`\nID: ${user.id}`));
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
      });
    } catch (error) {
      handleApiError(error);
    }
  });

program
  .command('analytics')
  .description('Display analytics data from the middleware API')
  .action(async (options) => {
    const apiUrl = options.parent.url;
    try {
      const response = await axios.get<Analytics>(`${apiUrl}/analytics`);
      const analytics = response.data;

      console.log(chalk.blue('\nAnalytics:'));
      console.log(chalk.white(`Total Users: ${analytics.usersCount}`));
      console.log(chalk.white(`Active Users: ${analytics.active}`));
    } catch (error) {
      handleApiError(error);
    }
  });

program.parse();