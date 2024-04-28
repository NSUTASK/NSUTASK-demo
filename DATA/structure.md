# Структура базы данных (образец):

```
GROUP_1
    |____ 🗄️ data.sqlite
    |____ 📂 files
GROUP_2
    |____ 🗄️ data.sqlite
    |____ 📂 files
GROUP_3
    |____ 🗄️ data.sqlite
    |____ 📂 files
...
```

# Что хранится в `data.sqlite`?
```
Users:
    🔢 user_id (🔑 PRIMARY)
    🔤 display_name
    🔤 role
    🕑 last_online

Boards:
    🔢 board_id (🔑 PRIMARY)
    🔤 display_name
    🔢 activity_counter
    🕑 last_updated

Tasks:
    🔢 task_id (🔑 PRIMARY)
    🔢 board_id (🗝️ FOREIGN)
    🔤 title
    🔤 shortened_text (markdown)
    🔤 full_text (markdown)
    🔢 visibility (-1 for everyone, user_id otherwise)
    🕑 last_modified

Memberships:
    🔢 user_id (🗝️ FOREIGN)
    🔢 board_id (🗝️ FOREIGN)
    🔢 last_fetched_activity_counter
```

# Что хранится в директории `files`?
```
Пока что — ничего, поэтому и структуры никакой не придумано.
В теории, там должны храниться загруженные и прикреплённые файлы,
например картинки к задачам или аватарки досок/пользователей.
```

