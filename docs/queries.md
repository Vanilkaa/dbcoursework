# Документація аналітичних запитів
---
### Дохід за категоріями

**Функція:** `getRevenueByCategory`
**Метод доступу:** `GET /api/analytics/revenue`

#### Бізнес-питання
Які категорії товарів приносять найбільший дохід і як обсяги продажів співвідносяться з отриманим прибутком? Це дозволяє визначити пріоритетні напрямки для закупівель.

#### SQL-запит
Цей запит виконується як "Raw SQL" через Prisma (`prisma.$queryRaw`), оскільки вимагає агрегації даних з трьох пов'язаних таблиць.

```sql
SELECT 
    pc.name as category_name,
    COUNT(oi.order_id) as total_items_sold,
    SUM(oi.quantity * oi.unitprice) as total_revenue
FROM "productcategory" pc
JOIN "product" p ON pc.category_id = p.category_id
JOIN "orderitem" oi ON p.product_id = oi.product_id
GROUP BY pc.category_id, pc.name
HAVING SUM(oi.quantity * oi.unitprice) > 0
ORDER BY total_revenue DESC;
````

#### Пояснення логіки

1.  **JOIN:**
      * `productcategory` з'єднується з `product`.
      * `product` з'єднується з `orderitem`, щоб отримати фактичні продажі.
2.  **Агрегатні функції:**
      * `COUNT(oi.order_id)`: Підраховує загальну кількість проданих позицій у цій категорії.
      * `SUM(oi.quantity * oi.unitprice)`: Обчислює сумарний дохід. Важливо, що використовується `unitprice` з таблиці `orderitem` (ціна на момент покупки), а не поточна ціна товару.
3.  **GROUP BY:**
      * Групування результатів за унікальним ID та назвою категорії.
4.  **HAVING:**
      * Фільтрація категорій, які не мають продажів (`SUM > 0`).
5.  **ORDER BY:**
      * Сортування від найбільш прибуткових до найменш прибуткових.

#### Приклад виводу (JSON Response -\> Markdown Table)

| category\_name | total\_items\_sold | total\_revenue |
|---------------|------------------|---------------|
| Електроніка   | 15               | 25400.00      |
| Книги         | 50               | 1250.50       |
| Одяг          | 12               | 450.00        |