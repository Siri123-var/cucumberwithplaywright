Feature: Login for Registered Users

  Scenario: Successful login with valid credentials
    Given I open the login page
    When I login with "test@qabrains.com" and "Password123"
    Then I should see the dashboard

  Scenario: Add multiple products in one step (by indices)
    Given I should see the dashboard
    When I add products to the cart
    Then I should see the products in the cart

  Scenario:proceed to checkout from cart
    Given I should see the products in the cart
    When I proceed to checkout
    Then I should fill the checkout page and proceed to continue

  Scenario: Complete the purchase
    # Given I should fill the checkout page and proceed to continue
    When I complete the purchase
    Then I should proceed with the finish button
