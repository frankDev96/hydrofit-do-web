# Local persistence options for HydroFit

Recommended for this app:

- Zustand + MMKV for fast, local, key-value persistence without extra boilerplate.

Other good options:

- Redux Toolkit + redux-persist: best if you already want Redux and full app-wide state orchestration.
- AsyncStorage: simple but slower and less suitable for larger or frequent writes.
- WatermelonDB / SQLite: best when you need relational queries and larger offline datasets.

Current setup:

- Zustand stores are persisted with MMKV through a shared storage adapter.
- This keeps onboarding and hydration data available after app restarts.
