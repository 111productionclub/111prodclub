# Assets — 111 production club

Источник: Figma `111-production-club` (UwN7wIjZ9tEkjFHDcfFldo).

## icons/
| Файл | Где в макете | Размер |
|---|---|---|
| `arrow-left.svg` | «← Все работы» в шапке кейса | 18×18 |
| `arrow-right.svg` | «следующий кейс →» | 56×56 |
| `arrow-cta.svg` | кнопка «Обсудить проект» | 36×36 |

Все иконки используют `stroke="currentColor"` — цвет задаётся классом (`text-white`, `text-black`).

## images/
- `logo.jpg` — логотип III на чёрном фоне (640×640, оригинал)
- `logo@3x.png` — экспорт логотипа как в шапке (87×86 @3x)

## screens/
Скриншоты всех страниц — референс для вёрстки:
`00-components`, `01-home`, `02-works`, `03-case`, `04-merch-catalog`, `05-product`.

## Дизайн-токены (из Figma variables)
Шрифт: **Geist** (подключается через `next/font/google`).

| Токен | size / line-height / weight | letter-spacing |
|---|---|---|
| Display / Hero | 120px / 0.95 / 400 | -3% |
| Header 1 | 32px / 1.09 / 500 | -5% |
| Header 3 | 18px / 1.35 / 500 | -2% |
| Button | 18px / 1.2 / 400 | -2% |

Цвета: `#000000` (фон), `#FFFFFF`, `#F2F2F2` (иконки/текст на тёмном).
Серые оттенки подписей уточняй в Figma Dev Mode.

Ширина макета: 1280px, боковые отступы контента 104px (контейнер 1072px).
Фото товаров и кейсов в макете — плейсхолдеры, реальных картинок пока нет.
