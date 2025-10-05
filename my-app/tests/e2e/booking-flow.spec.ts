import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should complete train search and booking simulation', async ({ page }) => {
    await page.goto('/');
    
    // Check if homepage loads
    await expect(page.getByText('SmartTatkal')).toBeVisible();
    
    // Navigate to booking page
    await page.click('text=Book Tickets');
    
    // Fill search form
    await page.fill('[data-testid="from-station"]', 'New Delhi');
    await page.fill('[data-testid="to-station"]', 'Mumbai Central');
    await page.fill('[data-testid="travel-date"]', '2025-02-15');
    
    // Search trains
    await page.click('[data-testid="search-trains"]');
    
    // Wait for results
    await expect(page.getByText('Available Trains')).toBeVisible({ timeout: 10000 });
    
    // Select first train (if available)
    const firstTrain = page.locator('[data-testid="train-card"]').first();
    if (await firstTrain.isVisible()) {
      await firstTrain.click();
      
      // Fill passenger details
      await page.fill('[data-testid="passenger-name-0"]', 'John Doe');
      await page.fill('[data-testid="passenger-age-0"]', '30');
      await page.selectOption('[data-testid="passenger-gender-0"]', 'M');
      
      // Proceed with booking
      await page.click('[data-testid="proceed-booking"]');
      
      // Check for booking confirmation
      await expect(page.getByText('Booking Successful')).toBeVisible({ timeout: 15000 });
    }
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/booking');
    
    // Try to search without filling required fields
    await page.click('[data-testid="search-trains"]');
    
    // Check for validation errors
    await expect(page.getByText('From station is required')).toBeVisible();
    await expect(page.getByText('To station is required')).toBeVisible();
  });
});