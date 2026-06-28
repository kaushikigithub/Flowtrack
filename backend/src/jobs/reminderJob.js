const cron = require('node-cron');
const notificationRepository = require('../repositories/notificationRepository');

async function runReminderCheck() {
  console.log(`⏰ [${new Date().toISOString()}] Running deadline reminder check...`);

  let tasksDueToday;

  try {
    tasksDueToday = await notificationRepository.findTasksDueToday();
  } catch (err) {
    // If we can't even read the tasks, log it and stop — nothing else to do this run
    console.error('❌ Reminder job failed to fetch due tasks:', err.message);
    return;
  }

  if (tasksDueToday.length === 0) {
    console.log('✅ No tasks due today. Nothing to notify.');
    return;
  }

  let successCount = 0;
  let failureCount = 0;

  // Process each task individually so one failure doesn't stop the rest
  for (const task of tasksDueToday) {
    try {
      await notificationRepository.createNotification({
        userId: task.assignee_id,
        message: `Reminder: your task "${task.title}" is due today.`,
      });
      successCount++;
    } catch (err) {
      failureCount++;
      console.error(`❌ Failed to create notification for task #${task.id}:`, err.message);
      // We deliberately do NOT throw here — continue to the next task
    }
  }

  console.log(`✅ Reminder check complete: ${successCount} sent, ${failureCount} failed.`);
}

// Schedule: runs every day at 9:00 AM server time
// Cron format: minute hour day-of-month month day-of-week
cron.schedule('0 9 * * *', runReminderCheck);

// Also export the function so we can test it manually without waiting until 9 AM
module.exports = { runReminderCheck };