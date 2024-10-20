use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_pomodoro_sessions",
            sql: include_str!("../migrations/20241020130909_create_pomodoro_sessions.sql"),
            kind: MigrationKind::Up,
        },
    ]
}
