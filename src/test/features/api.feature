Feature: API tests for automationexercise

  Scenario: GET products list returns products
    When I GET "/api/productsList"
    Then the response status should be 200
    And the JSON response should have property "products"
    And the "products" array length should be greater than 0

  Scenario: POST to productsList (wrong method)
    When I POST "/api/productsList" with empty form
    Then the response status should be 200

  Scenario: POST searchProduct with form value
    When I POST "/api/searchProduct" with form:
      | search_product | tshirt |
    Then the response status should be 200
    And the JSON response should have property "products"
    And the "products" array length should be greater than 0

  Scenario: VerifyLogin valid credentials
    When I POST "/api/verifyLogin" with form:
      | email    | varshu@gmail.com |
      | password | varshu@123      |
    Then the response status should be 200
    And the JSON response field "message" should equal "User exists!"