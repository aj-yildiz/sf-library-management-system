
/**
 * Test class for LibraryService
 * Ensures proper code coverage and functionality verification
 */
@isTest
private class LibraryServiceTest {
    
    @TestSetup
    static void setupTestData() {
        // Create test book
        Book__c testBook = new Book__c(
            Title__c = 'Test Book',
            Author__c = 'Test Author',
            ISBN__c = 'TEST-ISBN-12345',
            Genre__c = 'Fiction',
            Status__c = 'Available',
            Description__c = 'A test book for unit tests'
        );
        insert testBook;
        
        // Create test member
        Member__c testMember = new Member__c(
            Name__c = 'Test Member',
            Email__c = 'test@example.com',
            Status__c = 'Active'
        );
        insert testMember;
    }
    
    @isTest
    static void testCheckoutBook() {
        // Get test data
        Book__c book = [SELECT Id FROM Book__c WHERE ISBN__c = 'TEST-ISBN-12345' LIMIT 1];
        Member__c member = [SELECT Id FROM Member__c WHERE Email__c = 'test@example.com' LIMIT 1];
        
        Test.startTest();
        // Test checkout process
        Transaction__c transaction = LibraryService.checkoutBook(book.Id, member.Id, 14);
        Test.stopTest();
        
        // Verify transaction was created correctly
        System.assertNotEquals(null, transaction.Id, 'Transaction should have been created with an ID');
        
        // Verify book status was updated
        Book__c updatedBook = [SELECT Status__c FROM Book__c WHERE Id = :book.Id];
        System.assertEquals('Checked Out', updatedBook.Status__c, 'Book status should be updated to Checked Out');
        
        // Verify transaction details
        System.assertEquals(book.Id, transaction.Book__c, 'Transaction should reference the correct book');
        System.assertEquals(member.Id, transaction.Member__c, 'Transaction should reference the correct member');
        System.assertEquals('Active', transaction.Status__c, 'Transaction should have Active status');
        
        // Verify due date is set correctly (approx. 14 days from now)
        Datetime expectedDueDate = Datetime.now().addDays(14);
        Long actualDays = (transaction.DueDate__c.getTime() - Datetime.now().getTime()) / (1000 * 60 * 60 * 24);
        System.assert(Math.abs(14 - actualDays) < 1, 'Due date should be approximately 14 days from checkout');
    }
    
    @isTest
    static void testReturnBook() {
        // Get test data
        Book__c book = [SELECT Id FROM Book__c WHERE ISBN__c = 'TEST-ISBN-12345' LIMIT 1];
        Member__c member = [SELECT Id FROM Member__c WHERE Email__c = 'test@example.com' LIMIT 1];
        
        // First checkout a book
        Transaction__c transaction = LibraryService.checkoutBook(book.Id, member.Id, 14);
        
        Test.startTest();
        // Test return process
        Transaction__c updatedTransaction = LibraryService.returnBook(transaction.Id);
        Test.stopTest();
        
        // Verify book status was updated back to available
        Book__c updatedBook = [SELECT Status__c FROM Book__c WHERE Id = :book.Id];
        System.assertEquals('Available', updatedBook.Status__c, 'Book status should be updated to Available');
        
        // Verify transaction details
        System.assertEquals('Completed', updatedTransaction.Status__c, 'Transaction should have Completed status');
        System.assertNotEquals(null, updatedTransaction.ReturnDate__c, 'Return date should be set');
    }
    
    @isTest
    static void testSearchBooks() {
        Test.startTest();
        // Test search by title
        List<Book__c> results = LibraryService.searchBooks('Test Book', null, false);
        System.assertEquals(1, results.size(), 'Should find 1 book matching the title');
        
        // Test search by author
        results = LibraryService.searchBooks('Test Author', null, false);
        System.assertEquals(1, results.size(), 'Should find 1 book matching the author');
        
        // Test search by genre
        results = LibraryService.searchBooks(null, 'Fiction', false);
        System.assertEquals(1, results.size(), 'Should find 1 book matching the genre');
        
        // Test search by availability
        Book__c book = [SELECT Id FROM Book__c WHERE ISBN__c = 'TEST-ISBN-12345' LIMIT 1];
        Member__c member = [SELECT Id FROM Member__c WHERE Email__c = 'test@example.com' LIMIT 1];
        LibraryService.checkoutBook(book.Id, member.Id, 14);
        
        results = LibraryService.searchBooks(null, null, true);
        System.assertEquals(0, results.size(), 'Should find 0 available books after checkout');
        Test.stopTest();
    }
    
    @isTest
    static void testUpdateOverdueTransactions() {
        // Get test data
        Book__c book = [SELECT Id FROM Book__c WHERE ISBN__c = 'TEST-ISBN-12345' LIMIT 1];
        Member__c member = [SELECT Id FROM Member__c WHERE Email__c = 'test@example.com' LIMIT 1];
        
        // Create a transaction with a past due date
        Transaction__c transaction = new Transaction__c(
            Book__c = book.Id,
            Member__c = member.Id,
            CheckoutDate__c = Datetime.now().addDays(-30),
            DueDate__c = Datetime.now().addDays(-15),
            Status__c = 'Active'
        );
        insert transaction;
        
        Test.startTest();
        Integer updatedCount = LibraryService.updateOverdueTransactions();
        Test.stopTest();
        
        System.assertEquals(1, updatedCount, 'One transaction should be marked as overdue');
        
        Transaction__c updatedTransaction = [SELECT Status__c FROM Transaction__c WHERE Id = :transaction.Id];
        System.assertEquals('Overdue', updatedTransaction.Status__c, 'Transaction should be marked as Overdue');
    }
    
    @isTest
    static void testCheckoutBookExceptions() {
        // Get test data
        Book__c book = [SELECT Id FROM Book__c WHERE ISBN__c = 'TEST-ISBN-12345' LIMIT 1];
        Member__c member = [SELECT Id FROM Member__c WHERE Email__c = 'test@example.com' LIMIT 1];
        
        // First checkout the book to make it unavailable
        LibraryService.checkoutBook(book.Id, member.Id, 14);
        
        Test.startTest();
        // Try to checkout an unavailable book
        try {
            LibraryService.checkoutBook(book.Id, member.Id, 14);
            System.assert(false, 'Should have thrown an exception for unavailable book');
        } catch (LibraryService.LibraryException e) {
            System.assert(e.getMessage().contains('not available'), 
                         'Exception should mention book is not available');
        }
        
        // Now make the member inactive
        member.Status__c = 'Inactive';
        update member;
        
        // Return the book to make it available again
        Transaction__c transaction = [SELECT Id FROM Transaction__c WHERE Book__c = :book.Id LIMIT 1];
        LibraryService.returnBook(transaction.Id);
        
        // Try to checkout with inactive member
        try {
            LibraryService.checkoutBook(book.Id, member.Id, 14);
            System.assert(false, 'Should have thrown an exception for inactive member');
        } catch (LibraryService.LibraryException e) {
            System.assert(e.getMessage().contains('not active'), 
                         'Exception should mention member is not active');
        }
        Test.stopTest();
    }
}
