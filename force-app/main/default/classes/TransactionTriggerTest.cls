
/**
 * Test class for TransactionTrigger
 */
@isTest
private class TransactionTriggerTest {
    
    @TestSetup
    static void setupTestData() {
        // Create test book
        Book__c testBook = new Book__c(
            Title__c = 'Trigger Test Book',
            Author__c = 'Test Author',
            ISBN__c = 'TRIG-ISBN-12345',
            Genre__c = 'Fiction',
            Status__c = 'Available',
            Description__c = 'A test book for trigger tests'
        );
        insert testBook;
        
        // Create test member
        Member__c testMember = new Member__c(
            Name__c = 'Trigger Test Member',
            Email__c = 'triggertest@example.com',
            Status__c = 'Active'
        );
        insert testMember;
    }
    
    @isTest
    static void testTransactionInsert() {
        // Get test data
        Book__c book = [SELECT Id FROM Book__c WHERE ISBN__c = 'TRIG-ISBN-12345' LIMIT 1];
        Member__c member = [SELECT Id FROM Member__c WHERE Email__c = 'triggertest@example.com' LIMIT 1];
        
        // Create test transaction
        Transaction__c transaction = new Transaction__c(
            Book__c = book.Id,
            Member__c = member.Id,
            CheckoutDate__c = Datetime.now(),
            DueDate__c = Datetime.now().addDays(14),
            Status__c = 'Active'
        );
        
        Test.startTest();
        insert transaction;
        Test.stopTest();
        
        // Verify the transaction was created successfully
        Transaction__c insertedTransaction = [SELECT Id, Book__c, Member__c FROM Transaction__c WHERE Id = :transaction.Id];
        System.assertEquals(book.Id, insertedTransaction.Book__c, 'Book reference should be maintained');
        System.assertEquals(member.Id, insertedTransaction.Member__c, 'Member reference should be maintained');
    }
    
    @isTest
    static void testTransactionUpdate() {
        // Get test data
        Book__c book = [SELECT Id FROM Book__c WHERE ISBN__c = 'TRIG-ISBN-12345' LIMIT 1];
        Member__c member = [SELECT Id FROM Member__c WHERE Email__c = 'triggertest@example.com' LIMIT 1];
        
        // Create test transaction
        Transaction__c transaction = new Transaction__c(
            Book__c = book.Id,
            Member__c = member.Id,
            CheckoutDate__c = Datetime.now(),
            DueDate__c = Datetime.now().addDays(14),
            Status__c = 'Active'
        );
        insert transaction;
        
        // Create a second book to try changing the book reference
        Book__c secondBook = new Book__c(
            Title__c = 'Second Test Book',
            Author__c = 'Test Author',
            ISBN__c = 'TRIG-ISBN-67890',
            Genre__c = 'Fiction',
            Status__c = 'Available'
        );
        insert secondBook;
        
        Test.startTest();
        // Try to update with invalid changes
        transaction.Book__c = secondBook.Id;
        
        boolean exceptionThrown = false;
        try {
            update transaction;
        } catch (DmlException e) {
            exceptionThrown = true;
            System.assert(e.getMessage().contains('Cannot change the book'), 
                          'Error message should mention cannot change book');
        }
        System.assert(exceptionThrown, 'Exception should be thrown when trying to change book reference');
        
        // Try valid status update
        Transaction__c freshTransaction = [SELECT Id FROM Transaction__c WHERE Id = :transaction.Id];
        freshTransaction.Status__c = 'Completed';
        freshTransaction.ReturnDate__c = Datetime.now();
        update freshTransaction;
        Test.stopTest();
        
        // Verify status was updated
        Transaction__c updatedTransaction = [SELECT Status__c FROM Transaction__c WHERE Id = :transaction.Id];
        System.assertEquals('Completed', updatedTransaction.Status__c, 'Status should be updated to Completed');
    }
    
    @isTest
    static void testOverdueTransactionUpdate() {
        // Get test data
        Book__c book = [SELECT Id FROM Book__c WHERE ISBN__c = 'TRIG-ISBN-12345' LIMIT 1];
        Member__c member = [SELECT Id FROM Member__c WHERE Email__c = 'triggertest@example.com' LIMIT 1];
        
        // Create test transaction that will be overdue
        Transaction__c transaction = new Transaction__c(
            Book__c = book.Id,
            Member__c = member.Id,
            CheckoutDate__c = Datetime.now().addDays(-30),
            DueDate__c = Datetime.now().addDays(-15),
            Status__c = 'Active'
        );
        insert transaction;
        
        Test.startTest();
        // Update to overdue
        transaction.Status__c = 'Overdue';
        update transaction;
        Test.stopTest();
        
        // Verify status was updated
        Transaction__c updatedTransaction = [SELECT Status__c FROM Transaction__c WHERE Id = :transaction.Id];
        System.assertEquals('Overdue', updatedTransaction.Status__c, 'Status should be updated to Overdue');
    }
}
