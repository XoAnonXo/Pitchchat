import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, 'client/public/assets');

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function capture() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log('Navigating to home...');
        await page.goto('http://localhost:5070', { waitUntil: 'networkidle0' });

        // Handle Auth (Register)
        const emailSelector = 'input[name="email"]';
        if (await page.$(emailSelector) !== null) {
            console.log('On Auth page, registering...');
            // Click "Sign Up" button
            const signUpBtn = await page.evaluateHandle(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                return btns.find(b => b.innerText.includes('Sign Up'));
            });
            if (signUpBtn) await signUpBtn.click();

            await page.waitForSelector('input[name="confirmPassword"]');

            await page.type('input[name="email"]', `screenshot_${Date.now()}@test.com`);
            await page.type('input[name="password"]', 'Password123!');
            await page.type('input[name="confirmPassword"]', 'Password123!');

            const submitBtn = await page.$('button[type="submit"]');
            await submitBtn.click();
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
        }

        console.log('Logged in.');

        // Create Project if in Empty State
        // Check for "Create Your First Project" text or button
        const createProjectText = await page.evaluate(() => document.body.innerText.includes('Create Your First Project'));
        if (createProjectText || (await page.$('h1')?.then(h => h?.evaluate(n => n.innerText)) === 'Welcome to PitchChat')) {
            console.log('Creating Demo Project...');
            // Assuming there is a button to create project/start
            // Look for "Create Project" button
            const createBtn = await page.evaluateHandle(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                return btns.find(b => b.innerText.includes('Create Project') || b.innerText.includes('Start') || b.innerText.includes('New Project'));
            });
            if (createBtn) {
                await createBtn.click();
                // Wait for modal or input
                // This depends on EmptyStateSequence implementation.
                // Let's assume it might open a dialog or straightforward.
                // If it's complex, we might skip and just screenshot the empty state.
                // Let's try to type "Demo Project" into any visible input after clicking.
                await new Promise(r => setTimeout(r, 1000));
                const input = await page.$('input[placeholder*="Name"], input[name="name"]');
                if (input) {
                    await input.type('Demo Project');
                    const saveBtn = await page.evaluateHandle(() => {
                        const btns = Array.from(document.querySelectorAll('button'));
                        return btns.find(b => b.innerText.includes('Create') || b.innerText.includes('Continue'));
                    });
                    if (saveBtn) await saveBtn.click();
                }
            }
            await new Promise(r => setTimeout(r, 2000)); // Wait for creation
        }

        // Screenshot 1: Dashboard (Analytics proxy)
        console.log('Taking Analytics screenshot...');
        await page.goto('http://localhost:5001/', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(ASSETS_DIR, 'analytics.png') });

        // Screenshot 2: Chat
        console.log('Taking Chat screenshot...');
        await page.goto('http://localhost:5001/conversations', { waitUntil: 'networkidle0' });
        // Maybe take a screenshot of a "New Chat" view?
        await page.screenshot({ path: path.join(ASSETS_DIR, 'chat.png') });

        // Screenshot 3: Documents (using Dashboard or maybe Settings for variety)
        console.log('Taking Documents screenshot...');
        // We'll just use the Dashboard again but maybe zoomed or scrolled? 
        // Or let's use the "/settings" page to look like "Security/Config"
        await page.goto('http://localhost:5001/settings', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(ASSETS_DIR, 'documents.png') });

        console.log('Screenshots captured.');
    } catch (error) {
        console.error('Error capturing screenshots:', error);
    } finally {
        await browser.close();
    }
}

capture();
