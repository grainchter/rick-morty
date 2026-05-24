import { test, expect, Page } from '@playwright/test';

const MOCK_CHARACTERS = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    image: 'https://rickandmortyapi.com/avatar/1.jpeg',
    location: { name: 'Earth (C-137)' },
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    image: 'https://rickandmortyapi.com/avatar/2.jpeg',
    location: { name: 'Earth' },
  },
  {
    id: 3,
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
    image: 'https://rickandmortyapi.com/avatar/3.jpeg',
    location: { name: 'Earth (Replacement Dimension)' },
  },
  {
    id: 4,
    name: 'Beth Smith',
    status: 'Alive',
    species: 'Human',
    image: 'https://rickandmortyapi.com/avatar/4.jpeg',
    location: { name: 'Earth (Replacement Dimension)' },
  },
  {
    id: 5,
    name: 'Jerry Smith',
    status: 'Alive',
    species: 'Human',
    image: 'https://rickandmortyapi.com/avatar/5.jpeg',
    location: { name: 'Earth (Replacement Dimension)' },
  },
];

test.describe('Characters page with sidebar', () => {
  // хелперы для открытия/закрытия сайдбара
  async function openSidebar(page: Page) {
    const openBtn = page.getByRole('button', { name: 'Открыть боковую панель' });
    await openBtn.click();
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();
  }

  async function closeSidebar(page: Page) {
    const closeBtn = page.getByRole('button', { name: 'Закрыть боковую панель' });
    await closeBtn.click();
    const overlay = page.locator('.sidebar-overlay');
    await expect(overlay).toBeHidden();
  }

  test.beforeEach(async ({ page }) => {
    // Подменяем реальный апи на локальные мок-данные
    await page.route('**/api/character**', async (route) => {
      const url = route.request().url();
      const params = new URLSearchParams(url.split('?')[1] || '');

      const nameFilter = params.get('name')?.toLowerCase() || '';
      const pageNumber = parseInt(params.get('page') || '1');

      const filtered = MOCK_CHARACTERS.filter((char) =>
        char.name.toLowerCase().includes(nameFilter),
      );

      // имитируем серверную пагинацию (по 2 элемента на страницу)
      const itemsPerPage = 2;
      const start = (pageNumber - 1) * itemsPerPage;

      const paginated = filtered.slice(start, start + itemsPerPage);
      const totalPages = Math.ceil(filtered.length / itemsPerPage);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          info: {
            pages: totalPages,
            count: filtered.length,
            next: pageNumber < totalPages ? `/api/character?page=${pageNumber + 1}` : null,
            prev: pageNumber > 1 ? `/api/character?page=${pageNumber - 1}` : null,
          },
          results: paginated,
        }),
      });
    });

    await page.goto('http://localhost:5173/');

    await closeSidebar(page);

    const skeletons = page.locator('.card-skeleton');
    await expect(skeletons).toHaveCount(0, { timeout: 10000 });
  });

  test('search filters characters by name', async ({ page }) => {
    await openSidebar(page);

    const searchInput = page.locator('input[placeholder*="name"]');

    await searchInput.fill('Rick');
    await searchInput.press('Enter');

    const cards = page.locator('.card');

    await expect(cards).toHaveCount(1);

    await closeSidebar(page);

    await expect(page.getByText('Rick Sanchez')).toBeVisible();
    await expect(page.getByText('Morty Smith')).toBeHidden();

    await openSidebar(page);

    await searchInput.clear();
    await searchInput.fill('Smith');
    await searchInput.press('Enter');

    await expect(cards).toHaveCount(2);

    await closeSidebar(page);

    await expect(page.getByText('Morty Smith')).toBeVisible();
    await expect(page.getByText('Summer Smith')).toBeVisible();
  });

  test('pagination works with filtered results', async ({ page }) => {
    await openSidebar(page);

    const searchInput = page.locator('input[placeholder*="name"]');

    await searchInput.fill('Smith');
    await searchInput.press('Enter');

    await expect(page.getByText('Morty Smith')).toBeVisible();
    await expect(page.getByText('Summer Smith')).toBeVisible();

    await closeSidebar(page);

    const nextButton = page.locator('.pagination__button').last();
    await nextButton.click();

    await expect(page.getByText('Beth Smith')).toBeVisible();
    await expect(page.getByText('Jerry Smith')).toBeVisible();
  });

  test('sidebar does not break main content visibility', async ({ page }) => {
    await expect(page.locator('.card').first()).toBeVisible();
    await openSidebar(page);
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();
    await closeSidebar(page);
    await expect(sidebar).toBeHidden();
    await expect(page.locator('.card').first()).toBeVisible();
  });
});
