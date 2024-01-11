import { test,expect } from '@playwright/test';
import path from 'path';

const UI_URL = 'http://localhost:5173';

test.beforeEach(async ({ page }) => {        //this is used to run the code before each test
    await page.goto(UI_URL);       //here what basically going to happen is that we are going to visit the UI_URL which is the url of the client

  //get the sign in button
  await page.getByRole("link",{name:"Sign In"}).click();  //here we are getting the sign in button by role and name

  await expect(page.getByRole("heading",{name:"Sign In"})).toBeVisible();  //here we are checking if the heading is visible or not

  await page.locator("[name='email']").fill("hima@gmail.com");  //here we are filling the email field with the email
  await page.locator("[name='password']").fill("hima1234");  //here we are filling the password field with the password

  await page.getByRole("button",{name:"Login"}).click();  //here we are clicking the sign in button

  await expect(page.getByText("Login Successful")).toBeVisible();
}); 

test('should allow the user to add a hotel', async ({ page }) => {
    await page.goto(`${UI_URL}/add-hotel`);  //here we are going to the add-hotel page

    await page.locator("[name='name']").fill("test hotel");  //here we are filling the title field
    await page.locator("[name='city']").fill("test city");  //here we are filling the description field
    await page.locator("[name='country']").fill("test country");  //here we are filling the country field
    await page.locator("[name='description']").fill("test description");  //here we are filling the description field
    await page.locator("[name='pricePerNight']").fill("100");  //here we are filling the pricePerNight field
    await page.selectOption("select[name='starRating']", {label:"5"});  //here we are selecting the rating field
    await page.getByText("Luxury").click();  //here we are clicking the budget button
    await page.getByLabel("Free wifi").check();  //here we are clicking the free wifi button
    await page.getByLabel("Parking").check();  //here we are clicking the free wifi button
    await page.locator("[name='adultCount']").fill("2");  //here we are filling the adultCount field
    await page.locator("[name='childCount']").fill("2");  //here we are filling the childCount field
    
    await page.setInputFiles("[name='imageFiles']",[
        path.join(__dirname, "files", "1.jpg"),
        path.join(__dirname, "files", "2.jpg"),
        path.join(__dirname, "files", "3.jpg"),
    ]);
    await page.getByRole("button",{name:"Create"}).click();  //here we are clicking the add hotel button
    await expect(page.getByText("Hotel created successfully")).toBeVisible({timeout: 50000});  //here we are checking if the hotel is added successfully or not  //here we are giving the timeout because it takes some time to add the hotel
});

test("should display hotels", async ({ page }) => {
    await page.goto(`${UI_URL}/my-hotels`);
  
    await expect(page.getByText("kingsbury")).toBeVisible({timeout: 50000});
    await expect(page.getByText("Contrary to popular belief")).toBeVisible();
    await expect(page.getByText("colombo, Sri Lanka")).toBeVisible();
    await expect(page.getByText("Hiking Resort")).toBeVisible();
    await expect(page.getByText("£200 per night")).toBeVisible();
    await expect(page.getByText("2 adults, 3 children")).toBeVisible();
    await expect(page.getByText("5 Star Rating")).toBeVisible();
  
    await expect(
      page.getByRole("link", { name: "View Details" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
  });