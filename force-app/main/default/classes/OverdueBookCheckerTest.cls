
/**
 * Test class for OverdueBookChecker
 */
@isTest
private class OverdueBookCheckerTest {
    
    @TestSetup
    static void setupTestData() {
        // Create test book
        Book__c testBook = new Book__c(
            Title__c = 'Overdue Test Book',
            Author__c = 'Test Author',
            ISBN__c = 'OVER-ISBN-12345',
            Genre__c = 'Fiction',
            Status__c = 'Available'
        );
        insert testBook;
        
        // Create test member
        Member__c testMember = new Member__c(
            Name__c = 'Overdue Test Member',
            Email__c = 'overduetest@example.com',
            Status__c = 'Active'
        );
        insert testMember;
        
        // Create test transaction that is overdue
        Transaction__c transaction = new Transaction__c(
            Book__c = testBook.Id,
            Member__c = testMember.Id,
            CheckoutDate__c = Datetime.now().addDays(-30),
            DueDate__c = Datetime.now().addDays(-15),
            Status__c = 'Active'
        );
        insert transaction;
    }
    
    @isTest
    static void testScheduledExecution() {
        Test.startTest();
        
        // Schedule the job
        String jobId = System.schedule(
            'Test Overdue Checker',
            '0 0 0 15 3 ? 2099', // Future date
            new OverdueBookChecker()
        );
        
        // Execute the job right away
        OverdueBookChecker checker = new OverdueBookChecker();
        checker.execute(null);
        
        Test.stopTest();
        
        // Verify the transaction was marked as overdue
        List<Transaction__c> overdueTransactions = [
            SELECT Id, Status__c
            FROM Transaction__c
            WHERE Status__c = 'Overdue'
        ];
        
        System.assertEquals(1, overdueTransactions.size(), 'One transaction should be marked as overdue');
    }
    
    @isTest
    static void testScheduling() {
        Test.startTest();
        
        // Call the scheduling method
        OverdueBookChecker.scheduleDaily();
        
        Test.stopTest();
        
        // Verify the scheduled job was created
        List<CronTrigger> scheduledJobs = [
            SELECT Id, CronExpression
            FROM CronTrigger
            WHERE CronJobDetail.Name = 'Library Overdue Book Check'
        ];
        
        System.assertEquals(1, scheduledJobs.size(), 'A scheduled job should be created');
        System.assertEquals('0 0 7 * * ?', scheduledJobs[0].CronExpression, 
                           'Cron expression should be set to run daily at 7 AM');
    }
}
