// Магазин и кабинет клиента скрыты, пока не готов бэкенд.
// Включается переменной окружения NEXT_PUBLIC_SHOP_ENABLED=1 (см. docs/DEPLOY.md).
export const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED === "1";
