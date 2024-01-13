import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173/';

test('should allow the user to login', async ({ page }) => {
  await page.goto(UI_URL);       //here what basically going to happen is that we are going to visit the UI_URL which is the url of the client

  //get the sign in button
  await page.getByRole("link",{name:"Sign In"}).click();  //here we are getting the sign in button by role and name

  await expect(page.getByRole("heading",{name:"Sign In"})).toBeVisible();  //here we are checking if the heading is visible or not

  await page.locator("[name='email']").fill("hima@gmail.com");  //here we are filling the email field with the email
  await page.locator("[name='password']").fill("hima1234");  //here we are filling the password field with the password

  await page.getByRole("button",{name:"Login"}).click();  //here we are clicking the sign in button

  await expect(page.getByText("Login Successful")).toBeVisible();  //here we are checking if the text is visible or not
  await expect(page.getByRole("link",{name:"My Bookings"})).toBeVisible();  //here we are checking if the link is visible or not
  await expect(page.getByRole("link",{name:"My Hotels"})).toBeVisible();  //here we are checking if the link is visible or not
  await expect(page.getByRole("button",{name:"Sign Out"})).toBeVisible();  //here we are checking if the link is visible or not
});

test('should allow the user to register', async ({ page }) => {
  const testEmail = `test${Math.floor(Math.random()*9000)+1000}@gmail.com`;  //here we are generating a random email so that we can register the user
  await page.goto(UI_URL);

  await page.getByRole("link",{name:"Sign In"}).click();

  await page.getByRole("link",{name:"Create an account here"}).click();

  await expect(page.getByRole("heading",{name:"Create An Account"})).toBeVisible();

  await page.locator("[name='firstName']").fill("hima");
  await page.locator("[name='lastName']").fill("buth");
  await page.locator("[name='email']").fill(testEmail);
  await page.locator("[name='password']").fill("hima1234");
  await page.locator("[name='confirmPassword']").fill("hima1234");

  await page.getByRole("button",{name:"Register"}).click();

  await expect(page.getByText("Registration Successful")).toBeVisible();
  await expect(page.getByRole("link",{name:"My Bookings"})).toBeVisible();
  await expect(page.getByRole("link",{name:"My Hotels"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Sign Out"})).toBeVisible();

});



