Feature: Login
    In order to use the application
    As a user
    I want to login

Scenario: Normal login
    Given I have opened the home page
    When I enter my username
        And I enter my password
	And I click on the Login button
    Then I am logged in
