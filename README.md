# Time Tracker

[Live Demo](https://time-tracker-three-phi.vercel.app)

Next.js 15 Time Tracker with **TypeScript**, **TailwindCSS**, **SQLite**, and **Prisma ORM**. Clean architecture: domain, application use-cases, infrastructure (Prisma repositories), and presentation components.

## AI-assisted Development

The project was **developed using Cursor/IDE with integrated AI models**.

## Structure

```
src/
├── domain/           # Entities: Project, TaskName, TimeEntry
├── application/      # Use-cases and ports (no business logic in UI)
├── infrastructure/   # Prisma repositories (SQLite)
├── lib/              # Prisma client singleton
├── presentation/     # React components (data + callbacks only)
└── app/
    ├── api/          # API routes (CRUD projects, task-names, time-entries, reports)
    ├── layout.tsx
    └── page.tsx
prisma/
├── schema.prisma     # SQLite schema
├── seed.ts           # Initial project + tasks
└── dev.db            # SQLite DB (after migrate)
```

## Run locally

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or Open [http://localhost:3001](http://localhost:3001).

- **Start/Stop timer**: Pick project and task, then Start / Stop; time entries are stored in SQLite.
- **Projects**: Add/edit/delete projects and set color.
- **Time entries**: Edit project/task/duration (hh:mm), delete entries; list is grouped by project.
- **Reports**: Filter by day/week/month, export CSV.

## Database (SQLite + Prisma)

- **Schema**: `Project` (id, name, description, color, createdAt, updatedAt), `TaskName` (id, name, projectId, …), `TimeEntry` (id, projectId, taskNameId, startedAt, endedAt, description, …). Relations: Project → TaskNames, TimeEntries; TaskName → Project; TimeEntry → Project, TaskName.
- **Migrations**: `npx prisma migrate dev` to create migration; `npx prisma db push` to apply schema without migration files.
- **Seed**: `npx prisma db seed` creates a default project and two tasks (Development, Meeting).
- **Studio**: `npx prisma studio` to inspect and edit data.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/projects | List projects |
| POST | /api/projects | Create project `{ name, description?, color? }` |
| PUT | /api/projects/:id | Edit project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/task-names?projectId=&q= | List or autocomplete task names |
| POST | /api/task-names | Create task name `{ name, projectId }` |
| PUT | /api/task-names/:id | Edit task name |
| DELETE | /api/task-names/:id | Delete task name |
| GET | /api/time-entries?projectId=&activeOnly=&groupBy= | List or active or grouped |
| POST | /api/time-entries | Start entry `{ projectId, taskNameId, description? }` |
| PUT | /api/time-entries/:id | Edit or stop entry `{ endedAt?, ... }` |
| DELETE | /api/time-entries/:id | Delete entry |
| GET | /api/reports?period=day\|week\|month | Report data |
| GET | /api/reports/export?period=... | Download CSV |

All mutations use the application use-cases and Prisma repositories; responses use standard HTTP status codes (200, 201, 204, 400, 404).

### Prisma Studio

npx prisma studio


All core components, logic, and APIs were generated with AI, without manually writing code (minimal edits to configs and README were allowed).


### Example prompt used to generate the Main Timer functionality:

## 1️⃣ Main Timer

### Prompt used in Cursor:

```text
Generate the following for the Main Timer feature:

1. Presentation components:
- Timer display (always visible at top)
- Start button
- Stop button
- Task name input with autocomplete from previous tasks
- Project/client dropdown selector

2. Application layer (use-cases/services):
- Start timer use-case
- Stop timer use-case
- Select project use-case
- Select task use-case
- Autocomplete task name use-case

3. Infrastructure:
- Update InMemoryTimeEntryRepository with methods for starting/stopping entries
- Ensure domain entities TimeEntry, Project, TaskName are used correctly

4. API Routes:
- POST /api/time-entries → start new entry
- PUT /api/time-entries/:id → stop entry
- GET /api/time-entries → fetch active entry

Constraints:
- No business logic inside components
- Follow existing clean architecture
- Use TypeScript and TailwindCSS



## 2️⃣ Time Entries Management

### Prompt used in Cursor:

```text
Generate the following for the Time Entries feature:

1. Presentation components:
- List of time entries
- Editable fields: task name and project
- Input for manual time adjustment in hh:mm format
- Delete button for each entry
- Group entries by project with total time calculation

2. Application layer (use-cases/services):
- Edit time entry
- Delete time entry
- Update time entry time manually
- Group time entries by project

3. Infrastructure:
- Update InMemoryTimeEntryRepository with methods for update, delete, group
- Ensure domain entities TimeEntry, Project, TaskName are used correctly

4. API Routes:
- GET /api/time-entries → list entries
- POST /api/time-entries → create entry
- PUT /api/time-entries/:id → edit entry
- DELETE /api/time-entries/:id → delete entry

Constraints:
- No business logic inside components
- Use existing clean architecture
- Use TypeScript and TailwindCSS



## 3️⃣ Projects Management

### Prompt used in Cursor:

```text
Generate the following for the Projects feature:

1. Presentation components:
- Projects list
- Add new project form
- Edit project form
- Color picker for each project

2. Application layer (use-cases/services):
- Create project
- Edit project
- Assign color to project

3. Infrastructure:
- Update InMemoryProjectRepository with methods for create, edit, assign color
- Ensure domain entity Project is used correctly

4. API Routes:
- GET /api/projects → list projects
- POST /api/projects → create project
- PUT /api/projects/:id → edit project
- DELETE /api/projects/:id → delete project

Constraints:
- No business logic inside components
- Follow clean architecture
- Use TypeScript and TailwindCSS



## 4️⃣ Reports

### Prompt used in Cursor:

```text
Generate the following for the Reports feature:

1. Presentation components:
- Reports view
- Filter by day, week, month
- CSV export button

2. Application layer (use-cases/services):
- Generate report by selected period
- Aggregate time entries by project
- Export report to CSV

3. Infrastructure:
- Use InMemoryTimeEntryRepository to fetch entries
- Ensure domain entities TimeEntry, Project, TaskName are used correctly

4. API Routes:
- GET /api/reports?period=day|week|month → return report data
- GET /api/reports/export?period=day|week|month → download CSV

Constraints:
- No business logic inside components
- Use clean architecture
- Use TypeScript and TailwindCSS


