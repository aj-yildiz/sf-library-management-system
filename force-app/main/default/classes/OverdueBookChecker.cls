
/**
 * Scheduled class to check for overdue books
 */
global class OverdueBookChecker implements Schedulable {
    
    /**
     * Execute method that runs when job is scheduled
     * @param context - SchedulableContext
     */
    global void execute(SchedulableContext context) {
        // Call the service method to update overdue transactions
        Integer overdueCount = LibraryService.updateOverdueTransactions();
        
        // Log a result if needed
        if (overdueCount > 0) {
            System.debug('Marked ' + overdueCount + ' transaction(s) as overdue.');
            
            // Send notification to system administrator (optional)
            notifyAdmins(overdueCount);
        }
    }
    
    /**
     * Send notification to system administrators about overdue books
     * @param overdueCount - Number of overdue transactions
     */
    private void notifyAdmins(Integer overdueCount) {
        // Get admin users
        List<User> admins = [
            SELECT Id, Email
            FROM User
            WHERE Profile.Name = 'System Administrator'
            AND IsActive = true
            LIMIT 10
        ];
        
        if (!admins.isEmpty()) {
            List<String> toAddresses = new List<String>();
            for (User admin : admins) {
                toAddresses.add(admin.Email);
            }
            
            // Prepare email
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setToAddresses(toAddresses);
            mail.setSubject('Library System: ' + overdueCount + ' Book(s) Overdue');
            mail.setPlainTextBody(
                'This is an automated notification from the Library Management System.\n\n' +
                overdueCount + ' book(s) have become overdue and have been marked as such in the system.\n\n' +
                'Please review the transactions in Salesforce.'
            );
            
            // Send email
            if (!Test.isRunningTest()) {
                Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
            }
        }
    }
    
    /**
     * Static method to schedule this job
     */
    public static void scheduleDaily() {
        String jobName = 'Library Overdue Book Check';
        String cronExp = '0 0 7 * * ?'; // Run daily at 7 AM
        
        try {
            System.schedule(jobName, cronExp, new OverdueBookChecker());
            System.debug('Successfully scheduled ' + jobName);
        } catch (Exception e) {
            System.debug('Error scheduling job: ' + e.getMessage());
        }
    }
}
