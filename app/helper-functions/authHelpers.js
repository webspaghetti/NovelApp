
import bcrypt from 'bcryptjs';
import pool from "@/lib/db";

export async function createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.execute(
        'INSERT INTO users (username, password, normal_general_template_id, small_general_template_id) VALUES (?, ?, 3, 3)',
        [username, hashedPassword]
    );

    return result.insertId;
}

export async function verifyUser(username, password) {
    const [users] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );

    if (users.length === 0) return null;

    const user = users[0];

    // Check if password is null (needs reset)
    if (user.password === null) {
        return {
            id: user.id,
            username: user.username,
            needsPasswordReset: true
        };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return null;

    return {
        id: user.id,
        username: user.username,
        needsPasswordReset: false
    };
}

export async function getUserById(id) {
    const [users] = await pool.execute(
        'SELECT id, username, password FROM users WHERE id = ?',
        [id]
    );

    if (users.length === 0) return null;

    const user = users[0];
    return {
        id: user.id,
        username: user.username,
        needsPasswordReset: user.password === null
    };
}

export async function getUserByUsername(username) {
    const [users] = await pool.execute(
        'SELECT id, username FROM users WHERE username = ?',
        [username]
    );

    return users[0] || null;
}

export async function updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
    );
}