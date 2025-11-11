const assert = require('assert');
const { Before, BeforeAll, AfterAll, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { request } = require('playwright'); // Playwright API for HTTP

setDefaultTimeout(60 * 1000);

const BASE = 'https://automationexercise.com';


// Create one shared APIRequestContext for the whole test run and assign it
// to each scenario's World so `this.api` is available inside steps.
let apiContext;

BeforeAll(async function () {
  apiContext = await request.newContext({ baseURL: BASE, ignoreHTTPSErrors: true });
});

Before(async function () {
  // attach shared context to the scenario world
  this.api = apiContext;
});

AfterAll(async function () {
  if (apiContext) await apiContext.dispose();
});

When('I GET {string}', async function (path) {
  this.response = await this.api.get(path);
});

When('I POST {string} with empty form', async function (path) {
  this.response = await this.api.post(path, { form: {} });
});

When('I POST {string} with form:', async function (path, dataTable) {
  const obj = dataTable.rowsHash ? dataTable.rowsHash() : Object.fromEntries(dataTable.rows());
  this.response = await this.api.post(path, { form: obj });
});

When('I POST {string} with data:', async function (path, dataTable) {
  const obj = dataTable.rowsHash ? dataTable.rowsHash() : Object.fromEntries(dataTable.rows());
  this.response = await this.api.post(path, { data: obj, headers: { 'Content-Type': 'application/json' } });
});

When('I DELETE {string}', async function (path) {
  this.response = await this.api.delete(path);
});

When('I DELETE {string} with form:', async function (path, dataTable) {
  const obj = dataTable.rowsHash ? dataTable.rowsHash() : Object.fromEntries(dataTable.rows());
  this.response = await this.api.delete(path, { form: obj });
});

When('I PUT {string} with empty form', async function (path) {
  this.response = await this.api.put(path, { form: {} });
});

Then('the response status should be {int}', async function (expected) {
  assert.ok(this.response, 'No response available');
  const status = this.response.status();
  assert.strictEqual(status, expected, `Expected status ${expected} but got ${status}`);
});

Then('the JSON response should have property {string}', async function (prop) {
  const json = await this.response.json();
  assert.ok(Object.prototype.hasOwnProperty.call(json, prop), `Response JSON does not have property ${prop}`);
  this.json = json;
});

Then('the {string} array length should be greater than {int}', async function (prop, min) {
  const json = this.json || (await this.response.json());
  const arr = json[prop];
  assert.ok(Array.isArray(arr), `${prop} is not an array`);
  assert.ok(arr.length > min, `Expected ${prop}.length > ${min} but got ${arr.length}`);
});

Then('the JSON response field {string} should equal {string}', async function (field, expected) {
  const json = this.json || (await this.response.json());
  const value = json[field];
  assert.strictEqual(String(value), expected, `Expected field ${field} to equal ${expected} but got ${value}`);
});

Then('the response text should contain {string}', async function (expected) {
  const txt = await this.response.text();
  assert.ok(txt.includes(expected), `Response text did not contain: ${expected}`);
});