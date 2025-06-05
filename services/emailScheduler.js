const cron = require('node-cron');
const db = require('../config/dbConfig');
const { sendEmail } = require('../utils/sendEmail');

class emailScheduler{

  constructor() {
    
    // Cron scheduled for every minute to expire polls need to be expired
    this.job = cron.schedule('* * * * *', this.sendReminder.bind(this));
    this.job.start();
  }
  
  async sendReminder() {
    console.log('Cron job running at', new Date().toISOString());
    try {
      
      const [tasks] = await db.execute(`
        SELECT t.*, u.email FROM tasks t
        JOIN users u ON t.user_id = u.id
        LEFT JOIN notifications n ON n.task_id = t.id
        WHERE t.status = 'pending'
        AND TIMESTAMPDIFF(MINUTE, NOW(), t.due_date) <= 60
        AND n.id IS NULL
        `);
        if(tasks.length == 0) console.log('No task found!');
        for (const task of tasks) {
          await sendEmail(
            task.email,
            `Reminder: Task "${task.title}" is due soon`,
            `Your task "${task.title}" is due at ${task.due_date}. Please complete it.`
          );
          
          // Mark notified
          await db.execute(`INSERT INTO notifications (task_id, sent_at) VALUES (?, NOW())`, [task.id]);
          console.log('Task reminder sent');
        }
      } catch (error) {
        console.error('Error sending task reminder:', error.response?.body || error);
      }
  }

}

module.exports = new emailScheduler();