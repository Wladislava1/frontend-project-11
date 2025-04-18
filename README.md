### Hexlet tests and linter status:
[![Actions Status](https://github.com/Wladislava1/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Wladislava1/frontend-project-11/actions)

[![Maintainability](https://api.codeclimate.com/v1/badges/e9e5e89a5e074e76b797/maintainability)](https://codeclimate.com/github/Wladislava1/frontend-project-11/maintainability

# RSS-агрегатор

### RSS — специализированный формат, предназначенный для описания лент новостей, анонсов статей и других материалов. Это наиболее простой способ для сайтов дать возможность пользователям подписываться на изменения. 

### Данный сервис умеет опрашивать RSS-ленты сайтов на наличие новых постов и показывают их в удобном виде, отмечая прочитанное и так далее, с помощью него  удобно читать разнообразные источники, например, блоги. Он позволяет добавлять неограниченное количество RSS-лент, сам их обновляет и добавляет новые записи в общий поток.

## Запуск приложения:
- make install
- make dev 

### Демонстрацию запуска можете посмотреть, перейдя по ссылке: https://asciinema.org/a/FbuP4EcNQNapmsihfLJAWWFWS

После запуска через терминал, откроется браузер, используемый по умолчанию.

Для добавления ленты в поток достаточно ввести ссылку в строку поиска и нажать на кнопку _Добавить_

## Вывод ошибок

1) Ссылка должна быть валидным URL:
- Адрес одержит ошибки, например, опечатки, неправильный регистр или присутствие лишних символов;

2) Ресурс не содержит валидный RSS:
- Адрес не соответствует формату RSS-канала, например, URL, который вы указали, может быть на самом деле обычной HTML-страницей;
- Сервер возвращает пустые данные или текст, который нельзя интерпретировать как XML;

3) Ошибка сети:
- Нет подключения к интернету;
- Сервер недоступен;
- Превышение таймаута;

4) RSS уже существует:
- Возникает при повторном добавлении ленты

При успешном выполнении запроса вернётся _RSS успешно загружен_


