# Структура сайта: этап 1 — помощник для ETO, офицеров и суперинтендантов

Идея как у автосайта (OBD-коды, модели) и у Número Astral: много полезных точных страниц под длинный хвост. Справочник поставщиков появляется на этапе 2, но место под него и форму RFQ закладываем сразу.

Спрос: research/kw_helper_world.csv, kw_hist_world.csv, demand.md.

## Разделы
```
/                                   поиск по модели / коду ошибки / тесту, инструменты, свежие гайды
/equipment/                         хаб: типы оборудования
/equipment/radar/  /ecdis/  /gmdss-console/  /mf-hf/  /vhf-dsc/  /inmarsat-c/  /navtex/
/equipment/epirb/  /sart/  /vdr/  /ais/  /gyro-compass/  /gps/  /bnwas/  /ssas/  /lrit/  /echo-sounder/  /speed-log/  /autopilot/
/makers/furuno/                     хаб производителя: линейки, модели, сервис-контакты (официальные ссылки)
/makers/furuno/far-2117/            ★ страница модели
/makers/furuno/far-2117/alarms/     ★ таблица аварий/ошибок модели: код, текст на экране, причина, что проверить, когда звать сервис
/makers/furuno/far-2117/alarms/<code>/   отдельная страница кода — только когда Search Console показывает показы по нему
/troubleshooting/<symptom>/         ★ разбор по симптому: radar-no-picture, inmarsat-c-not-logged-in, navtex-no-messages, gps-no-fix, ais-not-transmitting, gyro-alarm-after-blackout, ecdis-chart-permits, vdr-capsule-alarm, bnwas-false-alarm, magnetron-replacement
/tests/                             ★ процедуры тестов: daily / weekly / monthly GMDSS tests, EPIRB self-test, SART test, DSC test call, Inmarsat-C PV/link test, SSAS test, BNWAS test, battery & reserve source test, radar performance monitor
/surveys/                           подготовка к Annual Radio Survey, VDR APT, EPIRB SBM, AIS annual test, LRIT conformance — что проверяют и чек-листы PDF
/rules/                             SOLAS Ch IV, GMDSS modernization 2024, sea areas A1–A4, radio log book, false alert cancellation (IMO), EPIRB registration by flag, battery/HRU expiry rules, wheelmark/MED, type approval
/tools/                             ★ инструменты (JS на клиенте)
  mmsi-lookup/                      MMSI → страна (MID), тип станции (судно/береговая/SAR/AIS-AtoN)
  mid-codes/                        таблица MID по странам
  epirb-hex-id-decoder/             расшифровка 15-hex ID: страна, протокол, серийный/MMSI
  frequencies/                      частоты бедствия, DSC, NAVTEX (518/490/4209.5), MF/HF, VHF-каналы
  navtex-stations/                  станции NAVTEX по NAVAREA с B1-идентификаторами и картой
  phonetic-alphabet/                ICAO/ITU + цифры, морские фразы SMCP
  q-codes/                          Q-коды и сокращения радиосвязи
  gmdss-battery-calculator/         ★ расчёт ёмкости резервных АКБ ГМССБ (SOLAS IV/13: 1 ч при аварийном источнике питания, 6 ч без него; методику расчёта нагрузки сверить с руководством IMO) + PDF-таблица для папки к освидетельствованию
  battery-expiry/                   калькулятор сроков: батарея EPIRB/SART, HRU, SBM, следующий radio survey/VDR APT
  radio-log-generator/              шаблон радиожурнала с записями ежедневных/еженедельных/месячных тестов (PDF)
/career/                            ETO: зарплаты, STCW III/6, GOC/ROC, собеседование, чек-лист первого контракта
/glossary/                          термины (DSC, MSI, RCC, HRU, APT, SBM…)
/service/                           этап 2: порты × услуги, профили поставщиков, RFQ (сейчас — только форма «нужен сервис в порту»)
```

## Страница модели (шаблон)
- Тип и производитель, годы выпуска, статус: в производстве или снята, чем заменили.
- Тип одобрения: IMO performance standard и MED/wheelmark, если известно. Источник обязателен.
- Ключевые характеристики (кратко), интерфейсы, с чем стыкуется (GPS, гиро, AIS, VDR).
- Таблица аварий и ошибок со ссылкой на /alarms/.
- Частые неисправности и что проверить экипажу.
- Ежедневные, еженедельные и ежемесячные проверки для этого оборудования.
- Документация: ссылки на официальные мануалы и бюллетени. Чужие PDF не выкладываем.
- Где обслуживают: официальный сервис-локатор производителя. На этапе 2 — наш справочник по портам.
- Блок «Нужен сервисный инженер в порту?» → форма RFQ.

## Порядок выпуска (черновик)
| Волна | Что | Страниц | Почему |
|---|---|---|---|
| 1 | Инструменты: MMSI/MID, EPIRB hex ID, частоты, NAVTEX-станции, phonetic alphabet, Q-коды, калькулятор сроков | 8 | самый большой спрос (MMSI ≈6 тыс., Q-коды 22 тыс., phonetic 823 тыс.), ссылки на сайт от форумов и учебных центров |
| 1 | Тесты ГМССБ и процедуры (SART, EPIRB, DSC, Inmarsat-C, SSAS, ежедневные/еженедельные/ежемесячные) + радиожурнал | 12 | sart test 720, gmdss tests 590, epirb test 320, ssas test 210 |
| 1 | Правила: sea areas, SOLAS IV, модернизация 2024, false alert, регистрация EPIRB, сроки батарей/HRU | 10 | epirb registration 1,6 тыс., radio log book 320, navtex stations 320 |
| 2 | 30–40 самых массовых моделей (Furuno, JRC, Sailor, Jotron, McMurdo, Danelec, Transas/Wärtsilä, Anschütz, Sperry, Tokyo Keiki) + таблицы аварий | 60–80 | длинный хвост, как OBD-коды |
| 2 | Разбор неисправностей по симптомам | 10–15 | ecdis alarms 210, vdr capsule 140, gps no fix 110 |
| 2 | Подготовка к освидетельствованиям + чек-листы PDF | 5 | аудитория суперинтендантов: вход для этапа 2 |
| 3 | Карьера ETO | 6–8 | ≈7 тыс. запросов, отдельная аудитория, через неё приходят будущие поставщики |
| 3 | Остальные модели, отдельные страницы кодов — по данным Search Console | — | — |

## Безопасность контента (обязательно)
- Радар: магнетрон и модулятор под высоким напряжением, излучение антенны. Работу на мачте и замену магнетрона описываем только как «что делает сервис», без пошаговых инструкций для экипажа. Предупреждения о радиационной зоне и блокировке (lockout).
- EPIRB, SART, DSC: при тесте не отправлять реальный сигнал бедствия. Процедура отмены ложного сигнала по IMO (сообщить в RCC), без советов «как отключить так, чтобы никто не узнал».
- Не советовать обходить требования: отключать BNWAS, VDR, AIS, SSAS и т.п. Всегда указывать, что окончательные требования — у флага и класса.
- Литиевые батареи EPIRB и SART: не вскрывать, менять только у одобренного сервиса.
- На страницах с кодами указывать: «по документации производителя, ред. X; проверьте мануал своей версии ПО».

## Требования к скорости (интернет на судне — VSAT/Starlink с лимитами)
- Бюджет веса страницы: HTML+CSS ≤ 60 КБ сжатыми, инструменты ≤ 100 КБ JS, без веб-шрифтов (системные), картинки только SVG/WebP по необходимости.
- Инструменты работают офлайн после первой загрузки (service worker) — на мостике связь пропадает.
- Кнопки «поделиться в WhatsApp/Telegram» и копирование ссылки на результат (MMSI, hex ID) — ссылки ходят по чатам экипажей.
- PDF (радиожурнал, чек-листы, расчёт АКБ) генерировать на клиенте, печать A4.

## Ответы ИИ (ChatGPT, Perplexity, Google AI Overviews)
- Schema.org: TechArticle/HowTo для процедур, FAQPage, Dataset для таблиц (MID, NAVTEX), Organization/LocalBusiness для поставщиков на этапе 2.
- /llms.txt со списком разделов и инструментов; таблицы в чистом HTML (не картинками), у каждого факта источник (SOLAS, резолюция IMO, мануал ред.).

## Испанский (этап 2–3)
- Спрос на испанском (CL PE EC MX AR CO ES PA) ≈14,6 тыс./мес, но это термины оборудования и рыболовная электроника: sart 6 600, ecosonda 1 600, epirb 1 300, sonar pesca 1 000, radiobaliza 720, gmdss 590, ecdis 480; запросы услуг (revisión radio gmdss, técnico radar marino, mantenimiento ais, electrónica marina + порт) = 0.
- Делать /es/ как перевод лучших страниц-инструментов и тестов после того, как английские наберут показы; рыболовная электроника (ecosonda, sonar) — отдельная аудитория, решать отдельно.
