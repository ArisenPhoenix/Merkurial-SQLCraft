# Merkurial SQLCraft

**Merkurial SQLCraft** is a lightweight and extensible SQL framework for PostgreSQL written in **TypeScript**.

It blends ORM-like modeling with low-level control over PostgreSQL features, including:
- Typed schemas
- JSONB support
- Array fields
- Foreign key mapping
- Dynamic query building
- React-friendly row structure
- SQL string generation (not hidden behind "magic")

> Ideal for projects that want **structure and safety** without the overhead of a full-blown ORM.

---

## 🚧 Works in Progress

This project is **actively being developed**. Some modules contain `filler` content or `TODO` markers where future logic will be implemented, especially the wrapping SQL_DATABSE file.

Most notably:
- JOINs and cross-table relational mapping are **planned**, but not yet implemented.
- Static Query construction helpers are under refinement in `QUERY_GENERATOR.ts`.

---

## 📁 File Structure


## 📦 Tech Stack

- **TypeScript**
- **Node.js v22+**
- **PostgreSQL**
- Optional: **React** as this was first under development for **foodie** which was built using Next.js, the database for which no longer exists.

---

##  Philosophy

Unlike the typical ORM, SQLCraft:
- Encourages **clear SQL understanding**
- Provides **structured classes** for rows, tables, and databases
- Gives developers the option to **generate or manually write** queries
- Is designed with **performance**, **clarity**, and **extensibility** in mind

---

##  Status

| Feature                | Status     |
|------------------------|------------|
| Typed Schema Models    |  Complete  |
| Row-Level Operations   |  Complete  |
| JSONB & Array Support  |  Complete  |
| SQL Generator          |  Drafting  |
| JOIN Handling          |  Planned   |
| Raw Query Utilities    |  Complete  |
| React Integration      |  Stable    |

---

##  License

This project is licensed under the [Mozilla Public License 2.0](LICENSE).

---

##  Author

Built and maintained by [Brandon M. Marcure](https://github.com/ArisenPhoenix).

---

