const db = require('../config/dbConfig');

class TaskService{

    async createTask(req, res, next){
        const { title, description, due_date, priority, recurrence } = req.body;
        try {
            const user_id = req.decoded.id;

            await db.execute(`
              INSERT INTO tasks (user_id, title, description, due_date, priority, status, recurrence)
              VALUES (?, ?, ?, ?, ?, 'pending', ?)
            `, [user_id, title, description, due_date, priority, recurrence]);
            
            return res.status(201).json({ message: 'Task created' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: false, message: error.message });
        }
    }
    async completeTask(req, res, next){
        try {
            const { id } = req.params;
            const user_id = req.decoded.id;
            const [[task]] = await db.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);
            if(task.status == 'completed') return res.status(501).json({message: 'Task already completed!'});
            // Update task
            await db.execute(`UPDATE tasks SET status = 'completed' WHERE id = ? AND user_id = ?`, [id, user_id]);

            // Add to history
            await db.execute(`INSERT INTO task_history (task_id, status, changed_at) VALUES (?, 'completed', NOW())`, [id]);

            // Handle recurrence
            // const [[task]] = await db.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);
            if (task.recurrence) {
              let next_due = new Date(task.due_date);
              if (task.recurrence === 'daily') next_due.setDate(next_due.getDate() + 1);
              if (task.recurrence === 'weekly') next_due.setDate(next_due.getDate() + 7);
              if (task.recurrence === 'monthly') next_due.setMonth(next_due.getMonth() + 1);
            
              await db.execute(`
                INSERT INTO tasks (user_id, title, description, due_date, priority, status, recurrence)
                VALUES (?, ?, ?, ?, ?, 'pending', ?)
              `, [user_id, task.title, task.description, next_due, task.priority, task.recurrence]);
            }
        
            return res.status(201).json({ message: 'Task marked as completed' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: false, message: error.message });
        }
    }
    async listTasks(req, res, next){
        try {
            const user_id = req.decoded.id;
            const [tasks] = await db.execute(`SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date`, [user_id]);
            return res.status(201).json({ status: true, message: 'Task list', data: tasks });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: false, message: error.message });
        }
    }

}

module.exports = new TaskService();