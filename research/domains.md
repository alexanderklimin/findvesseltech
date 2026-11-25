# Домены .com (проверка через RDAP Verisign, 2026-11-25)

«Свободен» значит, что RDAP ответил 404 на дату проверки. Перед покупкой проверить ещё раз у регистратора (Cloudflare Registrar — как у других сайтов). Покупать только после «да».

## Рекомендую
| Домен | Почему |
|---|---|
| **gmdsshub.com** | короткий, «GMDSS» — главный термин отрасли (12 тыс. запросов в месяц), «hub» подходит и справочнику, и маркетплейсу |
| **radiosurveyor.com** | точное название профессии и услуги, хорош для бренда маркетплейса |
| **shipradiohub.com** | понятен вне отрасли, шире GMDSS: радары, ECDIS |
| **navcomhub.com** | охватывает навигацию и связь, короткий |

## Свободны (запасные)
shipradioservice.com, gmdssservice.com, gmdssfinder.com, gmdssportal.com, gmdssdirectory.com, shipradiodirectory.com, radiosurveyfinder.com, findradiosurvey.com, radiosurveynet.com, marineradiohub.com, shipcomms.com, vesselradio.com, bridgetechhub.com, bridgeservicehub.com, shipelectronicshub.com, portradiotech.com, marinecommsfinder.com.

## Заняты
radiosurveys.com, vdrtest.com, vdrapt.com, shipetos.com, etohub.com, etoguide.com, portengineers.com, navcomservice.com.

Перед выбором проверить товарные знаки (USPTO, EUIPO) и нет ли компании с таким названием в отрасли.
Проверка: `curl -s -o /dev/null -w "%{http_code}" https://rdap.verisign.com/com/v1/domain/<имя>.com` (404 = свободен).

## Под маркетплейс (проверка RDAP 2026-11-25, вторая)
Название должно подходить и справочнику (этап 1), и маркетплейсу сервиса (этап 2–3). «GMDSS» и «radio» для маркетплейса узки.

Свободны: portengineer.com, porttechs.com, shiptechfinder.com, techinport.com, portcalltech.com, engineerinport.com, shipbridgehub.com, shipbridgetech.com, bridgetechhub.com, bridgeservicehub.com, navbridgehub.com, shiptechport.com, shiptechnet.com, findshiptech.com, shipwrench.com, portservicehub.com, portetos.com; прежние gmdsshub.com, shipradiohub.com, navcomhub.com всё ещё свободны.

Заняты: shipservicehub, shiptechhub, shiptechs, marinetechs, vesseltech, vesselservice, vesselfix, shipfix, shipcare, shipengineers, marineservicehub, portready, vesselready, surveyready, bridgefix, bridgetechs, bridgeengineer, portbridge, portelectronics, shipelectronics, navtechhub, berthtech.

Не брать похожее на ShipServ (существующая площадка закупок для судов).

## Третья партия (RDAP 2026-11-25)
Свободны: onberth.com, nextportcall.com, nextportservice.com, portcallservice.com, portcallengineer.com, portcallhub.com, portcallpro.com, shipcallservice.com, techsinport.com, engineersinport.com, engineeratport.com, serviceinport.com, techatberth.com, findportengineer.com, findportservice.com, shipservicefinder.com, vesselservicefinder.com, vesseltechfinder.com, marinetechfinder.com, findmarinetech.com, seatechfinder.com, findshiprepair.com, shiprepairfinder.com, vesselside.com, servicealongside.com, quayservice.com, quaysideservice.com, berthsideservice.com, anyportservice.com, anyporttech.com, marinefieldservice.com, shipfieldservice.com, navservicehub.com, portnavtech.com, portradiotech.com.
Заняты: alongside, atberth, berthside, dockside, quayside, portside, shipside, portwise, nextport, everyport, portcrew, portfixer, portservicefinder.
Риски по знакам: shiptechfinder — знак SHIPTECH (USPTO 4578036, Inatech); vesseltechfinder — похоже на VesselFinder (известный AIS-сайт). OnBerth, NextPortCall — в поиске совпадений нет.

## Проверка марок (2026-11-25) — onberth / nextportcall / portengineer
- Поиск по открытым агрегаторам USPTO (Justia, Trademarkia, Markinton) и вебу: совпадений нет. Ближайшие: THE NEXT PORT (EUIPO 019239776, кл. 25, 41 — бронирование мероприятий), THE PORTFOLIO ENGINEER (USPTO 2937052, кл. 36), PORTINEER (USPTO 6272101, кл. 21) — другие рынки.
- Компаний/приложений с такими названиями в морской отрасли не найдено.
- .net/.org/.io у всех трёх свободны (нет одноимённых проектов).
- НЕ проверено напрямую: официальные базы USPTO Trademark Search, EUIPO eSearch, WIPO Global Brand Database (JS-интерфейсы; API USPTO заблокирован правами, tmdb.eu отдаёт 403). Проверить в браузере перед покупкой.

## Пересмотр 2026-11-25: «port engineer» вне США читается как инженер портового оборудования (краны, терминалы) — снят как основной.
Свободны (RDAP), с явной привязкой к судну: shipcomms.com, shipboardservice.com, aboardservice.com, fixaboard.com, nextportcall.com, shipcallservice.com, vesselside.com, shipsidetech.com, shipradiotech.com, vesselradio.com, etodesk.com, etoservice.com, shipcaretech.com, onboardengineer.com, shipboardengineer.com, vesselfixers.com.
Заняты: onboardtech, techaboard, techonboard, shiptechs, vesseltechs, shipboardtech, bridgeservice, bridgetech, navcomservice, shipready, aboardtech, crewtech, etohub, etonet, etoguide, shipcare, vesselcare.
Риски: onboardengineer — бренды «Onboard» (ПО) и «Onboard Maritime» (обучение); shipboard/onboard engineer читается как вакансия механика. ShipComms — компаний с таким именем не найдено.

## С «radio» (2026-11-25, по просьбе пользователя: сайт про радио- и навигационное оборудование)
Свободны: shipradiohub, shipradionav, shipradiotech, shipradios, shipradioservice, shipradiopro, shipradiodesk, shipradiolab, shipradiosurvey, shipnavradio, shipradioandnav, radiosurveyor, vesselradio(s), marineradiohub, marineradiotech, navcomhub, navradiohub, radionavhub, radionavtech, radioandnav, gmdsshub (.com).
Заняты: shipradio, radionav, navradio, gmdssradio, radioofficer(s), radiosurveyors, bridgeradio, radiobridge, navcomtech.
Знаки/компании: ShipRadioHub / ShipRadioNav / ShipRadioTech / ShipRadios — совпадений нет. RADIONAVCOM — знак USPTO (компасы) → radionav* не берём. Крупный игрок отрасли — Radio Holland (не путать).
