import { Given, When, Then,setDefaultTimeout,BeforeAll} from '@cucumber/cucumber';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

let browser, context, page;

setDefaultTimeout(80 * 1000);

async function startBrowserIfNeeded() {
  if (!browser) {
    browser = await chromium.launch({ headless:false });
    context = await browser.newContext();
    page = await context.newPage();
    page.setDefaultTimeout(8000);
  }
  return page;
}

async function closeBrowserIfOpen() {
  if (browser) {
    await browser.close();
    browser = null;
    context = null;
    page = null;
  }
}

// screenshots folder (project-root/artifacts/screenshots)
const SCREENSHOT_DIR = path.join(process.cwd(), 'artifacts', 'screenshots');

function ensureScreenshotDir() {
  // remove existing artifacts folder and recreate (cleans from previous run)
  if (fs.existsSync(SCREENSHOT_DIR)) {
    try { fs.rmSync(SCREENSHOT_DIR, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  }
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

BeforeAll(async function () {
  ensureScreenshotDir();
});

async function saveScreenshot(filename) {
  if (!page) {
    // ensure page exists before trying to screenshot
    page = await startBrowserIfNeeded();
  }
  const filePath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filePath }).catch(() => {});
  return filePath;
}


Given('I open the login page', async function () {
  page = await startBrowserIfNeeded();
  await page.goto('https://practice.qabrains.com/ecommerce/login', { waitUntil: 'networkidle' });
});

When('I login with {string} and {string}', async function (email, password) {
  page = await startBrowserIfNeeded();
  await page.fill('//input[@id="email"]', email);
  await page.fill('//input[@id="password"]', password);

  const submit = await page.$('//button[normalize-space()="Login"]');
  if (submit) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
      submit.click()
    ]);
  } else {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
  }
});

Then('I should see the dashboard', async function () {
  await page.waitForTimeout(1000);
  await page.locator('//a[@class="inline-flex items-end gap-1"]').waitFor({ state: 'visible', timeout: 7000 });
  // await page.screenshot({ path: 'dashboard.png' });
  await saveScreenshot('dashboard.png');
 

});
 
When('I add products to the cart', async function () {
          page = await startBrowserIfNeeded();
          await page.locator("(//button[@type='button'][normalize-space()='Add to cart'])[1]").click();
          await page.locator("(//button[@type='button'][normalize-space()='Add to cart'])[2]").click();
          await page.locator("(//button[@type='button'][normalize-space()='Add to cart'])[3]").click();
          page = await startBrowserIfNeeded();
          const selectors = [
            "(//button[@type='button'][normalize-space()='Add to cart'])[1]",
            "(//button[@type='button'][normalize-space()='Add to cart'])[2]",
            "(//button[@type='button'][normalize-space()='Add to cart'])[3]"
          ];
           let addedCount = 0;
         for (const s of selectors) {
              const el = page.locator(s);
              await el.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
          if (await el.count() > 0) {
           try {
        await el.first().click();
        addedCount++;
        const cont = page.locator("//button[normalize-space()='Continue Shopping']");
        if (await cont.count() > 0) await cont.first().click().catch(() => {});
        await page.waitForTimeout(500);
      } catch (err) {
        console.warn('Click failed for', s, err.message);
      }
    } else {
      console.warn('Add-to-cart not found / skipped:', s);
    }
  }
    console.log(`Attempted ${selectors.length} adds, successful clicks: ${addedCount}`);
         });

Then('I should see the products in the cart', async function () {
          page = await startBrowserIfNeeded();
          await page.click("(//*[name()='svg'][@stroke='currentColor'])[1]");
          await page.waitForTimeout(1000);
          const container = page.locator("//div[contains(@class,'cart-list') and contains(@class,'space-y-4')]");
  await container.first().waitFor({ state: 'attached', timeout: 7000 }).catch(() => {});

  let names = [];
  
  if (names.length === 0) {
    const fallback = page.locator("//h3[contains(@class,'font-bold') or contains(@class,'text-lg')]");
    const n2 = await fallback.count();
    for (let i = 0; i < n2; i++) {
      const txt = (await fallback.nth(i).textContent())?.trim();
      if (txt) names.push(txt);
    }
  }

  if (names.length === 0) {
    console.log('No product names found in cart - selectors may need adjustment.');
  } else {
    console.log('Products in cart:');
    for (const nm of names) console.log('-', nm);
    console.log(`Total products in cart: ${names.length}`);
  }

          // await page.screenshot({ path: 'cart.png' });
          await saveScreenshot('cart.png');
        });

When('I proceed to checkout', async function () {
           // Write code here that turns the phrase above into concrete actions
           await page.click('button:has-text("Checkout")');
         });


Then('I should fill the checkout page and proceed to continue', async function () {
           await page.waitForURL('https://practice.qabrains.com/ecommerce/checkout-info', { timeout: 10000 });
          //  await page.screenshot({ path: 'checkout.png' });
           await page.getByPlaceholder('Ex. John').fill('John Doe');
           await page.getByPlaceholder('Ex. Doe').fill('Doe');
          await page.locator("//input[@value='1207']").click();  // or .fill(), .check(), etc.
          await page.getByRole('button', { name: 'Continue' }).click();

          //  await page.screenshot({ path: 'checkout-filled.png' });
           await saveScreenshot('checkout-filled.png');
         });

    When('I complete the purchase', async function () {
  const summarySection = page.locator("//div[@class='summery mt-8 flex justify-between pe-10 gap-4']//div[3]");

  // Wait for the section to be visible
  await summarySection.waitFor({ state: 'visible', timeout: 10000 });

  // Get all <p> tags inside
  const summaryItems = await summarySection.locator('p').allTextContents();

  // Print to console
  console.log("---- Order Summary ----");
  summaryItems.forEach(item => console.log(item));

  // Optional: include the header (Price Total)
  const header = await summarySection.locator('h4').innerText();
  console.log(header);
});


// When('I complete the purchase', async function () {
//            // Write code here that turns the phrase above into concrete actions
//            const summarySection = page.locator("//div[@class='summery mt-8 flex justify-between pe-10 gap-4']//div[3]");

// // Get all the <p> tags inside that div
//        const summaryItems = await summarySection.locator('p').allTextContents();

// // Print each line in the console
//      summaryItems.forEach(item => console.log(item));

// // OR if you also want to include the title (Price Total:)
//      const allText = await summarySection.allTextContents();
// console.log(allText.join('\n'));
//          });      
         
  Then('I should proceed with the finish button', async function () {
           // Write code here that turns the phrase above into concrete actions
           await page.getByRole('button', { name: 'Finish' }).click();
            // await page.screenshot({ path: 'final-step.png' });
            await saveScreenshot('final-step.png');
            await browser.close();

         });