# Спрос в Google (Keyword Planner, английский, весь мир, 2026-11-25)

Файлы:
- kw_ideas_world.csv — 1757 идей по 36 базовым запросам, суммарно ≈737 тыс. в месяц. Почти всё это шум: туристические EPIRB, «shipping radar live», маркетплейсы трекинга судов.
- kw_hist_world.csv — точные объёмы по ручному списку.

Цифры — оценка Google в запросах в месяц. Подходят для сравнения тем, прогнозом трафика не являются.

## Коммерческие запросы (заказ услуги): почти ноль
| Запрос | В месяц |
|---|---|
| marine electronics service / repair | 2 400 / 1 900 (в основном прогулочные лодки в США) |
| furuno singapore | 720 (ставка до $5,35) |
| lrit conformance test | 170 |
| jrc service / jrc singapore | 210 / 90 |
| marine radio repair / vhf radio repair | 110 / 110 (лодки) |
| voyage data service | 70 |
| ship repair singapore | 70 |
| gmdss radio survey | 50 |
| epirb sbm | 40 |
| furuno service / kongsberg service | 30 / 20 |
| annual radio survey, gmdss survey, vdr annual performance test, epirb shore based maintenance | по 20 |
| «marine electronics + порт» (Rotterdam, Piraeus, Dubai, Houston, Busan…) | 0–10 |

Вывод: суперинтенданты ищут поставщика через свою сеть контактов, агента, ShipServ и почту, а не через Google. Справочник должен приводить их другими путями (см. CLAUDE.md).

## Информационные запросы (экипаж, ETO, суперинтенданты)
| Группа | Сумма | Лидеры |
|---|---|---|
| Карьера | ≈13,9 тыс. | ship manager 3 600, electro technical officer 2 900, eto salary 1 900, marine electronics technician 1 900, eto jobs 1 300, technical superintendent 1 300, radio surveyor 480 |
| Правила и процедуры | ≈3,9 тыс. | epirb registration 1 600, radio log book 320, navtex stations 320, gmdss sea areas 210, wheelmark 210, magnetic compass deviation card 170, epirb hydrostatic release 170, cargo ship safety radio certificate 140, solas chapter iv 110, ssas test procedure 90, ecdis requirements 90 |
| Модели оборудования | ≈1,8 тыс. (по ручному списку) | furuno gp 170 260, sailor 6248 210, tron sart20 210, danelec vdr 140, furuno nx 700 140, mcmurdo e5 110, jrc jhs 183 / jue 87 / ncr 333 по 90 |
| Общие термины | десятки тысяч | gmdss 12 100, navtex 12 100, ecdis 12 100, furuno 12 100, gyro compass 8 100, bnwas 1 900, inmarsat c 1 900, voyage data recorder 880, gmdss equipment 880, gmdss manual 720 |

Запросы «error codes / alarm list» по конкретным моделям Google показывает как 0. Тексты ошибок ищут дословно, Planner их не агрегирует. Проверить по Search Console после запуска.

## Реалистичная оценка
- Хорошо сделанный справочник за 6–12 месяцев может набрать несколько тысяч визитов в месяц. Основная часть — ETO, офицеры и студенты, заказчиков среди них немного.
- Деньги приходят от небольшого числа дорогих B2B-заявок. Нужно измерять не трафик, а заявки RFQ и регистрации поставщиков.
- Google Ads проверить точечно по брендам в портах (furuno singapore и т.п.). LinkedIn Ads по должностям Technical Superintendent и Fleet Manager — после появления RFQ.

## Конкуренты и похожие сервисы
- **ShipServ** (Marcura): закупочная площадка, 43 тыс. поставщиков, есть категория «GMDSS & Radio Survey Services». Главный игрок в закупках, но не специализирован и без данных об одобрении классом.
- **PortServiceFinder**: поиск по порту и категории, гайды для Сингапура (ECDIS, GMDSS survey). Прямой аналог идеи — изучить глубже.
- **MagicPort, MarineTraffic directory, theshipmarket.com, MGN directory**: общие каталоги агентов и поставщиков.
- **Marcura PortsDirect**: договоры с портовыми сервисами (буксиры, катера), не радио.
- **Реестры классов**: ABS Service Supplier Database (есть поиск), DNV и LR (approval of service suppliers), сертификаты в PDF у поставщиков (например, Kongsberg DNV AoSS для VDR и радио).

Источники:
- https://www.shipserv.com/category/gmdss-radio-survey-services/170
- https://portservicefinder.com/blog/ecdis-service-gmdss-radio-survey-singapore-2026-operator-buyer-guide
- https://theshipmarket.com/directory/tag/survey
- https://www.dnv.com/services/approval-of-service-suppliers/
- https://www.lr.org/en/services/classification-certification/approval-of-service-suppliers
- https://ww2.eagle.org/en/rules-and-resources/recognized-specialists.html
- https://irclass.org/media/5751/2-relevant-sections-of-ur-z17-rev16.pdf
